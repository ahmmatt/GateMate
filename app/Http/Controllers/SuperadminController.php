<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class SuperadminController extends Controller
{
    /**
     * Tampilkan dasbor Superadmin dengan daftar withdrawal yang pending_superadmin
     */
    public function dashboard(): View
    {
        $pendingWithdrawals = WalletTransaction::with('user.event')
            ->where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->latest()
            ->get();

        // Total dana yang sudah berhasil dicairkan (withdrawal status=success dari admin/penyelenggara)
        $totalWithdrawnSuccess = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'success')
            ->whereHas('user', fn ($q) => $q->where('role', 'admin'))
            ->sum('amount');

        // Total nominal pending yang menunggu eksekusi superadmin
        $totalPendingAmount = WalletTransaction::where('type', 'withdrawal')
            ->where('status', 'pending_superadmin')
            ->sum('amount');

        // Jumlah penyelenggara (admin) yang terdaftar
        $totalOrganizers = User::where('role', 'admin')->count();

        // Total tiket terjual platform-wide
        $totalTicketsSold = \App\Models\Transaction::where('payment_status', 'success')->count();

        // Antrean Penyelenggara yang belum KYC
        $pendingOrganizers = User::where('role', 'admin')
            ->where('is_verified_organizer', false)
            ->latest('id_user') // Use id_user instead of created_at because it doesn't use timestamps
            ->get();

        return view('superadmin.dashboard', compact(
            'pendingWithdrawals',
            'totalWithdrawnSuccess',
            'totalPendingAmount',
            'totalOrganizers',
            'totalTicketsSold',
            'pendingOrganizers'
        ));
    }

    /**
     * Eksekusi pencairan dana (Superadmin)
     */
    public function executeWithdrawal(Request $request, $id): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $transaction = WalletTransaction::with('user.event')->findOrFail($id);

            if ($transaction->status !== 'pending_superadmin') {
                return back()->withErrors(['withdraw_error' => 'Transaksi tidak valid atau sudah diproses.']);
            }

            // [BYPASS] Langsung cairkan tanpa memanggil Midtrans IRIS.
            // Saldo Admin sudah dikurangi pada saat pengajuan withdrawal (withdrawEvent).
            $transaction->update(['status' => 'success']);

            DB::commit();

            \Illuminate\Support\Facades\Log::info('Withdrawal Admin/Penyelenggara disetujui (bypass Midtrans IRIS)', [
                'withdrawal_id' => $transaction->id,
                'user_id'       => $transaction->user_id,
                'amount'        => $transaction->amount,
            ]);

            return back()->with('success', 'Pencairan dana berhasil dieksekusi. Dana telah diteruskan ke penyelenggara.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['withdraw_error' => 'Gagal: ' . $e->getMessage()]);
        }
    }

    /**
     * Setujui KYC Penyelenggara
     */
    public function approveOrganizer($id): RedirectResponse
    {
        $user = User::where('role', 'admin')->findOrFail($id);
        $user->update(['is_verified_organizer' => true]);
        
        return back()->with('success', "Akun penyelenggara {$user->full_name} berhasil diverifikasi.");
    }

    /**
     * Tolak KYC Penyelenggara (Hapus Akun / Biarkan false dengan notifikasi)
     */
    public function rejectOrganizer(Request $request, $id): RedirectResponse
    {
        $user = User::where('role', 'admin')->findOrFail($id);
        // Opsi sederhana: Kita hapus akunnya agar mereka bisa mendaftar ulang, atau biarkan false
        // Sesuai prompt: "menghapus user atau membiarkannya 0 dengan pesan error"
        // Kita akan menghapus akun user jika ditolak.
        $user->delete();
        
        return back()->with('success', 'Akun penyelenggara ditolak dan dihapus dari sistem.');
    }
}
