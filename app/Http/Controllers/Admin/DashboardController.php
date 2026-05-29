<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard admin dengan statistik event + kalkulasi fee + riwayat penarikan.
     */
    public function index(): View
    {
        $adminId = Auth::user()->id_user;

        // ── Event Statistics ────────────────────────────────────────────────
        $events = Event::with(['ticketTiers', 'attendees'])
            ->where('id_admin', $adminId)
            ->orderByDesc('created_at')
            ->get();

        $totalEvents  = $events->count();
        $activeEvents = $events->where('status', 'active')->count();

        // ── Tiket Terjual & Pendapatan Tiket ────────────────────────────────
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

        // ── Kalkulasi Fee & Pendapatan Bersih ────────────────────────────────
        // Rumus:
        //   platformFeeTotal = ticketRevenue × (PLATFORM_FEE_PERCENT / 100)
        //   tenantRevenue    = semua tenant_revenue wallet transaction milik admin
        //   tenantCut        = tenantRevenue × (ORGANIZER_TENANT_CUT / 100)
        //   netIncomeTotal   = (ticketRevenue - platformFeeTotal) + tenantCut
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

        // ── Check-in hari ini ────────────────────────────────────────────────
        $checkedInToday = DB::table('transactions')
            ->join('events', 'transactions.event_id', '=', 'events.id_event')
            ->where('events.id_admin', $adminId)
            ->where('transactions.is_used', true)
            ->whereDate('transactions.scanned_at', today())
            ->count();

        // ── Revenue Trend (6 Bulan) ──────────────────────────────────────────
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
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
            if (isset($revenueTrend[$key])) $revenueTrend[$key] += (float) $trx->gross_amount;
        }
        $months   = array_keys($revenueTrend);
        $revenues = array_values($revenueTrend);

        // ── Riwayat Penarikan Admin (semua event) ────────────────────────────
        $withdrawalHistory = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        $activeEventsList = $events->where('status', 'active')->values();

        return view('admin.dashboard', compact(
            'events', 'activeEventsList',
            'totalEvents', 'activeEvents',
            'totalTicketsSold', 'ticketRevenue',
            'platformFeeTotal', 'feePercent', 'netIncomeTotal',
            'alreadyWithdrawnTotal', 'sisaBisaDitarikTotal',
            'checkedInToday', 'months', 'revenues',
            'withdrawalHistory', 'tenantCutTotal'
        ));
    }

}
