<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * API AiMatchController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menjalankan AI Matchmaking menggunakan Google Gemini API.
 * Logika identik dengan versi Blade — hanya response format yang berubah ke JSON.
 *
 * Endpoints:
 *   GET /api/tickets/{attendee_id}/ai-match → Cari kecocokan AI untuk peserta
 */
class AiMatchController extends Controller
{
    /**
     * Jalankan AI Matchmaking — panggil Gemini API dan kembalikan hasil JSON.
     *
     * @param int $id  ID dari Attendee (bukan Transaction!)
     */
    public function findMatch(int $id): JsonResponse
    {
        // ── 1. Ambil tiket (attendee) milik user yang sedang login ─────────────
        $myTicket = Attendee::with('event')
            ->where('id_attendee', $id)
            ->where('id_user', Auth::id())
            ->firstOrFail();

        // Validasi: user harus sudah mengisi vibe_bio
        if (empty($myTicket->vibe_bio)) {
            return response()->json([
                'success' => false,
                'message' => 'Isi dulu Vibe Bio kamu di profil tiket sebelum mencari kecocokan!',
            ], 422);
        }

        // ── 2. Ambil peserta LAIN di event yang sama ───────────────────────────
        $otherAttendees = Attendee::with('user')
            ->where('id_event', $myTicket->id_event)
            ->where('id_attendee', '!=', $myTicket->id_attendee)
            ->where('looking_for_match', true)
            ->whereNotNull('vibe_bio')
            ->get();

        if ($otherAttendees->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada peserta lain yang mengaktifkan AI Match di event ini. Coba lagi nanti!',
            ], 404);
        }

        // ── 3. Susun daftar peserta lain untuk prompt ──────────────────────────
        $participantList = $otherAttendees->map(function ($attendee): string {
            $name = $attendee->user?->full_name ?? 'Peserta Anonim';
            return "- {$name}: {$attendee->vibe_bio}";
        })->implode("\n");

        // ── 4. Bangun Prompt Gemini ────────────────────────────────────────────
        $prompt = <<<PROMPT
Saya adalah peserta event "{$myTicket->event->title}". Bio saya: {$myTicket->vibe_bio}

Berikut daftar peserta lain yang juga ingin berkenalan:
{$participantList}

Tugasmu: Analisis kecocokan bio saya dengan mereka. Pilih maksimal 3 orang yang paling cocok untuk saya ajak networking atau ngobrol. Jelaskan alasan kecocokannya dalam bahasa Indonesia yang santai, hangat, dan asik. Gunakan format yang rapi dengan nama sebagai judul tiap bagian.
PROMPT;

        // ── 5. Panggil Gemini API ──────────────────────────────────────────────
        $apiKey = trim(env('GEMINI_API_KEY'));

        if (empty($apiKey)) {
            Log::error('AiMatchController: GEMINI_API_KEY kosong!');
            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi AI belum selesai. Hubungi administrator.',
            ], 500);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey;

        $geminiResponse = Http::withHeaders(['Content-Type' => 'application/json'])
            ->timeout(30)
            ->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature'     => 0.8,
                    'maxOutputTokens' => 1024,
                ],
            ]);

        // ── 6. Parsing respons Gemini ──────────────────────────────────────────
        if ($geminiResponse->failed()) {
            Log::error('Gemini API Error', [
                'status' => $geminiResponse->status(),
                'body'   => $geminiResponse->body(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi Gemini AI. Coba lagi nanti.',
                'detail'  => 'HTTP ' . $geminiResponse->status(),
            ], 502);
        }

        $aiResponse = $geminiResponse->json('candidates.0.content.parts.0.text')
            ?? 'AI tidak memberikan respons. Silakan coba lagi.';

        // Daftar peserta yang di-match (untuk frontend tampilkan detail)
        $matchedProfiles = $otherAttendees->map(function ($attendee) {
            return [
                'id'                  => $attendee->id_attendee,
                'user_name'           => $attendee->user?->full_name ?? 'Peserta Anonim',
                'vibe_bio'            => $attendee->vibe_bio,
                'ig_handle'           => $attendee->ig_handle,
                'profile_picture_url' => $attendee->user?->profile_picture
                    ? asset('Media/uploads/' . $attendee->user->profile_picture)
                    : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => [
                'ai_response'      => $aiResponse,
                'event_title'      => $myTicket->event->title,
                'my_vibe_bio'      => $myTicket->vibe_bio,
                'candidates_count' => $otherAttendees->count(),
                'candidate_profiles' => $matchedProfiles,
            ],
        ]);
    }
}
