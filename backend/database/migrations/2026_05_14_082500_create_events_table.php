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
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id_event');

            $table->unsignedInteger('id_admin')->nullable();
            $table->foreign('id_admin')
                  ->references('id_user')
                  ->on('users')
                  ->nullOnDelete();

            $table->string('title', 255);
            $table->string('banner_image', 255);
            $table->string('category', 100);

            $table->enum('location_type', ['offline', 'online'])->default('offline');
            $table->text('location_details');
            $table->string('venue_name', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->text('maps_link')->nullable();
            $table->string('space_3d_file', 255)->nullable();

            $table->date('start_date');
            $table->time('start_time');
            $table->date('end_date');
            $table->time('end_time');
            $table->string('timezone', 50)->default('GMT+08:00');

            $table->text('description')->nullable();
            $table->boolean('require_approval')->default(false);

            $table->enum('capacity_type', ['unlimited', 'limited'])->default('unlimited');
            $table->integer('max_capacity')->nullable();

            $table->enum('seat_assignment', ['bebas', 'pilih'])->default('bebas');
            $table->enum('status', ['active', 'ended'])->default('active');

            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
