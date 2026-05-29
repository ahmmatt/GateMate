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
        Schema::table('events', function (Blueprint $table) {
            $table->string('poster_path', 255)->nullable()->after('banner_image');
            $table->json('custom_questions')->nullable()->after('require_approval');
        });

        Schema::table('ticket_tiers', function (Blueprint $table) {
            $table->boolean('is_unlimited')->default(false)->after('remaining_seats');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['poster_path', 'custom_questions']);
        });

        Schema::table('ticket_tiers', function (Blueprint $table) {
            $table->dropColumn('is_unlimited');
        });
    }
};
