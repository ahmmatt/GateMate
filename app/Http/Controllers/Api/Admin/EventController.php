<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Http\Resources\TicketResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * API Admin\EventController
 * ─────────────────────────────────────────────────────────────────────────────
 * Full CRUD event untuk penyelenggara (admin). Semua logika bisnis identik
 * dengan Admin\EventController Blade — hanya response format JSON.
 *
 * Endpoints:
 *   GET    /api/admin/events                          → Daftar event admin
 *   POST   /api/admin/events                          → Buat event baru
 *   GET    /api/admin/events/{id}                     → Detail event (statistik)
 *   PUT    /api/admin/events/{id}                     → Update status event
 *   DELETE /api/admin/events/{id}                     → Hapus event
 *   POST   /api/admin/events/{id}/toggle-status       → Toggle active/ended
 *   POST   /api/admin/events/{id}/tiers               → Tambah tier tiket
 *   PUT    /api/admin/events/{id}/tiers/{tid}         → Update tier tiket
 *   DELETE /api/admin/events/{id}/tiers/{tid}         → Hapus tier tiket
 *   POST   /api/admin/events/{id}/tenants             → Tambah tenant
 *   PUT    /api/admin/events/{id}/tenants/{tenant}    → Update tenant
 *   DELETE /api/admin/events/{id}/tenants/{tenant}    → Hapus tenant
 *   POST   /api/admin/events/{eid}/withdraw/{wid}/approve → Approve withdrawal tenant
 *   POST   /api/admin/events/{id}/withdraw            → Admin tarik pendapatan event
 *   POST   /api/admin/events/{eid}/tickets/{tid}/toggle-checkin → Toggle check-in
 *   POST   /api/admin/events/{eid}/tickets/{tid}/refund → Refund 93% tiket
 */
class EventController extends Controller
{
    // ── Index ────────────────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $query = Event::with(['ticketTiers', 'attendees'])
            ->where('id_admin', Auth::id());

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status') && in_array($request->status, ['active', 'ended'])) {
            $query->where('status', $request->status);
        }

        $events = $query->orderByDesc('created_at')->paginate(12);

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

    // ── Create / Store ───────────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'category'         => ['required', 'string', 'max:100'],
            'description'      => ['nullable', 'string'],
            'location_type'    => ['required', 'in:offline,online'],
            'location_details' => ['required', 'string', 'max:500'],
            'venue_name'       => ['nullable', 'string', 'max:255'],
            'city'             => ['nullable', 'string', 'max:100'],
            'maps_link'        => ['nullable', 'string'],
            'start_date'       => ['required', 'date'],
            'start_time'       => ['required', 'date_format:H:i'],
            'end_date'         => ['required', 'date', 'after_or_equal:start_date'],
            'end_time'         => ['required', 'date_format:H:i'],
            'timezone'         => ['nullable', 'string', 'max:50'],
            'capacity_type'    => ['required', 'in:unlimited,limited'],
            'max_capacity'     => ['nullable', 'integer', 'min:1'],
            'seat_assignment'  => ['nullable', 'string', 'in:bebas,pilih'],
            'seat_numbers'     => ['nullable', 'string'],
            'require_approval' => ['sometimes', 'boolean'],
            'banner_image'     => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'poster_image'     => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'custom_questions' => ['nullable', 'array'],
            'custom_questions.*' => ['string', 'max:255'],
            // Tier tiket
            'tier_name'        => ['required', 'string', 'max:100'],
            'price'            => ['required', 'numeric', 'min:0'],
            'is_unlimited'     => ['sometimes', 'boolean'],
            'quota'            => ['required_without:is_unlimited', 'nullable', 'integer', 'min:1'],
        ]);

        // Upload banner
        $bannerPath = 'default-banner.jpg';
        if ($request->hasFile('banner_image')) {
            $file       = $request->file('banner_image');
            $filename   = uniqid('banner_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('Media/uploads'), $filename);
            $bannerPath = $filename;
        }

        // Upload poster
        $posterPath = null;
        if ($request->hasFile('poster_image')) {
            $pfile      = $request->file('poster_image');
            $pfilename  = uniqid('poster_') . '.' . $pfile->getClientOriginalExtension();
            $pfile->move(public_path('Media/uploads'), $pfilename);
            $posterPath = $pfilename;
        }

        $event = DB::transaction(function () use ($validated, $bannerPath, $posterPath) {
            $questions = null;
            if (!empty($validated['custom_questions'])) {
                $questions = array_values(array_filter($validated['custom_questions']));
            }

            $event = Event::create([
                'id_admin'         => Auth::id(),
                'title'            => $validated['title'],
                'banner_image'     => $bannerPath,
                'poster_path'      => $posterPath,
                'category'         => $validated['category'],
                'location_type'    => $validated['location_type'],
                'location_details' => $validated['location_details'],
                'venue_name'       => $validated['venue_name'] ?? null,
                'city'             => $validated['city'] ?? null,
                'maps_link'        => $validated['maps_link'] ?? null,
                'start_date'       => $validated['start_date'],
                'start_time'       => $validated['start_time'],
                'end_date'         => $validated['end_date'],
                'end_time'         => $validated['end_time'],
                'timezone'         => $validated['timezone'] ?? 'GMT+08:00',
                'description'      => $validated['description'] ?? null,
                'require_approval' => isset($validated['require_approval']),
                'custom_questions' => $questions,
                'capacity_type'    => $validated['capacity_type'],
                'max_capacity'     => $validated['capacity_type'] === 'limited'
                                       ? ($validated['max_capacity'] ?? null) : null,
                'seat_assignment'  => $validated['capacity_type'] === 'limited'
                                       ? ($validated['seat_assignment'] ?? null) : null,
                'seat_numbers'     => isset($validated['seat_numbers']) ? json_decode($validated['seat_numbers']) : null,
                'status'           => 'active',
            ]);

            $isUnlimited = isset($validated['is_unlimited']);
            $capacity    = $isUnlimited ? 0 : ($validated['quota'] ?? 0);

            TicketTier::create([
                'id_event'        => $event->id_event,
                'tier_name'       => $validated['tier_name'],
                'price'           => $validated['price'],
                'capacity'        => $capacity,
                'remaining_seats' => $capacity,
                'is_unlimited'    => $isUnlimited,
            ]);

            return $event;
        });

        $event->load('ticketTiers');

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dibuat!',
            'data'    => new EventResource($event),
        ], 201);
    }

    // ── Show (Detail + Statistik) ────────────────────────────────────────────

    public function show(int $id): JsonResponse
    {
        $event = Event::with(['ticketTiers.attendees', 'attendees.user'])
            ->where('id_admin', Auth::id())
            ->findOrFail($id);

        $totalSold    = Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->count();
        $checkedIn    = Transaction::where('event_id', $event->id_event)->where('is_used', true)->count();
        $ticketRevenue = Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->sum('gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);
        $platformFee      = round($ticketRevenue * $feePercent / 100, 2);
        $organizerTicket  = $ticketRevenue - $platformFee;

        $tenantRevenueSum = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->sum('amount');
        $tenantCut  = round($tenantRevenueSum * $tenantCutPercent / 100, 2);
        $netIncome  = $organizerTicket + $tenantCut;
        $totalRevenue = $ticketRevenue + $tenantRevenueSum;

        $alreadyWithdrawn = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');
        $sisaBisaDitarik = max(0, $netIncome - $alreadyWithdrawn);

        $eventWithdrawals = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->latest()->get();

        $tenantTransactions = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->latest()->get();

        $tenants = User::where('role', 'tenant')
            ->where('id_event', $event->id_event)
            ->orderBy('full_name')->get();

        $pendingWithdrawals = WalletTransaction::with('user')
            ->where('type', 'withdrawal')
            ->where('status', 'pending_admin')
            ->whereHas('user', fn ($q) => $q->where('id_event', $event->id_event))
            ->latest()->get();

        $pendingTenantsBalance = false;
        foreach ($tenants as $t) {
            $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $t->id_user)->sum('amount');
            $wds   = WalletTransaction::where('user_id', $t->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending_admin', 'pending_superadmin', 'success'])->sum('amount');
            if (($sales - $wds) > 0) { $pendingTenantsBalance = true; break; }
        }

        $endDateTime = \Carbon\Carbon::parse($event->end_date->format('Y-m-d') . ' ' . $event->end_time, 'Asia/Makassar');
        $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);

        $ticketBuyers = Transaction::with(['user', 'ticketTier'])
            ->where('event_id', $event->id_event)
            ->whereIn('payment_status', ['success', 'pending'])
            ->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'event'                 => new EventResource($event),
                'stats'                 => [
                    'total_sold'         => $totalSold,
                    'checked_in'         => $checkedIn,
                    'total_revenue'      => (float) $totalRevenue,
                    'ticket_revenue'     => (float) $ticketRevenue,
                    'tenant_revenue_sum' => (float) $tenantRevenueSum,
                    'platform_fee'       => $platformFee,
                    'fee_percent'        => $feePercent,
                    'net_income'         => $netIncome,
                    'tenant_cut'         => $tenantCut,
                    'already_withdrawn'  => (float) $alreadyWithdrawn,
                    'available_to_withdraw' => $sisaBisaDitarik,
                    'is_event_ended'     => $isEventEnded,
                    'pending_tenants_balance' => $pendingTenantsBalance,
                ],
                'tenants'               => $tenants->map(fn ($t) => [
                    'id'         => $t->id_user,
                    'full_name'  => $t->full_name,
                    'email'      => $t->email,
                    'id_event'   => $t->id_event,
                ]),
                'pending_withdrawals'   => $pendingWithdrawals->map(fn ($w) => [
                    'id'         => $w->id,
                    'amount'     => (float) $w->amount,
                    'status'     => $w->status,
                    'user_name'  => $w->user?->full_name,
                    'meta'       => $w->meta,
                    'created_at' => $w->created_at?->toIso8601String(),
                ]),
                'tenant_transactions'   => WalletTransactionResource::collection($tenantTransactions),
                'event_withdrawals'     => WalletTransactionResource::collection($eventWithdrawals),
                'ticket_buyers'         => TicketResource::collection($ticketBuyers),
            ],
        ]);
    }

    // ── Update Status ────────────────────────────────────────────────────────

    public function update(Request $request, int $id): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:active,ended'],
        ]);

        $event->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status event berhasil diperbarui.',
            'data'    => new EventResource($event->fresh()),
        ]);
    }

    // ── Toggle Status ────────────────────────────────────────────────────────

    public function toggleStatus(int $id): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $event->status = $event->status === 'active' ? 'ended' : 'active';
        $event->save();

        $msg = $event->status === 'active' ? 'Event berhasil diaktifkan.' : 'Event berhasil dinonaktifkan.';

        return response()->json([
            'success' => true,
            'message' => $msg,
            'data'    => ['status' => $event->status],
        ]);
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    public function destroy(int $id): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        if ($event->banner_image && $event->banner_image !== 'default-banner.jpg'
            && file_exists(public_path('Media/uploads/' . $event->banner_image))) {
            unlink(public_path('Media/uploads/' . $event->banner_image));
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dihapus secara permanen.',
        ]);
    }

    // ── Tier Management ──────────────────────────────────────────────────────

    public function storeTier(Request $request, int $id): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'tier_name'  => ['required', 'string', 'max:100'],
            'price'      => ['required', 'numeric', 'min:0'],
            'quota'      => ['required', 'integer', 'min:1'],
        ]);

        $tier = TicketTier::create([
            'id_event'        => $event->id_event,
            'tier_name'       => $validated['tier_name'],
            'price'           => $validated['price'],
            'capacity'        => $validated['quota'],
            'remaining_seats' => $validated['quota'],
            'is_unlimited'    => false,
        ]);

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

    public function updateTier(Request $request, int $eventId, int $tierId): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $tier  = TicketTier::where('id_event', $event->id_event)->findOrFail($tierId);

        $validated = $request->validate([
            'tier_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'numeric', 'min:0'],
            'quota'     => ['required', 'integer', 'min:1'],
        ]);

        $sold = Transaction::where('ticket_tier_id', $tier->id_tier)->where('payment_status', 'success')->count();

        if ($validated['quota'] < $sold) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota tidak boleh kurang dari jumlah tiket yang sudah terjual (' . $sold . ').',
            ], 422);
        }

        $tier->update([
            'tier_name'       => $validated['tier_name'],
            'price'           => $validated['price'],
            'capacity'        => $validated['quota'],
            'remaining_seats' => $validated['quota'] - $sold,
        ]);

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
    }

    public function destroyTier(int $eventId, int $tierId): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $tier  = TicketTier::where('id_event', $event->id_event)->findOrFail($tierId);

        $sold = Transaction::where('ticket_tier_id', $tier->id_tier)->whereIn('payment_status', ['success', 'pending'])->count();

        if ($sold > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus tier yang sudah memiliki transaksi.',
            ], 422);
        }

        $tier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tier tiket berhasil dihapus!',
        ]);
    }

    // ── Tenant Management ────────────────────────────────────────────────────

    public function storeTenant(Request $request, int $id): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
        ]);

        $tenant = User::create([
            'full_name'      => $request->full_name,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'role'           => 'tenant',
            'id_event'       => $event->id_event,
            'wallet_balance' => 0,
        ]);

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

    public function updateTenant(Request $request, int $eventId, int $tenantId): JsonResponse
    {
        $event  = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenantId);

        $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email,' . $tenant->id_user . ',id_user'],
            'password'  => ['nullable', 'string', 'min:8'],
        ]);

        $tenant->full_name = $request->full_name;
        $tenant->email     = $request->email;
        if ($request->filled('password')) {
            $tenant->password = Hash::make($request->password);
        }
        $tenant->save();

        return response()->json([
            'success' => true,
            'message' => 'Data Tenant berhasil diperbarui!',
        ]);
    }

    public function destroyTenant(int $eventId, int $tenantId): JsonResponse
    {
        $event  = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenantId);

        $salesCount = WalletTransaction::where('meta->tenant_id', $tenant->id_user)->count();

        if ($salesCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus tenant yang sudah memiliki transaksi penjualan.',
            ], 422);
        }

        $tenant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tenant berhasil dihapus!',
        ]);
    }

    // ── Withdrawal & Finance ─────────────────────────────────────────────────

    public function approveWithdrawal(int $eventId, int $id): JsonResponse
    {
        Event::where('id_admin', Auth::id())->findOrFail($eventId);

        DB::beginTransaction();
        try {
            $withdrawal = WalletTransaction::where('id', $id)
                ->where('type', 'withdrawal')
                ->where('status', 'pending_admin')
                ->firstOrFail();

            $withdrawal->update(['status' => 'success']);

            DB::commit();

            Log::info('API: Withdrawal Tenant disetujui', [
                'withdrawal_id' => $withdrawal->id,
                'tenant_id'     => $withdrawal->user_id,
                'amount'        => $withdrawal->amount,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Penarikan Tenant berhasil disetujui dan dana telah dicairkan.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyetujui penarikan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function withdrawEvent(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'bank_name'      => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'amount'         => ['required', 'numeric', 'min:1000'],
        ]);

        $event = Event::with('ticketTiers.attendees')->where('id_admin', Auth::id())->findOrFail($id);

        $endDateTime = \Carbon\Carbon::parse($event->end_date->format('Y-m-d') . ' ' . $event->end_time, 'Asia/Makassar');
        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            return response()->json([
                'success' => false,
                'message' => 'Event belum berakhir.',
            ], 422);
        }

        $admin   = Auth::user();
        $adminId = $admin->id_user;

        // Syarat: Kewajiban Tenant Selesai
        $pendingTenantsBalance = false;
        $tenants = User::where('role', 'tenant')->where('id_event', $event->id_event)->get();
        foreach ($tenants as $t) {
            $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $t->id_user)->sum('amount');
            $wds   = WalletTransaction::where('user_id', $t->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending_admin', 'pending_superadmin', 'success'])->sum('amount');
            if (($sales - $wds) > 0) { $pendingTenantsBalance = true; break; }
        }

        $pendingWithdrawals = WalletTransaction::whereHas('user', function ($q) use ($event) {
            $q->where('role', 'tenant')->where('id_event', $event->id_event);
        })->where('type', 'withdrawal')->whereIn('status', ['pending', 'pending_admin'])->exists();

        if ($pendingTenantsBalance || $pendingWithdrawals) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan semua penarikan Tenant terlebih dahulu!',
            ], 422);
        }

        // Kalkulasi sisa bisa ditarik
        $feePercent      = (float) config('services.platform.fee_percent', 10);
        $tenantCutPct    = (float) config('services.platform.organizer_tenant_cut', 100);

        $ticketRevenue   = Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->sum('gross_amount');
        $platformFee     = round($ticketRevenue * $feePercent / 100, 2);
        $organizerTicket = $ticketRevenue - $platformFee;

        $tenantRevenue   = WalletTransaction::where('user_id', $adminId)->where('type', 'tenant_revenue')->where('meta->event_id', $event->id_event)->sum('amount');
        $tenantCut  = round($tenantRevenue * $tenantCutPct / 100, 2);
        $netIncome  = $organizerTicket + $tenantCut;

        $alreadyWithdrawn = WalletTransaction::where('user_id', $adminId)->where('type', 'withdrawal')->where('meta->event_id', $event->id_event)->whereIn('status', ['pending_superadmin', 'success'])->sum('amount');
        $sisaBisaDitarik = max(0, $netIncome - $alreadyWithdrawn);

        if ($netIncome <= 0) {
            return response()->json(['success' => false, 'message' => 'Tidak ada pendapatan bersih yang bisa ditarik.'], 422);
        }

        $requestedAmount = (float) $request->amount;
        if ($requestedAmount > $sisaBisaDitarik) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah melebihi sisa pendapatan bersih (Rp ' . number_format($sisaBisaDitarik, 0, ',', '.') . ').',
                'available_balance' => $sisaBisaDitarik,
            ], 422);
        }

        DB::beginTransaction();
        try {
            WalletTransaction::create([
                'user_id'  => $adminId,
                'order_id' => 'EWD-' . $event->id_event . '-' . time(),
                'type'     => 'withdrawal',
                'amount'   => $requestedAmount,
                'status'   => 'pending_superadmin',
                'meta'     => [
                    'event_id'            => $event->id_event,
                    'event_title'         => $event->title,
                    'is_event_withdrawal' => true,
                    'bank_name'           => $request->bank_name,
                    'account_number'      => $request->account_number,
                    'net_income'          => $netIncome,
                    'platform_fee'        => $platformFee,
                    'fee_percent'         => $feePercent,
                ],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan penarikan Rp ' . number_format($requestedAmount, 0, ',', '.') . ' ke ' . $request->bank_name . ' berhasil dikirim ke Superadmin.',
                'data'    => [
                    'amount'         => $requestedAmount,
                    'bank_name'      => $request->bank_name,
                    'account_number' => $request->account_number,
                    'status'         => 'pending_superadmin',
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal mengajukan penarikan: ' . $e->getMessage()], 500);
        }
    }

    // ── Attendee Management ──────────────────────────────────────────────────

    public function toggleCheckIn(int $eventId, int $transactionId): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)->findOrFail($transactionId);

        $transaction->update([
            'is_used'    => !$transaction->is_used,
            'scanned_at' => !$transaction->is_used ? now() : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status check-in diperbarui.',
            'data'    => [
                'is_used'    => (bool) $transaction->fresh()->is_used,
                'scanned_at' => $transaction->fresh()->scanned_at?->toIso8601String(),
            ],
        ]);
    }

    public function refundTicket(int $eventId, int $transactionId): JsonResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')
            ->findOrFail($transactionId);

        DB::beginTransaction();
        try {
            $grossAmount  = (float) $transaction->gross_amount;
            $refundAmount = round($grossAmount * 0.93, 2);
            $buyer        = $transaction->user;

            if ($buyer) {
                $buyer->wallet_balance = (float) $buyer->wallet_balance + $refundAmount;
                $buyer->save();

                WalletTransaction::create([
                    'order_id' => 'RFND-' . strtoupper(uniqid()),
                    'user_id'  => $buyer->id_user,
                    'type'     => 'ticket_refund',
                    'amount'   => $refundAmount,
                    'status'   => 'success',
                    'meta'     => [
                        'event_title'       => $event->title,
                        'ticket_tier'       => $transaction->ticketTier->tier_name ?? 'Tiket',
                        'transaction_id'    => $transaction->id,
                        'original_amount'   => $grossAmount,
                        'refund_percentage' => '93%',
                    ],
                ]);

                $buyer->notify(new \App\Notifications\TicketRefundNotification(
                    $event->title,
                    $transaction->ticketTier->tier_name ?? 'Tiket',
                    $refundAmount
                ));
            }

            if ($transaction->ticketTier && $transaction->ticketTier->capacity > 0) {
                $transaction->ticketTier->increment('remaining_seats');
            }

            $transaction->payment_status = 'failed';
            $transaction->is_used        = false;
            $transaction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Refund 93% berhasil! Rp ' . number_format($refundAmount, 0, ',', '.') . ' telah dikembalikan ke dompet pembeli.',
                'data'    => [
                    'refund_amount'   => $refundAmount,
                    'original_amount' => $grossAmount,
                    'buyer_name'      => $buyer?->full_name,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('API Refund Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses refund: ' . $e->getMessage(),
            ], 500);
        }
    }
}
