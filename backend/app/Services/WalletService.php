<?php

namespace App\Services;

use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;

/**
 * WalletService
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola logika wallet: cek pending topup, topup via Midtrans Snap,
 * serta pembayaran P2P dari user ke tenant (→ admin).
 */
class WalletService
{
    /**
     * Sinkronisasi status topup pending dengan Midtrans.
     * Dipanggil saat user membuka halaman wallet.
     *
     * @param  User $user
     */
    public function syncPendingTopups(User $user): void
    {
        $pendingTopups = $user->walletTransactions()
            ->where('type', 'topup')
            ->where('status', 'pending')
            ->get();

        if ($pendingTopups->isEmpty()) {
            return;
        }

        MidtransConfig::$serverKey    = config('services.midtrans.server_key');
        MidtransConfig::$isProduction = config('services.midtrans.is_production', false);

        foreach ($pendingTopups as $tx) {
            try {
                /** @var object{transaction_status?: string, fraud_status?: string}|null $status */
                $status = \Midtrans\Transaction::status($tx->order_id);

                if (! $status || ! isset($status->transaction_status)) {
                    continue;
                }

                $ts = $status->transaction_status;
                $fs = $status->fraud_status ?? '';

                if ($ts === 'capture' || $ts === 'settlement') {
                    if ($ts === 'capture' && $fs !== 'accept') {
                        continue;
                    }
                    $tx->update(['status' => 'success']);
                    $user->increment('wallet_balance', $tx->amount);
                    Log::info('WalletService: Topup pending dikonfirmasi.', [
                        'order_id' => $tx->order_id,
                        'amount'   => $tx->amount,
                    ]);
                } elseif (in_array($ts, ['cancel', 'deny', 'expire'])) {
                    $tx->update(['status' => 'failed']);
                }
            } catch (\Exception $e) {
                // Tidak ditemukan di Midtrans — abaikan
            }
        }
    }

    /**
     * Proses top-up saldo via Midtrans Snap.
     * Membuat pending record di DB dan mengembalikan Snap Token.
     *
     * @param  User $user
     * @param  int  $amount  (minimal 10.000)
     * @return array ['snap_token' => string, 'order_id' => string, 'amount' => int]
     * @throws \Exception
     */
    public function topup(User $user, int $amount): array
    {
        $orderId = 'TOPUP-' . time() . '-' . rand(100, 999);

        // Simpan transaksi pending
        WalletTransaction::create([
            'user_id'  => $user->id_user,
            'order_id' => $orderId,
            'type'     => 'topup',
            'amount'   => $amount,
            'status'   => 'pending',
        ]);

        // Konfigurasi Midtrans
        MidtransConfig::$serverKey    = config('services.midtrans.server_key');
        MidtransConfig::$isProduction = config('services.midtrans.is_production', false);
        MidtransConfig::$isSanitized  = true;
        MidtransConfig::$is3ds        = true;

        // Set override URL ke Ngrok jika berjalan di lokal
        $this->setNgrokOverrideIfLocal();

        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $amount,
            ],
            'customer_details' => [
                'first_name' => $user->full_name ?? 'User',
                'email'      => $user->email ?? 'user@securegate.id',
            ],
            'item_details' => [
                [
                    'id'       => 'TOPUP',
                    'price'    => $amount,
                    'quantity' => 1,
                    'name'     => 'Top-up Saldo SecureGate',
                ],
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        Log::info('WalletService: Snap token topup berhasil dibuat.', [
            'order_id' => $orderId,
            'amount'   => $amount,
        ]);

        return [
            'snap_token' => $snapToken,
            'order_id'   => $orderId,
            'amount'     => $amount,
        ];
    }

    /**
     * Proses pembayaran P2P dari pembeli ke tenant (revenue → admin event).
     *
     * @param  User $buyer
     * @param  int  $tenantId
     * @param  int  $amount
     * @return array
     * @throws \RuntimeException
     * @throws \Exception
     */
    public function payTenant(User $buyer, int $tenantId, int $amount): array
    {
        /** @var User $tenant */
        $tenant = User::with('event')
            ->where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        if ($buyer->wallet_balance < $amount) {
            throw new \RuntimeException(
                json_encode([
                    'message'         => 'Saldo wallet Anda tidak mencukupi untuk transaksi ini.',
                    'current_balance' => (float) $buyer->wallet_balance,
                    'required_amount' => $amount,
                ]),
                422
            );
        }

        return DB::transaction(function () use ($buyer, $tenant, $amount) {
            $orderId = 'PAY-' . time() . '-' . rand(100, 999);

            /** @var \App\Models\Event|null $tenantEvent */
            $tenantEvent = $tenant->event;

            if (! $tenantEvent || ! $tenantEvent->id_admin) {
                throw new \Exception('Tenant ini tidak terikat dengan event yang valid.');
            }

            /** @var User $admin */
            $admin = User::findOrFail($tenantEvent->id_admin);

            $buyer->decrement('wallet_balance', $amount);
            $admin->increment('wallet_balance', $amount);

            WalletTransaction::create([
                'user_id'      => $buyer->id_user,
                'reference_id' => $tenant->id_user,
                'order_id'     => $orderId . '-OUT',
                'type'         => 'payment',
                'amount'       => $amount,
                'status'       => 'success',
            ]);

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
                    'event_id'    => $tenantEvent->id_event,
                ],
            ]);

            Log::info('WalletService: Pembayaran P2P sukses.', [
                'buyer_id'  => $buyer->id_user,
                'tenant_id' => $tenant->id_user,
                'admin_id'  => $admin->id_user,
                'amount'    => $amount,
                'order_id'  => $orderId,
            ]);

            /** @var User|null $freshBuyer */
            $freshBuyer = $buyer->fresh();

            return [
                'order_id'    => $orderId,
                'amount_paid' => $amount,
                'tenant_name' => $tenant->full_name,
                'new_balance' => (float) ($freshBuyer?->wallet_balance ?? $buyer->wallet_balance),
            ];
        });
    }

    /**
     * Jika ada Ngrok tunnel aktif (lokal), set override notification URL ke Midtrans.
     */
    protected function setNgrokOverrideIfLocal(): void
    {
        try {
            $ngrokResponse = @file_get_contents('http://127.0.0.1:4040/api/tunnels');
            if ($ngrokResponse) {
                $ngrokData = json_decode($ngrokResponse, true);
                if (! empty($ngrokData['tunnels'][0]['public_url'])) {
                    $ngrokUrl = str_replace('http://', 'https://', $ngrokData['tunnels'][0]['public_url']);
                    MidtransConfig::$overrideNotifUrl = $ngrokUrl . '/webhook/midtrans';
                    Log::info('WalletService: Set Midtrans overrideNotifUrl via Ngrok.', [
                        'url' => MidtransConfig::$overrideNotifUrl,
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::warning('WalletService: Gagal mengambil URL ngrok.', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Handler khusus untuk notifikasi Top-up Wallet dari Midtrans Webhook.
     */
    public function handleTopupWebhook(string $orderId, string $transactionStatus, string $fraudStatus): array
    {
        $walletTx = WalletTransaction::with('user')->where('order_id', $orderId)->first();

        if (! $walletTx) {
            Log::warning('Midtrans Webhook: WalletTransaction tidak ditemukan', ['order_id' => $orderId]);
            throw new \RuntimeException('WalletTransaction not found', 404);
        }

        if ($transactionStatus === 'capture') {
            if ($fraudStatus === 'accept' && $walletTx->status !== 'success') {
                $walletTx->update(['status' => 'success']);
                $walletTx->user?->increment('wallet_balance', $walletTx->amount);
                Log::info('Topup Wallet Berhasil (capture).', ['order_id' => $orderId, 'amount' => $walletTx->amount]);
            }
        } elseif ($transactionStatus === 'settlement') {
            if ($walletTx->status !== 'success') {
                $walletTx->update(['status' => 'success']);
                $walletTx->user?->increment('wallet_balance', $walletTx->amount);
                Log::info('Topup Wallet Berhasil (settlement).', ['order_id' => $orderId, 'amount' => $walletTx->amount]);
            }
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $walletTx->update(['status' => 'failed']);
        }

        return ['status' => 'OK'];
    }
}
