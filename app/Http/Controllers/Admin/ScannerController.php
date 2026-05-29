<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ScannerController extends Controller
{
    /**
     * Tampilkan halaman Scanner QR Code untuk panitia.
     */
    public function index()
    {
        return view('admin.scanner');
    }

    /**
     * verifyTicket()  ──  READ-ONLY Verification (Step 1 of 2)
     * ─────────────────────────────────────────────────────────────────────────
     * Menerima order_id dari scan QR, memvalidasi transaksi, dan mengembalikan
     * data lengkap termasuk URL foto profil pemesan.
     *
     * TIDAK melakukan update ke database — hanya baca.
     *
     * Validasi berjenjang:
     *  1. Transaksi tidak ditemukan   → 404 not_found
     *  2. payment_status !== 'success' → 402 not_paid
     *  3. is_used === true             → 409 already_used (+ waktu scan terakhir)
     *  4. Semua OK                    → 200 valid (baca saja, belum check-in)
     */
    public function verifyTicket(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => ['required', 'string'],
        ]);

        $rawInput = trim($request->input('order_id'));
        
        // Parsing URL: Jika isi QR Code adalah URL utuh (contoh: https://app.com/scan/TICKET123), ambil belakangnya saja
        if (strpos($rawInput, '/') !== false) {
            $segments = explode('/', parse_url($rawInput, PHP_URL_PATH));
            $orderId = end($segments);
        } else {
            $orderId = $rawInput;
        }

        Log::info("[Scanner] Proses Scan QR: Raw '{$rawInput}' -> Parsed '{$orderId}'");

        // 1. Cari tiket murni berdasarkan order_id QR
        $transaction = Transaction::with(['user', 'event', 'ticketTier'])
            ->where('order_id', $orderId)
            ->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Tiket Tidak Ditemukan / Palsu!']);
        }

        // 2. Cek apakah relasi id_event cocok dengan event milik admin ini
        // Asumsi admin hanya boleh men-scan event miliknya
        if ($transaction->event->id_admin != auth()->user()->id_user) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak valid untuk event ini!']);
        }

        // 3. Cek status pembayaran tiket
        if ($transaction->payment_status !== 'success') {
            return response()->json(['success' => false, 'message' => 'Tiket belum lunas / pembayaran gagal!']);
        }

        // 4. Cek apakah tiket sudah di-scan sebelumnya
        if ($transaction->is_used) {
            return response()->json(['success' => false, 'message' => 'Tiket sudah digunakan sebelumnya!']);
        }

        // 5. Cek tanggal/waktu event (Validasi Hari H)
        if (now()->lessThan($transaction->event->date)) {
            return response()->json(['success' => false, 'message' => 'Check-in ditolak: Event belum dimulai!']);
        }

        // 6. Jika semua lolos, ubah status menjadi checked_in
        $now = now();
        $transaction->update([
            'is_used' => true,
            'scanned_at' => $now,
        ]);

        // (Opsional) Jika sistem menggunakan model Attendee secara terpisah, update juga status attendee
        // DB::table('attendees')->where('order_id', $orderId)->update(['status' => 'checked_in']);
        // Berhubung di app ini relasinya memakai $transaction->is_used, kita update itu saja.

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
            ]
        ]);
    }
}
