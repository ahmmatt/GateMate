<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\View\View;

class EventController extends Controller
{
    /**
     * Menampilkan halaman detail sebuah event.
     * Otomatis mengembalikan 404 jika event tidak ditemukan.
     */
    public function show(int $id): View
    {
        $event = Event::with(['ticketTiers', 'admin', 'customQuestions'])
            ->findOrFail($id);

        return view('event_detail', compact('event'));
    }
}
