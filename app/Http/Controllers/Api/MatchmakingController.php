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
Kamu adalah AI matchmaker yang membantu peserta event menemukan teman ngobrol yang paling cocok.

Profil saya (user yang sedang mencari match):
Bio: "{$myBio}"

Daftar kandidat yang bisa di-match (JSON):
{$candidateData}

Instruksi:
1. Analisis kecocokan bio saya dengan masing-masing kandidat.
2. Berikan "match_score" dari skala 1 sampai 100 berdasarkan tingkat kecocokan.
3. Berikan "reason" — ditulis dari sudut pandang SAYA (user yang mencari), bukan orang ketiga.
   - Gunakan kata "Dia" untuk merujuk kandidat, dan "kamu" untuk merujuk saya.
   - Contoh BAGUS: "Dia juga suka IT kayak kamu, dan humor soal meme-nya pasti nyambung banget!"
   - Contoh BAGUS: "Dia paham dunia coding dan bisa jadi partner diskusi teknologi yang asik buat kamu."
   - Contoh BURUK: "Keduanya suka IT dan paham jokes teknologi." ← jangan seperti ini!
   - Tulis 1 kalimat santai, hangat, dan natural dalam bahasa Indonesia. Jangan kaku.
4. KEMBALIKAN HANYA ARRAY JSON MURNI TANPA MARKDOWN ATAU TEKS TAMBAHAN.
5. Format Wajib:
[
  {"user_id": 123, "match_score": 95, "reason": "Dia juga anak IT yang paham jokes meme kayak kamu, dijamin seru ngobrolnya!"},
  {"user_id": 456, "match_score": 60, "reason": "Dia punya vibe yang kalem, bisa jadi teman ngobrol santai buat kamu."}
]
EOT;

        // 3. Panggil Groq API
        $apiKey = env('GROQ_API_KEY');
        $model = env('GROQ_MODEL', 'qwen-2.5-32b');
        
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

        $url = 'https://api.groq.com/openai/v1/chat/completions';

        try {
            $aiResponse = \Illuminate\Support\Facades\Http::withToken($apiKey)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->timeout(30)
                ->post($url, [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 2048,
                    'reasoning_effort' => 'none', // Matikan thinking mode (Qwen3)
                ]);

            if ($aiResponse->failed()) {
                throw new \Exception('Groq API Error: ' . $aiResponse->body());
            }

            $aiText = $aiResponse->json('choices.0.message.content');
            
            // Hapus blok <think>...</think> dari model reasoning (Qwen3, dll)
            $aiText = preg_replace('/<think>.*?<\/think>/s', '', $aiText);
            // Bersihkan markdown (contoh: ```json ... ```)
            $aiText = preg_replace('/```(?:json)?(.*?)```/s', '$1', $aiText);
            $aiText = trim($aiText);

            $aiResults = json_decode($aiText, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($aiResults)) {
                throw new \Exception('Invalid JSON dari Groq AI');
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
