<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\TicketTier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    /**
     * Proses pembelian tiket dengan proteksi race condition.
     */
    public function process(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_event' => ['required', 'integer', 'exists:events,id_event'],
            'id_tier'  => ['required', 'integer', 'exists:ticket_tiers,id_tier'],
        ]);

        try {
            DB::transaction(function () use ($validated): void {
                // ── Lock baris tier agar tidak ada race condition ──────────────
                $tier = TicketTier::where('id_tier', $validated['id_tier'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // ── Cek ketersediaan kursi ─────────────────────────────────────
                if ($tier->remaining_seats <= 0) {
                    throw new \RuntimeException('SOLD_OUT');
                }

                // ── Generate kode unik ─────────────────────────────────────────
                $ticketCode = 'TKT-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
                $qrToken    = Str::uuid()->toString();

                // ── Tentukan status berdasarkan harga ──────────────────────────
                $status = $tier->price == 0 ? 'approved' : 'awaiting_payment';

                // ── Simpan data attendee ───────────────────────────────────────
                Attendee::create([
                    'id_user'     => Auth::id(),
                    'id_event'    => $validated['id_event'],
                    'id_tier'     => $validated['id_tier'],
                    'ticket_code' => $ticketCode,
                    'qr_token'    => $qrToken,
                    'status'      => $status,
                ]);

                // ── Kurangi sisa kursi ─────────────────────────────────────────
                $tier->decrement('remaining_seats');
            });

        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'SOLD_OUT') {
                return back()->withErrors(['id_tier' => 'Tiket Habis! Sisa kursi tidak tersedia.']);
            }

            throw $e;
        }

        return redirect()->route('my-tickets')
            ->with('success', 'Tiket berhasil didaftarkan!');
    }
}
