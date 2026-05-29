<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class PublicEventController extends Controller
{
    public function index()
    {
        // Ambil semua event aktif
        $events = Event::where('status', 'active')->orderBy('start_date', 'asc')->get();
        return view('welcome', compact('events'));
    }

    public function show(Event $event)
    {
        // Eager load ticket tiers
        $event->load('ticketTiers');
        return view('events.show', compact('event'));
    }
}
