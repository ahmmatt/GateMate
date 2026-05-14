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
        Schema::create('attendees', function (Blueprint $table) {
            $table->increments('id_attendee');

            $table->unsignedInteger('id_user');
            $table->foreign('id_user')
                  ->references('id_user')
                  ->on('users')
                  ->cascadeOnDelete();

            $table->unsignedInteger('id_event');
            $table->foreign('id_event')
                  ->references('id_event')
                  ->on('events')
                  ->cascadeOnDelete();

            $table->unsignedInteger('id_tier');
            $table->foreign('id_tier')
                  ->references('id_tier')
                  ->on('ticket_tiers')
                  ->cascadeOnDelete();

            $table->string('ticket_code', 50)->unique();
            $table->string('qr_token', 255)->unique();

            $table->enum('status', ['need_approval', 'awaiting_payment', 'approved', 'checked_in'])
                  ->default('awaiting_payment');

            // Kolom AI GateMate Matchmaking
            $table->text('vibe_bio')->nullable();
            $table->boolean('looking_for_match')->default(false);

            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendees');
    }
};
