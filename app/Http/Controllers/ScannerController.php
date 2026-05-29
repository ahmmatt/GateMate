<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ScannerController extends Controller
{
    /**
     * Tampilkan halaman scanner.
     * Hanya dapat diakses oleh role 'admin' atau 'super admin'.
     */
    public function index(): View
    {
        $this->authorizeAdminRole();

        return view('scanner');
    }

    /**
     * Validasi QR token dan update status check-in via JSON API.
     * Hanya dapat diakses oleh role 'admin' atau 'super admin'.
     */
    public function validateTicket(Request $request): JsonResponse
    {
        $this->authorizeAdminRole();

        $request->validate([
            'qr_code' => ['required', 'string'],
        ]);

        $rawQr = trim($request->input('qr_code'));
        \Illuminate\Support\Facades\Log::info('RAW QR PAYLOAD: ' . $rawQr);

        // Parsing URL: ambil kode akhir saja (contoh dari http://web.com/scan/TRX-123 -> TRX-123)
        if (strpos($rawQr, '/') !== false) {
            $segments = explode('/', parse_url($rawQr, PHP_URL_PATH));
            $qrCode = end($segments);
        } else {
            $qrCode = $rawQr;
        }
        
        \Illuminate\Support\Facades\Log::info('PARSED QR CODE: ' . $qrCode);

        // ── Cari tiket berdasarkan order_id di tabel transactions ──────────────
        $transaction = \App\Models\Transaction::with(['user', 'ticketTier', 'event'])
            ->where('order_id', $qrCode)
            ->first();

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'status'  => 'error',
                'message' => 'Tiket Tidak Ditemukan / Palsu!',
            ], 404);
        }

        // Cek status pembayaran
        if ($transaction->payment_status !== 'success') {
            return response()->json([
                'success' => false,
                'status'  => 'error',
                'message' => 'Tiket belum lunas / pembayaran gagal!',
            ], 400);
        }

        // Cek waktu event (Fix: Hindari Double time specification jika start_date mengandung 00:00:00)
        $startDate = \Carbon\Carbon::parse($transaction->event->start_date)->format('Y-m-d');
        $validStartTime = \Carbon\Carbon::parse($startDate . ' ' . $transaction->event->start_time, 'Asia/Makassar');
        if (now()->timezone('Asia/Makassar')->lt($validStartTime)) {
            return response()->json([
                'success' => false,
                'status'  => 'error',
                'message' => 'Event belum dimulai!',
            ], 400);
        }

        // ── Cegah double scan ─────────────────────────────────────────────────
        if ($transaction->is_used) {
            $time = $transaction->scanned_at ? $transaction->scanned_at->format('d M Y H:i') : 'Tidak diketahui';
            return response()->json([
                'success' => false,
                'status'  => 'error',
                'message' => "Tiket Sudah Digunakan pada $time!",
            ], 400);
        }

        $user = $transaction->user;
        $avatar = $user->avatar ?? null;
        if ($avatar) {
            $photoUrl = str_starts_with($avatar, 'http') ? $avatar : asset('storage/' . $avatar);
        } else {
            $photoUrl = 'https://ui-avatars.com/api/?name=' . urlencode($user->full_name ?? 'User') . '&background=random&size=128';
        }

        // ── Jangan update status tiket di sini, kembalikan data peserta untuk direview ──
        return response()->json([
            'success' => true,
            'status'  => 'success',
            'message' => 'Tiket Valid. Silakan Approve.',
            'data'    => [
                'ticket_number' => $transaction->order_id,
                'user_name'     => $user->full_name ?? 'Peserta',
                'user_photo'    => $photoUrl,
                'check_in_time' => null, // belum check-in
                'event_name'    => $transaction->event->title ?? '-',
                'tier'          => $transaction->ticketTier->tier_name ?? '-'
            ],
        ], 200);
    }

    /**
     * Approve Check-in Tiket (Langkah 2)
     */
    public function approveCheckIn(Request $request): JsonResponse
    {
        $this->authorizeAdminRole();

        $request->validate([
            'qr_code' => ['required', 'string'],
        ]);

        $qrCode = $request->input('qr_code');

        $transaction = \App\Models\Transaction::where('order_id', $qrCode)->first();

        if (! $transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak valid.'], 404);
        }

        if ($transaction->is_used) {
            return response()->json(['success' => false, 'message' => 'Tiket sudah digunakan.'], 400);
        }

        $transaction->update([
            'is_used' => true,
            'scanned_at' => now('Asia/Makassar')
        ]);

        $user = $transaction->user;
        $avatar = $user->avatar ?? null;
        if ($avatar) {
            $photoUrl = str_starts_with($avatar, 'http') ? $avatar : asset('storage/' . $avatar);
        } else {
            $photoUrl = 'https://ui-avatars.com/api/?name=' . urlencode($user->full_name ?? 'User') . '&background=random&size=128';
        }

        return response()->json([
            'success' => true,
            'status'  => 'success',
            'message' => 'Check-in Berhasil',
            'data'    => [
                'ticket_number' => $transaction->order_id,
                'user_name'     => $user->full_name ?? 'Peserta',
                'user_photo'    => $photoUrl,
                'check_in_time' => now()->format('H:i:s'),
                'event_name'    => $transaction->event->title ?? '-',
                'tier'          => $transaction->ticketTier->tier_name ?? '-'
            ],
        ], 200);
    }

    /**
     * Helper: Batalkan akses jika bukan admin atau super admin.
     */
    private function authorizeAdminRole(): void
    {
        $role = Auth::user()?->role;

        if (! in_array($role, ['admin', 'super admin'])) {
            abort(403, 'Anda tidak memiliki hak akses untuk membuka halaman Scanner.');
        }
    }
}
