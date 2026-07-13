<?php

namespace App\Services;

use App\Models\Attendee;
use App\Models\Transaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

/**
 * MatchmakingService
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani business logic AI Matchmaking untuk mempertemukan peserta event
 * berdasarkan Vibe Bio menggunakan Groq API / AI LLM.
 */
class MatchmakingService
{
    /**
     * Menyimpan Vibe Bio pengguna dan menandai siap dicocokkan.
     */
    public function setVibeBio(int $userId, int $transactionId, string $vibeBio): void
    {
        $transaction = Transaction::where('id', $transactionId)
            ->where('user_id', $userId)
            ->first();

        if (!$transaction) {
            throw new Exception('Tiket tidak ditemukan.');
        }

        $attendee = Attendee::firstOrCreate(
            [
                'id_event' => $transaction->event_id,
                'id_user'  => $userId,
            ],
            [
                'id_tier'     => $transaction->ticket_tier_id,
                'ticket_code' => $transaction->order_id,
                'qr_token'    => Str::random(40),
                'status'      => 'approved',
            ]
        );

        $attendee->update([
            'vibe_bio'          => $vibeBio,
            'looking_for_match' => true,
        ]);
    }

    /**
     * Mendapatkan rekomendasi match berformat ringkas untuk tiket tertentu.
     */
    public function getMatchesForTransaction(int $userId, string $transactionId): Collection
    {
        $transaction = Transaction::where(function ($query) use ($transactionId) {
                $query->where('id', $transactionId)
                      ->orWhere('order_id', $transactionId);
            })
            ->where('user_id', $userId)
            ->first();

        if (!$transaction) {
            throw new Exception('Tiket tidak ditemukan.');
        }

        $eventId = $transaction->event_id;

        $myAttendee = Attendee::where('id_event', $eventId)
            ->where('id_user', $userId)
            ->first();

        $myBio = $myAttendee ? $myAttendee->vibe_bio : '';

        $candidates = Attendee::where('id_event', $eventId)
            ->where('id_user', '!=', $userId)
            ->whereNotNull('vibe_bio')
            ->where('vibe_bio', '!=', '')
            ->with('user')
            ->inRandomOrder()
            ->limit(50)
            ->get();

        if ($candidates->isEmpty()) {
            return collect([]);
        }

        $candidateData = $candidates->map(fn ($c) => [
            'user_id'  => $c->id_user,
            'vibe_bio' => $c->vibe_bio,
        ])->toJson();

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

        $apiKey = env('GROQ_API_KEY');
        $model  = env('GROQ_MODEL', 'qwen-2.5-32b');

        if (empty($apiKey)) {
            return $candidates->map(fn ($attendee) => [
                'id_user'       => $attendee->user->id_user,
                'name'          => $attendee->user->full_name,
                'avatar'        => $attendee->user->profile_picture ? asset('Media/uploads/' . $attendee->user->profile_picture) : null,
                'vibe_bio'      => $attendee->vibe_bio,
                'ig_handle'     => $attendee->ig_handle,
                'tiktok_handle' => $attendee->tiktok_handle,
                'score'         => rand(80, 99),
                'reason'        => 'Kalian punya vibe yang mirip!',
            ])->sortByDesc('score')->values();
        }

        $url = 'https://api.groq.com/openai/v1/chat/completions';

        try {
            $aiResponse = Http::withToken($apiKey)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->timeout(30)
                ->post($url, [
                    'model'            => $model,
                    'messages'         => [['role' => 'user', 'content' => $prompt]],
                    'temperature'      => 0.7,
                    'max_tokens'       => 2048,
                    'reasoning_effort' => 'none',
                ]);

            if ($aiResponse->failed()) {
                throw new Exception('Groq API Error: ' . $aiResponse->body());
            }

            $aiText = $aiResponse->json('choices.0.message.content');
            $aiText = preg_replace('/<think>.*?<\/think>/s', '', $aiText);
            $aiText = preg_replace('/```(?:json)?(.*?)```/s', '$1', $aiText);
            $aiText = trim($aiText);

            $aiResults = json_decode($aiText, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($aiResults)) {
                throw new Exception('Invalid JSON dari Groq AI');
            }

            $aiDataMap = [];
            foreach ($aiResults as $item) {
                if (isset($item['user_id'])) {
                    $aiDataMap[$item['user_id']] = [
                        'score'  => $item['match_score'] ?? rand(50, 90),
                        'reason' => $item['reason'] ?? 'Cocok buat networking!',
                    ];
                }
            }

            return $candidates->map(function ($attendee) use ($aiDataMap) {
                $aiMatch = $aiDataMap[$attendee->id_user] ?? null;
                return [
                    'id_user'       => $attendee->user->id_user,
                    'name'          => $attendee->user->full_name,
                    'avatar'        => $attendee->user->profile_picture ? (str_starts_with($attendee->user->profile_picture, 'http') ? $attendee->user->profile_picture : asset('Media/uploads/' . $attendee->user->profile_picture)) : null,
                    'vibe_bio'      => $attendee->vibe_bio,
                    'ig_handle'     => $attendee->ig_handle,
                    'tiktok_handle' => $attendee->tiktok_handle,
                    'score'         => $aiMatch ? $aiMatch['score'] : rand(50, 70),
                    'reason'        => $aiMatch ? $aiMatch['reason'] : 'Belum dianalisis sepenuhnya.',
                ];
            })->sortByDesc('score')->values();

        } catch (Exception $e) {
            Log::error('Matchmaking AI Error: ' . $e->getMessage());

            return $candidates->map(fn ($attendee) => [
                'id_user'       => $attendee->user->id_user,
                'name'          => $attendee->user->full_name,
                'avatar'        => $attendee->user->profile_picture ? (str_starts_with($attendee->user->profile_picture, 'http') ? $attendee->user->profile_picture : asset('Media/uploads/' . $attendee->user->profile_picture)) : null,
                'vibe_bio'      => $attendee->vibe_bio,
                'ig_handle'     => $attendee->ig_handle,
                'tiktok_handle' => $attendee->tiktok_handle,
                'score'         => rand(70, 90),
                'reason'   => 'Sistem AI sedang sibuk, tapi kalian mungkin cocok!',
            ])->sortByDesc('score')->values();
        }
    }

    /**
     * Menjalankan AI Matchmaking berformat paragraf narasi untuk Attendee ID tertentu.
     */
    public function findMatchForAttendee(int $userId, string $transactionId): array
    {
        $transaction = \App\Models\Transaction::where(function ($query) use ($transactionId) {
                $query->where('id', $transactionId)
                      ->orWhere('order_id', $transactionId);
            })
            ->where('user_id', $userId)
            ->firstOrFail();

        $myTicket = Attendee::with('event')
            ->where('id_event', $transaction->event_id)
            ->where('id_user', $userId)
            ->firstOrFail();

        if (empty($myTicket->vibe_bio)) {
            throw new Exception('Isi dulu Vibe Bio kamu di profil tiket sebelum mencari kecocokan!');
        }

        $otherAttendees = Attendee::with('user')
            ->where('id_event', $myTicket->id_event)
            ->where('id_attendee', '!=', $myTicket->id_attendee)
            ->whereNotNull('vibe_bio')
            ->get();

        if ($otherAttendees->isEmpty()) {
            throw new Exception('Belum ada peserta lain yang mengisi Vibe Bio di event ini. Coba lagi nanti!');
        }

        $participantList = $otherAttendees->map(function ($attendee): string {
            $name = $attendee->user?->full_name ?? 'Peserta Anonim';
            return "- {$name}: {$attendee->vibe_bio}";
        })->implode("\n");

        $prompt = <<<PROMPT
Saya adalah peserta event "{$myTicket->event->title}". Bio saya: {$myTicket->vibe_bio}

Berikut daftar peserta lain yang juga ingin berkenalan:
{$participantList}

Tugasmu: Analisis kecocokan bio saya dengan mereka. Pilih maksimal 3 orang yang paling cocok untuk saya ajak networking atau ngobrol. Jelaskan alasan kecocokannya dalam bahasa Indonesia yang santai, hangat, dan asik. Gunakan format yang rapi dengan nama sebagai judul tiap bagian.
PROMPT;

        $apiKey = trim(env('GROQ_API_KEY', ''));
        $model  = env('GROQ_MODEL', 'qwen-2.5-32b');

        if (empty($apiKey)) {
            throw new Exception('Konfigurasi AI belum selesai. Hubungi administrator.');
        }

        $url = 'https://api.groq.com/openai/v1/chat/completions';

        $aiResponse = Http::withToken($apiKey)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->timeout(30)
            ->post($url, [
                'model'            => $model,
                'messages'         => [['role' => 'user', 'content' => $prompt]],
                'temperature'      => 0.8,
                'max_tokens'       => 1024,
                'reasoning_effort' => 'none',
            ]);

        if ($aiResponse->failed()) {
            Log::error('Groq API Error', [
                'status' => $aiResponse->status(),
                'body'   => $aiResponse->body(),
            ]);
            throw new Exception('Gagal menghubungi Groq AI. Coba lagi nanti.');
        }

        $rawText = $aiResponse->json('choices.0.message.content') ?? '';
        $aiText  = preg_replace('/<think>.*?<\/think>/s', '', $rawText);
        $aiText  = trim($aiText) ?: 'AI tidak memberikan respons. Silakan coba lagi.';

        $matchedProfiles = $otherAttendees->map(fn ($attendee) => [
            'id'                  => $attendee->id_attendee,
            'user_name'           => $attendee->user?->full_name ?? 'Peserta Anonim',
            'vibe_bio'            => $attendee->vibe_bio,
            'ig_handle'           => $attendee->ig_handle,
            'profile_picture_url' => $attendee->user?->profile_picture
                ? asset('Media/uploads/' . $attendee->user->profile_picture)
                : null,
        ]);

        return [
            'ai_response'        => $aiText,
            'event_title'        => $myTicket->event->title,
            'my_vibe_bio'        => $myTicket->vibe_bio,
            'candidates_count'   => $otherAttendees->count(),
            'candidate_profiles' => $matchedProfiles,
        ];
    }
}
