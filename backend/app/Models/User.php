<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'full_name',
    'gender',
    'profile_picture',
    'face_verified_at',
    'email',
    'username',
    'password',
    'role',
    'id_event',
    'instagram',
    'tiktok',
    'tiktok_handle',
    'organization_name',
    'is_verified_organizer',
    'wallet_balance',
    'phone',
    'ktp_document',
    'organization_type',
    'organization_description',
    'organization_website',
    'organization_instagram',
    'bank_name',
    'bank_account_number',
    'bank_account_name',
    'notification_prefs',
    'organization_address',
    'organization_tiktok',
    'organization_twitter',
    'phone_otp',
    'phone_otp_expires_at',
    'phone_verified_at',
])]
#[Hidden([
    'password',
])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Primary key kolom tabel users.
     */
    protected $primaryKey = 'id_user';

    /**
     * Tidak menggunakan updated_at (skema hanya punya created_at).
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
            'created_at'            => 'datetime',
            'face_verified_at'      => 'datetime',
            'phone_otp_expires_at'  => 'datetime',
            'phone_verified_at'     => 'datetime',
            'password'              => 'hashed',
            'is_verified_organizer' => 'boolean',
            'notification_prefs'    => 'array',
        ];
    }

    /**
     * Semua data kehadiran (attendee) milik user ini.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class, 'id_user', 'id_user');
    }

    /**
     * Histori transaksi wallet user.
     */
    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class, 'user_id', 'id_user');
    }

    /**
     * Menu kasir tenant milik user ini.
     */
    public function tenantMenus(): HasMany
    {
        return $this->hasMany(TenantMenu::class, 'user_id', 'id_user');
    }

    /**
     * Event di mana user (tenant) ditugaskan.
     */
    public function event(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Event::class, 'id_event', 'id_event');
    }

    // ── Local Scopes ─────────────────────────────────────────────────────────

    /**
     * Scope: hanya pengguna dengan role 'admin' (organizer).
     */
    public function scopeOrganizers(Builder $query): Builder
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope: organizer yang sudah diverifikasi superadmin.
     */
    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('is_verified_organizer', true);
    }

    /**
     * Scope: hanya pengguna dengan role 'tenant'.
     */
    public function scopeTenants(Builder $query): Builder
    {
        return $query->where('role', 'tenant');
    }

    /**
     * Scope: user yang sudah memverifikasi nomor WhatsApp.
     */
    public function scopePhoneVerified(Builder $query): Builder
    {
        return $query->whereNotNull('phone_verified_at');
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    /**
     * Accessor: URL lengkap foto profil user.
     * Contoh: $user->full_avatar_url → 'http://..../Media/uploads/abc.jpg'
     */
    protected function fullAvatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->profile_picture
                ? asset('Media/uploads/' . $this->profile_picture)
                : null
        );
    }

    /**
     * Accessor: apakah KYC (face scan) user masih valid (tidak lebih dari 5 bulan).
     */
    protected function isKycValid(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->face_verified_at
                && \Carbon\Carbon::parse($this->face_verified_at)->gte(now()->subMonths(5))
        );
    }
}
