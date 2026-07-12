<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;
    /**
     * Kolom yang boleh diisi secara massal.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'event_id',
        'ticket_tier_id',
        'seat_number',
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

    // ── Local Scopes ─────────────────────────────────────────────────────────

    /**
     * Scope: hanya transaksi sukses (payment_status = 'success').
     */
    public function scopeSuccessful(Builder $query): Builder
    {
        return $query->where('payment_status', 'success');
    }

    /**
     * Scope: hanya transaksi pending.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('payment_status', 'pending');
    }

    /**
     * Scope: transaksi untuk event tertentu.
     */
    public function scopeForEvent(Builder $query, int $eventId): Builder
    {
        return $query->where('event_id', $eventId);
    }

    /**
     * Scope: tiket yang sudah digunakan (sudah di-scan).
     */
    public function scopeUsed(Builder $query): Builder
    {
        return $query->where('is_used', true);
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    /**
     * Accessor: nominal transaksi dalam format Rupiah.
     * Contoh: $transaction->formatted_amount → 'Rp 150.000'
     */
    protected function formattedAmount(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Rp ' . number_format((float) $this->gross_amount, 0, ',', '.')
        );
    }
}
