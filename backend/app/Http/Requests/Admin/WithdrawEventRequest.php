<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * WithdrawEventRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/admin/events/{id}/withdraw
 */
class WithdrawEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'bank_name'      => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'amount'         => ['required', 'numeric', 'min:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'bank_name.required'      => 'Nama bank wajib diisi.',
            'account_number.required' => 'Nomor rekening wajib diisi.',
            'amount.required'         => 'Jumlah penarikan wajib diisi.',
            'amount.min'              => 'Jumlah penarikan minimal Rp 1.000.',
        ];
    }
}
