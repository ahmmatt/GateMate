<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;

class AiMatchController extends Controller
{
    /**
     * Jalankan AI Matchmaking menggunakan Google Gemini API.
     */
    public function findMatch(int $id): View|RedirectResponse
    {
        // ── 1. Ambil tiket milik user yang sedang login ───────────────────────
        $myTicket = Attendee::with('event')
            ->where('id_attendee', $id)
            ->where('id_user', Auth::id())
            ->firstOrFail();

        // Validasi: user harus sudah mengisi vibe_bio
        if (empty($myTicket->vibe_bio)) {
            return back()->with('error', 'Isi dulu Vibe Bio kamu sebelum mencari kecocokan!');
        }

        // ── 2. Ambil peserta LAIN di event yang sama ──────────────────────────
        $otherAttendees = Attendee::with('user')
            ->where('id_event', $myTicket->id_event)
            ->where('id_attendee', '!=', $myTicket->id_attendee)
            ->where('looking_for_match', true)
            ->whereNotNull('vibe_bio')
            ->get();

        if ($otherAttendees->isEmpty()) {
            return back()->with('error', 'Belum ada peserta lain yang mengaktifkan AI Match di event ini.');
        }

        // ── 3. Susun daftar peserta lain untuk prompt ─────────────────────────
        $participantList = $otherAttendees->map(function ($attendee): string {
            $name = $attendee->user?->full_name ?? 'Peserta Anonim';

            return "- {$name}: {$attendee->vibe_bio}";
        })->implode("\n");

        // ── 4. Bangun Prompt Gemini ───────────────────────────────────────────
        $prompt = <<<PROMPT
Saya adalah peserta event "{$myTicket->event->title}". Bio saya: {$myTicket->vibe_bio}

Berikut daftar peserta lain yang juga ingin berkenalan:
{$participantList}

Tugasmu: Analisis kecocokan bio saya dengan mereka. Pilih maksimal 3 orang yang paling cocok untuk saya ajak networking atau ngobrol. Jelaskan alasan kecocokannya dalam bahasa Indonesia yang santai, hangat, dan asik. Gunakan format yang rapi dengan nama sebagai judul tiap bagian.
PROMPT;

        // ── 5. Panggil Gemini API via HTTP Facade ─────────────────────────────
        // KODE BARU: Pakai trim() untuk membuang spasi/enter tersembunyi dari .env
        $apiKey = trim(env('GEMINI_API_KEY')); 
        
        if (empty($apiKey)) {
            return back()->with('error', 'API Key kosong! Matikan server, jalankan "php artisan config:clear", lalu jalankan server lagi.');
        }

        // KODE BARU: Pakai /v1/ (bukan v1beta) dan model gemini-1.5-flash
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey;

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
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

        // ── 6. Parsing respons Gemini ─────────────────────────────────────────
        if ($response->failed()) {
            return back()->with('error', 'Error dari Google (' . $response->status() . '): ' . $response->body());
        }

        $aiResponse = $response->json('candidates.0.content.parts.0.text')
            ?? 'AI tidak memberikan respons. Silakan coba lagi.';

        return view('ai_match_result', compact('myTicket', 'aiResponse', 'otherAttendees'));
    }
}
