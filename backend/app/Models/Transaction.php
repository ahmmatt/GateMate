<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    /**
     * Kolom yang boleh diisi secara massal.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'event_id',
        'ticket_tier_id',
        'order_id',
        'gross_amount',
        'payment_status',
        'snap_token',
        'is_used',
        'scanned_at',
    ];

    /**
     * Cast otomatis untuk tipe data kolom.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'gross_amount' => 'decimal:2',
            'is_used'      => 'boolean',
            'scanned_at'   => 'datetime',
        ];
    }

    // ── Relasi ──────────────────────────────────────────────────────────────

    /**
     * User pemilik transaksi ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    /**
     * Event yang dibeli dalam transaksi ini.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id', 'id_event');
    }

    /**
     * Tier tiket yang dipilih dalam transaksi ini.
     */
    public function ticketTier(): BelongsTo
    {
        return $this->belongsTo(TicketTier::class, 'ticket_tier_id', 'id_tier');
    }
}
