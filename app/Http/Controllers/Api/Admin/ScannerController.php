<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * API Admin\ScannerController
 * ─────────────────────────────────────────────────────────────────────────────
 * QR Code Scanner untuk check-in peserta event.
 * Logika identik dengan ScannerController Blade (sudah return JSON).
 *
 * Endpoints:
 *   POST /api/admin/scanner/verify → Verifikasi QR + check-in peserta
 *   POST /api/admin/scanner/approve → (Placeholder untuk 2-step approval)
 */
class ScannerController extends Controller
{
    /**
     * Verifikasi QR Code + eksekusi Check-in (single-step).
     */
    public function verifyTicket(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => ['required', 'string'],
        ]);

        $rawInput = trim($request->input('order_id'));

        // Parsing URL: Jika isi QR Code adalah URL utuh, ambil segment terakhir
        if (strpos($rawInput, '/') !== false) {
            $segments = explode('/', parse_url($rawInput, PHP_URL_PATH));
            $orderId  = end($segments);
        } else {
            $orderId = $rawInput;
        }

        Log::info("[API Scanner] Proses Scan QR: Raw '{$rawInput}' -> Parsed '{$orderId}'");

        // 1. Cari tiket berdasarkan order_id
        $transaction = Transaction::with(['user', 'event', 'ticketTier'])
            ->where('order_id', $orderId)
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket Tidak Ditemukan / Palsu!',
            ]);
        }

        // 2. Cek apakah tiket milik event penyelenggara ini
        if ($transaction->event->id_admin != auth()->user()->id_user) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak valid untuk event ini!',
            ]);
        }

        // 3. Cek status pembayaran
        if ($transaction->payment_status !== 'success') {
            return response()->json([
                'success' => false,
                'message' => 'Tiket belum lunas / pembayaran gagal!',
            ]);
        }

        // 4. Cek apakah sudah digunakan
        if ($transaction->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket sudah digunakan sebelumnya!',
                'scanned_at' => $transaction->scanned_at
                    ? Carbon::parse($transaction->scanned_at)->translatedFormat('d F Y, H:i') . ' WIB'
                    : null,
            ]);
        }

        // 5. Check-in: update is_used dan scanned_at
        $now = now();
        $transaction->update([
            'is_used'    => true,
            'scanned_at' => $now,
        ]);

        $scannedAtFormatted = $now->translatedFormat('d F Y, H:i') . ' WIB';

        $profilePictureUrl = !empty($transaction->user->profile_picture)
            ? asset('Media/uploads/' . $transaction->user->profile_picture)
            : 'https://ui-avatars.com/api/?name=' . urlencode($transaction->user->full_name ?? 'User')
              . '&background=4ade80&color=052e16&size=200&bold=true';

        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil! Peserta diperbolehkan masuk.',
            'data'    => [
                'order_id'            => $transaction->order_id,
                'holder_name'         => $transaction->user->full_name ?? '—',
                'holder_email'        => $transaction->user->email ?? '—',
                'holder_gender'       => $transaction->user->gender ?? '—',
                'profile_picture_url' => $profilePictureUrl,
                'event_name'          => $transaction->event->title ?? '—',
                'tier_name'           => $transaction->ticketTier->tier_name ?? '—',
                'gross_amount'        => 'Rp ' . number_format($transaction->gross_amount, 0, ',', '.'),
                'scanned_at'          => $scannedAtFormatted,
            ],
        ]);
    }

    /**
     * Approve check-in (untuk skenario 2-step verify → approve).
     * Saat ini ScannerController lama langsung approve di verifyTicket,
     * endpoint ini tersedia untuk kompatibilitas rute masa depan.
     */
    public function approveTicket(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => ['required', 'string'],
        ]);

        $transaction = Transaction::where('order_id', $request->order_id)->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan.'], 404);
        }

        if ($transaction->is_used) {
            return response()->json(['success' => false, 'message' => 'Tiket sudah digunakan.'], 409);
        }

        $transaction->update(['is_used' => true, 'scanned_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in diapprove.',
        ]);
    }
}
