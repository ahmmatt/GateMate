<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Attendee;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * API TicketController
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola tiket milik user yang sedang login.
 *
 * Endpoints:
 *   GET  /api/my-tickets              → Daftar semua tiket user
 *   GET  /api/tickets/{id}            → Detail e-ticket + QR data + peserta event
 *   POST /api/tickets/{id}/vibe       → Update profil AI Matchmaking
 */
class TicketController extends Controller
{
    /**
     * Daftar semua tiket milik user yang sedang login.
     * Dikategorikan menjadi: upcoming, past.
     */
    public function index(): JsonResponse
    {
        $tickets = Transaction::with(['event', 'ticketTier'])
            ->where('user_id', auth()->id())
            ->where('payment_status', 'success')
            ->orderByDesc('created_at')
            ->get();

        $now = now();

        $upcoming = $tickets->filter(function ($t) use ($now) {
            return $t->event && $now->lt(\Carbon\Carbon::parse($t->event->end_date . ' ' . $t->event->end_time));
        })->values();

        $past = $tickets->filter(function ($t) use ($now) {
            return !$t->event || $now->gte(\Carbon\Carbon::parse($t->event->end_date . ' ' . $t->event->end_time));
        })->values();

        return response()->json([
            'success' => true,
            'data'    => [
                'upcoming' => TicketResource::collection($upcoming),
                'past'     => TicketResource::collection($past),
                'total'    => $tickets->count(),
            ],
        ]);
    }

    /**
     * Detail e-ticket + QR Code data + daftar peserta event (untuk networking).
     */
    public function show(int $id): JsonResponse
    {
        $transaction = Transaction::with(['event.ticketTiers', 'ticketTier', 'user'])
            ->findOrFail($id);

        // Pastikan tiket ini milik user yang sedang login
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke tiket ini.',
            ], 403);
        }

        // Attendee record milik user ini (untuk AI Match)
        $myAttendee = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', auth()->id())
            ->first();

        // Peserta lain di event yang sama
        $otherAttendees = Attendee::with('user')
            ->where('id_event', $transaction->event_id)
            ->where('id_user', '!=', auth()->id())
            ->get()
            ->map(function ($attendee) {
                return [
                    'id'                => $attendee->id_attendee,
                    'user_name'         => $attendee->user?->full_name ?? 'Peserta Anonim',
                    'vibe_bio'          => $attendee->vibe_bio,
                    'ig_handle'         => $attendee->ig_handle,
                    'looking_for_match' => (bool) $attendee->looking_for_match,
                    'profile_picture_url' => $attendee->user?->profile_picture
                        ? asset('Media/uploads/' . $attendee->user->profile_picture)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => [
                'ticket'           => new TicketResource($transaction),
                'my_attendee'      => $myAttendee ? [
                    'id'                => $myAttendee->id_attendee,
                    'vibe_bio'          => $myAttendee->vibe_bio,
                    'ig_handle'         => $myAttendee->ig_handle,
                    'looking_for_match' => (bool) $myAttendee->looking_for_match,
                ] : null,
                'other_attendees'  => $otherAttendees,
            ],
        ]);
    }

    /**
     * Update profil AI Matchmaking untuk tiket tertentu.
     */
    public function updateVibe(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'vibe_bio'          => ['nullable', 'string', 'max:500'],
            'ig_handle'         => ['nullable', 'string', 'max:50'],
            'looking_for_match' => ['nullable', 'boolean'],
        ]);

        $transaction = Transaction::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $attendee = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', Auth::id())
            ->first();

        if (!$attendee) {
            return response()->json([
                'success' => false,
                'message' => 'Data peserta belum diterbitkan. Pastikan transaksi tiket sudah sukses.',
            ], 404);
        }

        $attendee->vibe_bio          = $validated['vibe_bio'] ?? null;
        $attendee->ig_handle         = $validated['ig_handle'] ?? null;
        $attendee->looking_for_match = $validated['looking_for_match'] ?? false;
        $attendee->save();

        return response()->json([
            'success' => true,
            'message' => 'AI Matchmaking Profile berhasil diperbarui!',
            'data'    => [
                'vibe_bio'          => $attendee->vibe_bio,
                'ig_handle'         => $attendee->ig_handle,
                'looking_for_match' => (bool) $attendee->looking_for_match,
            ],
        ]);
    }
}
