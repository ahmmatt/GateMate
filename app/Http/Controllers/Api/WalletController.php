<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WalletTransactionResource;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;

/**
 * API WalletController
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola saldo & transaksi wallet user.
 * Integrasi Midtrans Snap untuk top-up dipertahankan penuh.
 *
 * Endpoints:
 *   GET  /api/wallet              → Info saldo + histori transaksi
 *   POST /api/wallet/topup        → Generate Snap Token Midtrans untuk top-up
 *   GET  /api/wallet/tenant/{id}  → Info tenant (untuk halaman pembayaran)
 *   POST /api/wallet/pay/{id}     → Proses pembayaran P2P ke tenant
 */
class WalletController extends Controller
{
    /**
     * Info saldo wallet + histori transaksi user.
     */
    public function index(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user         = Auth::user();
        $transactions = $user->walletTransactions()->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'wallet_balance'  => (float) $user->wallet_balance,
                'transactions'    => WalletTransactionResource::collection($transactions),
                'total_topup'     => (float) $transactions->where('type', 'topup')->where('status', 'success')->sum('amount'),
                'total_spent'     => (float) $transactions->where('type', 'ticket_purchase')->where('status', 'success')->sum('amount'),
            ],
        ]);
    }

    /**
     * Proses Top-up Saldo Wallet via Midtrans Snap.
     * Identik dengan WalletController Blade — return Snap Token ke frontend.
     */
    public function topup(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'amount' => ['required', 'numeric', 'min:10000'],
            ], [
                'amount.min' => 'Minimum top-up adalah Rp 10.000.',
            ]);

            $amount = (int) $request->amount;
            /** @var \App\Models\User $user */
            $user = Auth::user();

            // Generate Order ID khusus Topup
            $orderId = 'TOPUP-' . time() . '-' . rand(100, 999);

            // Simpan transaksi pending ke database
            WalletTransaction::create([
                'user_id'  => $user->id_user,
                'order_id' => $orderId,
                'type'     => 'topup',
                'amount'   => $amount,
                'status'   => 'pending',
            ]);

            // ── Konfigurasi Midtrans Snap ──────────────────────────────────────
            MidtransConfig::$serverKey    = config('services.midtrans.server_key');
            MidtransConfig::$isProduction = false; // Sandbox
            MidtransConfig::$isSanitized  = true;
            MidtransConfig::$is3ds        = true;

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $amount,
                ],
                'customer_details' => [
                    'first_name' => $user->full_name ?? 'User',
                    'email'      => $user->email ?? 'user@gatemate.com',
                ],
                'item_details' => [
                    [
                        'id'       => 'TOPUP',
                        'price'    => $amount,
                        'quantity' => 1,
                        'name'     => 'Top-up Saldo GateMate',
                    ],
                ],
            ];

            // Request Snap Token dari Midtrans
            $snapToken = Snap::getSnapToken($params);

            Log::info('API Topup Snap Token didapat.', [
                'order_id' => $orderId,
                'token'    => $snapToken,
            ]);

            return response()->json([
                'success'    => true,
                'message'    => 'Snap token berhasil dibuat. Lanjutkan pembayaran.',
                'data'       => [
                    'snap_token' => $snapToken,
                    'order_id'   => $orderId,
                    'amount'     => $amount,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('API Wallet Topup Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses top-up: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ambil info Tenant untuk halaman konfirmasi pembayaran.
     * Frontend React butuh data ini sebelum memproses POST /pay.
     */
    public function tenantInfo(int $tenantId): JsonResponse
    {
        $tenant = User::where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => $tenant->id_user,
                'name'       => $tenant->full_name,
                'event_name' => $tenant->event?->title ?? '-',
            ],
        ]);
    }

    /**
     * Proses Pembayaran P2P dari Pembeli ke Tenant.
     * Saldo masuk ke penyelenggara (Admin), bukan langsung ke tenant.
     */
    public function processPayment(Request $request, int $tenantId): JsonResponse
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
        ], [
            'amount.min' => 'Minimum pembayaran adalah Rp 1.000.',
        ]);

        $amount = (int) $request->amount;
        /** @var \App\Models\User $buyer */
        $buyer = Auth::user();

        $tenant = User::with('event')
            ->where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        // Validasi saldo pembeli
        if ($buyer->wallet_balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo wallet Anda tidak mencukupi untuk transaksi ini.',
                'current_balance' => (float) $buyer->wallet_balance,
                'required_amount' => $amount,
            ], 422);
        }

        DB::beginTransaction();
        try {
            $orderId = 'PAY-' . time() . '-' . rand(100, 999);

            // Kurangi saldo pembeli
            $buyer->decrement('wallet_balance', $amount);

            // Dapatkan Penyelenggara (Admin) dari event tenant
            if (!$tenant->event || !$tenant->event->id_admin) {
                throw new \Exception('Tenant ini tidak terikat dengan event yang valid.');
            }
            $admin = User::findOrFail($tenant->event->id_admin);

            // Tambah saldo ke Penyelenggara
            $admin->increment('wallet_balance', $amount);

            // Catat rekam jejak pengeluaran (pembeli)
            WalletTransaction::create([
                'user_id'      => $buyer->id_user,
                'reference_id' => $tenant->id_user,
                'order_id'     => $orderId . '-OUT',
                'type'         => 'payment',
                'amount'       => $amount,
                'status'       => 'success',
            ]);

            // Catat rekam jejak pemasukan (tenant_revenue) atas nama Penyelenggara
            WalletTransaction::create([
                'user_id'      => $admin->id_user,
                'reference_id' => $buyer->id_user,
                'order_id'     => $orderId . '-IN',
                'type'         => 'tenant_revenue',
                'amount'       => $amount,
                'status'       => 'success',
                'meta'         => [
                    'tenant_id'   => $tenant->id_user,
                    'tenant_name' => $tenant->full_name,
                    'event_id'    => $tenant->event->id_event,
                ],
            ]);

            DB::commit();

            Log::info('API P2P Payment sukses (Routed to Admin)', [
                'buyer_id'  => $buyer->id_user,
                'tenant_id' => $tenant->id_user,
                'admin_id'  => $admin->id_user,
                'amount'    => $amount,
                'order_id'  => $orderId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran Rp ' . number_format($amount, 0, ',', '.') . ' ke ' . $tenant->full_name . ' berhasil!',
                'data'    => [
                    'order_id'       => $orderId,
                    'amount_paid'    => $amount,
                    'tenant_name'    => $tenant->full_name,
                    'new_balance'    => (float) $buyer->fresh()->wallet_balance,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('API P2P Payment Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses pembayaran: ' . $e->getMessage(),
            ], 500);
        }
    }
}
