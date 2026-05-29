<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan kolom face_verified_at ke tabel users.
     * Digunakan oleh sistem KYC Face Verification Blocker.
     * Null berarti user belum pernah melakukan verifikasi wajah.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('face_verified_at')->nullable()->default(null)->after('profile_picture');
        });
    }

    /**
     * Rollback – hapus kolom face_verified_at.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('face_verified_at');
        });
    }
};
