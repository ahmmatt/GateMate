<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * StoreEventRequest
 * ─────────────────────────────────────────────────────────────────────────────
 * Validasi untuk endpoint POST /api/admin/events (buat event baru)
 */
class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'title'              => ['required', 'string', 'max:255'],
            'category'           => ['required', 'string', 'max:100'],
            'description'        => ['nullable', 'string'],
            'location_type'      => ['required', 'in:offline,online'],
            'location_details'   => ['required', 'string', 'max:500'],
            'venue_name'         => ['nullable', 'string', 'max:255'],
            'city'               => ['nullable', 'string', 'max:100'],
            'maps_link'          => ['nullable', 'string'],
            'start_date'         => ['required', 'date'],
            'start_time'         => ['required', 'date_format:H:i'],
            'end_date'           => ['required', 'date', 'after_or_equal:start_date'],
            'end_time'           => ['required', 'date_format:H:i'],
            'timezone'           => ['nullable', 'string', 'max:50'],
            'capacity_type'      => ['required', 'in:unlimited,limited'],
            'max_capacity'       => ['nullable', 'integer', 'min:1'],
            'seat_assignment'    => ['nullable', 'string', 'in:bebas,pilih'],
            'seat_numbers'       => ['nullable', 'string'],
            'require_approval'   => ['sometimes', 'boolean'],
            'banner_image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'poster_image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'custom_questions'   => ['nullable', 'array'],
            'custom_questions.*' => ['string', 'max:255'],
            // Tier tiket pertama
            'tier_name'          => ['required', 'string', 'max:100'],
            'price'              => ['required', 'numeric', 'min:0'],
            'is_unlimited'       => ['sometimes', 'boolean'],
            'quota'              => ['required_without:is_unlimited', 'nullable', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'          => 'Nama event wajib diisi.',
            'category.required'       => 'Kategori event wajib dipilih.',
            'location_type.required'  => 'Tipe lokasi wajib dipilih.',
            'location_type.in'        => 'Tipe lokasi harus offline atau online.',
            'location_details.required' => 'Detail lokasi wajib diisi.',
            'start_date.required'     => 'Tanggal mulai wajib diisi.',
            'start_time.required'     => 'Waktu mulai wajib diisi.',
            'end_date.required'       => 'Tanggal selesai wajib diisi.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'end_time.required'       => 'Waktu selesai wajib diisi.',
            'capacity_type.required'  => 'Tipe kapasitas wajib dipilih.',
            'capacity_type.in'        => 'Tipe kapasitas harus unlimited atau limited.',
            'tier_name.required'      => 'Nama tier tiket wajib diisi.',
            'price.required'          => 'Harga tiket wajib diisi.',
            'price.min'               => 'Harga tiket tidak boleh negatif.',
            'quota.required_without'  => 'Kuota tiket wajib diisi jika tier tidak unlimited.',
            'quota.min'               => 'Kuota tiket minimal 1.',
            'banner_image.max'        => 'Ukuran banner maksimal 4MB.',
            'poster_image.max'        => 'Ukuran poster maksimal 4MB.',
        ];
    }
}
