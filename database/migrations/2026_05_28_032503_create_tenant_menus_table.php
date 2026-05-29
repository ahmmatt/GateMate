<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_menus', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id'); // FK ke users.id_user (int unsigned)
            $table->string('item_name');
            $table->integer('price');
            $table->timestamps();

            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_menus');
    }
};
