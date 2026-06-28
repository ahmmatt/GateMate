<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration: buat tabel transactions untuk data pembelian tiket.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Foreign keys — pakai unsignedInteger agar kompatibel dengan
            // kolom parent yang menggunakan $table->increments() (UNSIGNED INT)
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('event_id');
            $table->unsignedInteger('ticket_tier_id');

            // Order info
            $table->string('order_id')->unique();
            $table->decimal('gross_amount', 12, 2);

            // Midtrans payment status
            $table->enum('payment_status', ['pending', 'success', 'failed', 'expired'])
                  ->default('pending');

            // Snap token dari Midtrans
            $table->string('snap_token')->nullable();

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')
                  ->references('id_user')
                  ->on('users')
                  ->cascadeOnDelete();

            $table->foreign('event_id')
                  ->references('id_event')
                  ->on('events')
                  ->cascadeOnDelete();

            $table->foreign('ticket_tier_id')
                  ->references('id_tier')
                  ->on('ticket_tiers')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Kembalikan migration: hapus tabel transactions.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
