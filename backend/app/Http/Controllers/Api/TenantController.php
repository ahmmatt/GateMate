<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreMenuRequest;
use App\Http\Requests\Tenant\TenantWithdrawRequest;
use App\Services\TenantService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * API TenantController
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel POS (Kasir) untuk Tenant dan Manajemen Penarikan Dana Tenant.
 * Seluruh logika bisnis didelegasikan ke TenantService.
 *
 * Endpoints:
 *   GET  /api/tenant/dashboard       → Data dashboard (menu, saldo, transaksi)
 *   POST /api/tenant/menus           → Tambah menu jualan
 *   POST /api/tenant/withdraw        → Ajukan penarikan dana ke admin
 */
class TenantController extends Controller
{
    use ApiResponse;

    protected TenantService $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    /**
     * GET /api/tenant/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $data = $this->tenantService->getDashboardData(Auth::user());

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * POST /api/tenant/menus
     */
    public function storeMenu(StoreMenuRequest $request): JsonResponse
    {
        $menu = $this->tenantService->storeMenu(Auth::user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Menu "' . $menu->item_name . '" berhasil ditambahkan!',
            'data'    => [
                'id'        => $menu->id,
                'item_name' => $menu->item_name,
                'price'     => (float) $menu->price,
            ],
        ], 201);
    }

    /**
     * POST /api/tenant/withdraw
     */
    public function withdraw(TenantWithdrawRequest $request): JsonResponse
    {
        try {
            $withdrawal = $this->tenantService->withdraw(Auth::user(), $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Permintaan penarikan Rp ' . number_format($withdrawal->amount, 0, ',', '.') . ' sedang diproses Admin Penyelenggara.',
                'data'    => [
                    'withdrawal_id' => $withdrawal->id,
                    'amount'        => (float) $withdrawal->amount,
                    'status'        => $withdrawal->status,
                ],
            ]);
        } catch (Exception $e) {
            $status = str_contains($e->getMessage(), 'tidak mencukupi') || str_contains($e->getMessage(), 'belum berakhir') ? 422 : 500;
            if (str_contains($e->getMessage(), 'tidak ditemukan')) {
                $status = 404;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
