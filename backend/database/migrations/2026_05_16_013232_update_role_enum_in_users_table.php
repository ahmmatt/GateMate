<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Tambahkan nilai 'super admin' ke ENUM role pada tabel users.
 * Nilai lama yang dipertahankan: 'user', 'admin', 'superadmin', 'pending_admin'.
 *
 * Note: MODIFY COLUMN hanya didukung MySQL/MariaDB.
 * SQLite (digunakan untuk testing) tidak mendukung ENUM, sehingga migration ini di-skip.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Skip pada SQLite (tidak mendukung ENUM / MODIFY COLUMN)
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role
            ENUM('user', 'admin', 'superadmin', 'super admin', 'pending_admin')
            NOT NULL DEFAULT 'user'
        ");
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role
            ENUM('user', 'admin', 'superadmin', 'pending_admin')
            NOT NULL DEFAULT 'user'
        ");
    }
};

