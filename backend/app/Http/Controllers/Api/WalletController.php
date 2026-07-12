<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wallet\PayTenantRequest;
use App\Http\Requests\Wallet\TopupRequest;
use App\Http\Resources\WalletTransactionResource;
use App\Models\User;
use App\Services\WalletService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * API WalletController
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola saldo & transaksi wallet user.
 * Logika bisnis didelegasikan ke WalletService.
 *
 * Endpoints:
 *   GET  /api/wallet              → Info saldo + histori transaksi
 *   POST /api/wallet/topup        → Generate Snap Token Midtrans untuk top-up
 *   GET  /api/wallet/tenant/{id}  → Info tenant (untuk halaman pembayaran)
 *   POST /api/wallet/pay/{id}     → Proses pembayaran P2P ke tenant
 */
class WalletController extends Controller
{
    use ApiResponse;

    public function __construct(protected WalletService $walletService) {}

    /**
     * Info saldo wallet + histori transaksi user.
     */
    public function index(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Sinkronisasi topup pending dengan Midtrans
        $this->walletService->syncPendingTopups($user);

        $transactions = $user->walletTransactions()->latest()->get();

        return $this->success([
            'wallet_balance' => (float) $user->wallet_balance,
            'transactions'   => WalletTransactionResource::collection($transactions),
            'total_topup'    => (float) $transactions->where('type', 'topup')->where('status', 'success')->sum('amount'),
            'total_spent'    => (float) $transactions->where('type', 'ticket_purchase')->where('status', 'success')->sum('amount'),
        ]);
    }

    /**
     * Proses Top-up Saldo Wallet via Midtrans Snap.
     */
    public function topup(TopupRequest $request): JsonResponse
    {
        try {
            /** @var \App\Models\User $user */
            $user   = Auth::user();
            $result = $this->walletService->topup($user, (int) $request->validated('amount'));

            return $this->success($result, 'Snap token berhasil dibuat. Lanjutkan pembayaran.');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WalletController Topup Error: ' . $e->getMessage());
            return $this->serverError('Gagal memproses top-up.');
        }
    }

    /**
     * Ambil info Tenant untuk halaman konfirmasi pembayaran.
     */
    public function tenantInfo(int $tenantId): JsonResponse
    {
        $tenant = User::where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        return $this->success([
            'id'         => $tenant->id_user,
            'name'       => $tenant->full_name,
            'event_name' => $tenant->event?->title ?? '-',
        ]);
    }

    /**
     * Proses Pembayaran P2P dari Pembeli ke Tenant.
     */
    public function processPayment(PayTenantRequest $request, int $tenantId): JsonResponse
    {
        try {
            /** @var \App\Models\User $buyer */
            $buyer  = Auth::user();
            $result = $this->walletService->payTenant($buyer, $tenantId, (int) $request->validated('amount'));

            $formattedAmount = 'Rp ' . number_format($result['amount_paid'], 0, ',', '.');

            return $this->success(
                $result,
                "Pembayaran {$formattedAmount} ke {$result['tenant_name']} berhasil!"
            );

        } catch (\RuntimeException $e) {
            $decoded = json_decode($e->getMessage(), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return response()->json(
                    array_merge(['success' => false], $decoded),
                    $e->getCode() ?: 422
                );
            }
            return $this->error($e->getMessage(), $e->getCode() ?: 422);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WalletController PayTenant Error: ' . $e->getMessage());
            return $this->serverError('Gagal memproses pembayaran.');
        }
    }
}
