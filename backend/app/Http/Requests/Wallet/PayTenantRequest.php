<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

/**
 * PayTenantRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/wallet/pay/{tenantId} (bayar ke tenant)
 */
class PayTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1000', 'max:10000000'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Jumlah pembayaran wajib diisi.',
            'amount.numeric'  => 'Jumlah pembayaran harus berupa angka.',
            'amount.min'      => 'Minimum pembayaran adalah Rp 1.000.',
            'amount.max'      => 'Maksimum pembayaran adalah Rp 10.000.000.',
        ];
    }
}
