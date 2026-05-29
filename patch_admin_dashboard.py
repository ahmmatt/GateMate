import re

file_path = r'd:\laragon\www\JVC26\gatemate\resources\views\admin\dashboard.blade.php'

content = r"""<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>SecureGate Organizer Dashboard</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for a cleaner look */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e3beb8; border-radius: 10px; }
        .chart-container {
            background-image: linear-gradient(to right, #fbf9f8 1px, transparent 1px);
            background-size: 20% 100%;
        }
    </style>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface-variant": "#5b403c",
                        "surface-container-high": "#e9e8e7",
                        "secondary-fixed": "#e5e2e1",
                        "error-container": "#ffdad6",
                        "surface-dim": "#dbdad9",
                        "surface-container-highest": "#e4e2e2",
                        "on-tertiary-fixed": "#001f27",
                        "on-tertiary-container": "#f9fdff",
                        "surface": "#fbf9f8",
                        "surface-bright": "#fbf9f8",
                        "tertiary": "#006579",
                        "on-secondary": "#ffffff",
                        "on-secondary-container": "#656464",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-fixed": "#400200",
                        "primary-fixed-dim": "#ffb4a7",
                        "on-error-container": "#93000a",
                        "on-secondary-fixed": "#1c1b1b",
                        "primary-fixed": "#ffdad4",
                        "tertiary-container": "#007f99",
                        "primary-container": "#d63b27",
                        "error": "#ba1a1a",
                        "inverse-on-surface": "#f2f0f0",
                        "secondary": "#5f5e5e",
                        "primary": "#b22110",
                        "background": "#fbf9f8",
                        "outline-variant": "#e3beb8",
                        "outline": "#8f706a",
                        "on-surface": "#1b1c1c",
                        "surface-container": "#efeded",
                        "inverse-primary": "#ffb4a7",
                        "secondary-fixed-dim": "#c8c6c5",
                        "on-primary-container": "#fffbff",
                        "on-primary": "#ffffff",
                        "tertiary-fixed": "#b2ebff",
                        "on-secondary-fixed-variant": "#474646",
                        "tertiary-fixed-dim": "#68d4f3",
                        "surface-variant": "#e4e2e2",
                        "on-primary-fixed-variant": "#910900",
                        "surface-tint": "#b62413",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-tertiary-fixed-variant": "#004e5e",
                        "secondary-container": "#e5e2e1",
                        "on-background": "#1b1c1c",
                        "inverse-surface": "#303031",
                        "surface-container-low": "#f5f3f3"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "sidebar-width": "240px",
                        "stack-sm": "8px",
                        "stack-md": "16px",
                        "page-padding": "24px",
                        "max-container": "1200px",
                        "gutter": "16px",
                        "stack-lg": "24px"
                    },
                    "fontFamily": {
                        "body-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "h1": ["Inter"],
                        "h1-mobile": ["Inter"],
                        "h2": ["Inter"],
                        "caption": ["Inter"],
                        "h3": ["Inter"]
                    },
                    "fontSize": {
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                        "h1-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "500"}],
                        "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                        "caption": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                        "h3": ["20px", {"lineHeight": "28px", "fontWeight": "500"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-surface text-on-surface">

@php
    $adminName = Auth::user()->full_name;
    $adminId = Auth::user()->id_user;
    $adminOrg = Auth::user()->organization_name ?? 'Organizer';
    $navPic = Auth::user()->profile_picture ?? null;
    $navInitial = strtoupper(substr($adminName ?? 'O', 0, 1));
@endphp

<!-- Mobile Top NavBar -->
<header class="flex justify-between items-center px-page-padding h-16 w-full fixed top-0 bg-surface border-b-[0.5px] border-outline-variant z-50 md:hidden">
    <h1 class="font-h1-mobile text-h1-mobile font-bold text-primary">SecureGate</h1>
    <button class="active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-primary">menu</span>
    </button>
</header>

<!-- Side Navigation (Desktop) -->
<aside class="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
    <div class="px-6 mb-10">
        <h2 class="font-h2 text-h2 font-black text-on-surface">SecureGate</h2>
        <p class="font-caption text-caption text-secondary">Organizer</p>
    </div>
    <nav class="flex-1 space-y-1">
        <!-- Active Item -->
        <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.dashboard') }}">
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
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="#">
            <span class="material-symbols-outlined mr-3">payments</span>
            <span class="font-body-sm text-body-sm">Keuangan</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="#">
            <span class="material-symbols-outlined mr-3">settings</span>
            <span class="font-body-sm text-body-sm">Pengaturan</span>
        </a>
    </nav>
    <div class="px-6 mt-auto space-y-1">
        <a class="flex items-center py-3 text-secondary hover:text-on-surface transition-colors cursor-pointer" href="#">
            <span class="material-symbols-outlined mr-3">help</span>
            <span class="font-body-sm text-body-sm">Bantuan</span>
        </a>
        <div class="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div class="flex items-center">
                @if (!empty($navPic))
                    <img alt="Organizer Profile" class="w-8 h-8 rounded-full object-cover bg-surface-container-high" src="{{ asset('Media/uploads/' . $navPic) }}"/>
                @else
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{{ $navInitial }}</div>
                @endif
                <div class="ml-2 overflow-hidden">
                    <p class="font-label-md text-label-md font-bold truncate">{{ $adminName }}</p>
                    <p class="font-caption text-caption text-secondary">ID: SG-{{ $adminId }}</p>
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

<!-- Main Content Canvas -->
<main class="md:ml-sidebar-width pt-16 md:pt-0 min-h-screen">
    <div class="max-w-max-container mx-auto p-page-padding space-y-stack-lg">
        
        <!-- Header Section -->
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div>
                <h1 class="font-h1 text-h1 text-on-surface">Dashboard</h1>
                <p class="font-body-sm text-body-sm text-secondary">Selamat datang kembali, <span class="font-bold text-on-surface">{{ $adminName }}</span></p>
            </div>
            <div class="flex items-center gap-stack-sm">
                <button class="flex items-center px-4 h-10 bg-surface-container border-[0.5px] border-outline-variant rounded-lg text-on-surface font-label-md active:scale-95 transition-transform">
                    <span class="material-symbols-outlined text-[18px] mr-2">download</span>
                    Laporan
                </button>
                <a href="{{ route('admin.events.create') }}" class="flex items-center px-4 h-10 bg-primary text-on-primary rounded-lg font-label-md active:scale-95 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[18px] mr-2">add</span>
                    Event Baru
                </a>
            </div>
        </header>

        <!-- Metric Cards Grid -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <!-- Total Event -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant p-stack-lg rounded-[14px]">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined">calendar_today</span>
                    </div>
                    <span class="text-secondary font-label-md">Aktif: {{ $activeEvents }}</span>
                </div>
                <p class="text-secondary font-label-md">Total Event</p>
                <p class="text-h2 font-h2 font-bold text-on-surface">{{ $totalEvents }}</p>
            </div>
            
            <!-- Tiket Terjual -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant p-stack-lg rounded-[14px]">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined">confirmation_number</span>
                    </div>
                </div>
                <p class="text-secondary font-label-md">Tiket Terjual</p>
                <p class="text-h2 font-h2 font-bold text-on-surface">{{ number_format($totalTicketsSold, 0, ',', '.') }}</p>
            </div>
            
            <!-- Pendapatan Kotor -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant p-stack-lg rounded-[14px]">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined">trending_up</span>
                    </div>
                </div>
                <p class="text-secondary font-label-md">Pendapatan Kotor</p>
                <p class="text-h2 font-h2 font-bold text-primary">Rp {{ number_format($ticketRevenue, 0, ',', '.') }}</p>
            </div>
            
            <!-- Check-in Hari Ini -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant p-stack-lg rounded-[14px]">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined">how_to_reg</span>
                    </div>
                    <span class="text-secondary font-label-md">Live</span>
                </div>
                <p class="text-secondary font-label-md">Check-in Hari Ini</p>
                <p class="text-h2 font-h2 font-bold text-on-surface">{{ $checkedInToday }}</p>
            </div>
        </section>

        <!-- Middle Section: Financial & Insights -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <!-- Financial Summary Card -->
            <div class="lg:col-span-4 bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-[14px] flex flex-col overflow-hidden">
                <div class="p-6 border-b-[0.5px] border-outline-variant bg-surface-container-low">
                    <h3 class="font-h3 text-h3 text-on-surface flex items-center">
                        <span class="material-symbols-outlined mr-2 text-primary">account_balance_wallet</span>
                        Ringkasan Keuangan
                    </h3>
                </div>
                <div class="p-6 flex-1 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-secondary font-body-sm">Gross Revenue</span>
                        <span class="font-body-sm font-medium">Rp {{ number_format($ticketRevenue, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex justify-between items-center text-error">
                        <span class="text-secondary font-body-sm">Service Fee ({{ $feePercent ?? 10 }}%)</span>
                        <span class="font-body-sm font-medium">- Rp {{ number_format($platformFeeTotal, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex justify-between items-center text-tertiary">
                        <span class="text-secondary font-body-sm">Tenant Cut</span>
                        <span class="font-body-sm font-medium">+ Rp {{ number_format($tenantCutTotal ?? 0, 0, ',', '.') }}</span>
                    </div>
                    <div class="pt-4 border-t border-outline-variant flex justify-between items-center">
                        <span class="text-on-surface font-bold font-body-lg">Net Earnings</span>
                        <span class="text-primary font-h2 font-bold">Rp {{ number_format($netIncomeTotal, 0, ',', '.') }}</span>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <button class="w-full h-12 bg-on-surface text-surface rounded-lg font-label-md active:opacity-80 transition-opacity flex items-center justify-center">
                        Ajukan Penarikan (Tersedia: Rp {{ number_format($sisaBisaDitarikTotal, 0, ',', '.') }})
                    </button>
                    <p class="text-center text-caption text-secondary mt-3 italic">
                        Penarikan terakhir: {{ $withdrawalHistory->first() ? $withdrawalHistory->first()->created_at->format('d M Y') : '-' }}
                    </p>
                </div>
            </div>
            
            <!-- Revenue Trend Chart -->
            <div class="lg:col-span-8 bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-[14px] p-6 flex flex-col">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h3 class="font-h3 text-h3 text-on-surface">Tren Pendapatan</h3>
                        <p class="text-caption text-secondary">Analistik 6 bulan terakhir</p>
                    </div>
                    <select class="bg-surface border-outline-variant rounded-md text-label-md py-1 px-3 outline-none focus:border-primary">
                        <option>Tahun {{ date('Y') }}</option>
                    </select>
                </div>
                <div class="flex-1 relative min-h-[200px] flex items-end justify-between gap-2 px-2 chart-container">
                    <svg class="absolute inset-0 w-full h-[85%] px-2 mt-4" preserveAspectRatio="none" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stop-color="#f04e37" stop-opacity="0.15"></stop>
                                <stop offset="100%" stop-color="#f04e37" stop-opacity="0"></stop>
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur result="blur" stdDeviation="2"></feGaussianBlur>
                                <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                            </filter>
                        </defs>
                        <!-- Vertical Grid Lines -->
                        <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#e3beb8" stroke-width="0.5" stroke-dasharray="4 4"></line>
                        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#e3beb8" stroke-width="0.5" stroke-dasharray="4 4"></line>
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e3beb8" stroke-width="0.5" stroke-dasharray="4 4"></line>
                        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#e3beb8" stroke-width="0.5" stroke-dasharray="4 4"></line>
                        <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#e3beb8" stroke-width="0.5" stroke-dasharray="4 4"></line>
                        <!-- Area Fill -->
                        <path d="M 0 150 C 50 140, 100 120, 150 130 S 250 80, 350 110 S 450 60, 500 70 V 200 H 0 Z" fill="url(#areaGradient)"></path>
                        <!-- Line -->
                        <path d="M 0 150 C 50 140, 100 120, 150 130 S 250 80, 350 110 S 450 60, 500 70" fill="none" stroke="#f04e37" stroke-width="3" stroke-linecap="round"></path>
                        <!-- Glowing Data Point -->
                        <circle cx="500" cy="70" r="5" fill="#f04e37" filter="url(#glow)"></circle>
                        <circle cx="500" cy="70" r="3" fill="#ffffff"></circle>
                    </svg>
                    
                    @php
                        // We use the latest month revenue for the tooltip display
                        $latestMonthIdx = count($months) - 1;
                        $latestRevenue = isset($revenues[$latestMonthIdx]) ? $revenues[$latestMonthIdx] : 0;
                        
                        function formatShort($num) {
                            if($num >= 1000000000) return round($num/1000000000, 1).'B';
                            if($num >= 1000000) return round($num/1000000, 1).'M';
                            if($num >= 1000) return round($num/1000, 1).'K';
                            return $num;
                        }
                    @endphp

                    <!-- Tooltip Container -->
                    <div class="absolute top-2 right-4 bg-[#1b1c1c] text-white p-2 rounded-md shadow-xl flex items-baseline gap-2 z-10">
                        <span class="font-bold text-sm">{{ formatShort($latestRevenue) }}</span>
                        <span class="text-[10px] text-secondary-fixed-dim">{{ $months[$latestMonthIdx] ?? 'Bulan Ini' }}</span>
                    </div>

                    <!-- Month Labels -->
                    <div class="absolute bottom-0 w-full flex justify-around px-2 text-caption text-secondary">
                        @foreach($months as $idx => $m)
                            @if($idx == $latestMonthIdx)
                                <span class="font-bold text-on-surface">{{ explode(' ', $m)[0] }}</span>
                            @else
                                <span>{{ explode(' ', $m)[0] }}</span>
                            @endif
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <!-- Bottom Table Section -->
        <section class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-[14px] overflow-hidden mb-12">
            <div class="px-6 py-4 border-b-[0.5px] border-outline-variant flex justify-between items-center">
                <h3 class="font-h3 text-h3">Event Mendatang</h3>
                <a class="text-primary font-label-md hover:underline" href="{{ route('admin.events.index') }}">Lihat Semua</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-surface-container-low text-secondary font-label-md">
                        <tr>
                            <th class="px-6 py-3 font-medium">Nama Event</th>
                            <th class="px-6 py-3 font-medium">Tanggal</th>
                            <th class="px-6 py-3 font-medium">Okupansi</th>
                            <th class="px-6 py-3 font-medium">Status</th>
                            <th class="px-6 py-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-body-sm">
                        @forelse($events->take(5) as $event)
                        @php
                            $sold = \App\Models\Transaction::where('event_id', $event->id_event)->where('payment_status', 'success')->count();
                            
                            $isUnlimited = $event->ticketTiers->where('is_unlimited', true)->count() > 0 || $event->capacity_type === 'unlimited';
                            $cap = $event->ticketTiers->sum('capacity');
                            
                            if ($isUnlimited) {
                                $percentage = 0; // Or keep it small to show some activity
                                $capText = '∞';
                            } else {
                                $percentage = $cap > 0 ? min(100, round(($sold / $cap) * 100)) : 0;
                                $capText = $cap;
                            }
                        @endphp
                        <tr class="border-b-[0.5px] border-outline-variant hover:bg-surface-container-low/50 transition-colors">
                            <td class="px-6 py-4 font-medium">{{ $event->title }}</td>
                            <td class="px-6 py-4 text-secondary">{{ \Carbon\Carbon::parse($event->start_date)->format('d M Y') }}</td>
                            <td class="px-6 py-4">
                                <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-primary h-full" style="width: {{ $percentage }}%"></div>
                                </div>
                                <span class="text-caption mt-1 inline-block">{{ $sold }}/{{ $capText }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($event->status === 'active')
                                    <span class="px-2 py-1 bg-green-100 text-green-800 text-[10px] rounded-full font-bold uppercase tracking-wider">Aktif</span>
                                @else
                                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] rounded-full font-bold uppercase tracking-wider">Selesai</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <a href="{{ route('admin.events.show', $event->id_event) }}" class="text-primary active:opacity-70">
                                    <span class="material-symbols-outlined">more_vert</span>
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-secondary">Belum ada event. <a href="{{ route('admin.events.create') }}" class="text-primary hover:underline">Buat event pertama Anda.</a></td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</main>

<!-- Mobile Bottom NavBar -->
<nav class="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.dashboard') }}">
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
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="#">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="font-label-md text-label-md">Finance</span>
    </a>
</nav>

<!-- Micro-interaction Scripts -->
<script>
    document.querySelectorAll('.active\\:scale-95').forEach(button => {
        button.addEventListener('mousedown', () => button.style.transform = 'scale(0.95)');
        button.addEventListener('mouseup', () => button.style.transform = 'scale(1)');
        button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
    });
</script>
</body>
</html>
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
