<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id_event',
    'question_text',
])]
class CustomQuestion extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel custom_questions.
     */
    protected $primaryKey = 'id_question';

    /**
     * Tabel tidak memiliki kolom timestamps.
     */
    public $timestamps = false;

    /**
     * Event yang memiliki pertanyaan kustom ini.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'id_event', 'id_event');
    }
}
