<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * FonnteService
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengirim pesan WhatsApp menggunakan Fonnte API.
 * Endpoint : POST https://api.fonnte.com/send
 * Auth     : Header "Authorization: {FONNTE_TOKEN}" (tanpa kata "Bearer")
 */
class FonnteService
{
    protected string $token;

    public function __construct()
    {
        $this->token = env('FONNTE_TOKEN', '');
    }

    /**
     * Kirim pesan WhatsApp ke nomor target.
     *
     * @param  string $phone  Format: 628xxxxxxxxxx
     * @param  string $message
     * @return bool
     */
    public function send(string $phone, string $message): bool
    {
        if (empty($this->token)) {
            Log::error('FonnteService: FONNTE_TOKEN kosong!');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token, // Fonnte: tanpa prefix "Bearer"
            ])->asForm()->timeout(10)->post('https://api.fonnte.com/send', [
                'target'  => $phone,
                'message' => $message,
                'delay'   => 2,
            ]);

            if ($response->failed()) {
                Log::error('FonnteService: Gagal kirim WA', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                    'target' => $phone,
                ]);
                return false;
            }

            Log::info('FonnteService: OTP terkirim ke ' . $phone);
            return true;

        } catch (\Exception $e) {
            Log::error('FonnteService: Exception — ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Normalisasi nomor HP Indonesia ke format Fonnte (628xxxxxxxxxx).
     * Contoh: 08123456789 → 628123456789
     *
     * @param  string $phone
     * @return string
     */
    public static function normalizePhone(string $phone): string
    {
        // Hilangkan karakter non-digit
        $phone = preg_replace('/\D/', '', $phone);

        // Ganti awalan 0 dengan 62
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        // Jika belum diawali 62, tambahkan
        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        return $phone;
    }
}
