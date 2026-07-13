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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('admin_id');
            $table->string('action'); // e.g., 'Verifikasi Organizer', 'Eksekusi Penarikan'
            $table->string('target_type')->nullable(); // e.g., 'Organizer', 'Withdrawal'
            $table->string('target_name')->nullable(); // Display name of the target
            $table->json('details')->nullable(); // Any additional info
            $table->timestamps();

            $table->foreign('admin_id')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
