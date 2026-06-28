<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TenantMenu;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * API TenantController
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel POS (Kasir) untuk Tenant dan Manajemen Penarikan Dana Tenant.
 *
 * Endpoints:
 *   GET  /api/tenant/dashboard       → Data dashboard (menu, saldo, transaksi)
 *   POST /api/tenant/menus           → Tambah menu jualan
 *   POST /api/tenant/withdraw        → Ajukan penarikan dana ke admin
 */
class TenantController extends Controller
{
    /**
     * Halaman Dashboard POS Kasir Tenant.
     */
    public function dashboard(): JsonResponse
    {
        $tenant = Auth::user();
        $menus  = $tenant->tenantMenus()->orderBy('item_name')->get()->map(fn ($m) => [
            'id'        => $m->id,
            'item_name' => $m->item_name,
            'price'     => (float) $m->price,
        ]);
        
        // Ambil transaksi penjualan (tenant_revenue) yang dicatat di akun Admin tapi milik tenant ini
        $salesTransactions = WalletTransaction::where('type', 'tenant_revenue')
            ->where('meta->tenant_id', $tenant->id_user)
            ->get();
            
        // Ambil transaksi penarikan tenant
        $wdTransactions = WalletTransaction::where('user_id', $tenant->id_user)
            ->where('type', 'withdrawal')
            ->get();

        // Gabungkan untuk history view
        $transactions = $salesTransactions->concat($wdTransactions)->sortByDesc('created_at')->take(20)->values()->map(fn ($t) => [
            'id'         => $t->id,
            'order_id'   => $t->order_id,
            'type'       => $t->type,
            'amount'     => (float) $t->amount,
            'status'     => $t->status,
            'meta'       => $t->meta,
            'created_at' => $t->created_at?->toIso8601String(),
        ]);

        // Statistik singkat
        $totalEarned  = $salesTransactions->sum('amount');
        $pendingWd    = $wdTransactions->whereIn('status', ['pending', 'pending_admin'])->sum('amount');
        $successWd    = $wdTransactions->where('status', 'success')->sum('amount');
        
        // Dynamic balance
        $availableBalance = $totalEarned - $pendingWd - $successWd;

        // Cek status event
        $event = \App\Models\Event::find($tenant->id_event);
        
        $isEventEnded = false;
        if ($event) {
            $endDate = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
            $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');
            $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'tenant_name'       => $tenant->full_name,
                'menus'             => $menus,
                'transactions'      => $transactions,
                'total_earned'      => (float) $totalEarned,
                'pending_wd'        => (float) $pendingWd,
                'available_balance' => (float) $availableBalance,
                'is_event_ended'    => $isEventEnded,
                'event_title'       => $event?->title,
            ],
        ]);
    }

    /**
     * Simpan menu baru ke database.
     */
    public function storeMenu(Request $request): JsonResponse
    {
        $request->validate([
            'item_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'integer', 'min:100'],
        ]);

        $menu = TenantMenu::create([
            'user_id'   => Auth::user()->id_user,
            'item_name' => $request->item_name,
            'price'     => (int) $request->price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu "' . $menu->item_name . '" berhasil ditambahkan!',
            'data'    => [
                'id'        => $menu->id,
                'item_name' => $menu->item_name,
                'price'     => (float) $menu->price,
            ],
        ], 201);
    }

    /**
     * Proses Permintaan Penarikan Dana Tenant.
     */
    public function withdraw(Request $request): JsonResponse
    {
        $request->validate([
            'amount'         => ['required', 'numeric', 'min:10000'],
            'bank_name'      => ['required', 'string', 'max:50'],
            'account_number' => ['required', 'string', 'max:30'],
        ]);

        $tenant = Auth::user();
        $amount = (int) $request->amount;

        $event = \App\Models\Event::find($tenant->id_event);
        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak ditemukan.',
            ], 404);
        }

        $endDate = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
        $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');

        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            return response()->json([
                'success' => false,
                'message' => 'Event belum berakhir. Anda belum bisa menarik dana.',
            ], 422);
        }

        // Hitung dynamic balance
        $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $tenant->id_user)->sum('amount');
        $wds   = WalletTransaction::where('user_id', $tenant->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending', 'pending_admin', 'success'])->sum('amount');
        $availableBalance = $sales - $wds;

        if ($availableBalance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo tidak mencukupi untuk penarikan ini. Saldo maksimal Anda: Rp ' . number_format($availableBalance, 0, ',', '.'),
                'available_balance' => (float) $availableBalance,
            ], 422);
        }

        DB::beginTransaction();
        try {
            $withdrawal = WalletTransaction::create([
                'user_id'  => $tenant->id_user,
                'order_id' => 'WD-' . time() . '-' . rand(100, 999),
                'type'     => 'withdrawal',
                'amount'   => $amount,
                'status'   => 'pending_admin',
                'meta'     => [
                    'bank_name'      => $request->bank_name,
                    'account_number' => $request->account_number,
                ],
            ]);

            DB::commit();
            Log::info('API: Withdrawal request dibuat', ['tenant_id' => $tenant->id_user, 'amount' => $amount]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan penarikan Rp ' . number_format($amount, 0, ',', '.') . ' sedang diproses Admin Penyelenggara.',
                'data'    => [
                    'withdrawal_id' => $withdrawal->id,
                    'amount'        => $amount,
                    'status'        => 'pending_admin',
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Withdrawal Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan penarikan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
