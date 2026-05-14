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
    'email',
    'username',
    'password',
    'role',
    'instagram',
    'tiktok',
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
            'created_at' => 'datetime',
            'password'   => 'hashed',
        ];
    }

    /**
     * Semua data kehadiran (attendee) milik user ini.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class, 'id_user', 'id_user');
    }
}
