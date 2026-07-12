<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Traits\ApiResponse;
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

    /**
     * Daftar semua event aktif yang belum berakhir.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::with(['ticketTiers', 'admin'])
            ->where('status', 'active')
            ->whereDate('end_date', '>=', now()->toDateString());

        // Filter opsional: kategori
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter opsional: kota
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Filter opsional: pencarian judul
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $events = $query->orderBy('start_date', 'asc')->get();

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
