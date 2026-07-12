<?php

namespace App\Services;

use App\Mail\OrganizerApprovedMail;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Exception;

/**
 * SuperadminService
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani seluruh business logic untuk panel Superadmin GateMate:
 * statistik global, penarikan dana organizer/tenant, serta approval verifikasi organizer.
 */
class SuperadminService
{
    /**
     * Mengambil statistik global platform GateMate.
     */
    public function getDashboardStats(): array
    {
        $totalUsers      = User::where('role', 'user')->count();
        $totalOrganizers = User::where('role', 'admin')->where('is_verified_organizer', true)->count();
        $pendingOrgs     = User::where('role', 'admin')->where('is_verified_organizer', false)->count();
        $totalTenants    = User::where('role', 'tenant')->count();
        $totalEvents     = Event::count();
        $activeEvents    = Event::where('status', 'active')->count();
        $totalTickets    = Transaction::where('payment_status', 'success')->count();
        $totalRevenue    = Transaction::where('payment_status', 'success')->sum('gross_amount');

        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $platformFeeTotal = round((float) $totalRevenue * $feePercent / 100, 2);

        $pendingWithdrawals = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->count();
        $pendingWithdrawalsAmount = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->sum('amount');

        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $txRaw = DB::table('transactions')
            ->where('payment_status', 'success')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->select('created_at', 'gross_amount')
            ->get();

        $revenueTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $revenueTrend[now()->subMonths($i)->format('M Y')] = 0;
        }
        foreach ($txRaw as $t) {
            $key = Carbon::parse($t->created_at)->format('M Y');
            if (isset($revenueTrend[$key])) {
                $revenueTrend[$key] += (float) $t->gross_amount;
            }
        }

        $recentOrganizers = User::where('role', 'admin')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($o) => [
                'id'                    => $o->id_user,
                'full_name'             => $o->full_name,
                'organization_name'     => $o->organization_name,
                'email'                 => $o->email,
                'is_verified_organizer' => (bool) $o->is_verified_organizer,
                'created_at'            => $o->created_at?->toIso8601String(),
            ]);

        return [
            'total_users'                => $totalUsers,
            'total_organizers'           => $totalOrganizers,
            'pending_organizers'         => $pendingOrgs,
            'total_tenants'              => $totalTenants,
            'total_events'               => $totalEvents,
            'active_events'              => $activeEvents,
            'total_tickets'              => $totalTickets,
            'total_revenue'              => (float) $totalRevenue,
            'platform_fee_total'         => $platformFeeTotal,
            'fee_percent'                => $feePercent,
            'pending_withdrawals_count'  => $pendingWithdrawals,
            'pending_withdrawals_amount' => (float) $pendingWithdrawalsAmount,
            'revenue_trend'              => $revenueTrend,
            'revenue_months'             => array_keys($revenueTrend),
            'revenue_values'             => array_values($revenueTrend),
            'recent_organizers'          => $recentOrganizers,
        ];
    }

    /**
     * Mengambil daftar penarikan dana yang membutuhkan atau memiliki status tertentu.
     */
    public function getPendingWithdrawals(?string $status): Collection
    {
        $query = WalletTransaction::with(['user.event'])->where('type', 'withdrawal');

        if (!empty($status)) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('created_at')
            ->get()
            ->map(function ($w) {
                $userRole = $w->user?->role;
                $eventName = 'Tidak Diketahui';

                if ($userRole === 'admin') {
                    if (!empty($w->meta['is_global_withdrawal'])) {
                        $eventName = 'Semua Event (Global)';
                    } elseif (!empty($w->meta['event_name'])) {
                        $eventName = $w->meta['event_name'];
                    }
                } elseif ($userRole === 'tenant') {
                    $eventName = $w->user?->event?->title ?? 'Tidak Diketahui';
                }

                return [
                    'id'           => $w->id,
                    'order_id'     => $w->order_id,
                    'amount'       => (float) $w->amount,
                    'status'       => $w->status,
                    'meta'         => $w->meta,
                    'created_at'   => $w->created_at?->toIso8601String(),
                    'user_role'    => $userRole,
                    'event_name'   => $eventName,
                    'admin_name'   => $w->user?->full_name,
                    'admin_email'  => $w->user?->email,
                    'organization' => $w->user?->organization_name,
                ];
            });
    }

    /**
     * Mengeksekusi pencairan withdrawal oleh superadmin.
     */
    public function executeWithdrawal(int $id, ?UploadedFile $transferProofFile): array
    {
        $withdrawal = WalletTransaction::where('id', $id)
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->firstOrFail();

        return DB::transaction(function () use ($withdrawal, $transferProofFile) {
            $admin = $withdrawal->user;

            if ($admin) {
                $transferProof = null;
                if ($transferProofFile) {
                    $filename = 'proof_' . $withdrawal->id . '_' . time() . '.' . $transferProofFile->getClientOriginalExtension();
                    $transferProofFile->move(public_path('Media/uploads/proofs'), $filename);
                    $transferProof = $filename;
                }

                $meta = $withdrawal->meta ?? [];
                if ($transferProof) {
                    $meta['transfer_proof'] = $transferProof;
                }

                $withdrawal->update([
                    'status' => 'success',
                    'meta'   => $meta,
                ]);

                Log::info('Superadmin eksekusi WD', [
                    'wd_id'    => $withdrawal->id,
                    'admin_id' => $admin->id_user,
                    'amount'   => $withdrawal->amount,
                ]);
            }

            return [
                'withdrawal_id' => $withdrawal->id,
                'amount'        => (float) $withdrawal->amount,
                'admin_name'    => $admin?->full_name,
                'status'        => 'success',
            ];
        });
    }

    /**
     * Mengambil daftar organizer (semua atau yang masih pending diverifikasi).
     */
    public function getOrganizers(bool $pendingOnly): Collection
    {
        $query = User::where('role', 'admin');

        if ($pendingOnly) {
            $query->where('is_verified_organizer', false);
        }

        return $query->orderByDesc('created_at')->get()->map(fn ($o) => [
            'id'                    => $o->id_user,
            'full_name'             => $o->full_name,
            'organization_name'     => $o->organization_name,
            'email'                 => $o->email,
            'phone'                 => $o->phone,
            'is_verified_organizer' => (bool) $o->is_verified_organizer,
            'instagram'             => $o->instagram,
            'tiktok_handle'         => $o->tiktok_handle,
            'ktp_document_url'      => $o->ktp_document
                ? asset('storage/' . $o->ktp_document)
                : null,
            'created_at'            => $o->created_at?->toIso8601String(),
        ]);
    }

    /**
     * Menyetujui verifikasi organizer dan mengirimkan password baru via email.
     */
    public function approveOrganizer(int $id): User
    {
        $organizer = User::where('role', 'admin')->findOrFail($id);

        if ($organizer->is_verified_organizer) {
            throw new Exception('Organizer ini sudah terverifikasi.');
        }

        $rawPassword = Str::random(10);
        $organizer->password = Hash::make($rawPassword);
        $organizer->is_verified_organizer = true;
        $organizer->save();

        try {
            Mail::to($organizer->email)->send(new OrganizerApprovedMail($organizer, $rawPassword));
        } catch (Exception $e) {
            Log::error('Gagal mengirim email approve organizer: ' . $e->getMessage());
        }

        Log::info('Superadmin approved organizer', ['organizer_id' => $organizer->id_user]);

        return $organizer;
    }

    /**
     * Menolak dan menghapus pendaftaran organizer yang tidak memenuhi syarat.
     */
    public function rejectOrganizer(int $id): void
    {
        $organizer = User::where('role', 'admin')->findOrFail($id);
        $organizer->delete();

        Log::info('Superadmin rejected/deleted organizer', ['organizer_id' => $id]);
    }
}
