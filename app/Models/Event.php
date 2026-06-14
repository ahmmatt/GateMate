<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'id_admin',
    'title',
    'banner_image',
    'poster_path',
    'category',
    'location_type',
    'location_details',
    'venue_name',
    'city',
    'maps_link',
    'space_3d_file',
    'start_date',
    'start_time',
    'end_date',
    'end_time',
    'timezone',
    'description',
    'require_approval',
    'custom_questions',
    'capacity_type',
    'max_capacity',
    'seat_assignment',
    'seat_numbers',
    'status',
])]
class Event extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel events.
     */
    protected $primaryKey = 'id_event';

    /**
     * Skema hanya memiliki created_at, tanpa updated_at.
     */
    public $timestamps = false;

    /**
     * Cast otomatis untuk tipe data kolom.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date'       => 'date',
            'end_date'         => 'date',
            'created_at'       => 'datetime',
            'require_approval' => 'boolean',
            'custom_questions' => 'array',
            'seat_numbers'     => 'array',
        ];
    }

    /**
     * Admin (User) yang membuat event ini.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_user');
    }

    /**
     * Semua tier tiket yang dimiliki event ini.
     */
    public function ticketTiers(): HasMany
    {
        return $this->hasMany(TicketTier::class, 'id_event', 'id_event');
    }

    /**
     * Semua pertanyaan kustom yang dimiliki event ini.
     */
    public function customQuestions(): HasMany
    {
        return $this->hasMany(CustomQuestion::class, 'id_event', 'id_event');
    }

    /**
     * Semua peserta (attendee) yang terdaftar di event ini.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class, 'id_event', 'id_event');
    }
}
