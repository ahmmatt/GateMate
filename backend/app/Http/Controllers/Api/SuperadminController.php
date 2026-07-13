<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SuperadminService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;
use Illuminate\Support\Facades\DB;
use App\Models\WalletTransaction;
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
     * Helper for logging audit
     */
    private function logAudit(string $action, string $targetType, ?string $targetName = null, ?array $details = null)
    {
        $adminId = auth()->id() ?? User::where('role', 'superadmin')->value('id_user') ?? 3;
        
        \App\Models\AuditLog::create([
            'admin_id'    => $adminId,
            'action'      => $action,
            'target_type' => $targetType,
            'target_name' => $targetName,
            'details'     => $details,
        ]);
    }

    /**
     * GET /api/superadmin/audit-logs
     */
    public function auditLogs(): JsonResponse
    {
        $logs = \App\Models\AuditLog::with('admin')->orderByDesc('created_at')->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'date' => $log->created_at->format('d M Y'),
                'time' => $log->created_at->format('H:i'),
                'adminName' => $log->admin ? $log->admin->full_name : 'Unknown',
                'adminInitial' => strtoupper(substr($log->admin ? $log->admin->full_name : 'U', 0, 2)),
                'adminColor' => 'bg-primary-fixed text-primary',
                'activityText' => $log->action,
                'activityClass' => 'bg-surface-container-low text-secondary border-outline-variant',
                'targetName' => $log->target_name ?? '-',
                'targetSub' => $log->target_type ?? '-',
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $logs,
        ]);
    }

    /**
     * POST /api/superadmin/withdrawals/{id}/execute
     */
    public function executeWithdrawal(Request $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Hanya withdrawal yang statusnya pending_superadmin
            $withdrawal = WalletTransaction::where('id', $id)
                ->where('type', 'withdrawal')
                ->whereIn('status', ['pending_superadmin', 'pending'])
                ->firstOrFail();

            // Asumsi meta berisi info bank (bank_code, account_number, dsb)
            $meta = $withdrawal->meta ?? [];

            // TODO: Integrasi third-party payout (Midtrans IRIS, Xendit, dll)
            // $payoutResponse = PayoutService::createPayout(...)
            // $meta['payout_id'] = $payoutResponse->id;

            // Untuk sementara, kita anggap simulasi berhasil
            $meta['executed_at'] = now()->toDateTimeString();

            $withdrawal->update([
                'status' => 'success',
                'meta'   => $meta,
            ]);

            $this->logAudit('Eksekusi Penarikan Dana', 'Penarikan Dana', 'ID: ' . $withdrawal->id, ['amount' => $withdrawal->amount]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penarikan dana berhasil dieksekusi.',
                'data'    => $withdrawal
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengeksekusi penarikan dana.',
                'error'   => $e->getMessage()
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

            $this->logAudit('Verifikasi Organizer', 'Organizer', $organizer->organization_name ?? $organizer->full_name);

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
        // Temukan user dulu untuk logging nama
        $organizer = User::where('role', 'tenant')->findOrFail($id);
        
        $this->superadminService->rejectOrganizer($id);

        $this->logAudit('Tolak Verifikasi Organizer', 'Organizer', $organizer->organization_name ?? $organizer->full_name);

        return response()->json([
            'success' => true,
            'message' => 'Organizer berhasil ditolak dan dihapus dari sistem.',
        ]);
    }

    /**
     * GET /api/superadmin/organizers/{id}/download-docs
     * Download dokumen organizer (KTP + foto profil) dalam format ZIP.
     */
    public function downloadOrganizerDocs(int $id): StreamedResponse|JsonResponse
    {
        try {
            $organizer = \App\Models\User::where('role', 'admin')->findOrFail($id);

            // Kumpulkan file yang akan di-zip
            $files = [];

            // KTP Document (disimpan di storage/)
            if (!empty($organizer->ktp_document)) {
                $ktpPath = storage_path('app/public/' . $organizer->ktp_document);
                if (file_exists($ktpPath)) {
                    $ext = pathinfo($ktpPath, PATHINFO_EXTENSION);
                    $files[] = [
                        'path'     => $ktpPath,
                        'filename' => 'ktp_document.' . $ext,
                    ];
                }
            }

            // Profile Picture (disimpan di public/Media/uploads/)
            if (!empty($organizer->profile_picture)) {
                $profilePath = public_path('Media/uploads/' . $organizer->profile_picture);
                if (file_exists($profilePath)) {
                    $ext = pathinfo($profilePath, PATHINFO_EXTENSION);
                    $files[] = [
                        'path'     => $profilePath,
                        'filename' => 'foto_profil.' . $ext,
                    ];
                }
            }

            if (empty($files)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada dokumen yang tersedia untuk organizer ini.',
                ], 404);
            }

            // Buat ZIP di temp
            $zipName = 'dokumen_organizer_' . $organizer->id_user . '_' . time() . '.zip';
            $zipPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $zipName;

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new Exception('Gagal membuat file ZIP.');
            }

            // Tambahkan info organizer sebagai README
            $info  = "DOKUMEN ORGANIZER GATEMATE\n";
            $info .= "===========================\n";
            $info .= "Nama        : {$organizer->full_name}\n";
            $info .= "Organisasi  : {$organizer->organization_name}\n";
            $info .= "Email       : {$organizer->email}\n";
            $info .= "Telepon     : {$organizer->phone}\n";
            $info .= "Tgl Daftar  : " . ($organizer->created_at?->format('d M Y') ?? '-') . "\n";
            $info .= "Status      : " . ($organizer->is_verified_organizer ? 'Terverifikasi' : 'Menunggu Verifikasi') . "\n";
            $zip->addFromString('INFO_ORGANIZER.txt', $info);

            foreach ($files as $file) {
                $zip->addFile($file['path'], $file['filename']);
            }

            $zip->close();

            return response()->streamDownload(function () use ($zipPath) {
                readfile($zipPath);
                @unlink($zipPath); // Hapus temp file setelah stream
            }, $zipName, [
                'Content-Type'        => 'application/zip',
                'Content-Disposition' => 'attachment; filename="' . $zipName . '"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Organizer tidak ditemukan.'], 404);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
