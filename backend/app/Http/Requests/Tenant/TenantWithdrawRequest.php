<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * TenantWithdrawRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/tenant/withdraw
 */
class TenantWithdrawRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'tenant';
    }

    public function rules(): array
    {
        return [
            'amount'         => ['required', 'numeric', 'min:10000'],
            'bank_name'      => ['required', 'string', 'max:50'],
            'account_number' => ['required', 'string', 'max:30'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required'         => 'Nominal penarikan wajib diisi.',
            'amount.numeric'          => 'Nominal penarikan harus berupa angka.',
            'amount.min'              => 'Nominal penarikan minimal Rp 10.000.',
            'bank_name.required'      => 'Nama bank wajib diisi.',
            'account_number.required' => 'Nomor rekening wajib diisi.',
        ];
    }
}
