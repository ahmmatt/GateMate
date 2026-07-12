<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed akun Super Admin dan Admin Event untuk aplikasi GateMate.
     */
    public function run(): void
    {
        // ── 1. Super Admin ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'superadmin@gatemate.com'],
            [
                'full_name' => 'Super Admin GateMate',
                'password'  => Hash::make('password123'),
                'role'      => 'superadmin',
            ]
        );

        // ── 2. Admin Event ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@gatemate.com'],
            [
                'full_name' => 'Admin Event',
                'password'  => Hash::make('password123'),
                'role'      => 'admin',
            ]
        );
    }
}
