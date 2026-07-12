<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\ProcessCheckoutRequest;
use App\Services\CheckoutService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * API CheckoutController
 * ─────────────────────────────────────────────────────────────────────────────
 * Proses pembelian tiket via pemotongan saldo wallet.
 * Logika bisnis didelegasikan ke CheckoutService.
 *
 * Endpoints:
 *   POST /api/checkout → Beli tiket, potong wallet, kirim e-ticket via email
 */
class CheckoutController extends Controller
{
    use ApiResponse;

    public function __construct(protected CheckoutService $checkoutService) {}

    /**
     * Proses Checkout Tiket via Pemotongan Saldo Wallet.
     */
    public function process(ProcessCheckoutRequest $request): JsonResponse
    {
        try {
            /** @var \App\Models\User $user */
            $user   = $request->user();
            $result = $this->checkoutService->process(
                $user,
                $request->integer('event_id'),
                $request->integer('tier_id'),
                $request->input('seat_number')
            );

            $message = $result['status'] === 'pending'
                ? 'Pendaftaran berhasil. Silakan tunggu persetujuan dari penyelenggara.'
                : 'Pembelian tiket berhasil dengan Wallet!';

            return $this->success($result, $message);

        } catch (\PDOException | \Illuminate\Database\QueryException $e) {
            \Illuminate\Support\Facades\Log::error('CheckoutController Database Error: ' . $e->getMessage());
            return $this->serverError('Sistem Error saat memproses checkout.');

        } catch (\RuntimeException $e) {
            $status = is_int($e->getCode()) && $e->getCode() >= 100 && $e->getCode() <= 599
                ? $e->getCode()
                : 422;

            // Decode JSON payload jika ada data tambahan (ex: insufficient_balance)
            $decoded = json_decode($e->getMessage(), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $message = $decoded['message'] ?? 'Terjadi kesalahan.';
                $extra   = array_diff_key($decoded, ['message' => null]);
                return response()->json(array_merge(
                    ['success' => false, 'message' => $message],
                    $extra
                ), $status);
            }
            return $this->error($e->getMessage(), $status);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('CheckoutController Error: ' . $e->getMessage());
            return $this->serverError('Sistem Error saat memproses checkout.');
        }
    }

    /**
     * Webhook Midtrans untuk notifikasi pembayaran Topup Wallet & Tiket.
     */
    public function handleNotification(Request $request): JsonResponse
    {
        try {
            $result = $this->checkoutService->handleMidtransWebhook($request->all());
            return response()->json($result, 200);
        } catch (\RuntimeException $e) {
            $status = is_int($e->getCode()) && $e->getCode() >= 100 && $e->getCode() <= 599 ? $e->getCode() : 403;
            return response()->json(['status' => $e->getMessage()], $status);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('CheckoutController Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'Error'], 500);
        }
    }
}
