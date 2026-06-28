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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id_user');
            $table->string('full_name', 255);
            $table->string('gender', 20)->nullable();
            $table->string('profile_picture', 255)->nullable();
            $table->string('email', 255)->unique();
            $table->string('username', 50)->nullable()->unique();
            $table->string('password', 255);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->enum('role', ['user', 'admin', 'superadmin', 'pending_admin'])
                  ->default('user');
            $table->string('instagram', 255)->nullable();
            $table->string('tiktok', 255)->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
