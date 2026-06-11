<!DOCTYPE html>
<html lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SecureGate Superadmin Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fcf9f8;
            color: #1c1b1b;
        }
        .modal-overlay {
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-container-high": "#ebe7e7",
                      "error": "#ba1a1a",
                      "on-error": "#ffffff",
                      "secondary": "#5d5e60",
                      "background": "#fcf9f8",
                      "on-error-container": "#93000a",
                      "primary-fixed": "#ffdad4",
                      "on-primary-fixed": "#400200",
                      "on-secondary-fixed-variant": "#454749",
                      "surface-container-highest": "#e5e2e1",
                      "surface-container": "#f0edec",
                      "surface-dim": "#dcd9d9",
                      "on-background": "#1c1b1b",
                      "secondary-fixed-dim": "#c6c6c8",
                      "error-container": "#ffdad6",
                      "on-secondary-container": "#616365",
                      "inverse-surface": "#313030",
                      "primary": "#b22110",
                      "primary-fixed-dim": "#ffb4a7",
                      "on-surface": "#1c1b1b",
                      "surface-container-lowest": "#ffffff",
                      "on-secondary": "#ffffff",
                      "surface-bright": "#fcf9f8",
                      "primary-container": "#d63b27",
                      "secondary-fixed": "#e2e2e4",
                      "tertiary": "#5b5c5c",
                      "tertiary-fixed-dim": "#c6c6c7",
                      "on-surface-variant": "#5b403c",
                      "outline": "#8f706a",
                      "tertiary-container": "#737575",
                      "on-tertiary-fixed": "#1a1c1c",
                      "on-secondary-fixed": "#1a1c1d",
                      "on-primary": "#ffffff",
                      "on-tertiary": "#ffffff",
                      "on-tertiary-container": "#fcfcfc",
                      "on-primary-fixed-variant": "#910900",
                      "on-primary-container": "#fffbff",
                      "secondary-container": "#dfdfe1",
                      "surface-variant": "#e5e2e1",
                      "inverse-primary": "#ffb4a7",
                      "tertiary-fixed": "#e2e2e2",
                      "surface-tint": "#b62413",
                      "surface-container-low": "#f6f3f2",
                      "outline-variant": "#e3beb8",
                      "inverse-on-surface": "#f3f0ef",
                      "surface": "#fcf9f8",
                      "on-tertiary-fixed-variant": "#454747"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "container-padding": "24px",
                      "stack-lg": "32px",
                      "stack-md": "16px",
                      "stack-sm": "8px",
                      "gutter": "24px",
                      "sidebar-width": "240px",
                      "content-max-width": "1200px"
              },
              "fontFamily": {
                      "headline-lg": ["Inter"],
                      "label-md": ["Inter"],
                      "body-md": ["Inter"],
                      "headline-md": ["Inter"],
                      "headline-xl": ["Inter"],
                      "body-lg": ["Inter"],
                      "label-sm": ["Inter"]
              },
              "fontSize": {
                      "headline-lg": ["22px", {"lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                      "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                      "body-md": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                      "headline-md": ["18px", {"lineHeight": "26px", "fontWeight": "500"}],
                      "headline-xl": ["28px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                      "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                      "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}]
              }
            },
          },
        }
      </script>
</head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- Sidebar Navigation -->
<aside class="fixed left-0 top-0 h-full w-[240px] border-r border-surface-container-high bg-surface-container-lowest dark:bg-surface-dim flex flex-col justify-between py-stack-lg z-50">
    <div class="flex flex-col">
        <div class="px-6 mb-10">
            <span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">SecureGate</span>
            <p class="font-label-md text-label-md text-secondary mt-1">Superadmin</p>
        </div>
        <nav class="flex flex-col space-y-1">
            <a href="{{ route('superadmin.dashboard') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.dashboard') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                <span class="material-symbols-outlined">dashboard</span>
                <span class="font-body-md text-body-md">Dashboard</span>
            </a>
            <a href="{{ route('superadmin.organizers') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.organizers') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                <span class="material-symbols-outlined">verified_user</span>
                <span class="font-body-md text-body-md">Verifikasi Organizer</span>
            </a>
            <a href="{{ route('superadmin.withdrawals') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.withdrawals') || request()->routeIs('superadmin.withdraw.*') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                <span class="material-symbols-outlined">account_balance_wallet</span>
                <span class="font-body-md text-body-md">Penarikan Dana</span>
            </a>
            <a href="#" class="flex items-center gap-3 px-6 py-3 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80">
                <span class="material-symbols-outlined">settings</span>
                <span class="font-body-md text-body-md">Pengaturan</span>
            </a>
        </nav>
    </div>
    <div class="px-6">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="flex items-center gap-3 text-primary w-full py-3 px-4 border border-primary hover:bg-primary/5 transition-colors duration-200 rounded-full font-medium">
                <span class="material-symbols-outlined">logout</span>
                <span class="font-body-md text-body-md font-medium">Keluar</span>
            </button>
        </form>
    </div>
</aside>
<!-- Top App Bar -->
<header class="fixed top-0 right-0 left-0 ml-[240px] flex justify-between items-center h-16 px-container-padding bg-surface border-b border-surface-container-high z-40">
<div>
<h1 class="font-headline-md text-headline-md font-bold text-on-surface">Dashboard</h1>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-2 text-secondary">
<span class="material-symbols-outlined text-[20px]" data-icon="update">update</span>
<span class="text-label-md">Terakhir diperbarui: 30 Mei 2026, 09:41</span>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-secondary hover:text-primary transition-colors active:scale-90">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 text-secondary hover:text-primary transition-colors active:scale-90">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
</div>
</div>
</header>
<!-- Main Content -->
<main class="ml-[240px] pt-24 px-container-padding pb-stack-lg max-w-[1200px] mx-auto">
<!-- Welcome Header -->
<div class="mb-stack-lg">
<p class="text-secondary font-body-lg">Selamat datang, <span class="font-semibold text-on-surface">Budi Santoso</span></p>
</div>
<!-- Section A: Analytics -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-stack-lg">
<!-- Card 1 -->
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] p-5 transition-all hover:border-primary/30">
<div class="flex justify-between items-start mb-3">
<div class="p-1.5 bg-surface-container rounded-[8px]">
<span class="material-symbols-outlined text-secondary text-[20px]" data-icon="receipt">receipt</span>
</div>
</div>
<p class="text-secondary font-label-md uppercase tracking-wider mb-0.5">Total Transaksi</p>
<h2 class="text-[24px] font-bold text-on-surface leading-tight">{{ $totalTransactions }}</h2>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] p-5 transition-all hover:border-primary/30">
<div class="flex justify-between items-start mb-3">
<div class="p-1.5 bg-primary-fixed rounded-[8px]">
<span class="material-symbols-outlined text-primary text-[20px]" data-icon="trending_up">trending_up</span>
</div>
</div>
<p class="text-secondary font-label-md uppercase tracking-wider mb-0.5">Total Pendapatan</p>
<h2 class="text-[24px] font-bold text-primary leading-tight">Rp {{ number_format($totalWithdrawnSuccess, 0, ',', '.') }}</h2>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] p-5 transition-all hover:border-primary/30">
<div class="flex justify-between items-start mb-3">
<div class="p-1.5 bg-surface-container rounded-[8px]">
<span class="material-symbols-outlined text-secondary text-[20px]" data-icon="group">group</span>
</div>
</div>
<p class="text-secondary font-label-md uppercase tracking-wider mb-0.5">Pengguna Aktif</p>
<h2 class="text-[24px] font-bold text-on-surface leading-tight">{{ $totalActiveUsers }}</h2>
</div>
<!-- Card 4 -->
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] p-5 transition-all hover:border-primary/30">
<div class="flex justify-between items-start mb-3">
<div class="p-1.5 bg-orange-100 rounded-[8px]">
<span class="material-symbols-outlined text-orange-600 text-[20px]" data-icon="schedule">schedule</span>
</div>
</div>
<p class="text-secondary font-label-md uppercase tracking-wider mb-0.5">Menunggu Eksekusi</p>
<h2 class="text-[24px] font-bold text-orange-600 leading-tight">{{ $pendingWithdrawals->count() }}</h2>
</div>
</section>
<!-- Section B: Verifikasi Organizer -->
<section class="mb-stack-lg">
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] overflow-hidden">
<div class="px-5 py-3.5 border-b border-surface-container-high flex justify-between items-center">
<div class="flex items-center gap-3">
<h3 class="text-[17px] font-semibold text-on-surface">Verifikasi Organizer</h3>
<span class="bg-primary px-2 py-0.5 rounded-full text-white text-[10px]">{{ $pendingOrganizers->count() }} menunggu</span>
</div>
<button class="text-primary font-medium hover:underline text-[13px]">Lihat Semua</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead class="bg-surface-container-low">
<tr>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Organizer</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Email</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Organisasi</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Telepon</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Dokumen</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider text-right">Aksi</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-high">
@foreach($pendingOrganizers as $org)
<tr class="bg-white hover:bg-surface-container-low transition-colors">
<td class="px-5 py-3">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-secondary-fixed-dim overflow-hidden">
<img alt="{{ $org->full_name }}" data-alt="{{ $org->full_name }}" src="{{ $org->profile_image ?? 'https://via.placeholder.com/32' }}"/>
</div>
<span class="text-[13px] font-medium">{{ $org->full_name }}</span>
</div>
</td>
<td class="px-5 py-3 text-[13px]">{{ $org->email }}</td>
<td class="px-5 py-3 text-[13px]">{{ $org->organization_name }}</td>
<td class="px-5 py-3 text-[13px]">{{ $org->phone }}</td>
<td class="px-5 py-3">
<a class="text-primary hover:underline flex items-center gap-1 text-[13px]" href="{{ $org->ktp_document ? asset('storage/'.$org->ktp_document) : '#' }}">
<span class="material-symbols-outlined text-[16px]" data-icon="description">description</span>
{{ $org->ktp_document ? 'KTP.pdf' : '' }}
</a>
</td>
<td class="px-5 py-3 text-right">
<div class="flex justify-end gap-2">
<button class="bg-primary text-white px-3 py-1 rounded-full text-[11px] hover:bg-primary-container transition-colors shadow-sm">Approve</button>
<button class="border border-outline text-secondary px-3 py-1 rounded-full text-[11px] hover:bg-surface-container transition-colors">Reject</button>
</div>
</td>
</tr>
@endforeach
</tbody>
</table>
</div>
</div>
</section>
<!-- Section C: Eksekusi Penarikan Dana -->
<section>
<div class="bg-surface-container-lowest border border-surface-container-high rounded-[12px] overflow-hidden">
<div class="px-5 py-3.5 border-b border-surface-container-high flex justify-between items-center">
<div class="flex items-center gap-3">
<h3 class="text-[17px] font-semibold text-on-surface">Penarikan Dana Tertunda</h3>
<span class="bg-orange-600 px-2 py-0.5 rounded-full text-white text-[10px]">5 menunggu</span>
</div>
<button class="text-primary font-medium hover:underline text-[13px]">Laporan Keuangan</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead class="bg-surface-container-low">
<tr>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Organizer</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Event</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Jumlah</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">Status</th>
<th class="px-5 py-2.5 text-[11px] font-semibold text-secondary uppercase tracking-wider text-right">Aksi</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-high">
@foreach($pendingWithdrawals as $wd)
@php 
    $meta = $wd->meta ?? []; 
    $wdAmount = number_format($wd->amount, 0, ',', '.');
    $tenantName = $wd->user ? $wd->user->full_name : 'Unknown';
    $eventName = $meta['event_title'] ?? $meta['event_name'] ?? 'Pencairan Event';
@endphp
<tr class="bg-white hover:bg-surface-container-low transition-colors">
<td class="px-5 py-3">
<div class="font-semibold text-on-surface text-[13px]">{{ $wd->created_at->format('d M Y') }}</div>
<div class="text-[11px] text-secondary">{{ $wd->created_at->format('H:i') }} WIB</div>
</td>
<td class="px-5 py-3">
<div class="font-semibold text-on-surface text-[13px]">{{ $tenantName }}</div>
<div class="text-[11px] text-secondary">Event: {{ $eventName }}</div>
</td>
<td class="px-5 py-3 text-primary font-bold text-[13px]">Rp {{ $wdAmount }}</td>
<td class="px-5 py-3">
<span class="bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] border border-orange-200">Menunggu Eksekusi</span>
</td>
<td class="px-5 py-3 text-right">
<form action="{{ route('superadmin.withdraw.execute', $wd->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin sudah melakukan transfer Rp {{ $wdAmount }} ke rekening {{ $meta['bank_name'] ?? '' }} {{ $meta['account_number'] ?? '' }} milik {{ $tenantName }}?');">
@csrf
<button type="submit" class="bg-primary text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-primary-container transition-all active:scale-95 shadow-sm flex items-center gap-1.5 ml-auto">
<span class="material-symbols-outlined text-[16px]" data-icon="payments">payments</span>
Eksekusi
</button>
</form>
</td>
</tr>
@endforeach
</tbody>
</table>
</div>
</div>
</section>
</main>
<!-- Approve Confirmation Modal (Open by Default for Demonstration) -->
<div class="fixed inset-0 z-[100] hidden items-center justify-center p-4 modal-overlay" id="approveModal">
<div class="bg-surface-container-lowest w-full max-w-md rounded-[14px] border border-surface-container-high overflow-hidden animate-in fade-in zoom-in duration-300">
<div class="p-6">
<div class="flex items-center gap-4 mb-6">
<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[28px]" data-icon="verified">verified</span>
</div>
<div>
<h4 class="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Verifikasi</h4>
<p class="text-secondary text-body-md">Tinjau detail organizer sebelum menyetujui.</p>
</div>
</div>
<div class="bg-surface-container-low rounded-xl p-4 mb-6 border border-surface-container-high">
<div class="flex items-center gap-3 mb-3">
<img alt="{{ $org->full_name ?? '' }}" class="w-12 h-12 rounded-full" src="{{ $org->profile_image ?? '' }}"/>
<div>
<p class="font-body-md font-bold text-on-surface">{{ $org->full_name ?? '' }}</p>
<p class="text-secondary text-label-sm">Organisasi: {{ $org->organization_name ?? '' }}</p>
</div>
</div>
<div class="space-y-2 border-t border-surface-container-high pt-3">
<div class="flex justify-between text-body-md">
<span class="text-secondary">Email</span>
<span class="text-on-surface">{{ $org->email ?? '' }}</span>
</div>
<div class="flex justify-between text-body-md">
<span class="text-secondary">No. Telepon</span>
<span class="text-on-surface">{{ $org->phone ?? '' }}</span>
</div>
</div>
</div>
<div class="flex gap-3">
<button class="flex-1 border border-outline text-secondary py-3 rounded-full font-medium hover:bg-surface-container transition-colors" onclick="document.getElementById('approveModal').style.display='none'">
Batal
</button>
<button class="flex-1 bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-container transition-colors shadow-lg active:scale-95">
Ya, Approve
</button>
</div>
</div>
</div>
</div>
<script>
        // Simple JS to toggle modal for demonstration purposes
        window.onclick = function(event) {
            const modal = document.getElementById('approveModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
</body></html>
