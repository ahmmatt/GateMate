<?php

namespace App\Http\Controllers;

use App\Mail\ETicketMail;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckoutController extends Controller
{
    /**
     * Proses Checkout Tiket via Pemotongan Saldo Wallet
     */
    public function process(Request $request): JsonResponse
    {
        try {
            $eventId = $request->event_id;
            $tierId  = $request->tier_id;

            Log::info("=== CHECKOUT DITEKAN (WALLET) ===", ['event_id' => $eventId, 'tier_id' => $tierId]);

            // ─── KYC Face Verification Blocker ────────────────────────────────────
            $user = auth()->user();
            $needsVerification = !$user->face_verified_at
                || \Carbon\Carbon::parse($user->face_verified_at)->lt(now()->subMonths(5));

            if ($needsVerification) {
                Log::warning("KYC Blocker aktif: user #{$user->id} belum/kedaluwarsa verifikasi wajah.", [
                    'face_verified_at' => $user->face_verified_at,
                ]);

                session(['url.intended' => url()->previous()]);

                return response()->json([
                    'status'       => 'needs_verification',
                    'redirect_url' => route('verify.face'),
                    'message'      => 'Akses Ditolak: Anda mencoba melakukan bypass API. Verifikasi KYC (Wajah) diperlukan.',
                ], 403);
            }
            // ─────────────────────────────────────────────────────────────────────

            // Ambil data event & tier dari DB
            $event = Event::find($eventId);
            $tier  = TicketTier::find($tierId);

            if (!$event || !$tier) {
                return response()->json(['message' => 'Event atau Tiket tidak ditemukan.'], 404);
            }

            $grossAmount = (float) $tier->price;

            // ─── Cek Ketersediaan Kursi ───────────────────────────────────────────
            if (!$tier->is_unlimited && $tier->remaining_seats <= 0) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Maaf, tiket untuk tier ini sudah habis.',
                ], 422);
            }

            // ─── Cek Saldo Wallet User ────────────────────────────────────────────
            if ($user->wallet_balance < $grossAmount) {
                return response()->json([
                    'status'  => 'insufficient_balance',
                    'message' => 'Saldo wallet tidak cukup. Silakan Top Up.',
                    'current_balance' => (float) $user->wallet_balance,
                    'required_amount' => $grossAmount,
                ], 422);
            }

            // ─── Proses Pembelian dengan DB Transaction ───────────────────────────
            \Illuminate\Support\Facades\DB::beginTransaction();

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
                \App\Models\WalletTransaction::create([
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

                // 5. Kirim E-Ticket via email
                try {
                    $transaction->load(['user', 'event', 'ticketTier']);
                    Mail::to($user->email)->send(new \App\Mail\ETicketMail($transaction));
                    Log::info('E-Ticket email terkirim (wallet checkout).', ['order_id' => $orderId]);
                } catch (\Exception $mailErr) {
                    Log::error('Gagal kirim E-Ticket email: ' . $mailErr->getMessage());
                }

                \Illuminate\Support\Facades\DB::commit();

                Log::info("Checkout Wallet Berhasil!", [
                    'order_id'       => $orderId,
                    'user_id'        => $user->id_user,
                    'amount_charged' => $grossAmount,
                ]);

                return response()->json([
                    'status'       => 'success',
                    'message'      => 'Pembelian tiket berhasil! E-Ticket telah dikirim ke email Anda.',
                    'order_id'     => $orderId,
                    'redirect_url' => route('my-tickets'),
                ]);

            } catch (\Exception $innerEx) {
                \Illuminate\Support\Facades\DB::rollBack();
                throw $innerEx;
            }

        } catch (\Exception $e) {
            Log::error("CHECKOUT WALLET ERROR: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Sistem Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Webhook / Notification Handler dari Midtrans
     */
    public function handleNotification(Request $request): JsonResponse
    {
        try {
            \Illuminate\Support\Facades\Log::info('WEBHOOK_HIT: ', $request->all() ?? []);
            $payload = $request->all();
            
            Log::info('=== MIDTRANS WEBHOOK ===', $payload);

            $orderId = $payload['order_id'] ?? null;

            // Jika request berasal dari tombol "Tes" Midtrans (transaksi tidak ada di DB)
            if (!$orderId) {
                Log::info('Midtrans Test Notification diterima dan di-bypass dengan sukses.');
                return response()->json(['status' => 'OK', 'message' => 'Test notification handled gracefully'], 200);
            }

            $isTicketTx = \App\Models\Transaction::where('order_id', $orderId)->exists();
            $isWalletTx = \App\Models\WalletTransaction::where('order_id', $orderId)->exists();

            if (!$isTicketTx && !$isWalletTx) {
                Log::info('Midtrans Test Notification (Not in DB) diterima dan di-bypass dengan sukses.');
                return response()->json(['status' => 'OK', 'message' => 'Test notification handled gracefully'], 200);
            }

            $statusCode = $payload['status_code'] ?? '';
            $grossAmount = $payload['gross_amount'] ?? '';
            $serverKey = config('services.midtrans.server_key');
            $signatureKey = $payload['signature_key'] ?? '';

            // Validasi Signature Key dari Midtrans (Keamanan)
            $calculatedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

            if ($calculatedSignature !== $signatureKey) {
                Log::warning('Midtrans Webhook: Invalid Signature', ['order_id' => $orderId]);
                return response()->json(['status' => 'Invalid Signature'], 403);
            }

            // Ekstrak status transaksi — HARUS sebelum pengecekan prefix order_id
            $transactionStatus = $payload['transaction_status'] ?? '';
            $fraudStatus       = $payload['fraud_status'] ?? '';

            // Pengecekan tipe transaksi (Topup atau Checkout Tiket)
            if (str_starts_with($orderId, 'TOPUP-')) {
                return $this->handleTopupNotification($payload, $orderId, $transactionStatus, $fraudStatus);
            }

            // Cari transaksi tiket berdasarkan order_id
            $transaction = Transaction::where('order_id', $orderId)->first();

            if (!$transaction) {
                Log::warning('Midtrans Webhook: Transaksi Tiket tidak ditemukan', ['order_id' => $orderId]);
                return response()->json(['status' => 'Transaction not found'], 404);
            }

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $transaction->update(['payment_status' => 'success']);

                    // ── Kirim E-Ticket via email setelah pembayaran lunas ────
                    try {
                        $transaction->load(['user', 'event', 'ticketTier']);
                        Mail::to($transaction->user->email)->send(new ETicketMail($transaction));
                        Log::info('E-Ticket email terkirim (capture).', ['order_id' => $orderId]);
                    } catch (\Exception $mailErr) {
                        Log::error('Gagal kirim E-Ticket email: ' . $mailErr->getMessage());
                    }
                }
            } else if ($transactionStatus == 'settlement') {
                $transaction->update(['payment_status' => 'success']);

                // ── Kirim E-Ticket via email setelah pembayaran lunas ────────
                try {
                    $transaction->load(['user', 'event', 'ticketTier']);
                    Mail::to($transaction->user->email)->send(new ETicketMail($transaction));
                    Log::info('E-Ticket email terkirim (settlement).', ['order_id' => $orderId]);
                } catch (\Exception $mailErr) {
                    Log::error('Gagal kirim E-Ticket email: ' . $mailErr->getMessage());
                }
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $transaction->update(['payment_status' => 'failed']);
            } else if ($transactionStatus == 'pending') {
                $transaction->update(['payment_status' => 'pending']);
            }

            Log::info('Midtrans Webhook: Sukses Memperbarui Transaksi', ['order_id' => $orderId, 'status' => $transaction->payment_status]);

            return response()->json(['status' => 'OK'], 200);

        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'Error'], 500);
        }
    }

    /**
     * Handler khusus untuk notifikasi Top-up Wallet
     */
    private function handleTopupNotification(array $payload, string $orderId, string $transactionStatus, string $fraudStatus): JsonResponse
    {
        try {
            $walletTx = \App\Models\WalletTransaction::where('order_id', $orderId)->first();

            if (!$walletTx) {
                Log::warning('Midtrans Webhook: WalletTransaction tidak ditemukan', ['order_id' => $orderId]);
                return response()->json(['status' => 'WalletTransaction not found'], 404);
            }

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept' && $walletTx->status !== 'success') {
                    $walletTx->update(['status' => 'success']);
                    $walletTx->user->increment('wallet_balance', $walletTx->amount);
                    Log::info('Topup Wallet Berhasil (capture).', ['order_id' => $orderId, 'amount' => $walletTx->amount]);
                }
            } else if ($transactionStatus == 'settlement') {
                if ($walletTx->status !== 'success') {
                    $walletTx->update(['status' => 'success']);
                    $walletTx->user->increment('wallet_balance', $walletTx->amount);
                    Log::info('Topup Wallet Berhasil (settlement).', ['order_id' => $orderId, 'amount' => $walletTx->amount]);
                }
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $walletTx->update(['status' => 'failed']);
            }

            return response()->json(['status' => 'OK'], 200);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WEBHOOK_TOPUP_CRASH: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}