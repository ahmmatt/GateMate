<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * RegisterRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/auth/register
 */
class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'gender'    => ['required', 'string', 'in:Male,Female'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone'     => ['required', 'string', 'min:9', 'max:15'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required'  => 'Nama lengkap wajib diisi.',
            'gender.required'     => 'Jenis kelamin wajib dipilih.',
            'gender.in'           => 'Jenis kelamin harus Male atau Female.',
            'email.required'      => 'Email wajib diisi.',
            'email.unique'        => 'Email ini sudah terdaftar.',
            'phone.required'      => 'Nomor WhatsApp wajib diisi.',
            'phone.min'           => 'Nomor WhatsApp tidak valid (minimal 9 digit).',
            'password.required'   => 'Password wajib diisi.',
            'password.min'        => 'Password minimal 8 karakter.',
            'password.confirmed'  => 'Konfirmasi password tidak cocok.',
        ];
    }
}
