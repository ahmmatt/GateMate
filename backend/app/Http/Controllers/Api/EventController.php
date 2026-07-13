<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Traits\ApiResponse;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * API EventController (Public)
 * ─────────────────────────────────────────────────────────────────────────────
 * Menampilkan event yang aktif untuk publik (tanpa autentikasi).
 *
 * Endpoints:
 *   GET /api/events        → Daftar semua event aktif
 *   GET /api/events/{id}   → Detail event + ticket tiers
 */
class EventController extends Controller
{
    use ApiResponse;

    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Daftar semua event aktif yang belum berakhir.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category', 'city', 'search']);
        $events = $this->eventService->getPublicEvents($filters);

        return $this->success(EventResource::collection($events));
    }

    /**
     * Detail event beserta ticket tiers.
     */
    public function show(int $id): JsonResponse
    {
        $event = Event::with(['ticketTiers', 'admin'])
            ->where('status', 'active')
            ->findOrFail($id);

        $hasPurchased = false;
        if (\Illuminate\Support\Facades\Auth::guard('sanctum')->check()) {
            $user = \Illuminate\Support\Facades\Auth::guard('sanctum')->user();
            $hasPurchased = \App\Models\Transaction::where('event_id', $id)
                ->where('user_id', $user->id_user ?? $user->id)
                ->whereIn('payment_status', ['success', 'pending'])
                ->exists();
        }

        $takenSeats = \App\Models\Transaction::where('event_id', $id)
            ->whereIn('payment_status', ['success', 'pending'])
            ->whereNotNull('seat_number')
            ->pluck('seat_number');

        return $this->success([
            'event'         => new EventResource($event),
            'has_purchased' => $hasPurchased,
            'taken_seats'   => $takenSeats,
        ]);
    }
}
