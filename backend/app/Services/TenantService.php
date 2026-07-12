<?php

namespace App\Services;

use App\Models\Event;
use App\Models\TenantMenu;
use App\Models\User;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * TenantService
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani seluruh business logic untuk Tenant POS (Kasir), manajemen menu,
 * statistik penjualan, serta pengajuan penarikan dana ke Admin Penyelenggara.
 */
class TenantService
{
    /**
     * Mengambil data dashboard tenant (menu, riwayat transaksi, saldo, status event).
     */
    public function getDashboardData(User $tenant): array
    {
        $menus = $tenant->tenantMenus()->orderBy('item_name')->get()->map(fn ($m) => [
            'id'        => $m->id,
            'item_name' => $m->item_name,
            'price'     => (float) $m->price,
        ]);

        $salesTransactions = WalletTransaction::where('type', 'tenant_revenue')
            ->where('meta->tenant_id', $tenant->id_user)
            ->get();

        $wdTransactions = WalletTransaction::where('user_id', $tenant->id_user)
            ->where('type', 'withdrawal')
            ->get();

        $transactions = $salesTransactions->concat($wdTransactions)
            ->sortByDesc('created_at')
            ->take(20)
            ->values()
            ->map(fn ($t) => [
                'id'         => $t->id,
                'order_id'   => $t->order_id,
                'type'       => $t->type,
                'amount'     => (float) $t->amount,
                'status'     => $t->status,
                'meta'       => $t->meta,
                'created_at' => $t->created_at?->toIso8601String(),
            ]);

        $totalEarned = $salesTransactions->sum('amount');
        $pendingWd   = $wdTransactions->whereIn('status', ['pending', 'pending_admin'])->sum('amount');
        $successWd   = $wdTransactions->where('status', 'success')->sum('amount');

        $availableBalance = $totalEarned - $pendingWd - $successWd;

        $event = Event::find($tenant->id_event);

        $isEventEnded = false;
        if ($event) {
            $endDate     = Carbon::parse($event->end_date)->format('Y-m-d');
            $endDateTime = Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');
            $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);
        }

        return [
            'tenant_name'       => $tenant->full_name,
            'menus'             => $menus,
            'transactions'      => $transactions,
            'total_earned'      => (float) $totalEarned,
            'pending_wd'        => (float) $pendingWd,
            'available_balance' => (float) $availableBalance,
            'is_event_ended'    => $isEventEnded,
            'event_title'       => $event?->title,
        ];
    }

    /**
     * Menambahkan menu jualan baru untuk tenant.
     */
    public function storeMenu(User $tenant, array $data): TenantMenu
    {
        return TenantMenu::create([
            'user_id'   => $tenant->id_user,
            'item_name' => $data['item_name'],
            'price'     => (int) $data['price'],
        ]);
    }

    /**
     * Mengajukan penarikan dana tenant ke Admin Penyelenggara.
     */
    public function withdraw(User $tenant, array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        $event = Event::find($tenant->id_event);
        if (!$event) {
            throw new Exception('Event tidak ditemukan.');
        }

        $endDate     = Carbon::parse($event->end_date)->format('Y-m-d');
        $endDateTime = Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');

        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            throw new Exception('Event belum berakhir. Anda belum bisa menarik dana.');
        }

        $sales = WalletTransaction::where('type', 'tenant_revenue')
            ->where('meta->tenant_id', $tenant->id_user)
            ->sum('amount');
        $wds = WalletTransaction::where('user_id', $tenant->id_user)
            ->where('type', 'withdrawal')
            ->whereIn('status', ['pending', 'pending_admin', 'success'])
            ->sum('amount');
        $availableBalance = $sales - $wds;

        if ($availableBalance < $amount) {
            throw new Exception('Saldo tidak mencukupi untuk penarikan ini. Saldo maksimal Anda: Rp ' . number_format($availableBalance, 0, ',', '.'));
        }

        return DB::transaction(function () use ($tenant, $amount, $data) {
            $withdrawal = WalletTransaction::create([
                'user_id'  => $tenant->id_user,
                'order_id' => 'WD-' . time() . '-' . rand(100, 999),
                'type'     => 'withdrawal',
                'amount'   => $amount,
                'status'   => 'pending_admin',
                'meta'     => [
                    'bank_name'      => $data['bank_name'],
                    'account_number' => $data['account_number'],
                ],
            ]);

            Log::info('API: Withdrawal request dibuat', ['tenant_id' => $tenant->id_user, 'amount' => $amount]);

            return $withdrawal;
        });
    }
}
