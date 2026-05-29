<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cek apakah kolom sudah ada (kemungkinan sudah ada dari migrasi sebelumnya)
        if (!Schema::hasColumn('users', 'id_event')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedInteger('id_event')->nullable()->after('role');
                $table->foreign('id_event')
                      ->references('id_event')
                      ->on('events')
                      ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'id_event')) {
                $table->dropForeign(['id_event']);
                $table->dropColumn('id_event');
            }
        });
    }
};
