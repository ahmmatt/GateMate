<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ProcessCheckoutRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/checkout (beli tiket via wallet)
 */
class ProcessCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id'    => ['required', 'integer', 'exists:events,id_event'],
            'tier_id'     => ['required', 'integer', 'exists:ticket_tiers,id_tier'],
            'seat_number' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'event_id.required' => 'Event wajib dipilih.',
            'event_id.exists'   => 'Event tidak ditemukan.',
            'tier_id.required'  => 'Tier tiket wajib dipilih.',
            'tier_id.exists'    => 'Tier tiket tidak ditemukan.',
        ];
    }
}
