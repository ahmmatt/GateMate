<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * StoreTierRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/admin/events/{id}/tiers
 */
class StoreTierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'tier_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'numeric', 'min:0'],
            'quota'     => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'tier_name.required' => 'Nama tier tiket wajib diisi.',
            'price.required'     => 'Harga tiket wajib diisi.',
            'price.min'          => 'Harga tiket tidak boleh negatif.',
            'quota.required'     => 'Kuota tiket wajib diisi.',
            'quota.min'          => 'Kuota tiket minimal 1.',
        ];
    }
}
