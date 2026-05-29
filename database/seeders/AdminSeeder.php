<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed akun Super Admin dan Admin Event untuk aplikasi SecureGate.
     */
    public function run(): void
    {
        // ── 1. Super Admin ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'superadmin@securegate.com'],
            [
                'full_name' => 'Super Admin SecureGate',
                'password'  => Hash::make('password123'),
                'role'      => 'superadmin',
            ]
        );

        // ── 2. Admin Event ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@securegate.com'],
            [
                'full_name' => 'Admin Event',
                'password'  => Hash::make('password123'),
                'role'      => 'admin',
            ]
        );
    }
}
