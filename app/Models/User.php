<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
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
            'password'              => 'hashed',
            'is_verified_organizer' => 'boolean',
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
}
