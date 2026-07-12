<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MatchmakingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * API AiMatchController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menjalankan AI Matchmaking naratif menggunakan Groq/Gemini API.
 * Seluruh logika bisnis didelegasikan ke MatchmakingService.
 *
 * Endpoints:
 *   GET /api/tickets/{attendee_id}/ai-match → Cari kecocokan AI untuk peserta
 */
class AiMatchController extends Controller
{
    use ApiResponse;

    protected MatchmakingService $matchmakingService;

    public function __construct(MatchmakingService $matchmakingService)
    {
        $this->matchmakingService = $matchmakingService;
    }

    /**
     * Jalankan AI Matchmaking — panggil Groq API dan kembalikan hasil JSON.
     *
     * @param int $id ID dari Attendee (bukan Transaction!)
     */
    public function findMatch(int $id): JsonResponse
    {
        try {
            $data = $this->matchmakingService->findMatchForAttendee(Auth::id(), $id);
            return response()->json([
                'success' => true,
                'data'    => $data,
            ]);
        } catch (Exception $e) {
            $status = 422;
            if (str_contains($e->getMessage(), 'Konfigurasi AI') || str_contains($e->getMessage(), 'Gagal menghubungi')) {
                $status = 502;
            } elseif (str_contains($e->getMessage(), 'Belum ada peserta lain')) {
                $status = 404;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
