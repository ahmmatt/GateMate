<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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

    // ── Local Scopes ─────────────────────────────────────────────────────────

    /**
     * Scope: hanya event dengan status 'active'.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: event aktif yang belum berakhir (end_date >= today).
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->active()->whereDate('end_date', '>=', now()->toDateString());
    }

    /**
     * Scope: filter event berdasarkan kota (partial match).
     */
    public function scopeByCity(Builder $query, string $city): Builder
    {
        return $query->where('city', 'like', '%' . $city . '%');
    }

    /**
     * Scope: filter event berdasarkan kategori.
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Accessor: URL lengkap banner image.
     */
    protected function bannerImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->banner_image
                ? asset('Media/uploads/' . $this->banner_image)
                : null
        );
    }

    /**
     * Accessor: URL lengkap poster image.
     */
    protected function posterImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->poster_path
                ? asset('Media/uploads/' . $this->poster_path)
                : null
        );
    }
}
