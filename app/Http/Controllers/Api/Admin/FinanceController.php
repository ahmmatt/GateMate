<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WalletTransactionResource;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * API Admin\FinanceController
 * ─────────────────────────────────────────────────────────────────────────────
 * Laporan keuangan dan pengajuan penarikan dana bagi admin/penyelenggara.
 *
 * Endpoints:
 *   GET  /api/admin/finance          → Ringkasan keuangan + histori transaksi
 *   POST /api/admin/finance/withdraw → Ajukan penarikan dana global
 */
class FinanceController extends Controller
{
    /**
     * Laporan keuangan admin.
     */
    public function index(): JsonResponse
    {
        $adminId = Auth::user()->id_user;

        $transactions = WalletTransaction::where('user_id', $adminId)
            ->orderByDesc('created_at')
            ->get();

        $ticketRevenue = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->sum('transactions.gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);

        $platformFeeTotal = round((float) $ticketRevenue * $feePercent / 100, 2);

        $tenantRevenueTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')
            ->sum('amount');
        $tenantCutTotal = round((float) $tenantRevenueTotal * $tenantCutPercent / 100, 2);

        $netIncomeTotal = ((float) $ticketRevenue - $platformFeeTotal) + $tenantCutTotal;

        $alreadyWithdrawnTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');

        $sisaBisaDitarikTotal = max(0, $netIncomeTotal - (float) $alreadyWithdrawnTotal);

        $pendingWithdrawals = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data'    => [
                'ticket_revenue'       => (float) $ticketRevenue,
                'platform_fee_total'   => $platformFeeTotal,
                'fee_percent'          => $feePercent,
                'tenant_revenue_total' => (float) $tenantRevenueTotal,
                'tenant_cut_total'     => $tenantCutTotal,
                'net_income_total'     => $netIncomeTotal,
                'already_withdrawn'    => (float) $alreadyWithdrawnTotal,
                'available_to_withdraw'=> $sisaBisaDitarikTotal,
                'pending_withdrawals'  => (float) $pendingWithdrawals,
                'transactions'         => WalletTransactionResource::collection($transactions),
            ],
        ]);
    }

    /**
     * Ajukan penarikan dana global (tidak terikat satu event).
     */
    public function withdraw(Request $request): JsonResponse
    {
        $admin   = Auth::user();
        $adminId = $admin->id_user;

        $request->validate([
            'amount'         => ['required', 'numeric', 'min:10000'],
            'bank_name'      => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
        ], [
            'amount.min' => 'Jumlah penarikan minimal Rp 10.000.',
        ]);

        // Kalkulasi ulang saldo yang tersedia
        $ticketRevenue = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->sum('transactions.gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);
        $platformFeeTotal = round((float) $ticketRevenue * $feePercent / 100, 2);

        $tenantRevenueTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')->sum('amount');
        $tenantCutTotal = round((float) $tenantRevenueTotal * $tenantCutPercent / 100, 2);

        $netIncomeTotal = ((float) $ticketRevenue - $platformFeeTotal) + $tenantCutTotal;

        $alreadyWithdrawnTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');

        $sisaBisaDitarikTotal = max(0, $netIncomeTotal - (float) $alreadyWithdrawnTotal);
        $requestedAmount      = (float) $request->amount;

        if ($requestedAmount > $sisaBisaDitarikTotal) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah penarikan melebihi saldo yang tersedia (Rp ' . number_format($sisaBisaDitarikTotal, 0, ',', '.') . ').',
                'available_balance' => $sisaBisaDitarikTotal,
            ], 422);
        }

        DB::beginTransaction();
        try {
            WalletTransaction::create([
                'user_id'  => $adminId,
                'order_id' => 'WD-' . $adminId . '-' . time(),
                'type'     => 'withdrawal',
                'amount'   => $requestedAmount,
                'status'   => 'pending_superadmin',
                'meta'     => [
                    'is_global_withdrawal' => true,
                    'bank_name'            => $request->bank_name,
                    'account_number'       => $request->account_number,
                    'net_income_at_wd'     => $netIncomeTotal,
                ],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan penarikan dana sebesar Rp ' . number_format($requestedAmount, 0, ',', '.') . ' ke ' . $request->bank_name . ' (' . $request->account_number . ') berhasil diajukan.',
                'data'    => [
                    'amount'         => $requestedAmount,
                    'bank_name'      => $request->bank_name,
                    'account_number' => $request->account_number,
                    'status'         => 'pending_superadmin',
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan penarikan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
