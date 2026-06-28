<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * API Admin\DashboardController
 * ─────────────────────────────────────────────────────────────────────────────
 * Statistik dashboard untuk penyelenggara event (admin).
 *
 * Endpoints:
 *   GET /api/admin/dashboard → Statistik, revenue, trend 6 bulan, riwayat penarikan
 */
class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $adminId = Auth::user()->id_user;

        // ── Event Statistics ──────────────────────────────────────────────────
        $events = Event::with(['ticketTiers', 'attendees'])
            ->where('id_admin', $adminId)
            ->orderByDesc('created_at')
            ->get();

        $totalEvents  = $events->count();
        $activeEvents = $events->where('status', 'active')->count();

        // ── Tiket Terjual & Pendapatan Tiket ──────────────────────────────────
        $totalTicketsSold = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->count();

        $ticketRevenue = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->sum('transactions.gross_amount');

        // ── Kalkulasi Fee & Pendapatan Bersih ─────────────────────────────────
        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);

        $platformFeeTotal = round((float) $ticketRevenue * $feePercent / 100, 2);

        $tenantRevenueTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')
            ->sum('amount');
        $tenantCutTotal = round((float) $tenantRevenueTotal * $tenantCutPercent / 100, 2);

        $netIncomeTotal = ((float) $ticketRevenue - $platformFeeTotal) + $tenantCutTotal;

        // ── Sudah Ditarik ─────────────────────────────────────────────────────
        $alreadyWithdrawnTotal = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');

        $sisaBisaDitarikTotal = max(0, $netIncomeTotal - (float) $alreadyWithdrawnTotal);

        // ── Check-in hari ini ─────────────────────────────────────────────────
        $checkedInToday = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.is_used', true)
            ->whereDate('transactions.scanned_at', today())
            ->count();

        // ── Revenue Trend (6 Bulan) ───────────────────────────────────────────
        $sixMonthsAgo    = now()->subMonths(5)->startOfMonth();
        $transactionsRaw = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.payment_status', 'success')
            ->where('transactions.created_at', '>=', $sixMonthsAgo)
            ->select('transactions.created_at', 'transactions.gross_amount')
            ->get();

        $revenueTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $revenueTrend[now()->subMonths($i)->format('M Y')] = 0;
        }
        foreach ($transactionsRaw as $trx) {
            $key = \Carbon\Carbon::parse($trx->created_at)->format('M Y');
            if (isset($revenueTrend[$key])) {
                $revenueTrend[$key] += (float) $trx->gross_amount;
            }
        }

        // ── Riwayat Penarikan ─────────────────────────────────────────────────
        $withdrawalHistory = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                // Statistik utama
                'total_events'           => $totalEvents,
                'active_events'          => $activeEvents,
                'total_tickets_sold'     => $totalTicketsSold,
                'checked_in_today'       => $checkedInToday,

                // Keuangan
                'ticket_revenue'         => (float) $ticketRevenue,
                'platform_fee_total'     => $platformFeeTotal,
                'fee_percent'            => $feePercent,
                'tenant_cut_total'       => $tenantCutTotal,
                'net_income_total'       => $netIncomeTotal,
                'already_withdrawn'      => (float) $alreadyWithdrawnTotal,
                'available_to_withdraw'  => $sisaBisaDitarikTotal,

                // Trend pendapatan
                'revenue_trend'          => $revenueTrend,
                'revenue_months'         => array_keys($revenueTrend),
                'revenue_values'         => array_values($revenueTrend),

                // Event list
                'events'                 => EventResource::collection($events),
                'active_events_list'     => EventResource::collection($events->where('status', 'active')->values()),

                // Riwayat penarikan
                'withdrawal_history'     => WalletTransactionResource::collection($withdrawalHistory),
            ],
        ]);
    }
}
