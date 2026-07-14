<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\StoreTenantRequest;
use App\Http\Requests\Admin\StoreTierRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Http\Requests\Admin\UpdateTenantRequest;
use App\Http\Requests\Admin\UpdateTierRequest;
use App\Http\Requests\Admin\WithdrawEventRequest;
use App\Http\Resources\EventResource;
use App\Http\Resources\TicketResource;
use App\Http\Resources\WalletTransactionResource;
use App\Services\EventManagementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * EventController (Admin API)
 * ─────────────────────────────────────────────────────────────────────────────
 * Slim Controller untuk manajemen Event Organizer (CRUD Event, Tier, Tenant, Check-in, Refund).
 * Seluruh business logic didelegasikan ke EventManagementService.
 */
class EventController extends Controller
{
    use ApiResponse;

    protected EventManagementService $eventService;

    public function __construct(EventManagementService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * GET /api/admin/events
     */
    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService->getEvents(Auth::id(), $request->only(['search', 'status']));

        return response()->json([
            'success' => true,
            'data'    => EventResource::collection($events),
            'meta'    => [
                'current_page' => $events->currentPage(),
                'last_page'    => $events->lastPage(),
                'total'        => $events->total(),
                'per_page'     => $events->perPage(),
            ],
        ]);
    }

    /**
     * POST /api/admin/events
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $bannerPath = null;
        if ($request->hasFile('banner_image')) {
            $file       = $request->file('banner_image');
            $filename   = uniqid('banner_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('Media/uploads'), $filename);
            $bannerPath = $filename;
        }

        $posterPath = null;
        if ($request->hasFile('poster_image')) {
            $pfile      = $request->file('poster_image');
            $pfilename  = uniqid('poster_') . '.' . $pfile->getClientOriginalExtension();
            $pfile->move(public_path('Media/uploads'), $pfilename);
            $posterPath = $pfilename;
        }

        $space3dPath = null;
        if ($request->hasFile('space_3d_file')) {
            $sfile       = $request->file('space_3d_file');
            $sfilename   = uniqid('space3d_') . '.' . $sfile->getClientOriginalExtension();
            $sfile->move(public_path('Media/uploads'), $sfilename);
            $space3dPath = $sfilename;
        }

        $event = $this->eventService->createEvent(Auth::id(), $request->validated(), $bannerPath, $posterPath, $space3dPath);
        $event->load('ticketTiers');

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dibuat!',
            'data'    => new EventResource($event),
        ], 201);
    }

    /**
     * GET /api/admin/events/{id}
     */
    public function show(int $id): JsonResponse
    {
        $detail = $this->eventService->getEventDetail(Auth::id(), $id);

        return response()->json([
            'success' => true,
            'data'    => [
                'event'                 => new EventResource($detail['event']),
                'stats'                 => $detail['stats'],
                'tenants'               => $detail['tenants'],
                'pending_withdrawals'   => $detail['pending_withdrawals']->map(fn ($w) => [
                    'id'         => $w->id,
                    'amount'     => (float) $w->amount,
                    'status'     => $w->status,
                    'user_name'  => $w->user?->full_name,
                    'meta'       => $w->meta,
                    'created_at' => $w->created_at?->toIso8601String(),
                ]),
                'tenant_transactions'   => WalletTransactionResource::collection($detail['tenant_transactions']),
                'event_withdrawals'     => WalletTransactionResource::collection($detail['event_withdrawals']),
                'ticket_buyers'         => TicketResource::collection($detail['ticket_buyers']),
            ],
        ]);
    }

    /**
     * PUT /api/admin/events/{id}
     */
    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        $event = $this->eventService->updateEventStatus(Auth::id(), $id, $request->validated('status'));

        return response()->json([
            'success' => true,
            'message' => 'Status event berhasil diperbarui.',
            'data'    => new EventResource($event),
        ]);
    }

    /**
     * PATCH /api/admin/events/{id}/toggle-status
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $event = $this->eventService->toggleStatus(Auth::id(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Status event berhasil diubah menjadi: ' . $event->status,
            'data'    => new EventResource($event),
        ]);
    }

    /**
     * DELETE /api/admin/events/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->eventService->deleteEvent(Auth::id(), $id);
            return response()->json([
                'success' => true,
                'message' => 'Event beserta seluruh data tenant terkait berhasil dihapus secara permanen.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/admin/events/{id}/tiers
     */
    public function storeTier(StoreTierRequest $request, int $id): JsonResponse
    {
        $tier = $this->eventService->createTier(Auth::id(), $id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Tier tiket berhasil ditambahkan!',
            'data'    => [
                'id'              => $tier->id_tier,
                'tier_name'       => $tier->tier_name,
                'price'           => (float) $tier->price,
                'capacity'        => (int) $tier->capacity,
                'remaining_seats' => (int) $tier->remaining_seats,
            ],
        ], 201);
    }

    /**
     * PUT /api/admin/events/{eventId}/tiers/{tierId}
     */
    public function updateTier(UpdateTierRequest $request, int $eventId, int $tierId): JsonResponse
    {
        try {
            $tier = $this->eventService->updateTier(Auth::id(), $eventId, $tierId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Tier tiket berhasil diperbarui!',
                'data'    => [
                    'id'              => $tier->id_tier,
                    'tier_name'       => $tier->tier_name,
                    'price'           => (float) $tier->price,
                    'capacity'        => (int) $tier->capacity,
                    'remaining_seats' => (int) $tier->remaining_seats,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * DELETE /api/admin/events/{eventId}/tiers/{tierId}
     */
    public function destroyTier(int $eventId, int $tierId): JsonResponse
    {
        try {
            $this->eventService->deleteTier(Auth::id(), $eventId, $tierId);
            return response()->json([
                'success' => true,
                'message' => 'Tier tiket berhasil dihapus!',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/admin/events/{id}/tenants
     */
    public function storeTenant(StoreTenantRequest $request, int $id): JsonResponse
    {
        $tenant = $this->eventService->createTenant(Auth::id(), $id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Akun Tenant "' . $tenant->full_name . '" berhasil dibuat!',
            'data'    => [
                'id'        => $tenant->id_user,
                'full_name' => $tenant->full_name,
                'email'     => $tenant->email,
                'id_event'  => $tenant->id_event,
            ],
        ], 201);
    }

    /**
     * PUT /api/admin/events/{eventId}/tenants/{tenantId}
     */
    public function updateTenant(UpdateTenantRequest $request, int $eventId, int $tenantId): JsonResponse
    {
        $this->eventService->updateTenant(Auth::id(), $eventId, $tenantId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data Tenant berhasil diperbarui!',
        ]);
    }

    /**
     * DELETE /api/admin/events/{eventId}/tenants/{tenantId}
     */
    public function destroyTenant(int $eventId, int $tenantId): JsonResponse
    {
        try {
            $this->eventService->deleteTenant(Auth::id(), $eventId, $tenantId);
            return response()->json([
                'success' => true,
                'message' => 'Tenant beserta riwayat transaksinya berhasil dihapus!',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/admin/events/{eventId}/withdrawals/{id}/approve
     */
    public function approveWithdrawal(int $eventId, int $id): JsonResponse
    {
        try {
            $this->eventService->approveWithdrawal(Auth::id(), $eventId, $id);
            return response()->json([
                'success' => true,
                'message' => 'Penarikan Tenant berhasil disetujui dan dana telah dicairkan.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyetujui penarikan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/admin/events/{id}/withdraw
     */
    public function withdrawEvent(WithdrawEventRequest $request, int $id): JsonResponse
    {
        try {
            $res = $this->eventService->withdrawEvent(Auth::user(), $id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan penarikan Rp ' . number_format($res['requested_amount'], 0, ',', '.') . ' berhasil dikirim ke Superadmin.',
                'data'    => [
                    'requested_amount'  => $res['requested_amount'],
                    'remaining_balance' => $res['remaining_balance'],
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * PATCH /api/admin/events/{eventId}/attendees/{transactionId}/checkin
     */
    public function toggleCheckIn(int $eventId, int $transactionId): JsonResponse
    {
        $tx = $this->eventService->toggleCheckIn(Auth::id(), $eventId, $transactionId);

        return response()->json([
            'success' => true,
            'message' => 'Status check-in diperbarui.',
            'data'    => [
                'is_used'    => (bool) $tx->is_used,
                'scanned_at' => $tx->scanned_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * POST /api/admin/events/{eventId}/attendees/{transactionId}/approve
     */
    public function approveAttendee(int $eventId, int $transactionId): JsonResponse
    {
        try {
            $this->eventService->approveAttendee(Auth::id(), $eventId, $transactionId);
            return response()->json(['success' => true, 'message' => 'Peserta berhasil disetujui.']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * POST /api/admin/events/{eventId}/attendees/{transactionId}/reject
     */
    public function rejectAttendee(int $eventId, int $transactionId): JsonResponse
    {
        try {
            $this->eventService->rejectAttendee(Auth::id(), $eventId, $transactionId);
            return response()->json(['success' => true, 'message' => 'Peserta berhasil ditolak dan dana dikembalikan.']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * POST /api/admin/events/{eventId}/attendees/{transactionId}/refund
     */
    public function refundTicket(int $eventId, int $transactionId): JsonResponse
    {
        try {
            $res = $this->eventService->refundTicket(Auth::id(), $eventId, $transactionId);
            return response()->json([
                'success' => true,
                'message' => 'Refund 93% berhasil! Rp ' . number_format($res['refund_amount'], 0, ',', '.') . ' telah dikembalikan ke dompet pembeli.',
                'data'    => $res,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses refund: ' . $e->getMessage(),
            ], 500);
        }
    }
}
