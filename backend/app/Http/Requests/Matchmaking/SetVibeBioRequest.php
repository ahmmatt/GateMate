<?php

namespace App\Http\Requests\Matchmaking;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * SetVibeBioRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/matchmaking/{id}/vibe-bio
 */
class SetVibeBioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'vibe_bio' => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'vibe_bio.required' => 'Vibe Bio wajib diisi.',
            'vibe_bio.max'      => 'Vibe Bio maksimal 500 karakter.',
        ];
    }
}
