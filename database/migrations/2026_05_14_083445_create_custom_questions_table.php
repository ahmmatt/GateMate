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
        Schema::create('custom_questions', function (Blueprint $table) {
            $table->increments('id_question');

            $table->unsignedInteger('id_event');
            $table->foreign('id_event')
                  ->references('id_event')
                  ->on('events')
                  ->cascadeOnDelete();

            $table->text('question_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_questions');
    }
};
