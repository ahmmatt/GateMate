<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    /**
     * Tampilkan halaman Keuangan / Finance untuk Penyelenggara
     */
    public function index(): View
    {
        $adminId = Auth::user()->id_user;

        // Ambil semua transaksi wallet
        $transactions = WalletTransaction::where('user_id', $adminId)
            ->orderByDesc('created_at')
            ->get();

        // ── Tiket Terjual & Pendapatan Tiket ────────────────────────────────
        $ticketRevenue = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->sum('transactions.gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);

        $platformFeeTotal = round((float)$ticketRevenue * $feePercent / 100, 2);

        $tenantRevenueTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')
            ->sum('amount');
        $tenantCutTotal = round((float)$tenantRevenueTotal * $tenantCutPercent / 100, 2);

        $netIncomeTotal = ((float)$ticketRevenue - $platformFeeTotal) + $tenantCutTotal;

        // ── Sudah Ditarik (semua event) ──────────────────────────────────────
        $alreadyWithdrawnTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');

        $sisaBisaDitarikTotal = max(0, $netIncomeTotal - (float)$alreadyWithdrawnTotal);
        
        $pendingWithdrawals = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->sum('amount');

        return view('admin.finance', compact(
            'netIncomeTotal', 'sisaBisaDitarikTotal', 'pendingWithdrawals', 'transactions'
        ));
    }

    /**
     * Proses pengajuan penarikan dana (Global)
     */
    public function withdraw(Request $request): RedirectResponse
    {
        $admin = Auth::user();
        $adminId = $admin->id_user;

        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
        ]);

        // Kalkulasi ulang pendapatan bersih
        $ticketRevenue = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->sum('transactions.gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);
        $platformFeeTotal = round((float)$ticketRevenue * $feePercent / 100, 2);

        $tenantRevenueTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')
            ->sum('amount');
        $tenantCutTotal = round((float)$tenantRevenueTotal * $tenantCutPercent / 100, 2);

        $netIncomeTotal = ((float)$ticketRevenue - $platformFeeTotal) + $tenantCutTotal;

        $alreadyWithdrawnTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');

        $sisaBisaDitarikTotal = max(0, $netIncomeTotal - (float)$alreadyWithdrawnTotal);

        $requestedAmount = (float) $request->amount;

        if ($requestedAmount > $sisaBisaDitarikTotal) {
            return back()->withErrors(['withdraw_error' => 'Jumlah penarikan melebihi saldo yang tersedia (Rp ' . number_format($sisaBisaDitarikTotal, 0, ',', '.') . ').']);
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

            return back()->with('success', 'Pengajuan penarikan dana sebesar Rp ' . number_format($requestedAmount, 0, ',', '.') . ' ke ' . $request->bank_name . ' (' . $request->account_number . ') berhasil diajukan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['withdraw_error' => 'Gagal mengajukan penarikan: ' . $e->getMessage()]);
        }
    }
}
