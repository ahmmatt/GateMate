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

        if ($event->status !== 'active' || \Carbon\Carbon::parse($event->end_date)->isPast()) {
            // Jika tanggal end_date adalah hari ini, jangan block (masih bisa diakses hingga hari ini selesai).
            // isPast() pada end_date (tanpa time) mengecek apakah waktu sekarang > waktu 00:00 hari berikutnya
            if (\Carbon\Carbon::parse($event->end_date)->endOfDay()->isPast()) {
                abort(404, 'Event ini sudah berakhir atau sedang tidak aktif.');
            }
        }

        return view('events.show', compact('event'));
    }
}
