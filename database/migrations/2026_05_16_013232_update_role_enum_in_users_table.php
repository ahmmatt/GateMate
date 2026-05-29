<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Tambahkan nilai 'super admin' ke ENUM role pada tabel users.
 * Nilai lama yang dipertahankan: 'user', 'admin', 'superadmin', 'pending_admin'.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Gunakan raw ALTER TABLE agar ENUM tidak di-drop-recreate secara destruktif
        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role
            ENUM('user', 'admin', 'superadmin', 'super admin', 'pending_admin')
            NOT NULL DEFAULT 'user'
        ");
    }

    public function down(): void
    {
        // Hapus nilai 'super admin' — pastikan tidak ada baris yang masih memakai nilai ini
        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role
            ENUM('user', 'admin', 'superadmin', 'pending_admin')
            NOT NULL DEFAULT 'user'
        ");
    }
};
