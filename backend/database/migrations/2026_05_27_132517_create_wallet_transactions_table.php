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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id'); // Pemilik dompet
            $table->unsignedInteger('reference_id')->nullable(); // Penerima / Referensi relasi lain
            $table->string('order_id')->unique(); // ID dari/ke Midtrans atau internal
            $table->enum('type', ['topup', 'payment', 'withdrawal']);
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->timestamps();

            // Setup foreign keys (assuming User primary key is id_user based on the model)
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('reference_id')->references('id_user')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
