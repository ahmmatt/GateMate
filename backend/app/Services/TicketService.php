<?php

namespace App\Services;

use App\Models\Attendee;
use App\Models\Transaction;
use Carbon\Carbon;
use Exception;

/**
 * TicketService
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani seluruh business logic untuk manajemen tiket pengguna,
 * pembagian kategori upcoming/past, detail tiket dan daftar networking,
 * serta pembaruan profil AI Matchmaking.
 */
class TicketService
{
    /**
     * Mengambil daftar tiket milik user (upcoming & past).
     */
    public function getUserTickets(int $userId): array
    {
        $tickets = Transaction::with(['event', 'ticketTier'])
            ->where('user_id', $userId)
            ->where('payment_status', 'success')
            ->orderByDesc('created_at')
            ->get();

        $now = now();

        $upcoming = $tickets->filter(function ($t) use ($now) {
            if (!$t->event) return false;
            $dateStr = $t->event->end_date instanceof Carbon ? $t->event->end_date->format('Y-m-d') : $t->event->end_date;
            return $now->lt(Carbon::parse($dateStr . ' ' . $t->event->end_time));
        })->values();

        $past = $tickets->filter(function ($t) use ($now) {
            if (!$t->event) return true;
            $dateStr = $t->event->end_date instanceof Carbon ? $t->event->end_date->format('Y-m-d') : $t->event->end_date;
            return $now->gte(Carbon::parse($dateStr . ' ' . $t->event->end_time));
        })->values();

        return [
            'upcoming' => $upcoming,
            'past'     => $past,
            'total'    => $tickets->count(),
        ];
    }

    /**
     * Mengambil detail e-ticket, info attendee user, dan daftar peserta lain untuk networking.
     */
    public function getTicketDetail(int $userId, int $transactionId): array
    {
        $transaction = Transaction::with(['event.ticketTiers', 'ticketTier', 'user'])
            ->findOrFail($transactionId);

        if ($transaction->user_id !== $userId) {
            throw new Exception('Anda tidak memiliki akses ke tiket ini.');
        }

        $myAttendee = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', $userId)
            ->first();

        $otherAttendees = Attendee::with('user')
            ->where('id_event', $transaction->event_id)
            ->where('id_user', '!=', $userId)
            ->get()
            ->map(function ($attendee) {
                return [
                    'id'                  => $attendee->id_attendee,
                    'user_name'           => $attendee->user?->full_name ?? 'Peserta Anonim',
                    'vibe_bio'            => $attendee->vibe_bio,
                    'ig_handle'           => $attendee->ig_handle,
                    'looking_for_match'   => (bool) $attendee->looking_for_match,
                    'profile_picture_url' => $attendee->user?->profile_picture
                        ? asset('Media/uploads/' . $attendee->user->profile_picture)
                        : null,
                ];
            });

        return [
            'ticket'          => $transaction,
            'my_attendee'     => $myAttendee ? [
                'id'                => $myAttendee->id_attendee,
                'vibe_bio'          => $myAttendee->vibe_bio,
                'ig_handle'         => $myAttendee->ig_handle,
                'looking_for_match' => (bool) $myAttendee->looking_for_match,
            ] : null,
            'other_attendees' => $otherAttendees,
        ];
    }

    /**
     * Memperbarui profil AI Matchmaking (Vibe Bio, IG handle, status looking for match).
     */
    public function updateTicketVibe(int $userId, int $transactionId, array $data): Attendee
    {
        $transaction = Transaction::where('id', $transactionId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $attendee = Attendee::where('id_event', $transaction->event_id)
            ->where('id_user', $userId)
            ->first();

        if (!$attendee) {
            throw new Exception('Data peserta belum diterbitkan. Pastikan transaksi tiket sudah sukses.');
        }

        $attendee->vibe_bio          = $data['vibe_bio'] ?? null;
        $attendee->ig_handle         = $data['ig_handle'] ?? null;
        $attendee->looking_for_match = $data['looking_for_match'] ?? false;
        $attendee->save();

        return $attendee;
    }
}
