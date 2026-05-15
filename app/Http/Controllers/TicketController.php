<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class TicketController extends Controller
{
    /**
     * Menampilkan semua tiket milik user yang sedang login,
     * dipisahkan menjadi upcoming dan past berdasarkan waktu selesai event.
     */
    public function index(): View
    {
        $now = now();

        $allTickets = Attendee::with(['event.admin', 'ticketTier'])
            ->where('id_user', Auth::id())
            ->latest('created_at')
            ->get();

        // ── Pisahkan upcoming vs past berdasarkan end_date + end_time event ──
        $upcomingTickets = $allTickets->filter(function ($ticket) use ($now): bool {
            if (! $ticket->event) {
                return false;
            }

            if ($ticket->event->status === 'ended') {
                return false;
            }

            $eventEnd = \Carbon\Carbon::parse(
                $ticket->event->end_date->format('Y-m-d') . ' ' . $ticket->event->end_time
            );

            return $now->lessThanOrEqualTo($eventEnd);
        })->values();

        $pastTickets = $allTickets->filter(function ($ticket) use ($now): bool {
            if (! $ticket->event) {
                return true;
            }

            if ($ticket->event->status === 'ended') {
                return true;
            }

            $eventEnd = \Carbon\Carbon::parse(
                $ticket->event->end_date->format('Y-m-d') . ' ' . $ticket->event->end_time
            );

            return $now->greaterThan($eventEnd);
        })->values();

        return view('my_tickets', compact('upcomingTickets', 'pastTickets'));
    }

    /**
     * Update profil AI Matchmaking pada tiket tertentu milik user yang login.
     */
    public function updateVibe(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'vibe_bio'          => ['nullable', 'string', 'max:500'],
            'ig_handle'         => ['nullable', 'string', 'max:50'],
            'looking_for_match' => ['nullable', 'boolean'],
        ]);

        // Pastikan tiket ini benar-benar milik user yang sedang login
        $ticket = Attendee::where('id_attendee', $id)
            ->where('id_user', Auth::id())
            ->firstOrFail();

        $ticket->update([
            'vibe_bio'          => $validated['vibe_bio'] ?? null,
            'ig_handle'         => $validated['ig_handle'] ?? null,
            'looking_for_match' => $validated['looking_for_match'] ?? false,
        ]);

        return back()->with('vibe_success_' . $id, 'AI Matchmaking Profile Updated!');
    }
}
