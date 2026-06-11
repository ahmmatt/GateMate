<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WalletTransactionResource;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * API SuperadminController
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel Superadmin: dashboard stats, kelola organizer, dan eksekusi penarikan.
 *
 * Endpoints:
 *   GET  /api/superadmin/dashboard                 → Statistik platform
 *   GET  /api/superadmin/withdrawals               → Daftar WD pending
 *   POST /api/superadmin/withdrawals/{id}/execute  → Eksekusi WD
 *   GET  /api/superadmin/organizers                → Daftar organizer (unverified + all)
 *   POST /api/superadmin/organizers/{id}/approve   → Approve organizer
 *   POST /api/superadmin/organizers/{id}/reject    → Reject organizer
 */
class SuperadminController extends Controller
{
    // ── Dashboard ────────────────────────────────────────────────────────────

    public function dashboard(): JsonResponse
    {
        $totalUsers     = User::where('role', 'user')->count();
        $totalOrganizers = User::where('role', 'admin')->where('is_verified_organizer', true)->count();
        $pendingOrgs    = User::where('role', 'admin')->where('is_verified_organizer', false)->count();
        $totalTenants   = User::where('role', 'tenant')->count();
        $totalEvents    = Event::count();
        $activeEvents   = Event::where('status', 'active')->count();
        $totalTickets   = Transaction::where('payment_status', 'success')->count();
        $totalRevenue   = Transaction::where('payment_status', 'success')->sum('gross_amount');

        $feePercent     = (float) config('services.platform.fee_percent', 10);
        $platformFeeTotal = round((float) $totalRevenue * $feePercent / 100, 2);

        $pendingWithdrawals = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->count();
        $pendingWithdrawalsAmount = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->sum('amount');

        // Trend pendapatan platform 6 bulan
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
            $key = \Carbon\Carbon::parse($t->created_at)->format('M Y');
            if (isset($revenueTrend[$key])) {
                $revenueTrend[$key] += (float) $t->gross_amount;
            }
        }

        // Daftar organizer terbaru
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

        return response()->json([
            'success' => true,
            'data'    => [
                'total_users'              => $totalUsers,
                'total_organizers'         => $totalOrganizers,
                'pending_organizers'       => $pendingOrgs,
                'total_tenants'            => $totalTenants,
                'total_events'             => $totalEvents,
                'active_events'            => $activeEvents,
                'total_tickets'            => $totalTickets,
                'total_revenue'            => (float) $totalRevenue,
                'platform_fee_total'       => $platformFeeTotal,
                'fee_percent'              => $feePercent,
                'pending_withdrawals_count' => $pendingWithdrawals,
                'pending_withdrawals_amount' => (float) $pendingWithdrawalsAmount,
                'revenue_trend'            => $revenueTrend,
                'revenue_months'           => array_keys($revenueTrend),
                'revenue_values'           => array_values($revenueTrend),
                'recent_organizers'        => $recentOrganizers,
            ],
        ]);
    }

    // ── Withdrawal Management ─────────────────────────────────────────────────

    public function pendingWithdrawals(): JsonResponse
    {
        $withdrawals = WalletTransaction::with('user')
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($w) => [
                'id'             => $w->id,
                'order_id'       => $w->order_id,
                'amount'         => (float) $w->amount,
                'status'         => $w->status,
                'meta'           => $w->meta,
                'created_at'     => $w->created_at?->toIso8601String(),
                'admin_name'     => $w->user?->full_name,
                'admin_email'    => $w->user?->email,
                'organization'   => $w->user?->organization_name,
            ]);

        return response()->json([
            'success' => true,
            'data'    => $withdrawals,
            'total'   => $withdrawals->count(),
        ]);
    }

    public function executeWithdrawal(Request $request, int $id): JsonResponse
    {
        $withdrawal = WalletTransaction::where('id', $id)
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->firstOrFail();

        DB::beginTransaction();
        try {
            $admin = $withdrawal->user;

            if ($admin) {
                // Simpan bukti transfer (opsional)
                $transferProof = null;
                if ($request->hasFile('transfer_proof')) {
                    $file          = $request->file('transfer_proof');
                    $filename      = 'proof_' . $withdrawal->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('Media/uploads/proofs'), $filename);
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

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal berhasil dieksekusi. Dana telah dikirim ke penyelenggara.',
                'data'    => [
                    'withdrawal_id' => $withdrawal->id,
                    'amount'        => (float) $withdrawal->amount,
                    'admin_name'    => $admin?->full_name,
                    'status'        => 'success',
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengeksekusi withdrawal: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ── Organizer Management ──────────────────────────────────────────────────

    public function organizers(Request $request): JsonResponse
    {
        $query = User::where('role', 'admin');

        if ($request->query('pending') === 'true') {
            $query->where('is_verified_organizer', false);
        }

        $organizers = $query->orderByDesc('created_at')->get()->map(fn ($o) => [
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

        return response()->json([
            'success' => true,
            'data'    => $organizers,
        ]);
    }

    public function approveOrganizer(int $id): JsonResponse
    {
        $organizer = User::where('role', 'admin')->findOrFail($id);

        if ($organizer->is_verified_organizer) {
            return response()->json([
                'success' => false,
                'message' => 'Organizer ini sudah terverifikasi.',
            ], 422);
        }

        $organizer->is_verified_organizer = true;
        $organizer->save();

        Log::info('Superadmin approved organizer', ['organizer_id' => $organizer->id_user]);

        return response()->json([
            'success' => true,
            'message' => 'Organizer "' . $organizer->organization_name . '" berhasil disetujui!',
        ]);
    }

    public function rejectOrganizer(Request $request, int $id): JsonResponse
    {
        $organizer = User::where('role', 'admin')->findOrFail($id);

        $organizer->delete();

        Log::info('Superadmin rejected/deleted organizer', ['organizer_id' => $id]);

        return response()->json([
            'success' => true,
            'message' => 'Organizer berhasil ditolak dan dihapus dari sistem.',
        ]);
    }
}
