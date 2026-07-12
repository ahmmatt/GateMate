<?php

namespace App\Http\Requests\Otp;

use Illuminate\Foundation\Http\FormRequest;

/**
 * VerifyOtpRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/auth/otp/verify
 */
class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'otp' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'otp.required' => 'Kode OTP wajib diisi.',
            'otp.size'     => 'Kode OTP harus tepat 6 digit.',
            'otp.regex'    => 'Kode OTP hanya boleh berisi angka.',
        ];
    }
}
