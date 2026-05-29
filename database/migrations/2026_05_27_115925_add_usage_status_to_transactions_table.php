<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan kolom status penggunaan tiket pada tabel transactions.
     *
     *  is_used   – boolean default false; true setelah tiket di-scan panitia.
     *  scanned_at – timestamp kapan tiket pertama kali di-scan.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->boolean('is_used')->default(false)->after('snap_token');
            $table->timestamp('scanned_at')->nullable()->after('is_used');
        });
    }

    /**
     * Rollback – hapus kedua kolom.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['is_used', 'scanned_at']);
        });
    }
};
