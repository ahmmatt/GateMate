<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\UpdateVibeRequest;
use App\Http\Resources\TicketResource;
use App\Services\TicketService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * API TicketController
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola tiket milik user yang sedang login.
 * Seluruh logika bisnis didelegasikan ke TicketService.
 *
 * Endpoints:
 *   GET  /api/my-tickets              → Daftar semua tiket user
 *   GET  /api/tickets/{id}            → Detail e-ticket + QR data + peserta event
 *   POST /api/tickets/{id}/vibe       → Update profil AI Matchmaking
 */
class TicketController extends Controller
{
    use ApiResponse;

    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * GET /api/my-tickets
     */
    public function index(): JsonResponse
    {
        $data = $this->ticketService->getUserTickets(Auth::id());

        return response()->json([
            'success' => true,
            'data'    => [
                'upcoming' => TicketResource::collection($data['upcoming']),
                'past'     => TicketResource::collection($data['past']),
                'total'    => $data['total'],
            ],
        ]);
    }

    /**
     * GET /api/tickets/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            $detail = $this->ticketService->getTicketDetail(Auth::id(), $id);

            return response()->json([
                'success' => true,
                'data'    => [
                    'ticket'          => new TicketResource($detail['ticket']),
                    'my_attendee'     => $detail['my_attendee'],
                    'other_attendees' => $detail['other_attendees'],
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 403);
        }
    }

    /**
     * POST /api/tickets/{id}/vibe
     */
    public function updateVibe(UpdateVibeRequest $request, string $id): JsonResponse
    {
        try {
            $attendee = $this->ticketService->updateTicketVibe(Auth::id(), $id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'AI Matchmaking Profile berhasil diperbarui!',
                'data'    => [
                    'vibe_bio'          => $attendee->vibe_bio,
                    'ig_handle'         => $attendee->ig_handle,
                    'looking_for_match' => (bool) $attendee->looking_for_match,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
