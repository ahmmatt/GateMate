<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FonnteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * OtpController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani pengiriman dan verifikasi OTP via WhatsApp (Fonnte).
 *
 * Endpoints:
 *   POST /api/auth/otp/send    → Kirim ulang OTP ke nomor HP yang terdaftar
 *   POST /api/auth/otp/verify  → Verifikasi kode OTP (auth:sanctum)
 */
class OtpController extends Controller
{
    public function __construct(protected FonnteService $fonnte) {}

    /**
     * Generate dan kirim OTP baru ke nomor HP user.
     * Bisa dipakai saat registrasi (langsung dipanggil dari AuthController)
     * atau saat user klik "Kirim Ulang OTP".
     */
    public function send(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 401);
        }

        if ($user->phone_verified_at) {
            return response()->json(['success' => false, 'message' => 'Nomor telepon sudah terverifikasi.'], 409);
        }

        if (empty($user->phone)) {
            return response()->json(['success' => false, 'message' => 'Nomor telepon belum terdaftar di akun ini.'], 422);
        }

        // Cek cooldown: jika OTP sebelumnya belum expire lebih dari 4 menit (baru 1 menit lewat), tolak
        if ($user->phone_otp_expires_at && now()->diffInSeconds($user->phone_otp_expires_at) > 240) {
            $remainingSeconds = now()->diffInSeconds($user->phone_otp_expires_at) - 240;
            return response()->json([
                'success' => false,
                'message' => "Mohon tunggu {$remainingSeconds} detik sebelum meminta OTP baru.",
            ], 429);
        }

        // Generate OTP 6 digit
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(5);

        // Simpan ke DB
        $user->update([
            'phone_otp'            => $otp,
            'phone_otp_expires_at' => $expiresAt,
        ]);

        // Normalisasi nomor & kirim WA
        $normalizedPhone = FonnteService::normalizePhone($user->phone);
        $appName = config('app.name', 'SecureGate');
        $message = "🔐 *Kode Verifikasi {$appName}*\n\nKode OTP Anda adalah:\n\n*{$otp}*\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.\n\n_Tim {$appName}_";

        $sent = $this->fonnte->send($normalizedPhone, $message);

        if (!$sent) {
            Log::error('OtpController: Gagal kirim OTP ke ' . $normalizedPhone);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP. Pastikan nomor WhatsApp Anda aktif dan coba lagi.',
            ], 502);
        }

        return response()->json([
            'success'    => true,
            'message'    => 'OTP berhasil dikirim ke WhatsApp Anda.',
            'expires_in' => 300, // detik
        ]);
    }

    /**
     * Verifikasi kode OTP yang diinput user.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ], [
            'otp.required' => 'Kode OTP wajib diisi.',
            'otp.size'     => 'Kode OTP harus 6 digit.',
        ]);

        $user = Auth::user();

        if ($user->phone_verified_at) {
            return response()->json(['success' => false, 'message' => 'Nomor telepon sudah terverifikasi.'], 409);
        }

        // Cek apakah OTP expired
        if (!$user->phone_otp_expires_at || now()->isAfter($user->phone_otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP sudah kadaluarsa. Silakan minta kode baru.',
            ], 422);
        }

        // Cek kecocokan OTP
        if ($request->otp !== $user->phone_otp) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP yang Anda masukkan salah. Periksa kembali.',
            ], 422);
        }

        // Verifikasi berhasil — bersihkan OTP & set waktu verifikasi
        $user->update([
            'phone_verified_at'    => now(),
            'phone_otp'            => null,
            'phone_otp_expires_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ Nomor WhatsApp Anda berhasil diverifikasi!',
        ]);
    }
}
