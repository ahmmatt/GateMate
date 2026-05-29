<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tambahkan kolom verifikasi penyelenggara (organizer) ke tabel users.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tiktok_handle', 255)->nullable()->after('instagram');
            $table->string('organization_name', 255)->nullable()->after('tiktok_handle');
            $table->boolean('is_verified_organizer')->default(false)->after('organization_name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tiktok_handle', 'organization_name', 'is_verified_organizer']);
        });
    }
};
