<?php

namespace App\Http\Controllers;

use App\Models\TenantMenu;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TenantController extends Controller
{
    /**
     * Halaman Dashboard POS Kasir Tenant
     */
    public function dashboard()
    {
        $tenant       = Auth::user();
        $menus        = $tenant->tenantMenus()->orderBy('item_name')->get();
        
        // Ambil transaksi penjualan (tenant_revenue) yang dicatat di akun Admin tapi milik tenant ini
        $salesTransactions = WalletTransaction::where('type', 'tenant_revenue')
            ->where('meta->tenant_id', $tenant->id_user)
            ->get();
            
        // Ambil transaksi penarikan tenant
        $wdTransactions = WalletTransaction::where('user_id', $tenant->id_user)
            ->where('type', 'withdrawal')
            ->get();

        // Gabungkan untuk history view
        $transactions = $salesTransactions->concat($wdTransactions)->sortByDesc('created_at')->take(20);

        // Statistik singkat
        $totalEarned  = $salesTransactions->sum('amount');
        $pendingWd    = $wdTransactions->whereIn('status', ['pending', 'pending_admin'])->sum('amount');
        $successWd    = $wdTransactions->where('status', 'success')->sum('amount');
        
        // Dynamic balance
        $availableBalance = $totalEarned - $pendingWd - $successWd;

        // Cek status event
        $event = \App\Models\Event::find($tenant->id_event);
        
        $isEventEnded = false;
        if ($event) {
            $endDate = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
            $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');
            $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);
        }

        return view('tenant.dashboard', compact('tenant', 'menus', 'transactions', 'totalEarned', 'pendingWd', 'availableBalance', 'isEventEnded'));
    }

    /**
     * Simpan menu baru ke database
     */
    public function storeMenu(Request $request)
    {
        $request->validate([
            'item_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'integer', 'min:100'],
        ]);

        TenantMenu::create([
            'user_id'   => Auth::user()->id_user,
            'item_name' => $request->item_name,
            'price'     => (int) $request->price,
        ]);

        return back()->with('menu_success', 'Menu "' . $request->item_name . '" berhasil ditambahkan!');
    }

    /**
     * Proses Permintaan Penarikan Dana Tenant
     */
    public function withdraw(Request $request)
    {
        $request->validate([
            'amount'         => ['required', 'numeric', 'min:10000'],
            'bank_name'      => ['required', 'string', 'max:50'],
            'account_number' => ['required', 'string', 'max:30'],
        ]);

        $tenant = Auth::user();
        $amount = (int) $request->amount;

        $event = \App\Models\Event::find($tenant->id_event);
        if (!$event) {
            return back()->withErrors(['wd_amount' => 'Event tidak ditemukan.']);
        }

        $endDate = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
        $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');

        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            return back()->withErrors(['wd_amount' => 'Event belum berakhir. Anda belum bisa menarik dana.']);
        }

        // Hitung dynamic balance
        $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $tenant->id_user)->sum('amount');
        $wds   = WalletTransaction::where('user_id', $tenant->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending', 'pending_admin', 'success'])->sum('amount');
        $availableBalance = $sales - $wds;

        if ($availableBalance < $amount) {
            return back()->withErrors(['wd_amount' => 'Saldo tidak mencukupi untuk penarikan ini. Saldo maksimal Anda: Rp ' . number_format($availableBalance, 0, ',', '.')]);
        }

        DB::beginTransaction();
        try {
            WalletTransaction::create([
                'user_id'  => $tenant->id_user,
                'order_id' => 'WD-' . time() . '-' . rand(100, 999),
                'type'     => 'withdrawal',
                'amount'   => $amount,
                'status'   => 'pending_admin',
                'meta'     => [
                    'bank_name'      => $request->bank_name,
                    'account_number' => $request->account_number,
                ],
            ]);

            DB::commit();
            Log::info('Withdrawal request dibuat', ['tenant_id' => $tenant->id_user, 'amount' => $amount]);

            return back()->with('wd_success', 'Permintaan penarikan Rp ' . number_format($amount, 0, ',', '.') . ' sedang diproses Admin Penyelenggara.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Withdrawal Error: ' . $e->getMessage());
            return back()->withErrors(['wd_amount' => 'Gagal mengajukan penarikan: ' . $e->getMessage()]);
        }
    }
}
