<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Attendee;
use App\Models\User;

class MatchmakingController extends Controller
{
    // Simpan Vibe Bio pengguna dan set looking_for_match = true
    public function setVibeBio(Request $request, $id)
    {
        $request->validate([
            'vibe_bio' => 'required|string|max:500'
        ]);

        $user = Auth::user();
        
        // Cari tiket (transaction) milik user ini
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id_user)
            ->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan'], 404);
        }

        // Cari atau buat record attendee berdasarkan event dan user
        $attendee = Attendee::firstOrCreate(
            [
                'id_event' => $transaction->event_id,
                'id_user'  => $user->id_user,
            ],
            [
                'id_tier'     => $transaction->ticket_tier_id,
                'ticket_code' => $transaction->order_id,
                'qr_token'    => \Illuminate\Support\Str::random(40),
                'status'      => 'approved',
            ]
        );

        $attendee->update([
            'vibe_bio' => $request->vibe_bio,
            'looking_for_match' => true
        ]);
        
        return response()->json(['success' => true, 'message' => 'Vibe Bio berhasil disimpan!']);
    }

    // Mendapatkan rekomendasi match berdasarkan partisipan lain di event yang sama
    public function getMatches($id)
    {
        $user = Auth::user();

        // Cari event dari tiket user
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id_user)
            ->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan'], 404);
        }

        $eventId = $transaction->event_id;

        // Ambil partisipan lain di event yang sama yang looking_for_match = true
        $matches = Attendee::where('id_event', $eventId)
            ->where('id_user', '!=', $user->id_user)
            ->where('looking_for_match', true)
            ->with('user')
            ->get();

        // Format datanya agar mirip dengan UI
        $formattedMatches = $matches->map(function ($attendee) {
            return [
                'id_user' => $attendee->user->id_user,
                'name' => $attendee->user->full_name,
                'avatar' => $attendee->user->profile_picture_url,
                'vibe_bio' => $attendee->vibe_bio,
                'score' => rand(80, 99) // Simulasi AI Match Score
            ];
        });

        // Urutkan berdasarkan score (simulasi match terbaik di awal)
        $formattedMatches = $formattedMatches->sortByDesc('score')->values();

        return response()->json(['success' => true, 'data' => $formattedMatches]);
    }
}
