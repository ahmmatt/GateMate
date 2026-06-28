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
        $tickets = \App\Models\Transaction::with(['event', 'ticketTier'])
            ->where('user_id', auth()->id())
            ->where('payment_status', 'success')
            ->get();

        return view('my_tickets', compact('tickets'));
    }

    /**
     * Menampilkan E-Ticket dan QR Code untuk transaksi yang valid.
     */
    public function showTicket($id)
    {
        $transaction = \App\Models\Transaction::with(['event', 'ticketTier', 'user'])->findOrFail($id);

        if ($transaction->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        // ── Networking Hub: Ambil data peserta untuk halaman E-Ticket ──────────

        // Tiket (Attendee record) milik user ini — untuk tombol AI Match
        $myAttendee = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', auth()->id())
            ->first();

        // Peserta lain di event yang sama (kecualikan diri sendiri)
        $otherAttendees = Attendee::with('user')
            ->where('id_event', $transaction->event_id)
            ->where('id_user', '!=', auth()->id())
            ->get();

        return view('tickets.e_ticket', compact('transaction', 'myAttendee', 'otherAttendees'));
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

        // Gunakan Transaction ID untuk mencari Event ID, lalu cari Attendee-nya
        $transaction = \App\Models\Transaction::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $ticket = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', Auth::id())
            ->first();

        // Jika belum ada attendee (misal karena tiket belum sepenuhnya lunas), buatkan dummy/draft atau kembalikan error
        if (!$ticket) {
            return back()->withErrors(['vibe_bio' => 'Data peserta belum diterbitkan. Pastikan transaksi tiket sudah sukses.']);
        }

        $ticket->vibe_bio          = $validated['vibe_bio'] ?? null;
        $ticket->ig_handle         = $validated['ig_handle'] ?? null;
        $ticket->looking_for_match = $validated['looking_for_match'] ?? false;
        $ticket->save();

        return back()->with('vibe_success_' . $id, 'AI Matchmaking Profile Updated!');
    }
}
