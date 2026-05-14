<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id_user',
    'id_event',
    'id_tier',
    'ticket_code',
    'qr_token',
    'status',
    'vibe_bio',
    'looking_for_match',
])]
class Attendee extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel attendees.
     */
    protected $primaryKey = 'id_attendee';

    /**
     * Aktifkan timestamps karena tabel memiliki created_at dan updated_at.
     */
    public $timestamps = true;

    /**
     * Cast otomatis untuk tipe data kolom.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'looking_for_match' => 'boolean',
            'created_at'        => 'datetime',
            'updated_at'        => 'datetime',
        ];
    }

    /**
     * User (peserta) yang mendaftar.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    /**
     * Event yang dihadiri.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'id_event', 'id_event');
    }

    /**
     * Tier tiket yang dipilih.
     */
    public function ticketTier(): BelongsTo
    {
        return $this->belongsTo(TicketTier::class, 'id_tier', 'id_tier');
    }
}
