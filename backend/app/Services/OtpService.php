<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * OtpService
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola logika OTP: generate, kirim via WhatsApp, verifikasi.
 */
class OtpService
{
    // Cooldown: user tidak boleh minta OTP baru dalam 1 menit pertama
    public const COOLDOWN_SECONDS = 60;

    // Masa berlaku OTP dalam menit
    public const EXPIRES_MINUTES = 5;

    public function __construct(protected FonnteService $fonnte) {}

    /**
     * Generate dan kirim OTP baru ke nomor HP user.
     *
     * @param  User $user
     * @return array ['expires_in' => int (detik)]
     * @throws \RuntimeException
     */
    public function send(User $user): array
    {
        if ($user->phone_verified_at) {
            throw new \RuntimeException('Nomor telepon sudah terverifikasi.', 409);
        }

        if (empty($user->phone)) {
            throw new \RuntimeException('Nomor telepon belum terdaftar di akun ini.', 422);
        }

        // Cek cooldown
        if ($user->phone_otp_expires_at) {
            $secondsRemaining = now()->diffInSeconds($user->phone_otp_expires_at, false);
            $cooldownThreshold = (self::EXPIRES_MINUTES * 60) - self::COOLDOWN_SECONDS;

            if ($secondsRemaining > $cooldownThreshold) {
                $waitSeconds = $secondsRemaining - $cooldownThreshold;
                throw new \RuntimeException(
                    "Mohon tunggu {$waitSeconds} detik sebelum meminta OTP baru.",
                    429
                );
            }
        }

        // Generate OTP 6 digit
        $otp       = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(self::EXPIRES_MINUTES);

        // Simpan ke DB
        $user->update([
            'phone_otp'            => $otp,
            'phone_otp_expires_at' => $expiresAt,
        ]);

        // Kirim via WhatsApp
        $normalizedPhone = FonnteService::normalizePhone($user->phone);
        $appName         = config('app.name', 'SecureGate');
        $message         = "🔐 *Kode Verifikasi {$appName}*\n\nKode OTP Anda adalah:\n\n*{$otp}*\n\nKode ini berlaku selama " . self::EXPIRES_MINUTES . " menit. Jangan berikan kode ini kepada siapapun.\n\n_Tim {$appName}_";

        $sent = $this->fonnte->send($normalizedPhone, $message);

        if (! $sent) {
            Log::error('OtpService: Gagal kirim OTP.', [
                'user_id' => $user->id_user,
                'phone'   => $normalizedPhone,
            ]);
            throw new \RuntimeException(
                'Gagal mengirim OTP. Pastikan nomor WhatsApp Anda aktif dan coba lagi.',
                502
            );
        }

        Log::info('OtpService: OTP berhasil dikirim.', ['user_id' => $user->id_user]);

        return ['expires_in' => self::EXPIRES_MINUTES * 60];
    }

    /**
     * Verifikasi kode OTP yang diinput user.
     *
     * @param  User   $user
     * @param  string $otp
     * @throws \RuntimeException
     */
    public function verify(User $user, string $otp): void
    {
        if ($user->phone_verified_at) {
            throw new \RuntimeException('Nomor telepon sudah terverifikasi.', 409);
        }

        if (! $user->phone_otp_expires_at || now()->isAfter($user->phone_otp_expires_at)) {
            throw new \RuntimeException('Kode OTP sudah kadaluarsa. Silakan minta kode baru.', 422);
        }

        if ($otp !== $user->phone_otp) {
            throw new \RuntimeException('Kode OTP yang Anda masukkan salah. Periksa kembali.', 422);
        }

        // Verifikasi berhasil — bersihkan OTP
        $user->update([
            'phone_verified_at'    => now(),
            'phone_otp'            => null,
            'phone_otp_expires_at' => null,
        ]);

        Log::info('OtpService: Verifikasi OTP berhasil.', ['user_id' => $user->id_user]);
    }
}
