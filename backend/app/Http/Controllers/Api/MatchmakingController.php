<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Matchmaking\SetVibeBioRequest;
use App\Services\MatchmakingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * API MatchmakingController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani set Vibe Bio dan pencarian daftar kecocokan antar peserta.
 * Seluruh logika bisnis didelegasikan ke MatchmakingService.
 */
class MatchmakingController extends Controller
{
    use ApiResponse;

    protected MatchmakingService $matchmakingService;

    public function __construct(MatchmakingService $matchmakingService)
    {
        $this->matchmakingService = $matchmakingService;
    }

    /**
     * POST /api/matchmaking/{id}/vibe-bio
     */
    public function setVibeBio(SetVibeBioRequest $request, $id): JsonResponse
    {
        try {
            $this->matchmakingService->setVibeBio(Auth::id(), (int) $id, $request->validated('vibe_bio'));
            return response()->json(['success' => true, 'message' => 'Vibe Bio berhasil disimpan!']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }

    /**
     * GET /api/matchmaking/{id}/matches
     */
    public function getMatches($id): JsonResponse
    {
        try {
            $matches = $this->matchmakingService->getMatchesForTransaction(Auth::id(), (int) $id);
            return response()->json(['success' => true, 'data' => $matches]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }
}
