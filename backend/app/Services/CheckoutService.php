<?php

namespace App\Services;

use App\Models\Attendee;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use App\Mail\ETicketMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * CheckoutService
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola seluruh logika proses pembelian tiket via wallet GateMate.
 * Termasuk: KYC check, seat check, anti-calo, potong saldo, kirim e-ticket.
 */
class CheckoutService
{
    /**
     * Proses pembelian tiket via pemotongan saldo wallet.
     *
     * @param  \App\Models\User $user
     * @param  int              $eventId
     * @param  int              $tierId
     * @param  string|null      $seatNumber
     * @return array  Data order yang sukses
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException  (via abort())
     * @throws \Exception
     */
    public function process($user, int $eventId, int $tierId, ?string $seatNumber = null): array
    {
        // ── 1. KYC Face Verification Check ────────────────────────────────────
        $this->checkKyc($user);

        // ── 2. Ambil Event & Tier ──────────────────────────────────────────────
        $event = Event::findOrFail($eventId);
        $tier  = TicketTier::findOrFail($tierId);
        $grossAmount = (float) $tier->price;

        // ── 3. Cek Ketersediaan Kursi Tier ────────────────────────────────────
        if (! $tier->is_unlimited && $tier->remaining_seats <= 0) {
            throw new \RuntimeException('Maaf, tiket untuk tier ini sudah habis.', 422);
        }

        // ── 4. Cek Nomor Kursi Spesifik ───────────────────────────────────────
        $this->checkSeatAvailability($event, $eventId, $seatNumber);

        // ── 5. Anti-Calo: 1 tiket per akun per event ──────────────────────────
        $this->checkAntiScalp($user, $eventId);

        // ── 6. Cek Saldo Wallet ────────────────────────────────────────────────
        if ($user->wallet_balance < $grossAmount) {
            throw new \RuntimeException(
                json_encode([
                    'status'          => 'insufficient_balance',
                    'message'         => 'Saldo wallet tidak cukup. Silakan Top Up terlebih dahulu.',
                    'current_balance' => (float) $user->wallet_balance,
                    'required_amount' => $grossAmount,
                ]),
                422
            );
        }

        // ── 7. Proses Transaksi DB ─────────────────────────────────────────────
        return DB::transaction(function () use ($user, $event, $tier, $grossAmount, $seatNumber) {
            $orderId    = 'TRX-' . time() . '-' . $user->id_user;
            $isPending  = (bool) $event->require_approval;

            // Potong saldo user
            $user->decrement('wallet_balance', $grossAmount);

            // Buat record transaksi tiket
            $transaction = Transaction::create([
                'user_id'        => $user->id_user,
                'event_id'       => $event->id_event,
                'ticket_tier_id' => $tier->id_tier,
                'seat_number'    => $seatNumber,
                'order_id'       => $orderId,
                'gross_amount'   => $grossAmount,
                'payment_status' => $isPending ? 'pending' : 'success',
                'snap_token'     => null,
            ]);

            // Buat Attendee record
            Attendee::create([
                'id_user'     => $user->id_user,
                'id_event'    => $event->id_event,
                'id_tier'     => $tier->id_tier,
                'ticket_code' => $orderId,
                'qr_token'    => Str::random(40),
                'status'      => $isPending ? 'need_approval' : 'approved',
            ]);

            // Catat histori wallet
            WalletTransaction::create([
                'user_id'  => $user->id_user,
                'order_id' => $orderId,
                'type'     => 'ticket_purchase',
                'amount'   => $grossAmount,
                'status'   => $isPending ? 'pending' : 'success',
                'meta'     => [
                    'event_id'    => $event->id_event,
                    'event_title' => $event->title,
                    'tier_id'     => $tier->id_tier,
                    'tier_name'   => $tier->tier_name,
                ],
            ]);

            // Kurangi remaining_seats jika bukan unlimited
            if (! $tier->is_unlimited) {
                $tier->decrement('remaining_seats');
            }

            // Kirim E-Ticket via email jika langsung sukses
            if (! $isPending) {
                $this->sendETicket($transaction);
            }

            Log::info('CheckoutService: Pembelian tiket berhasil.', [
                'order_id'   => $orderId,
                'user_id'    => $user->id_user,
                'event_id'   => $event->id_event,
                'is_pending' => $isPending,
            ]);

            return [
                'order_id'       => $orderId,
                'event_title'    => $event->title,
                'tier_name'      => $tier->tier_name,
                'gross_amount'   => $grossAmount,
                'new_balance'    => (float) $user->fresh()->wallet_balance,
                'transaction_id' => $transaction->id,
                'status'         => $isPending ? 'pending' : 'success',
            ];
        });
    }

    /**
     * Pastikan user telah melakukan KYC face verification.
     *
     * @throws \RuntimeException
     */
    protected function checkKyc($user): void
    {
        $needsVerification = ! $user->face_verified_at
            || Carbon::parse($user->face_verified_at)->lt(now()->subMonths(5));

        if ($needsVerification) {
            Log::warning('CheckoutService: KYC Blocker aktif.', [
                'user_id'          => $user->id_user,
                'face_verified_at' => $user->face_verified_at,
            ]);
            throw new \RuntimeException(
                json_encode([
                    'status'  => 'needs_verification',
                    'message' => 'Verifikasi wajah (KYC) diperlukan sebelum membeli tiket.',
                ]),
                403
            );
        }
    }

    /**
     * Periksa ketersediaan nomor kursi spesifik.
     *
     * @throws \RuntimeException
     */
    protected function checkSeatAvailability($event, int $eventId, ?string $seatNumber): void
    {
        if ($event->seat_assignment === 'pilih' && ! $seatNumber) {
            throw new \RuntimeException('Silakan pilih nomor kursi terlebih dahulu.', 422);
        }

        if ($event->seat_assignment === 'pilih' && $seatNumber) {
            $isTaken = Transaction::where('event_id', $eventId)
                ->where('seat_number', $seatNumber)
                ->whereIn('payment_status', ['success', 'pending'])
                ->exists();

            if ($isTaken) {
                throw new \RuntimeException(
                    "Maaf, kursi {$seatNumber} sudah dipesan oleh orang lain. Silakan pilih kursi lain.",
                    422
                );
            }
        }
    }

    /**
     * Anti-calo: Cek apakah user sudah punya tiket untuk event ini.
     *
     * @throws \RuntimeException
     */
    protected function checkAntiScalp($user, int $eventId): void
    {
        $hasTicket = Transaction::where('event_id', $eventId)
            ->where('user_id', $user->id_user)
            ->whereIn('payment_status', ['success', 'pending'])
            ->exists();

        if ($hasTicket) {
            throw new \RuntimeException(
                'Sistem anti-calo aktif: Anda hanya dapat membeli 1 tiket per akun untuk event ini.',
                422
            );
        }
    }

    /**
     * Kirim E-Ticket via email (non-blocking; error tidak membatalkan transaksi).
     *
     * @param  Transaction $transaction
     */
    protected function sendETicket(Transaction $transaction): void
    {
        try {
            $transaction->load(['user', 'event', 'ticketTier']);
            Mail::to($transaction->user->email)->send(new ETicketMail($transaction));
            Log::info('CheckoutService: E-Ticket email terkirim.', ['order_id' => $transaction->order_id]);
        } catch (\Exception $e) {
            Log::error('CheckoutService: Gagal kirim E-Ticket.', [
                'order_id' => $transaction->order_id,
                'error'    => $e->getMessage(),
            ]);
        }
    }

    /**
     * Memproses webhook notifikasi dari Midtrans.
     *
     * @param  array $payload
     * @return array
     * @throws \RuntimeException
     */
    public function handleMidtransWebhook(array $payload): array
    {
        $orderId      = $payload['order_id'] ?? '';
        $statusCode   = $payload['status_code'] ?? '';
        $grossAmount  = $payload['gross_amount'] ?? '';
        $signatureKey = $payload['signature_key'] ?? '';
        $serverKey    = config('services.midtrans.server_key');

        $calculatedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($calculatedSignature !== $signatureKey) {
            Log::warning('Midtrans Webhook: Invalid Signature', ['order_id' => $orderId]);
            throw new \RuntimeException('Invalid Signature', 403);
        }

        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus       = $payload['fraud_status'] ?? '';

        if (str_starts_with($orderId, 'TOPUP-')) {
            return app(WalletService::class)->handleTopupWebhook($orderId, $transactionStatus, $fraudStatus);
        }

        $transaction = Transaction::where('order_id', $orderId)->first();

        if (! $transaction) {
            Log::warning('Midtrans Webhook: Transaksi Tiket tidak ditemukan', ['order_id' => $orderId]);
            throw new \RuntimeException('Transaction not found', 404);
        }

        if ($transactionStatus === 'capture') {
            if ($fraudStatus === 'accept') {
                $transaction->update(['payment_status' => 'success']);
                $isPending = $transaction->event->require_approval ?? false;

                Attendee::firstOrCreate(
                    ['ticket_code' => $orderId],
                    [
                        'id_user'  => $transaction->user_id,
                        'id_event' => $transaction->event_id,
                        'id_tier'  => $transaction->ticket_tier_id,
                        'qr_token' => Str::random(40),
                        'status'   => $isPending ? 'need_approval' : 'approved',
                    ]
                );

                if (! $isPending) {
                    $this->sendETicket($transaction);
                }
            }
        } elseif ($transactionStatus === 'settlement') {
            $transaction->update(['payment_status' => 'success']);
            $isPending = $transaction->event->require_approval ?? false;

            Attendee::firstOrCreate(
                ['ticket_code' => $orderId],
                [
                    'id_user'  => $transaction->user_id,
                    'id_event' => $transaction->event_id,
                    'id_tier'  => $transaction->ticket_tier_id,
                    'qr_token' => Str::random(40),
                    'status'   => $isPending ? 'need_approval' : 'approved',
                ]
            );

            if (! $isPending) {
                $this->sendETicket($transaction);
            }
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $transaction->update(['payment_status' => 'failed']);
        } elseif ($transactionStatus === 'pending') {
            $transaction->update(['payment_status' => 'pending']);
        }

        Log::info('Midtrans Webhook: Sukses Memperbarui Transaksi Tiket', [
            'order_id' => $orderId,
            'status'   => $transaction->payment_status,
        ]);

        return ['status' => 'OK'];
    }
}
