<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Otp\VerifyOtpRequest;
use App\Services\OtpService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * OtpController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani pengiriman dan verifikasi OTP via WhatsApp (Fonnte).
 * Logika bisnis didelegasikan ke OtpService.
 *
 * Endpoints:
 *   POST /api/auth/otp/send    → Kirim ulang OTP ke nomor HP yang terdaftar
 *   POST /api/auth/otp/verify  → Verifikasi kode OTP (auth:sanctum)
 */
class OtpController extends Controller
{
    use ApiResponse;

    public function __construct(protected OtpService $otpService) {}

    /**
     * Generate dan kirim OTP baru ke nomor HP user.
     */
    public function send(): JsonResponse
    {
        try {
            $result = $this->otpService->send(Auth::user());
            return $this->success($result, 'OTP berhasil dikirim ke WhatsApp Anda.');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 422);
        }
    }

    /**
     * Verifikasi kode OTP yang diinput user.
     */
    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        try {
            $this->otpService->verify(Auth::user(), $request->validated('otp'));
            return $this->success(null, '✅ Nomor WhatsApp Anda berhasil diverifikasi!');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 422);
        }
    }
}
