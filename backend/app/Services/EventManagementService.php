<?php

namespace App\Services;

use App\Mail\ETicketMail;
use App\Models\Attendee;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Notifications\TicketRefundNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

/**
 * EventManagementService
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani seluruh business logic untuk manajemen Event, Tier, Tenant,
 * Attendance, Check-in, Withdrawal Event, dan Refund Tiket.
 */
class EventManagementService
{
    /**
     * Mengambil daftar event milik admin dengan filter pencarian dan status.
     */
    public function getEvents(int $adminId, array $filters)
    {
        $query = Event::with(['ticketTiers', 'attendees'])
            ->where('id_admin', $adminId);

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status']) && in_array($filters['status'], ['active', 'ended'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->paginate(12);
    }

    /**
     * Membuat event baru beserta tier tiket pertama dalam DB transaction.
     */
    public function createEvent(int $adminId, array $validated, ?string $bannerPath, ?string $posterPath): Event
    {
        $bannerPath = $bannerPath ?? 'default-banner.jpg';

        return DB::transaction(function () use ($adminId, $validated, $bannerPath, $posterPath) {
            $questions = null;
            if (!empty($validated['custom_questions'])) {
                $questions = array_values(array_filter($validated['custom_questions']));
            }

            $event = Event::create([
                'id_admin'         => $adminId,
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
                'require_approval' => filter_var($validated['require_approval'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'custom_questions' => $questions,
                'capacity_type'    => $validated['capacity_type'],
                'max_capacity'     => $validated['capacity_type'] === 'limited'
                                       ? ($validated['max_capacity'] ?? null) : null,
                'seat_assignment'  => $validated['capacity_type'] === 'limited'
                                       ? ($validated['seat_assignment'] ?? 'bebas') : 'bebas',
                'seat_numbers'     => isset($validated['seat_numbers']) ? json_decode($validated['seat_numbers']) : null,
                'status'           => 'active',
            ]);

            $isUnlimited = filter_var($validated['is_unlimited'] ?? false, FILTER_VALIDATE_BOOLEAN);
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
    }

    /**
     * Mengambil detail event beserta statistik lengkap dan daftar relasi.
     */
    public function getEventDetail(int $adminId, int $eventId): array
    {
        $event = Event::with(['ticketTiers.attendees', 'attendees.user'])
            ->where('id_admin', $adminId)
            ->findOrFail($eventId);

        $totalSold    = Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->count();
        $checkedIn    = Transaction::where('event_id', $event->id_event)->where('is_used', true)->count();
        $ticketRevenue = Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->sum('gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);
        $platformFee      = round($ticketRevenue * $feePercent / 100, 2);
        $organizerTicket  = $ticketRevenue - $platformFee;

        $tenantRevenueSum = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->sum('amount');
        $tenantCut  = round($tenantRevenueSum * $tenantCutPercent / 100, 2);
        $netIncome  = $organizerTicket + $tenantCut;
        $totalRevenue = $ticketRevenue + $tenantRevenueSum;

        $alreadyWithdrawn = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');
        $sisaBisaDitarik = max(0, $netIncome - $alreadyWithdrawn);

        $eventWithdrawals = WalletTransaction::where('user_id', $adminId)
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->latest()->get();

        $tenantTransactions = WalletTransaction::where('user_id', $adminId)
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

        $endDateTime = Carbon::parse($event->end_date->format('Y-m-d') . ' ' . $event->end_time, 'Asia/Makassar');
        $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);

        $ticketBuyers = Transaction::with(['user', 'ticketTier'])
            ->where('event_id', $event->id_event)
            ->whereIn('payment_status', ['success', 'pending'])
            ->latest()->get();

        return [
            'event'                 => $event,
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
            'tenants'               => $tenants,
            'pending_withdrawals'   => $pendingWithdrawals,
            'tenant_transactions'   => $tenantTransactions,
            'event_withdrawals'     => $eventWithdrawals,
            'ticket_buyers'         => $ticketBuyers,
        ];
    }

    /**
     * Memperbarui status event.
     */
    public function updateEventStatus(int $adminId, int $eventId, string $status): Event
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $event->update(['status' => $status]);
        return $event->fresh();
    }

    /**
     * Mengubah status event (active -> ended -> active).
     */
    public function toggleStatus(int $adminId, int $eventId): Event
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $event->status = ($event->status === 'active') ? 'ended' : 'active';
        $event->save();
        return $event->fresh();
    }

    /**
     * Menghapus event secara permanen jika belum ada transaksi.
     */
    public function deleteEvent(int $adminId, int $eventId): void
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);

        $ticketSales = Transaction::where('id_event', $event->id_event)->count();
        $tenantSales = WalletTransaction::where('meta->event_id', $event->id_event)->count();

        if ($ticketSales > 0 || $tenantSales > 0) {
            throw new Exception('Tidak dapat menghapus event yang sudah memiliki riwayat transaksi tiket atau penjualan tenant.');
        }

        if ($event->banner_image && $event->banner_image !== 'default-banner.jpg'
            && file_exists(public_path('Media/uploads/' . $event->banner_image))) {
            unlink(public_path('Media/uploads/' . $event->banner_image));
        }

        User::where('role', 'tenant')->where('id_event', $event->id_event)->delete();
        WalletTransaction::where('meta->event_id', $event->id_event)->delete();

        $event->delete();
    }

    /**
     * Menambahkan tier tiket baru pada event.
     */
    public function createTier(int $adminId, int $eventId, array $validated): TicketTier
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);

        return TicketTier::create([
            'id_event'        => $event->id_event,
            'tier_name'       => $validated['tier_name'],
            'price'           => $validated['price'],
            'capacity'        => $validated['quota'],
            'remaining_seats' => $validated['quota'],
            'is_unlimited'    => false,
        ]);
    }

    /**
     * Memperbarui data tier tiket event.
     */
    public function updateTier(int $adminId, int $eventId, int $tierId, array $validated): TicketTier
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $tier  = TicketTier::where('id_event', $event->id_event)->findOrFail($tierId);

        $sold = Transaction::where('ticket_tier_id', $tier->id_tier)->where('payment_status', 'success')->count();

        if ($validated['quota'] < $sold) {
            throw new Exception('Kuota tidak boleh kurang dari jumlah tiket yang sudah terjual (' . $sold . ').');
        }

        $tier->update([
            'tier_name'       => $validated['tier_name'],
            'price'           => $validated['price'],
            'capacity'        => $validated['quota'],
            'remaining_seats' => $validated['quota'] - $sold,
        ]);

        return $tier->fresh();
    }

    /**
     * Menghapus tier tiket event jika belum ada penjualan.
     */
    public function deleteTier(int $adminId, int $eventId, int $tierId): void
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $tier  = TicketTier::where('id_event', $event->id_event)->findOrFail($tierId);

        $sold = Transaction::where('ticket_tier_id', $tier->id_tier)->whereIn('payment_status', ['success', 'pending'])->count();

        if ($sold > 0) {
            throw new Exception('Tidak dapat menghapus tier yang sudah memiliki transaksi.');
        }

        $tier->delete();
    }

    /**
     * Membuat akun tenant baru pada event.
     */
    public function createTenant(int $adminId, int $eventId, array $validated): User
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);

        return User::create([
            'full_name'      => $validated['full_name'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'role'           => 'tenant',
            'id_event'       => $event->id_event,
            'wallet_balance' => 0,
        ]);
    }

    /**
     * Memperbarui akun tenant pada event.
     */
    public function updateTenant(int $adminId, int $eventId, int $tenantId, array $validated): void
    {
        $event  = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenantId);

        $tenant->full_name = $validated['full_name'];
        $tenant->email     = $validated['email'];
        if (!empty($validated['password'])) {
            $tenant->password = Hash::make($validated['password']);
        }
        $tenant->save();
    }

    /**
     * Menghapus akun tenant pada event jika belum ada riwayat transaksi penjualan.
     */
    public function deleteTenant(int $adminId, int $eventId, int $tenantId): void
    {
        $event  = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenantId);

        $salesCount = WalletTransaction::where('meta->tenant_id', $tenant->id_user)->count();

        if ($salesCount > 0) {
            throw new Exception('Tidak dapat menghapus tenant yang sudah memiliki riwayat transaksi penjualan.');
        }

        WalletTransaction::where('type', 'tenant_revenue')
            ->where('meta->tenant_id', $tenant->id_user)
            ->delete();

        $tenant->delete();
    }

    /**
     * Menyetujui penarikan (withdrawal) oleh tenant.
     */
    public function approveWithdrawal(int $adminId, int $eventId, int $withdrawalId): void
    {
        Event::where('id_admin', $adminId)->findOrFail($eventId);

        DB::beginTransaction();
        try {
            $withdrawal = WalletTransaction::where('id', $withdrawalId)
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
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Mengajukan penarikan pendapatan event oleh admin ke superadmin.
     */
    public function withdrawEvent(User $admin, int $eventId, array $validated): array
    {
        $event = Event::with('ticketTiers.attendees')->where('id_admin', $admin->id_user)->findOrFail($eventId);

        $endDateTime = Carbon::parse($event->end_date->format('Y-m-d') . ' ' . $event->end_time, 'Asia/Makassar');
        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            throw new Exception('Event belum berakhir.');
        }

        $adminId = $admin->id_user;

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
            throw new Exception('Selesaikan semua penarikan Tenant terlebih dahulu!');
        }

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
            throw new Exception('Tidak ada pendapatan bersih yang bisa ditarik.');
        }

        $requestedAmount = (float) $validated['amount'];
        if ($requestedAmount > $sisaBisaDitarik) {
            throw new Exception('Jumlah melebihi sisa pendapatan bersih (Rp ' . number_format($sisaBisaDitarik, 0, ',', '.') . ').');
        }

        return DB::transaction(function () use ($adminId, $event, $requestedAmount, $netIncome, $platformFee, $feePercent, $validated, $sisaBisaDitarik) {
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
                    'bank_name'           => $validated['bank_name'],
                    'account_number'      => $validated['account_number'],
                    'net_income'          => $netIncome,
                    'platform_fee'        => $platformFee,
                    'fee_percent'         => $feePercent,
                ],
            ]);

            return [
                'requested_amount'  => $requestedAmount,
                'remaining_balance' => $sisaBisaDitarik - $requestedAmount,
            ];
        });
    }

    /**
     * Memperbarui status check-in peserta.
     */
    public function toggleCheckIn(int $adminId, int $eventId, int $transactionId): Transaction
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)->findOrFail($transactionId);

        $isUsedNow = !$transaction->is_used;

        $transaction->update([
            'is_used'    => $isUsedNow,
            'scanned_at' => $isUsedNow ? now() : null,
        ]);

        Attendee::where('ticket_code', $transaction->order_id)
            ->update(['status' => $isUsedNow ? 'checked_in' : 'approved']);

        return $transaction->fresh();
    }

    /**
     * Menyetujui peserta yang membutuhkan persetujuan (need_approval).
     */
    public function approveAttendee(int $adminId, int $eventId, int $transactionId): void
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)->findOrFail($transactionId);
        $attendee = Attendee::where('ticket_code', $transaction->order_id)->first();

        if (!$attendee || $attendee->status !== 'need_approval') {
            throw new Exception('Status peserta tidak valid untuk disetujui.');
        }

        DB::beginTransaction();
        try {
            $attendee->update(['status' => 'approved']);
            $transaction->update(['payment_status' => 'success']);

            $walletTx = WalletTransaction::where('order_id', $transaction->order_id)
                                         ->where('type', 'ticket_purchase')
                                         ->first();
            if ($walletTx) {
                $walletTx->update(['status' => 'success']);
            }

            $transaction->load(['user', 'event', 'ticketTier']);
            try {
                Mail::to($transaction->user->email)->send(new ETicketMail($transaction));
            } catch (Exception $e) {
                Log::error('Gagal kirim ETicket setelah approve: ' . $e->getMessage());
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Approve Attendee Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Menolak peserta dan melakukan refund saldo ke dompet pembeli.
     */
    public function rejectAttendee(int $adminId, int $eventId, int $transactionId): void
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)->findOrFail($transactionId);
        $attendee = Attendee::where('ticket_code', $transaction->order_id)->first();

        if (!$attendee || $attendee->status !== 'need_approval') {
            throw new Exception('Status peserta tidak valid untuk ditolak.');
        }

        DB::beginTransaction();
        try {
            $transaction->update(['payment_status' => 'failed']);

            $walletTx = WalletTransaction::where('order_id', $transaction->order_id)
                                         ->where('type', 'ticket_purchase')
                                         ->first();
            if ($walletTx) {
                $walletTx->update(['status' => 'failed']);
            }

            $user = User::find($transaction->user_id);
            if ($user) {
                $user->increment('wallet_balance', $transaction->gross_amount);

                WalletTransaction::create([
                    'user_id'  => $user->id_user,
                    'order_id' => 'REFUND-' . time() . '-' . rand(100, 999),
                    'type'     => 'topup',
                    'amount'   => $transaction->gross_amount,
                    'status'   => 'success',
                    'meta'     => [
                        'note'        => 'Refund penolakan peserta event',
                        'event_title' => $event->title,
                    ],
                ]);
            }

            $attendee->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Reject Attendee Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Melakukan refund tiket 93% kepada pembeli atas permintaan admin.
     */
    public function refundTicket(int $adminId, int $eventId, int $transactionId): array
    {
        $event = Event::where('id_admin', $adminId)->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')
            ->findOrFail($transactionId);

        return DB::transaction(function () use ($event, $transaction) {
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

                $buyer->notify(new TicketRefundNotification(
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

            return [
                'refund_amount'   => $refundAmount,
                'original_amount' => $grossAmount,
                'buyer_name'      => $buyer?->full_name,
            ];
        });
    }
}
