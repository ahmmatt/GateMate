<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransIrisService
{
    /**
     * Otomatisasi pencairan dana via Midtrans IRIS.
     *
     * @param  \App\Models\WalletTransaction  $transaction
     * @return array|null
     * @throws \Exception
     */
    public static function payout($transaction)
    {
        try {
            $meta = $transaction->meta ?? [];
            $rekening = $meta['account_number'] ?? '';
            $bank = $meta['bank_name'] ?? '';

            if (empty($rekening) || empty($bank)) {
                throw new \Exception('Data rekening atau bank tidak ditemukan di metadata transaksi.');
            }

            // Memastikan amount adalah numeric (bisa integer atau float) sesuai kebutuhan Midtrans
            $amount = (float) $transaction->amount;

            $payload = [
                'payouts' => [
                    [
                        'beneficiary_name'    => $transaction->user->full_name,
                        'beneficiary_account' => $rekening,
                        'beneficiary_bank'    => $bank,
                        'beneficiary_email'   => $transaction->user->email,
                        'amount'              => $amount,
                        'notes'               => 'Pencairan Dana GateMate',
                    ]
                ]
            ];

            $serverKey = env('MIDTRANS_SERVER_KEY');
            
            if (empty($serverKey)) {
                throw new \Exception('Sistem Gagal: MIDTRANS_SERVER_KEY belum dikonfigurasi.');
            }

            $response = Http::withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->withBasicAuth((string) $serverKey, '')
            ->post('https://app.sandbox.midtrans.com/iris/api/v1/payouts', $payload);

            if ($response->successful() || $response->status() === 201) {
                Log::info('Midtrans IRIS Payout Success', ['transaction_id' => $transaction->id, 'response' => $response->json()]);
                return $response->json();
            }

            // Ekstrak detail error seakurat mungkin
            $respBody = $response->json();
            $errorMsg = 'Gagal menghubungi Midtrans IRIS.';
            
            if (is_array($respBody)) {
                if (isset($respBody['errors']) && is_string($respBody['errors'])) {
                    $errorMsg = $respBody['errors'];
                } elseif (isset($respBody['errors']) && is_array($respBody['errors'])) {
                    $errorMsg = implode(', ', $respBody['errors']);
                } elseif (isset($respBody['error_message'])) {
                    $errorMsg = $respBody['error_message'];
                } elseif (isset($respBody['message'])) {
                    $errorMsg = $respBody['message'];
                } else {
                    $errorMsg = json_encode($respBody);
                }
            } elseif ($response->body()) {
                $errorMsg = $response->body(); // Menangkap respons HTML/teks (misal 401 Unauthorized)
            }

            Log::error('Midtrans IRIS Payout Failed', ['transaction_id' => $transaction->id, 'response' => $response->body()]);
            
            throw new \Exception('Midtrans IRIS: ' . $errorMsg);

        } catch (\Exception $e) {
            Log::error('Midtrans IRIS Payout Exception: ' . $e->getMessage());
            throw $e;
        }
    }
}
