<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * UpdateVibeRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/tickets/{id}/vibe
 */
class UpdateVibeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'vibe_bio'          => ['nullable', 'string', 'max:500'],
            'ig_handle'         => ['nullable', 'string', 'max:50'],
            'looking_for_match' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'vibe_bio.max'  => 'Vibe Bio maksimal 500 karakter.',
            'ig_handle.max' => 'Instagram handle maksimal 50 karakter.',
        ];
    }
}
