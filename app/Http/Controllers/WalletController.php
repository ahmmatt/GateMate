<?php

namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;

class WalletController extends Controller
{
    /**
     * Tampilkan halaman Wallet Dashboard
     */
    public function index()
    {
        $user = Auth::user();
        $transactions = $user->walletTransactions()->latest()->get();

        return view('wallet.index', compact('user', 'transactions'));
    }

    /**
     * Proses Top-up Saldo Wallet via Midtrans Snap
     */
    public function topup(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'amount' => ['required', 'numeric', 'min:10000']
            ]);

            $amount = (int) $request->amount;
            $user = Auth::user();

            // Generate Order ID khusus Topup
            $orderId = 'TOPUP-' . time() . '-' . rand(100, 999);

            // Simpan transaksi pending ke database
            $transaction = WalletTransaction::create([
                'user_id' => $user->id_user,
                'order_id' => $orderId,
                'type' => 'topup',
                'amount' => $amount,
                'status' => 'pending'
            ]);

            // Konfigurasi Midtrans
            Config::$serverKey    = config('services.midtrans.server_key');
            Config::$isProduction = false;
            Config::$isSanitized  = true;
            Config::$is3ds        = true;

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $amount, 
                ],
                'customer_details' => [
                    'first_name' => $user->full_name ?? 'User',
                    'email'      => $user->email ?? 'user@gatemate.com',
                ],
                'item_details' => [
                    [
                        'id' => 'TOPUP',
                        'price' => $amount,
                        'quantity' => 1,
                        'name' => 'Top-up Saldo GateMate'
                    ]
                ]
            ];

            // Request Snap Token
            $snapToken = Snap::getSnapToken($params);

            Log::info("Topup Snap Token didapat:", ['order_id' => $orderId, 'token' => $snapToken]);

            return response()->json([
                'snap_token' => $snapToken,
                'order_id' => $orderId
            ]);

        } catch (\Exception $e) {
            Log::error("Wallet Topup Error: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal memproses topup: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Halaman Scanner QR Tenant (pembeli scan QRIS tenant)
     */
    public function scanQr()
    {
        $user = Auth::user();
        return view('wallet.scan', compact('user'));
    }

    /**
     * Halaman Konfirmasi Pembayaran ke Tenant
     */
    public function showPayForm(Request $request, $tenantId)
    {
        $tenant = User::where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        $buyer  = Auth::user();
        $amount = $request->query('amount') ? (int) $request->query('amount') : null;

        return view('wallet.pay', compact('tenant', 'buyer', 'amount'));
    }

    /**
     * Proses Pembayaran P2P dari Pembeli ke Tenant
     */
    public function processPayment(Request $request, $tenantId)
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
        ]);

        $amount = (int) $request->amount;
        $buyer  = Auth::user();

        $tenant = User::with('event')->where('id_user', $tenantId)
            ->where('role', 'tenant')
            ->firstOrFail();

        // Validasi saldo pembeli
        if ($buyer->wallet_balance < $amount) {
            return back()->withErrors(['amount' => 'Saldo Anda tidak mencukupi untuk transaksi ini.']);
        }

        DB::beginTransaction();
        try {
            $orderId = 'PAY-' . time() . '-' . rand(100, 999);

            // Kurangi saldo pembeli
            $buyer->decrement('wallet_balance', $amount);

            // 1. Dapatkan Penyelenggara (Admin)
            if (!$tenant->event || !$tenant->event->id_admin) {
                throw new \Exception('Tenant ini tidak terikat dengan event yang valid.');
            }
            $admin = User::findOrFail($tenant->event->id_admin);

            // 2. Tambah saldo ke Penyelenggara, bukan ke tenant
            $admin->increment('wallet_balance', $amount);

            // 3. Catat rekam jejak pengeluaran (pembeli)
            WalletTransaction::create([
                'user_id'      => $buyer->id_user,
                'reference_id' => $tenant->id_user,
                'order_id'     => $orderId . '-OUT',
                'type'         => 'payment',
                'amount'       => $amount,
                'status'       => 'success',
            ]);

            // 4. Catat rekam jejak pemasukan (tenant_revenue) atas nama Penyelenggara
            WalletTransaction::create([
                'user_id'      => $admin->id_user,
                'reference_id' => $buyer->id_user,
                'order_id'     => $orderId . '-IN',
                'type'         => 'tenant_revenue',
                'amount'       => $amount,
                'status'       => 'success',
                'meta'         => [
                    'tenant_id'   => $tenant->id_user,
                    'tenant_name' => $tenant->full_name,
                    'event_id'    => $tenant->event->id_event,
                ]
            ]);

            DB::commit();

            Log::info('P2P Payment sukses (Routed to Admin)', [
                'buyer_id'  => $buyer->id_user,
                'tenant_id' => $tenant->id_user,
                'admin_id'  => $admin->id_user,
                'amount'    => $amount,
                'order_id'  => $orderId,
            ]);

            return redirect()->route('wallet.index')
                ->with('success', 'Pembayaran Rp ' . number_format($amount, 0, ',', '.') . ' ke ' . $tenant->full_name . ' berhasil!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Payment Error: ' . $e->getMessage());
            return back()->withErrors(['amount' => 'Gagal memproses pembayaran: ' . $e->getMessage()]);
        }
    }
}
