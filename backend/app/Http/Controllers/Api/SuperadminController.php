<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SuperadminService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

/**
 * API SuperadminController
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel Superadmin: dashboard stats, kelola organizer, dan eksekusi penarikan.
 * Seluruh logika bisnis didelegasikan ke SuperadminService.
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
    use ApiResponse;

    protected SuperadminService $superadminService;

    public function __construct(SuperadminService $superadminService)
    {
        $this->superadminService = $superadminService;
    }

    /**
     * GET /api/superadmin/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $stats = $this->superadminService->getDashboardStats();

        return response()->json([
            'success' => true,
            'data'    => $stats,
        ]);
    }

    /**
     * GET /api/superadmin/withdrawals
     */
    public function pendingWithdrawals(Request $request): JsonResponse
    {
        $withdrawals = $this->superadminService->getPendingWithdrawals($request->query('status'));

        return response()->json([
            'success' => true,
            'data'    => $withdrawals,
            'total'   => $withdrawals->count(),
        ]);
    }

    /**
     * POST /api/superadmin/withdrawals/{id}/execute
     */
    public function executeWithdrawal(Request $request, int $id): JsonResponse
    {
        try {
            $file = $request->hasFile('transfer_proof') ? $request->file('transfer_proof') : null;
            $data = $this->superadminService->executeWithdrawal($id, $file);

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal berhasil dieksekusi. Dana telah dikirim ke penyelenggara.',
                'data'    => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengeksekusi withdrawal: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/superadmin/organizers
     */
    public function organizers(Request $request): JsonResponse
    {
        $pendingOnly = ($request->query('pending') === 'true');
        $organizers  = $this->superadminService->getOrganizers($pendingOnly);

        return response()->json([
            'success' => true,
            'data'    => $organizers,
        ]);
    }

    /**
     * POST /api/superadmin/organizers/{id}/approve
     */
    public function approveOrganizer(int $id): JsonResponse
    {
        try {
            $organizer = $this->superadminService->approveOrganizer($id);

            return response()->json([
                'success' => true,
                'message' => 'Organizer "' . $organizer->organization_name . '" berhasil disetujui! Email berisi password telah dikirimkan ke calon organizer.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/superadmin/organizers/{id}/reject
     */
    public function rejectOrganizer(Request $request, int $id): JsonResponse
    {
        $this->superadminService->rejectOrganizer($id);

        return response()->json([
            'success' => true,
            'message' => 'Organizer berhasil ditolak dan dihapus dari sistem.',
        ]);
    }
}
