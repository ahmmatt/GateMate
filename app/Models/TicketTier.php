<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'id_event',
    'tier_name',
    'price',
    'capacity',
    'remaining_seats',
    'is_unlimited',
])]
class TicketTier extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel ticket_tiers.
     */
    protected $primaryKey = 'id_tier';

    /**
     * Tabel tidak memiliki kolom timestamps.
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
            'price'           => 'decimal:2',
            'capacity'        => 'integer',
            'remaining_seats' => 'integer',
            'is_unlimited'    => 'boolean',
        ];
    }

    /**
     * Event yang memiliki tier tiket ini.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'id_event', 'id_event');
    }

    /**
     * Semua peserta (attendee) yang menggunakan tier ini.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class, 'id_tier', 'id_tier');
    }
}
