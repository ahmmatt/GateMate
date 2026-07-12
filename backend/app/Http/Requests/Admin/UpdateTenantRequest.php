<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * UpdateTenantRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint PUT /api/admin/events/{eventId}/tenants/{tenantId}
 */
class UpdateTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $tenantId = $this->route('tenant') ?? $this->route('tenantId');

        return [
            'full_name' => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email,' . $tenantId . ',id_user'],
            'password'  => ['nullable', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap tenant wajib diisi.',
            'email.required'     => 'Email wajib diisi.',
            'email.email'        => 'Format email tidak valid.',
            'email.unique'       => 'Email sudah terdaftar untuk pengguna lain.',
            'password.min'       => 'Password minimal 8 karakter.',
        ];
    }
}
