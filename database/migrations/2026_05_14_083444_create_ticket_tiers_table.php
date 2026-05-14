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
        Schema::create('ticket_tiers', function (Blueprint $table) {
            $table->increments('id_tier');

            $table->unsignedInteger('id_event');
            $table->foreign('id_event')
                  ->references('id_event')
                  ->on('events')
                  ->cascadeOnDelete();

            $table->string('tier_name', 100);
            $table->decimal('price', 12, 2)->default(0.00);
            $table->integer('capacity');
            $table->integer('remaining_seats');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_tiers');
    }
};
