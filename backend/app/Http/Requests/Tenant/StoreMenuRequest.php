<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * StoreMenuRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/tenant/menus
 */
class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'tenant';
    }

    public function rules(): array
    {
        return [
            'item_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'integer', 'min:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'item_name.required' => 'Nama menu wajib diisi.',
            'item_name.max'      => 'Nama menu maksimal 100 karakter.',
            'price.required'     => 'Harga menu wajib diisi.',
            'price.integer'      => 'Harga menu harus berupa angka.',
            'price.min'          => 'Harga menu minimal Rp 100.',
        ];
    }
}
