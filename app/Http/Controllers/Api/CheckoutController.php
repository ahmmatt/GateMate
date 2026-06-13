<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ETicketMail;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * API CheckoutController
 * ─────────────────────────────────────────────────────────────────────────────
 * Proses pembelian tiket via pemotongan saldo wallet.
 * Logika identik dengan CheckoutController Blade — sudah JSON by design.
 *
 * Endpoints:
 *   POST /api/checkout → Beli tiket, potong wallet, kirim e-ticket via email
 */
class CheckoutController extends Controller
{
    /**
     * Proses Checkout Tiket via Pemotongan Saldo Wallet.
     */
    public function process(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => ['required', 'integer'],
            'tier_id'  => ['required', 'integer'],
        ]);

        try {
            $eventId = $request->event_id;
            $tierId  = $request->tier_id;

            Log::info('=== API CHECKOUT DITEKAN (WALLET) ===', [
                'event_id' => $eventId,
                'tier_id'  => $tierId,
            ]);

            /** @var \App\Models\User $user */
            $user = auth()->user();

            // ── KYC Face Verification Blocker ─────────────────────────────────
            $needsVerification = !$user->face_verified_at
                || Carbon::parse($user->face_verified_at)->lt(now()->subMonths(5));

            if ($needsVerification) {
                Log::warning("API KYC Blocker aktif: user #{$user->id} belum/kedaluwarsa verifikasi.", [
                    'face_verified_at' => $user->face_verified_at,
                ]);
                return response()->json([
                    'status'  => 'needs_verification',
                    'success' => false,
                    'message' => 'Verifikasi wajah (KYC) diperlukan sebelum membeli tiket.',
                ], 403);
            }

            // ── Validasi Event & Tier ──────────────────────────────────────────
            $event = Event::find($eventId);
            $tier  = TicketTier::find($tierId);

            if (!$event || !$tier) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event atau Tiket tidak ditemukan.',
                ], 404);
            }

            $grossAmount = (float) $tier->price;

            // ── Cek Ketersediaan Kursi ─────────────────────────────────────────
            if (!$tier->is_unlimited && $tier->remaining_seats <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maaf, tiket untuk tier ini sudah habis.',
                ], 422);
            }

            // ── Anti-Calo: Cek apakah user sudah punya tiket ───────────────────────
            $hasTicket = Transaction::where('event_id', $eventId)
                ->where('user_id', $user->id_user ?? $user->id)
                ->whereIn('payment_status', ['success', 'pending'])
                ->exists();

            if ($hasTicket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sistem anti-calo aktif: Anda hanya dapat membeli 1 tiket per akun untuk event ini.',
                ], 422);
            }

            // ── Cek Saldo Wallet ───────────────────────────────────────────────
            if ($user->wallet_balance < $grossAmount) {
                return response()->json([
                    'success'          => false,
                    'status'           => 'insufficient_balance',
                    'message'          => 'Saldo wallet tidak cukup. Silakan Top Up terlebih dahulu.',
                    'current_balance'  => (float) $user->wallet_balance,
                    'required_amount'  => $grossAmount,
                ], 422);
            }

            // ── Proses Pembelian dengan DB Transaction ─────────────────────────
            DB::beginTransaction();
            try {
                $orderId = 'TRX-' . time() . '-' . ($user->id_user ?? rand(1, 100));

                // 1. Potong saldo wallet user
                $user->decrement('wallet_balance', $grossAmount);

                // 2. Buat record transaksi tiket langsung success
                $transaction = Transaction::create([
                    'user_id'        => $user->id_user,
                    'event_id'       => $event->id_event,
                    'ticket_tier_id' => $tier->id_tier,
                    'order_id'       => $orderId,
                    'gross_amount'   => $grossAmount,
                    'payment_status' => 'success',
                    'snap_token'     => null,
                ]);

                // 3. Catat histori pengeluaran di wallet transaction
                WalletTransaction::create([
                    'user_id'  => $user->id_user,
                    'order_id' => $orderId,
                    'type'     => 'ticket_purchase',
                    'amount'   => $grossAmount,
                    'status'   => 'success',
                    'meta'     => [
                        'event_id'    => $event->id_event,
                        'event_title' => $event->title,
                        'tier_id'     => $tier->id_tier,
                        'tier_name'   => $tier->tier_name,
                    ],
                ]);

                // 4. Kurangi remaining_seats jika tier bukan unlimited
                if (!$tier->is_unlimited) {
                    $tier->decrement('remaining_seats');
                }

                // 5. Kirim E-Ticket via email (fire-and-forget, non-blocking)
                try {
                    $transaction->load(['user', 'event', 'ticketTier']);
                    Mail::to($user->email)->send(new ETicketMail($transaction));
                    Log::info('E-Ticket email terkirim (API wallet checkout).', ['order_id' => $orderId]);
                } catch (\Exception $mailErr) {
                    Log::error('Gagal kirim E-Ticket email: ' . $mailErr->getMessage());
                    // Tidak throw — pembelian tetap sukses meski email gagal
                }

                DB::commit();

                Log::info('API Checkout Wallet Berhasil!', [
                    'order_id'       => $orderId,
                    'user_id'        => $user->id_user,
                    'amount_charged' => $grossAmount,
                ]);

                return response()->json([
                    'success'   => true,
                    'message'   => 'Pembelian tiket berhasil! E-Ticket telah dikirim ke email Anda.',
                    'data'      => [
                        'order_id'        => $orderId,
                        'event_title'     => $event->title,
                        'tier_name'       => $tier->tier_name,
                        'gross_amount'    => $grossAmount,
                        'new_balance'     => (float) $user->fresh()->wallet_balance,
                        'transaction_id'  => $transaction->id,
                    ],
                ]);

            } catch (\Exception $innerEx) {
                DB::rollBack();
                throw $innerEx;
            }

        } catch (\Exception $e) {
            Log::error('API CHECKOUT WALLET ERROR: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Sistem Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
