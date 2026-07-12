<!DOCTYPE html>
<html class="light" lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>GateMate - Keuangan</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface": "#fbf9f8",
                    "on-primary-fixed": "#400200",
                    "surface-container-lowest": "#ffffff",
                    "outline": "#8f706a",
                    "on-secondary-fixed": "#1c1b1b",
                    "surface-bright": "#fbf9f8",
                    "on-surface": "#1b1c1c",
                    "background": "#fbf9f8",
                    "on-primary-fixed-variant": "#910900",
                    "primary-container": "#d63b27",
                    "on-surface-variant": "#5b403c",
                    "tertiary-fixed-dim": "#68d4f3",
                    "inverse-primary": "#ffb4a7",
                    "on-tertiary": "#ffffff",
                    "error-container": "#ffdad6",
                    "tertiary": "#006579",
                    "on-tertiary-fixed": "#001f27",
                    "on-secondary-container": "#656464",
                    "tertiary-container": "#007f99",
                    "secondary-container": "#e5e2e1",
                    "surface-dim": "#dbdad9",
                    "on-primary-container": "#fffbff",
                    "secondary": "#5f5e5e",
                    "inverse-surface": "#303031",
                    "on-background": "#1b1c1c",
                    "surface-container-highest": "#e4e2e2",
                    "primary-fixed": "#ffdad4",
                    "secondary-fixed-dim": "#c8c6c5",
                    "secondary-fixed": "#e5e2e1",
                    "on-error": "#ffffff",
                    "surface-container-high": "#e9e8e7",
                    "surface-container": "#efeded",
                    "outline-variant": "#e3beb8",
                    "surface-variant": "#e4e2e2",
                    "on-tertiary-container": "#f9fdff",
                    "tertiary-fixed": "#b2ebff",
                    "inverse-on-surface": "#f2f0f0",
                    "surface-container-low": "#f5f3f3",
                    "on-error-container": "#93000a",
                    "primary": "#b22110",
                    "primary-fixed-dim": "#ffb4a7",
                    "on-secondary": "#ffffff",
                    "error": "#ba1a1a",
                    "on-tertiary-fixed-variant": "#004e5e",
                    "on-primary": "#ffffff",
                    "surface-tint": "#b62413",
                    "on-secondary-fixed-variant": "#474646"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "stack-sm": "8px",
                    "sidebar-width": "240px",
                    "max-container": "1200px",
                    "stack-lg": "24px",
                    "gutter": "16px",
                    "stack-md": "16px",
                    "page-padding": "24px"
            },
            "fontFamily": {
                    "label-md": ["Inter"],
                    "h2": ["Inter"],
                    "h1": ["Inter"],
                    "caption": ["Inter"],
                    "body-lg": ["Inter"],
                    "h1-mobile": ["Inter"],
                    "body-sm": ["Inter"],
                    "h3": ["Inter"]
            },
            "fontSize": {
                    "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                    "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                    "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                    "caption": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                    "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "h1-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "500"}],
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "h3": ["20px", {"lineHeight": "28px", "fontWeight": "500"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fbf9f8;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .flat-border {
            border: 0.5px solid #e3beb8;
        }
        .sidebar-active {
            border-left: 4px solid #b22110;
            background-color: rgba(145, 9, 0, 0.05);
            color: #b22110;
            font-weight: 700;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #e3beb8;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-background text-on-surface">

<!-- Sidebar Navigation -->
<aside class="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
    <div class="px-6 mb-10">
        <h2 class="font-h2 text-h2 font-black text-on-surface">GateMate</h2>
        <p class="font-caption text-caption text-secondary">Organizer</p>
    </div>
    <nav class="flex-1 space-y-1">
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined mr-3">dashboard</span>
            <span class="font-body-sm text-body-sm">Dashboard</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.events.index') }}">
            <span class="material-symbols-outlined mr-3">event</span>
            <span class="font-body-sm text-body-sm">Event Saya</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.scanner') }}">
            <span class="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span class="font-body-sm text-body-sm">Scanner</span>
        </a>
        <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.finance') }}">
            <span class="material-symbols-outlined mr-3">payments</span>
            <span class="font-body-sm text-body-sm">Keuangan</span>
        </a>
    </nav>
    <div class="px-6 mt-auto space-y-1">
        <a class="flex items-center py-3 text-secondary hover:text-on-surface transition-colors cursor-pointer" href="#">
            <span class="material-symbols-outlined mr-3">help</span>
            <span class="font-body-sm text-body-sm">Bantuan</span>
        </a>
        <div class="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div class="flex items-center">
                @if (!empty(auth()->user()->profile_picture))
                    <img alt="Organizer Profile" class="w-8 h-8 rounded-full object-cover bg-surface-container-high" src="{{ asset('Media/uploads/' . auth()->user()->profile_picture) }}"/>
                @else
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{{ strtoupper(substr(auth()->user()->full_name ?? 'O', 0, 1)) }}</div>
                @endif
                <div class="ml-2 overflow-hidden">
                    <p class="font-label-md text-label-md font-bold truncate">{{ auth()->user()->full_name ?? 'Organizer' }}</p>
                    <p class="font-caption text-caption text-secondary">ID: SG-{{ auth()->user()->id_user ?? '1' }}</p>
                </div>
            </div>
            <form action="{{ route('logout') }}" method="POST" class="inline">
                @csrf
                <button type="submit" class="text-primary active:opacity-70 mt-1">
                    <span class="material-symbols-outlined text-[20px]">logout</span>
                </button>
            </form>
        </div>
    </div>
</aside>

<!-- Top Navigation Bar -->
<header class="flex justify-between items-center w-full h-[64px] px-page-padding lg:pl-[264px] bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-20">
    <div class="flex items-center gap-4">
        <button class="lg:hidden p-2 text-on-surface">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <h2 class="font-h3 text-h3 font-black text-on-surface">Keuangan</h2>
    </div>
    <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-full border-[0.5px] border-outline-variant focus-within:border-primary transition-all">
            <span class="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input class="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Cari transaksi..." type="text"/>
        </div>
    </div>
</header>

<!-- Main Content -->
<main class="lg:pl-[240px] min-h-screen pb-20 lg:pb-10 relative">

    @if(session('success'))
        <div class="max-w-[1200px] mx-auto p-page-padding pb-0">
            <div class="bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm mb-4">
                <span class="material-symbols-outlined">check_circle</span>
                {{ session('success') }}
            </div>
        </div>
    @endif
    @if($errors->any())
        <div class="max-w-[1200px] mx-auto p-page-padding pb-0">
            <div class="bg-[#FFF0EE] border border-primary text-primary px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm mb-4">
                <span class="material-symbols-outlined">error</span>
                {{ $errors->first() }}
            </div>
        </div>
    @endif

    <div class="max-w-[1200px] mx-auto p-page-padding space-y-stack-lg">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="space-y-1">
                <h1 class="font-h1 text-h1 text-on-surface">Ringkasan Keuangan</h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant">Kelola saldo, pantau arus kas, dan ajukan penarikan dana ke rekening Anda.</p>
            </div>
            <button onclick="document.getElementById('withdrawModal').classList.remove('hidden')" class="flex items-center justify-center gap-2 px-6 h-[44px] bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium text-body-sm shadow-sm">
                <span class="material-symbols-outlined text-white">account_balance_wallet</span>
                Ajukan Penarikan Dana
            </button>
        </div>

        <!-- Summary Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <!-- Total Saldo (Pendapatan Bersih Total Sejarah) -->
            <div class="bg-surface-container-lowest p-6 rounded-[14px] flat-border flex flex-col justify-between h-[160px]">
                <div class="flex justify-between items-start">
                    <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Pendapatan</span>
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary">payments</span>
                    </div>
                </div>
                <div>
                    <h2 class="font-h1 text-h1 text-on-surface font-black">Rp {{ number_format($netIncomeTotal, 0, ',', '.') }}</h2>
                    <div class="flex items-center gap-1 mt-1 text-emerald-600 font-label-md text-label-md">
                        <span class="material-symbols-outlined text-sm">trending_up</span>
                        <span>Akumulasi Sejak Awal</span>
                    </div>
                </div>
            </div>
            
            <!-- Saldo Tersedia -->
            <div class="bg-surface-container-lowest p-6 rounded-[14px] flat-border flex flex-col justify-between h-[160px]">
                <div class="flex justify-between items-start">
                    <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Saldo Tersedia</span>
                    <div class="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                        <span class="material-symbols-outlined text-tertiary">verified_user</span>
                    </div>
                </div>
                <div>
                    <h2 class="font-h1 text-h1 text-on-surface font-black">Rp {{ number_format($sisaBisaDitarikTotal, 0, ',', '.') }}</h2>
                    <p class="text-on-surface-variant font-caption text-caption mt-1 italic">Siap untuk ditarik ke rekening utama</p>
                </div>
            </div>
            
            <!-- Penarikan Tertunda -->
            <div class="bg-surface-container-lowest p-6 rounded-[14px] flat-border flex flex-col justify-between h-[160px]">
                <div class="flex justify-between items-start">
                    <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Penarikan Tertunda</span>
                    <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                        <span class="material-symbols-outlined text-secondary">schedule</span>
                    </div>
                </div>
                <div>
                    <h2 class="font-h1 text-h1 text-on-surface font-black">Rp {{ number_format($pendingWithdrawals, 0, ',', '.') }}</h2>
                    <p class="text-on-surface-variant font-caption text-caption mt-1">Status Sedang Diproses</p>
                </div>
            </div>
        </div>

        <!-- Transaction History Section -->
        <div class="bg-surface-container-lowest rounded-[14px] flat-border overflow-hidden">
            <div class="p-6 border-b-[0.5px] border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 class="font-h3 text-h3 font-bold">Riwayat Transaksi Dompet (Wallet)</h3>
                <div class="flex flex-wrap items-center gap-3">
                    <button class="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-secondary-container transition-colors font-label-md text-label-md">
                        <span class="material-symbols-outlined text-sm">filter_list</span>
                        Filter Lanjut
                    </button>
                </div>
            </div>
            
            <!-- Data Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-surface-variant/30 text-secondary font-label-md text-label-md">
                            <th class="px-6 py-4 font-semibold uppercase tracking-wider">Tanggal</th>
                            <th class="px-6 py-4 font-semibold uppercase tracking-wider">Deskripsi</th>
                            <th class="px-6 py-4 font-semibold uppercase tracking-wider">Jenis</th>
                            <th class="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 font-semibold uppercase tracking-wider text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-[0.5px] divide-outline-variant">
                        @forelse($transactions as $trx)
                        <tr class="hover:bg-surface-container transition-colors group">
                            <td class="px-6 py-4 font-body-sm text-body-sm">{{ $trx->created_at->format('d M Y, H:i') }}</td>
                            <td class="px-6 py-4">
                                <p class="font-body-sm text-body-sm font-medium">
                                    @if($trx->type === 'tenant_revenue')
                                        Bagi Hasil Tenant ({{ $trx->meta['tenant_name'] ?? 'Tenant' }})
                                    @elseif($trx->type === 'withdrawal')
                                        Penarikan Dana ke {{ $trx->meta['bank_name'] ?? 'Bank' }} {{ $trx->meta['account_number'] ?? '' }}
                                    @else
                                        {{ ucfirst(str_replace('_', ' ', $trx->type)) }}
                                    @endif
                                </p>
                                <p class="text-[11px] text-on-surface-variant">Trx #{{ $trx->order_id }}</p>
                            </td>
                            <td class="px-6 py-4">
                                @if($trx->type === 'tenant_revenue')
                                    <span class="text-caption font-label-md px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">Pendapatan</span>
                                @elseif($trx->type === 'withdrawal')
                                    <span class="text-caption font-label-md px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant">Penarikan</span>
                                @else
                                    <span class="text-caption font-label-md px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">Lainnya</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if(in_array($trx->status, ['success', 'settlement']))
                                    <div class="flex items-center gap-1.5 text-emerald-700 font-label-md text-label-md">
                                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> Selesai
                                    </div>
                                @elseif(in_array($trx->status, ['pending', 'pending_superadmin']))
                                    <div class="flex items-center gap-1.5 text-amber-700 font-label-md text-label-md">
                                        <div class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></div> Diproses
                                    </div>
                                @else
                                    <div class="flex items-center gap-1.5 text-red-700 font-label-md text-label-md">
                                        <div class="w-1.5 h-1.5 rounded-full bg-red-600"></div> Ditolak / Gagal
                                    </div>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right font-medium {{ $trx->type === 'withdrawal' ? 'text-on-surface' : 'text-emerald-600' }}">
                                {{ $trx->type === 'withdrawal' ? '-' : '+' }} Rp {{ number_format($trx->amount, 0, ',', '.') }}
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-secondary font-body-sm">
                                Belum ada riwayat transaksi dompet
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <!-- Pagination (Mock) -->
            <div class="p-6 border-t-[0.5px] border-outline-variant flex items-center justify-between">
                <p class="text-caption text-on-surface-variant">Menampilkan {{ $transactions->count() }} transaksi</p>
                <div class="flex items-center gap-2">
                    <button class="w-8 h-8 flex items-center justify-center rounded border-[0.5px] border-outline-variant hover:bg-surface-container transition-colors">
                        <span class="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button class="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-label-md text-label-md">1</button>
                    <button class="w-8 h-8 flex items-center justify-center rounded border-[0.5px] border-outline-variant hover:bg-surface-container transition-colors">
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Withdrawal Methods & Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <div class="bg-surface-container-lowest p-6 rounded-[14px] flat-border space-y-4">
                <h3 class="font-h3 text-h3 font-bold">Rekening Terdaftar</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-4 bg-surface rounded-lg border-[0.5px] border-outline-variant">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">DEFAULT</div>
                            <div>
                                <p class="font-label-md text-label-md">Rekening Utama (Dummy)</p>
                                <p class="text-caption text-on-surface-variant">Admin • Input saat Withdraw</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined text-emerald-600" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-surface-container-lowest p-6 rounded-[14px] flat-border relative overflow-hidden group">
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <h3 class="font-h3 text-h3 font-bold">Butuh Bantuan?</h3>
                        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Kami siap membantu kendala keuangan Anda setiap saat.</p>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button class="px-4 py-2 bg-on-surface text-surface rounded-lg text-label-md font-label-md">Hubungi Support</button>
                        <button class="px-4 py-2 bg-surface-container text-on-surface-variant rounded-lg text-label-md font-label-md">Baca FAQ</button>
                    </div>
                </div>
                <!-- Abstract Background Pattern -->
                <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                <div class="absolute right-10 top-0 w-20 h-20 bg-tertiary/5 rounded-full blur-xl"></div>
            </div>
        </div>
    </div>
</main>

<!-- Bottom Navigation Bar (Mobile) -->
<nav class="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.dashboard') }}">
        <span class="material-symbols-outlined">grid_view</span>
        <span class="font-label-md text-label-md">Dashboard</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.events.index') }}">
        <span class="material-symbols-outlined">confirmation_number</span>
        <span class="font-label-md text-label-md">Events</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.scanner') }}">
        <div class="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span class="material-symbols-outlined">center_focus_weak</span>
        </div>
        <span class="font-label-md text-label-md mt-1">Scan</span>
    </a>
    <a class="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.finance') }}">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="font-label-md text-label-md">Finance</span>
    </a>
</nav>

<!-- Modal Withdraw (Injected automatically) -->
<div class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4" id="withdrawModal">
    <div class="bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-h2 text-h2 font-black text-on-surface">Tarik Dana</h3>
            <button class="text-secondary hover:text-on-surface" onclick="document.getElementById('withdrawModal').classList.add('hidden')">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <form action="{{ route('admin.finance.withdraw') }}" method="POST">
            @csrf
            <div class="space-y-4">
                <div>
                    <label class="block font-label-md text-on-surface-variant mb-1">Nominal (Rp)</label>
                    <input type="number" name="amount" required min="10000" max="{{ $sisaBisaDitarikTotal }}"
                           class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                           placeholder="Misal: 1500000">
                    <p class="text-[11px] text-secondary mt-1">Maksimal: Rp {{ number_format($sisaBisaDitarikTotal, 0, ',', '.') }}</p>
                </div>
                <div>
                    <label class="block font-label-md text-on-surface-variant mb-1">Nama Bank / E-Wallet</label>
                    <input type="text" name="bank_name" required
                           class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                           placeholder="Misal: Bank BCA / GoPay">
                </div>
                <div>
                    <label class="block font-label-md text-on-surface-variant mb-1">Nomor Rekening</label>
                    <input type="text" name="account_number" required
                           class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                           placeholder="0123456789">
                </div>
                
                <div class="pt-4 flex gap-3">
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="document.getElementById('withdrawModal').classList.add('hidden')">
                        Batal
                    </button>
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md">
                        Konfirmasi
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script>
    document.querySelectorAll('button, a').forEach(elem => {
        elem.addEventListener('mousedown', () => {
            elem.style.transform = 'scale(0.98)';
        });
        elem.addEventListener('mouseup', () => {
            elem.style.transform = 'scale(1)';
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'scale(1)';
        });
    });
</script>
</body></html>