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

        // 1. Validasi tiket dan event
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id_user)
            ->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan'], 404);
        }

        $eventId = $transaction->event_id;

        // Cari bio user saat ini
        $myAttendee = Attendee::where('id_event', $eventId)
            ->where('id_user', $user->id_user)
            ->first();

        $myBio = $myAttendee ? $myAttendee->vibe_bio : '';

        // 1. POOLING KANDIDAT: Ambil maksimal 50 kandidat lain
        $candidates = Attendee::where('id_event', $eventId)
            ->where('id_user', '!=', $user->id_user)
            ->where('looking_for_match', true)
            ->whereNotNull('vibe_bio')
            ->where('vibe_bio', '!=', '')
            ->with('user')
            ->inRandomOrder()
            ->limit(50)
            ->get();

        if ($candidates->isEmpty()) {
            return response()->json(['success' => true, 'data' => []]);
        }

        // 2. SYSTEM PROMPT & BATCHING
        $candidateData = $candidates->map(function($c) {
            return [
                'user_id' => $c->id_user,
                'vibe_bio' => $c->vibe_bio
            ];
        })->toJson();

        $prompt = <<<EOT
Anda adalah matchmaker psiko-linguistik profesional. Tugas Anda adalah menganalisis tingkat kecocokan (match_score) antara target user dan daftar kandidat berdasarkan "vibe_bio" mereka.

Target User Bio:
"{$myBio}"

Daftar Kandidat (JSON):
{$candidateData}

Instruksi:
1. Analisis kecocokan bio Target User dengan masing-masing kandidat.
2. Berikan "match_score" dari skala 1 sampai 100.
3. Berikan "reason" (alasan singkat 1 kalimat santai dalam bahasa Indonesia) mengapa mereka cocok atau kurang cocok.
4. KEMBALIKAN HANYA ARRAY JSON MURNI TANPA MARKDOWN ATAU TEKS TAMBAHAN. 
5. Format Wajib:
[
  {"user_id": 123, "match_score": 95, "reason": "Sama-sama suka teknologi dan kopi!"},
  {"user_id": 456, "match_score": 60, "reason": "Mungkin bisa ngobrol santai."}
]
EOT;

        // 3. Panggil Gemini API
        $apiKey = env('GEMINI_API_KEY');
        
        if (empty($apiKey)) {
            // Fallback jika API Key belum diset
            $formattedMatches = $candidates->map(function ($attendee) {
                return [
                    'id_user' => $attendee->user->id_user,
                    'name' => $attendee->user->full_name,
                    'avatar' => $attendee->user->profile_picture ? asset('Media/uploads/' . $attendee->user->profile_picture) : null,
                    'vibe_bio' => $attendee->vibe_bio,
                    'score' => rand(80, 99),
                    'reason' => 'Kalian punya vibe yang mirip!'
                ];
            })->sortByDesc('score')->values();
            return response()->json(['success' => true, 'data' => $formattedMatches]);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

        try {
            $geminiResponse = \Illuminate\Support\Facades\Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(30)
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 2048,
                    ]
                ]);

            if ($geminiResponse->failed()) {
                throw new \Exception('Gemini API Error: ' . $geminiResponse->body());
            }

            $geminiText = $geminiResponse->json('candidates.0.content.parts.0.text');
            
            // Bersihkan markdown (contoh: ```json ... ```)
            $geminiText = preg_replace('/```(?:json)?(.*?)```/s', '$1', $geminiText);
            $geminiText = trim($geminiText);

            $aiResults = json_decode($geminiText, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($aiResults)) {
                throw new \Exception('Invalid JSON dari Gemini');
            }

            // Map data gemini dengan model
            $aiDataMap = [];
            foreach ($aiResults as $item) {
                if (isset($item['user_id'])) {
                    $aiDataMap[$item['user_id']] = [
                        'score' => $item['match_score'] ?? rand(50, 90),
                        'reason' => $item['reason'] ?? 'Cocok buat networking!'
                    ];
                }
            }

            // 4. RESPONSE FORMAT
            $formattedMatches = $candidates->map(function ($attendee) use ($aiDataMap) {
                $aiMatch = $aiDataMap[$attendee->id_user] ?? null;
                return [
                    'id_user' => $attendee->user->id_user,
                    'name' => $attendee->user->full_name,
                    'avatar' => $attendee->user->profile_picture ? asset('Media/uploads/' . $attendee->user->profile_picture) : null,
                    'vibe_bio' => $attendee->vibe_bio,
                    'score' => $aiMatch ? $aiMatch['score'] : rand(50, 70),
                    'reason' => $aiMatch ? $aiMatch['reason'] : 'Belum dianalisis sepenuhnya.'
                ];
            });

            $formattedMatches = $formattedMatches->sortByDesc('score')->values();

            return response()->json(['success' => true, 'data' => $formattedMatches]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Matchmaking AI Error: ' . $e->getMessage());
            
            // Fallback response jika AI gagal
            $formattedMatches = $candidates->map(function ($attendee) {
                return [
                    'id_user' => $attendee->user->id_user,
                    'name' => $attendee->user->full_name,
                    'avatar' => $attendee->user->profile_picture ? asset('Media/uploads/' . $attendee->user->profile_picture) : null,
                    'vibe_bio' => $attendee->vibe_bio,
                    'score' => rand(70, 90),
                    'reason' => 'Sistem AI sedang sibuk, tapi kalian mungkin cocok!'
                ];
            })->sortByDesc('score')->values();

            return response()->json(['success' => true, 'data' => $formattedMatches]);
        }
    }
}
