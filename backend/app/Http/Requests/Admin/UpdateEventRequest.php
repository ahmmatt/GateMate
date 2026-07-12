<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * UpdateEventRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint PUT/PATCH /api/admin/events/{id} (update event)
 */
class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'title'              => ['sometimes', 'required', 'string', 'max:255'],
            'category'           => ['sometimes', 'required', 'string', 'max:100'],
            'description'        => ['nullable', 'string'],
            'location_type'      => ['sometimes', 'required', 'in:offline,online'],
            'location_details'   => ['sometimes', 'required', 'string', 'max:500'],
            'venue_name'         => ['nullable', 'string', 'max:255'],
            'city'               => ['nullable', 'string', 'max:100'],
            'maps_link'          => ['nullable', 'string'],
            'start_date'         => ['sometimes', 'required', 'date'],
            'start_time'         => ['sometimes', 'required', 'date_format:H:i'],
            'end_date'           => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'end_time'           => ['sometimes', 'required', 'date_format:H:i'],
            'timezone'           => ['nullable', 'string', 'max:50'],
            'capacity_type'      => ['sometimes', 'required', 'in:unlimited,limited'],
            'max_capacity'       => ['nullable', 'integer', 'min:1'],
            'seat_assignment'    => ['nullable', 'string', 'in:bebas,pilih'],
            'require_approval'   => ['sometimes', 'boolean'],
            'banner_image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'poster_image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'status'             => ['sometimes', 'string', 'in:active,ended,draft'],
        ];
    }

    public function messages(): array
    {
        return [
            'location_type.in'        => 'Tipe lokasi harus offline atau online.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'capacity_type.in'        => 'Tipe kapasitas harus unlimited atau limited.',
            'status.in'               => 'Status event tidak valid.',
            'banner_image.max'        => 'Ukuran banner maksimal 4MB.',
            'poster_image.max'        => 'Ukuran poster maksimal 4MB.',
        ];
    }
}
