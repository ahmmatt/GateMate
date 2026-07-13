<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhitelistIp extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'ip_address',
        'is_active',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id_user');
    }
}
