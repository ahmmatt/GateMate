<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class EventController extends Controller
{
    /**
     * Daftar semua event milik admin yang sedang login.
     * (Digunakan jika ingin halaman dedicated — saat ini dashboard sudah menampilkan ini)
     */
    public function index(Request $request): View
    {
        $query = Event::with(['ticketTiers', 'attendees'])
            ->where('id_admin', Auth::id());

        if ($request->has('search') && $request->search != '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && in_array($request->status, ['active', 'ended'])) {
            $query->where('status', $request->status);
        }

        $events = $query->orderByDesc('created_at')->paginate(12);
        $events->appends($request->all());

        return view('admin.events.index', compact('events'));
    }

    /**
     * Tampilkan form pembuatan event baru.
     */
    public function create(): View
    {
        return view('admin.events.create');
    }

    /**
     * Simpan event baru beserta tier tiket pertamanya.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'category'       => ['required', 'string', 'max:100'],
            'description'    => ['nullable', 'string'],
            'location_type'  => ['required', 'in:offline,online'],
            'location_details' => ['required', 'string', 'max:500'],
            'venue_name'     => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:100'],
            'maps_link'      => ['nullable', 'string', function ($attribute, $value, $fail) {
                if (strpos($value, '<iframe') === false && strpos($value, '/embed/') === false) {
                    $fail('Tautan lokasi harus berupa kode Iframe (Embed) dari Google Maps.');
                }
            }],
            'start_date'     => ['required', 'date'],
            'start_time'     => ['required', 'date_format:H:i'],
            'end_date'       => ['required', 'date', 'after_or_equal:start_date'],
            'end_time'       => ['required', 'date_format:H:i'],
            'timezone'       => ['nullable', 'string', 'max:50'],
            'capacity_type'  => ['required', 'in:unlimited,limited'],
            'max_capacity'   => ['nullable', 'integer', 'min:1'],
            'seat_assignment'=> ['nullable', 'string', 'in:bebas,pilih'],
            'require_approval' => ['sometimes', 'boolean'],
            'banner_image'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'poster_image'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'custom_questions' => ['nullable', 'array'],
            'custom_questions.*' => ['string', 'max:255'],
            // Tier tiket
            'tier_name'      => ['required', 'string', 'max:100'],
            'price'          => ['required', 'numeric', 'min:0'],
            'is_unlimited'   => ['sometimes', 'boolean'],
            'quota'          => ['required_without:is_unlimited', 'nullable', 'integer', 'min:1'],
        ], [
            'title.required'          => 'Judul event wajib diisi.',
            'category.required'       => 'Kategori event wajib dipilih.',
            'location_type.required'  => 'Tipe lokasi wajib dipilih.',
            'location_details.required' => 'Detail lokasi wajib diisi.',
            'start_date.required'     => 'Tanggal mulai wajib diisi.',
            'start_time.required'     => 'Jam mulai wajib diisi.',
            'end_date.required'       => 'Tanggal selesai wajib diisi.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'end_time.required'       => 'Jam selesai wajib diisi.',
            'tier_name.required'      => 'Nama tier tiket wajib diisi.',
            'price.required'          => 'Harga tiket wajib diisi.',
            'quota.required_without'  => 'Kuota tiket wajib diisi jika tiket tidak unlimited.',
            'banner_image.max'        => 'Ukuran banner maksimal 4MB.',
            'poster_image.max'        => 'Ukuran poster maksimal 4MB.',
        ]);

        // ── Upload banner jika ada ─────────────────────────────────────────────
        $bannerPath = 'default-banner.jpg';
        if ($request->hasFile('banner_image')) {
            $file       = $request->file('banner_image');
            $filename   = uniqid('banner_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('Media/uploads'), $filename);
            $bannerPath = $filename;
        }

        // ── Upload poster (1:1 ideal) jika ada ─────────────────────────────────
        $posterPath = null;
        if ($request->hasFile('poster_image')) {
            $pfile       = $request->file('poster_image');
            $pfilename   = uniqid('poster_') . '.' . $pfile->getClientOriginalExtension();
            $pfile->move(public_path('Media/uploads'), $pfilename);
            $posterPath  = $pfilename;
        }

        DB::transaction(function () use ($validated, $bannerPath, $posterPath): void {
            // Bersihkan array empty dari custom_questions
            $questions = null;
            if (!empty($validated['custom_questions'])) {
                $questions = array_values(array_filter($validated['custom_questions']));
            }

            // ── Buat Event ────────────────────────────────────────────────────
            $event = Event::create([
                'id_admin'         => Auth::id(),
                'title'            => $validated['title'],
                'banner_image'     => $bannerPath,
                'poster_path'      => $posterPath,
                'category'         => $validated['category'],
                'location_type'    => $validated['location_type'],
                'location_details' => $validated['location_details'],
                'venue_name'       => $validated['venue_name'] ?? null,
                'city'             => $validated['city'] ?? null,
                'maps_link'        => $validated['maps_link'] ?? null,
                'start_date'       => $validated['start_date'],
                'start_time'       => $validated['start_time'],
                'end_date'         => $validated['end_date'],
                'end_time'         => $validated['end_time'],
                'timezone'         => $validated['timezone'] ?? 'GMT+08:00',
                'description'      => $validated['description'] ?? null,
                'require_approval' => isset($validated['require_approval']),
                'custom_questions' => $questions,
                'capacity_type'    => $validated['capacity_type'],
                'max_capacity'     => $validated['capacity_type'] === 'limited'
                                        ? ($validated['max_capacity'] ?? null)
                                        : null,
                'seat_assignment'  => $validated['capacity_type'] === 'limited'
                                        ? ($validated['seat_assignment'] ?? null)
                                        : null,
                'status'           => 'active',
            ]);

            $isUnlimited = isset($validated['is_unlimited']);
            $capacity = $isUnlimited ? 0 : ($validated['quota'] ?? 0);

            // ── Buat Tier Tiket Pertama ───────────────────────────────────────
            TicketTier::create([
                'id_event'        => $event->id_event,
                'tier_name'       => $validated['tier_name'],
                'price'           => $validated['price'],
                'capacity'        => $capacity,
                'remaining_seats' => $capacity,
                'is_unlimited'    => $isUnlimited,
            ]);
        });

        return redirect()->route('admin.dashboard')
            ->with('success', 'Event berhasil dibuat! Peserta sudah bisa mendaftar.');
    }

    /**
     * Tampilkan detail event + statistik check-in.
     */
    public function show(int $id): View
    {
        $event = Event::with(['ticketTiers.attendees', 'attendees.user'])
            ->where('id_admin', Auth::id())
            ->findOrFail($id);

        $totalSold  = \App\Models\Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')->count();
        $checkedIn  = \App\Models\Transaction::where('event_id', $event->id_event)
            ->where('is_used', true)->count();
        $ticketRevenue = \App\Models\Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')
            ->sum('gross_amount');

        // ── Kalkulasi Fee ────────────────────────────────────────────────────
        // Rumus:
        //   platformFee     = ticketRevenue × (PLATFORM_FEE_PERCENT / 100)
        //   organizerTicket = ticketRevenue - platformFee
        //   tenantCut       = tenantRevenueSum × (ORGANIZER_TENANT_CUT / 100)
        //   netIncome       = organizerTicket + tenantCut
        $feePercent       = (float) config('services.platform.fee_percent', 10);
        $tenantCutPercent = (float) config('services.platform.organizer_tenant_cut', 100);
        $platformFee      = round($ticketRevenue * $feePercent / 100, 2);
        $organizerTicket  = $ticketRevenue - $platformFee;

        $tenantRevenueSum = \App\Models\WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->sum('amount');
        $tenantCut   = round($tenantRevenueSum * $tenantCutPercent / 100, 2);
        $netIncome   = $organizerTicket + $tenantCut;
        $totalRevenue = $ticketRevenue + $tenantRevenueSum; // gross (untuk display)

        // Sudah berapa yang telah diajukan penarikan (pending atau success)
        $alreadyWithdrawn = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');
        $sisaBisaDitarik = max(0, $netIncome - $alreadyWithdrawn);

        // Riwayat withdrawal penyelenggara untuk event ini
        $eventWithdrawals = WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->latest()
            ->get();

        // Transaksi Tenant untuk event ini
        $tenantTransactions = \App\Models\WalletTransaction::where('user_id', Auth::id())
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->latest()
            ->get();

        // Tenant yang terikat ke event ini
        $tenants = User::where('role', 'tenant')
            ->where('id_event', $event->id_event)
            ->orderBy('full_name')
            ->get();

        // Withdrawal pending dari tenant event ini
        $pendingWithdrawals = WalletTransaction::with('user')
            ->where('type', 'withdrawal')
            ->where('status', 'pending_admin')
            ->whereHas('user', fn ($q) => $q->where('id_event', $event->id_event))
            ->latest()
            ->get();

        // Cek apakah ada tenant yang masih memiliki saldo
        $pendingTenantsBalance = false;
        foreach ($tenants as $t) {
            $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $t->id_user)->sum('amount');
            $wds   = WalletTransaction::where('user_id', $t->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending_admin', 'pending_superadmin', 'success'])->sum('amount');
            if (($sales - $wds) > 0) {
                $pendingTenantsBalance = true;
                break;
            }
        }

        $endDate     = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
        $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');
        $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);

        // Data Pembeli Tiket
        $ticketBuyers = Transaction::with(['user', 'ticketTier'])
            ->where('event_id', $event->id_event)
            ->whereIn('payment_status', ['success', 'pending'])
            ->latest()
            ->get();

        return view('admin.events.show', compact(
            'event', 'totalSold', 'checkedIn', 'totalRevenue', 'ticketRevenue', 'tenantRevenueSum',
            'tenants', 'pendingWithdrawals', 'tenantTransactions', 'pendingTenantsBalance', 'isEventEnded',
            'platformFee', 'feePercent', 'netIncome', 'sisaBisaDitarik', 'alreadyWithdrawn', 'eventWithdrawals',
            'tenantCut', 'ticketBuyers'
        ));
    }

    /**
     * Buat akun Tenant baru dan ikat ke event tertentu.
     */
    public function storeTier(Request $request, int $id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'tier_name' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'quota' => ['required', 'integer', 'min:1'],
        ]);

        TicketTier::create([
            'id_event' => $event->id_event,
            'tier_name' => $validated['tier_name'],
            'price' => $validated['price'],
            'capacity' => $validated['quota'],
            'remaining_seats' => $validated['quota'],
            'is_unlimited' => false,
        ]);

        return redirect()->back()->with('success', 'Tier tiket berhasil ditambahkan!');
    }

    public function updateTier(Request $request, int $event_id, int $tier_id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($event_id);
        $tier = TicketTier::where('id_event', $event->id_event)->findOrFail($tier_id);

        $validated = $request->validate([
            'tier_name' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'quota' => ['required', 'integer', 'min:1'],
        ]);

        $sold = \App\Models\Transaction::where('ticket_tier_id', $tier->id_tier)->where('payment_status', 'success')->count();
        if ($validated['quota'] < $sold) {
            return redirect()->back()->withErrors(['quota' => 'Kuota tidak boleh kurang dari jumlah tiket yang sudah terjual ('.$sold.').']);
        }

        $tier->update([
            'tier_name' => $validated['tier_name'],
            'price' => $validated['price'],
            'capacity' => $validated['quota'],
            'remaining_seats' => $validated['quota'] - $sold,
        ]);

        return redirect()->back()->with('success', 'Tier tiket berhasil diperbarui!');
    }

    public function destroyTier(int $event_id, int $tier_id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($event_id);
        $tier = TicketTier::where('id_event', $event->id_event)->findOrFail($tier_id);

        $sold = \App\Models\Transaction::where('ticket_tier_id', $tier->id_tier)->whereIn('payment_status', ['success', 'pending'])->count();
        if ($sold > 0) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus tier tiket yang sudah memiliki transaksi (terjual/pending).');
        }

        $tier->delete();
        return redirect()->back()->with('success', 'Tier tiket berhasil dihapus!');
    }

    public function storeTenant(Request $request, int $id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'full_name'      => $request->full_name,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'role'           => 'tenant',
            'id_event'       => $event->id_event,
            'wallet_balance' => 0,
        ]);

        return back()->with('tenant_success', 'Akun Tenant "' . $request->full_name . '" berhasil dibuat dan ditautkan ke event ini!');
    }

    public function updateTenant(Request $request, int $event_id, int $tenant_id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($event_id);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenant_id);

        $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'unique:users,email,'.$tenant->id_user.',id_user'],
            'password'  => ['nullable', 'string', 'min:8'],
        ]);

        $tenant->full_name = $request->full_name;
        $tenant->email = $request->email;
        if ($request->filled('password')) {
            $tenant->password = Hash::make($request->password);
        }
        $tenant->save();

        return back()->with('tenant_success', 'Data Tenant berhasil diperbarui!');
    }

    public function destroyTenant(int $event_id, int $tenant_id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($event_id);
        $tenant = User::where('role', 'tenant')->where('id_event', $event->id_event)->findOrFail($tenant_id);

        // Optional: you can check if tenant has sales before deleting, for safety
        $salesCount = \App\Models\WalletTransaction::where('meta->tenant_id', $tenant->id_user)->count();
        if ($salesCount > 0) {
            return back()->with('error', 'Tidak dapat menghapus tenant yang sudah memiliki transaksi penjualan.');
        }

        $tenant->delete();
        return back()->with('tenant_success', 'Tenant berhasil dihapus!');
    }

    /**
     * Approve withdrawal dari tenant yang terikat ke event ini (Lapis 1).
     */
    public function approveWithdrawal(Request $request, int $eventId, int $id): RedirectResponse
    {
        // Verifikasi event milik admin ini
        Event::where('id_admin', Auth::id())->findOrFail($eventId);

        DB::beginTransaction();
        try {
            $withdrawal = WalletTransaction::where('id', $id)
                ->where('type', 'withdrawal')
                ->where('status', 'pending_admin') // Lapis 1 (tenant -> admin)
                ->firstOrFail();

            // [BYPASS] Langsung setujui tanpa memanggil Midtrans IRIS.
            // Saldo tenant bersifat virtual (dihitung dari tenant_revenue - withdrawal),
            // sehingga tidak ada perubahan numerik saldo yang diperlukan.
            $withdrawal->update(['status' => 'success']);

            DB::commit();

            \Illuminate\Support\Facades\Log::info('Withdrawal Tenant disetujui (bypass Midtrans IRIS)', [
                'withdrawal_id' => $withdrawal->id,
                'tenant_id'     => $withdrawal->user_id,
                'amount'        => $withdrawal->amount,
            ]);

            return back()->with('withdraw_approved', 'Penarikan Tenant berhasil disetujui dan dana telah dicairkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Approve Withdrawal Error: ' . $e->getMessage());
            return back()->withErrors(['withdraw_error' => 'Gagal menyetujui penarikan: ' . $e->getMessage()]);
        }
    }

    /**
     * Penyelenggara menarik seluruh dana event ke Superadmin (Lapis 2).
     */
    public function withdrawEvent(Request $request, int $id): RedirectResponse
    {
        // ── Validasi Input Form ───────────────────────────────────────────────
        $request->validate([
            'bank_name'      => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'amount'         => ['required', 'numeric', 'min:1000'],
        ], [
            'bank_name.required'      => 'Nama bank wajib diisi.',
            'account_number.required' => 'Nomor rekening wajib diisi.',
            'amount.required'         => 'Jumlah penarikan wajib diisi.',
            'amount.min'              => 'Jumlah penarikan minimal Rp 1.000.',
        ]);

        $event = Event::with('ticketTiers.attendees')->where('id_admin', Auth::id())->findOrFail($id);

        $endDate     = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
        $endDateTime = \Carbon\Carbon::parse($endDate . ' ' . $event->end_time, 'Asia/Makassar');
        if ($event->status !== 'ended' && now('Asia/Makassar')->lt($endDateTime)) {
            return back()->withErrors(['withdraw_error' => 'Event belum berakhir.']);
        }

        // Syarat: Kewajiban Tenant Selesai
        $pendingWithdrawals = WalletTransaction::whereHas('user', function ($q) use ($event) {
            $q->where('role', 'tenant')->where('id_event', $event->id_event);
        })->where('type', 'withdrawal')->whereIn('status', ['pending', 'pending_admin'])->exists();

        $pendingTenantsBalance = false;
        $tenants = User::where('role', 'tenant')->where('id_event', $event->id_event)->get();
        foreach ($tenants as $t) {
            $sales = WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $t->id_user)->sum('amount');
            $wds   = WalletTransaction::where('user_id', $t->id_user)->where('type', 'withdrawal')->whereIn('status', ['pending_admin', 'pending_superadmin', 'success'])->sum('amount');
            if (($sales - $wds) > 0) { $pendingTenantsBalance = true; break; }
        }
        if ($pendingTenantsBalance || $pendingWithdrawals) {
            return back()->withErrors(['withdraw_error' => 'Gagal: Selesaikan semua penarikan Tenant terlebih dahulu!']);
        }

        $admin = Auth::user();

        // ── Kalkulasi Pendapatan Bersih & Sisa Bisa Ditarik ──────────────────
        $feePercent      = (float) config('services.platform.fee_percent', 10);
        $tenantCutPct    = (float) config('services.platform.organizer_tenant_cut', 100);

        $ticketRevenue   = \App\Models\Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')->sum('gross_amount');
        $platformFee     = round($ticketRevenue * $feePercent / 100, 2);
        $organizerTicket = $ticketRevenue - $platformFee;

        $tenantRevenue   = WalletTransaction::where('user_id', $admin->id_user)
            ->where('type', 'tenant_revenue')
            ->where('meta->event_id', $event->id_event)
            ->sum('amount');
        $tenantCut  = round($tenantRevenue * $tenantCutPct / 100, 2);
        $netIncome  = $organizerTicket + $tenantCut;

        $alreadyWithdrawn = WalletTransaction::where('user_id', $admin->id_user)
            ->where('type', 'withdrawal')
            ->where('meta->event_id', $event->id_event)
            ->whereIn('status', ['pending_superadmin', 'success'])
            ->sum('amount');
        $sisaBisaDitarik = max(0, $netIncome - $alreadyWithdrawn);

        if ($netIncome <= 0) {
            return back()->withErrors(['withdraw_error' => 'Tidak ada pendapatan bersih yang bisa ditarik.']);
        }

        $requestedAmount = (float) $request->amount;
        if ($requestedAmount > $sisaBisaDitarik) {
            return back()->withErrors(['withdraw_error' =>
                'Jumlah melebihi sisa pendapatan bersih yang belum ditarik (Rp ' . number_format($sisaBisaDitarik, 0, ',', '.') . ').']);
        }

        DB::beginTransaction();
        try {
            WalletTransaction::create([
                'user_id'  => $admin->id_user,
                'order_id' => 'EWD-' . $event->id_event . '-' . time(),
                'type'     => 'withdrawal',
                'amount'   => $requestedAmount,
                'status'   => 'pending_superadmin',
                'meta'     => [
                    'event_id'           => $event->id_event,
                    'event_title'        => $event->title,
                    'is_event_withdrawal' => true,
                    'bank_name'          => $request->bank_name,
                    'account_number'     => $request->account_number,
                    'net_income'         => $netIncome,
                    'platform_fee'       => $platformFee,
                    'fee_percent'        => $feePercent,
                ],
            ]);

            DB::commit();

            return back()->with('success',
                'Pengajuan penarikan Rp ' . number_format($requestedAmount, 0, ',', '.') .
                ' ke ' . $request->bank_name . ' (' . $request->account_number . ') berhasil dikirim ke Superadmin.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['withdraw_error' => 'Gagal mengajukan penarikan: ' . $e->getMessage()]);
        }
    }

    /**
     * Form edit event.
     */
    public function edit(int $id): View
    {
        $event = Event::with('ticketTiers')
            ->where('id_admin', Auth::id())
            ->findOrFail($id);

        return view('admin.events.edit', compact('event'));
    }

    /**
     * Update status event (active ↔ ended).
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:active,ended'],
        ]);

        $event->update(['status' => $validated['status']]);

        return back()->with('success', 'Status event berhasil diperbarui.');
    }

    /**
     * Hapus permanen event & data terkait.
     */
    public function destroy(int $id): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);

        if ($event->banner_image && file_exists(public_path('Media/uploads/' . $event->banner_image))) {
            unlink(public_path('Media/uploads/' . $event->banner_image));
        }

        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event berhasil dihapus secara permanen.');
    }

    /**
     * Membalikkan status check-in (Reverse Status) tiket peserta.
     */
    public function toggleCheckIn(Request $request, int $eventId, int $transactionId): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)->findOrFail($transactionId);

        $transaction->update([
            'is_used' => !$transaction->is_used,
            'scanned_at' => !$transaction->is_used ? now() : null
        ]);

        return back()->with('success', 'Status check-in diperbarui');
    }

    /**
     * Eksekusi Refund Tiket (Aturan 93%) dan Hapus/Refund Transaksi.
     */
    public function refundTicket(Request $request, int $eventId, int $transactionId): RedirectResponse
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($eventId);
        $transaction = Transaction::where('event_id', $event->id_event)
            ->where('payment_status', 'success')
            ->findOrFail($transactionId);

        DB::beginTransaction();
        try {
            $grossAmount = (float) $transaction->gross_amount;
            $refundAmount = round($grossAmount * 0.93, 2); // Aturan 93% refund
            $buyer = $transaction->user;

            if ($buyer) {
                // Tambahkan ke saldo wallet pembeli
                $buyer->wallet_balance = (float)$buyer->wallet_balance + $refundAmount;
                $buyer->save();

                // Catat riwayat di WalletTransaction
                WalletTransaction::create([
                    'order_id' => 'RFND-' . strtoupper(uniqid()),
                    'user_id' => $buyer->id_user,
                    'type' => 'ticket_refund',
                    'amount' => $refundAmount,
                    'status' => 'success',
                    'meta' => [
                        'event_title' => $event->title,
                        'ticket_tier' => $transaction->ticketTier->tier_name ?? 'Tiket',
                        'transaction_id' => $transaction->id,
                        'original_amount' => $grossAmount,
                        'refund_percentage' => '93%'
                    ]
                ]);

                // Kirim Notifikasi ke User
                $buyer->notify(new \App\Notifications\TicketRefundNotification(
                    $event->title,
                    $transaction->ticketTier->tier_name ?? 'Tiket',
                    $refundAmount
                ));
            }

            // Kembalikan kuota kursi (jika ada batasan)
            if ($transaction->ticketTier && $transaction->ticketTier->capacity > 0) {
                $transaction->ticketTier->increment('remaining_seats');
            }

            // Ubah status ke failed agar tidak dihitung di statistik pendapatan lagi, atau hapus jika mau.
            // Kita ubah payment_status ke failed agar riwayat pemesanannya masih ada (ditandai dibatalkan).
            $transaction->payment_status = 'failed';
            $transaction->is_used = false;
            $transaction->save();

            DB::commit();
            return back()->with('success', "Refund 93% berhasil! Rp " . number_format($refundAmount, 0, ',', '.') . " telah dikembalikan ke dompet pembeli.");

        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Refund Error: ' . $e->getMessage());
            return back()->withErrors(['withdraw_error' => 'Gagal memproses refund: ' . $e->getMessage()]);
        }
    }

    /**
     * Mengaktifkan atau menonaktifkan event (ubah status).
     */
    public function toggleStatus($id)
    {
        $event = Event::where('id_admin', Auth::id())->findOrFail($id);
        
        $event->status = $event->status === 'active' ? 'ended' : 'active';
        $event->save();
        
        $msg = $event->status === 'active' ? 'Event berhasil diaktifkan.' : 'Event berhasil dinonaktifkan.';
        return back()->with('success', $msg);
    }
}
