<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>GateMate - Kelola Event</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fbf9f8;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #e3beb8;
            border-radius: 10px;
        }
        .modal-overlay { background: rgba(27, 28, 28, 0.4); backdrop-filter: blur(2px); }
    </style>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-fixed": "#ffdad4",
                        "on-background": "#1b1c1c",
                        "secondary": "#5f5e5e",
                        "on-secondary": "#ffffff",
                        "on-primary-fixed-variant": "#910900",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed": "#400200",
                        "inverse-primary": "#ffb4a7",
                        "primary": "#b22110",
                        "surface-dim": "#dbdad9",
                        "surface-tint": "#b62413",
                        "on-tertiary-fixed-variant": "#004e5e",
                        "on-error": "#ffffff",
                        "surface": "#fbf9f8",
                        "surface-container": "#efeded",
                        "background": "#fbf9f8",
                        "primary-fixed-dim": "#ffb4a7",
                        "on-tertiary-fixed": "#001f27",
                        "on-tertiary-container": "#f9fdff",
                        "on-secondary-fixed": "#1c1b1b",
                        "on-surface-variant": "#5b403c",
                        "tertiary-fixed": "#b2ebff",
                        "surface-container-low": "#f5f3f3",
                        "outline-variant": "#e3beb8",
                        "surface-variant": "#e4e2e2",
                        "secondary-fixed-dim": "#c8c6c5",
                        "surface-container-highest": "#e4e2e2",
                        "inverse-surface": "#303031",
                        "error": "#ba1a1a",
                        "tertiary-container": "#007f99",
                        "on-primary-container": "#fffbff",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed": "#e5e2e1",
                        "error-container": "#ffdad6",
                        "primary-container": "#d63b27",
                        "surface-container-high": "#e9e8e7",
                        "on-error-container": "#93000a",
                        "on-surface": "#1b1c1c",
                        "surface-bright": "#fbf9f8",
                        "on-secondary-container": "#656464",
                        "tertiary-fixed-dim": "#68d4f3",
                        "inverse-on-surface": "#f2f0f0",
                        "tertiary": "#006579",
                        "secondary-container": "#e5e2e1",
                        "outline": "#8f706a",
                        "on-secondary-fixed-variant": "#474646",
                        "on-primary": "#ffffff"
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
<body class="bg-surface text-on-surface font-body-sm">

@php
    $banner = !empty($event->banner_image) ? asset('Media/uploads/'.$event->banner_image) : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
@endphp

<!-- Mobile Top Bar -->
<header class="md:hidden flex justify-between items-center px-page-padding h-16 w-full bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-40">
    <span class="font-h1-mobile text-h1-mobile font-bold text-primary">GateMate</span>
    <button class="active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-on-surface">menu</span>
    </button>
</header>

<!-- Desktop Side Navigation -->
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
        <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.events.index') }}">
            <span class="material-symbols-outlined mr-3">event</span>
            <span class="font-body-sm text-body-sm">Event Saya</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.scanner') }}">
            <span class="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span class="font-body-sm text-body-sm">Scanner</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.finance') }}">
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

<!-- Main Content Canvas -->
<main class="md:ml-sidebar-width min-h-screen pb-24 md:pb-page-padding">

    @if(session('success'))
        <div class="max-w-max-container mx-auto px-page-padding pt-6">
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        </div>
    @endif
    @if(session('error'))
        <div class="max-w-max-container mx-auto px-page-padding pt-6">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        </div>
    @endif

    <!-- Hero Banner Section -->
    <section class="max-w-max-container mx-auto px-0 md:px-page-padding md:pt-page-padding">
        <div class="relative w-full aspect-video md:rounded-xl overflow-hidden border-[0.5px] border-outline-variant bg-surface-container-high">
            <img alt="Event Banner" class="w-full h-full object-cover" src="{{ $banner }}"/>
            <div class="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full border border-outline-variant">
                @if($event->status === 'active')
                    <span class="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Live Event</span>
                @else
                    <span class="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">Ended</span>
                @endif
            </div>
        </div>
        
        <!-- Event Basic Info -->
        <div class="px-page-padding md:px-0 mt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
                <span class="text-tertiary font-label-md text-label-md bg-tertiary-fixed px-3 py-1 rounded-full">{{ $event->category }}</span>
                <h2 class="font-h1 text-h1 md:text-h1 mt-2 text-on-surface">{{ $event->title }}</h2>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-secondary">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span class="font-body-sm text-body-sm">{{ \Carbon\Carbon::parse($event->start_date)->format('d F Y') }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                        <span class="font-body-sm text-body-sm">{{ $event->venue_name ?? ($event->city ?? $event->location_type) }}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <form action="{{ route('admin.events.toggle-status', $event->id_event) }}" method="POST">
                    @csrf
                    <button type="submit" onclick="return confirm('Apakah Anda yakin ingin mengubah status event ini?');" class="bg-surface-container-highest hover:bg-surface-variant text-on-surface px-4 py-2 rounded-full font-label-md flex items-center gap-2 transition-colors border border-outline-variant">
                        <span class="material-symbols-outlined text-[18px]">
                            {{ $event->status === 'active' ? 'power_settings_new' : 'play_arrow' }}
                        </span>
                        {{ $event->status === 'active' ? 'Nonaktifkan Event' : 'Aktifkan Event' }}
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Tabs Navigation -->
    <section class="max-w-max-container mx-auto mt-10 px-page-padding">
        <div class="flex border-b-[0.5px] border-outline-variant mb-stack-lg overflow-x-auto no-scrollbar">
            <button data-target="tab-tiket" class="tab-btn px-6 py-4 font-label-md text-primary border-b-2 border-primary font-bold whitespace-nowrap">
                Tiket
            </button>
            <button data-target="tab-peserta" class="tab-btn px-6 py-4 font-label-md text-secondary border-b-2 border-transparent hover:text-primary transition-colors whitespace-nowrap">
                Peserta
            </button>
            <button data-target="tab-tenant" class="tab-btn px-6 py-4 font-label-md text-secondary border-b-2 border-transparent hover:text-primary transition-colors whitespace-nowrap">
                Tenant
            </button>
            <button data-target="tab-keuangan" class="tab-btn px-6 py-4 font-label-md text-secondary border-b-2 border-transparent hover:text-primary transition-colors whitespace-nowrap">
                Keuangan
            </button>
        </div>

        <!-- Tiket Tab Content -->
        <div id="tab-tiket" class="tab-content">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($event->ticketTiers as $tier)
                @php
                    $sold = \App\Models\Transaction::where('ticket_tier_id', $tier->id_tier)->where('payment_status','success')->count();
                    $pct  = $tier->capacity > 0 ? round(($sold / $tier->capacity) * 100) : 0;
                    $isSoldOut = $tier->capacity > 0 && $sold >= $tier->capacity;
                @endphp
                <!-- Ticket Card -->
                <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 transition-all hover:border-primary/40 group {{ $isSoldOut ? 'border-dashed border-2 opacity-75' : '' }}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-h3 text-h3 text-on-surface">{{ $tier->tier_name }}</h3>
                            <p class="font-caption text-caption text-secondary mt-1">Tier capacity: {{ $tier->capacity ?: 'Unlimited' }}</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <button type="button" onclick="openEditTierModal({{ $tier->id_tier }}, '{{ htmlspecialchars($tier->tier_name, ENT_QUOTES) }}', {{ $tier->price }}, {{ $tier->capacity }})" class="p-2 text-secondary hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <form action="{{ route('admin.events.tiers.destroy', [$event->id_event, $tier->id_tier]) }}" method="POST" class="m-0" onsubmit="return confirm('Peringatan: Apakah Anda yakin ingin menghapus tier tiket ini? Tindakan ini tidak dapat dibatalkan.');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-2 text-secondary hover:text-error transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="font-body-sm text-body-sm text-primary font-bold">IDR</span>
                        <span class="font-h2 text-h2 text-primary font-black">{{ number_format($tier->price, 0, ',', '.') }}</span>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="font-body-sm text-body-sm text-secondary">Terjual</span>
                            <span class="font-label-md text-label-md text-on-surface font-bold">{{ $sold }} / {{ $tier->capacity ?: '∞' }}</span>
                        </div>
                        <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div class="bg-primary h-full rounded-full {{ $isSoldOut ? 'bg-error w-full' : '' }}" style="width: {{ $pct }}%;"></div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            @if($isSoldOut)
                                <span class="bg-error-container text-on-error-container px-3 py-1 rounded-full font-caption text-caption uppercase font-bold">Sold Out</span>
                            @else
                                <span class="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-caption text-caption">Available</span>
                            @endif
                        </div>
                    </div>
                </div>
                @endforeach

                <!-- Add New Ticket Tier Button -->
                <button type="button" onclick="openAddTierModal()" class="col-span-1 md:col-span-2 lg:col-span-3 mt-4 py-8 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary-fixed/30 hover:border-primary transition-all group">
                    <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-active:scale-90 transition-transform">
                        <span class="material-symbols-outlined">add</span>
                    </div>
                    <span class="font-body-sm text-body-sm font-bold">+ Tambah Tier Tiket</span>
                </button>
            </div>
        </div>

        <!-- Peserta Tab Content -->
        <div id="tab-peserta" class="tab-content hidden">
            <!-- Controls: Search & Filter -->
            <div class="flex flex-col md:flex-row gap-stack-md mb-stack-lg items-center">
                <div class="relative flex-1 w-full">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
                    <input class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors font-body-sm" placeholder="Cari nama atau email peserta..." type="text"/>
                </div>
                <div class="flex gap-stack-sm w-full md:w-auto">
                    <select class="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary">
                        <option>Semua Tier</option>
                        @foreach($event->ticketTiers as $tier)
                            <option>{{ $tier->tier_name }}</option>
                        @endforeach
                    </select>
                    <button class="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold active:scale-95 transition-all">
                        <span class="material-symbols-outlined text-[20px]">download</span>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <!-- Attendee Table Card -->
            <div class="bg-white rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                            <tr>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Peserta</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Email</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Tier</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Waktu Beli</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-center">Status</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-[0.5px] divide-outline-variant">
                            @if($ticketBuyers->isEmpty())
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-secondary">
                                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                                        <p>Belum ada peserta untuk event ini.</p>
                                    </td>
                                </tr>
                            @else
                                @foreach($ticketBuyers as $tb)
                                <tr class="hover:bg-surface-container-lowest transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full border-[0.5px] border-outline-variant bg-surface-container flex items-center justify-center text-primary font-bold">
                                                {{ strtoupper(substr($tb->user->full_name ?? 'G', 0, 1)) }}
                                            </div>
                                            <span class="font-bold text-on-surface">{{ $tb->user->full_name ?? 'Guest' }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-secondary">{{ $tb->user->email ?? '-' }}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-0.5 rounded-full text-caption bg-surface-container-high text-secondary font-bold">
                                            {{ $tb->ticketTier->tier_name ?? 'Tiket' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-secondary">{{ $tb->created_at->format('d M Y, H:i') }}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex justify-center flex-col items-center gap-1">
                                            @if($tb->payment_status === 'success')
                                                <span class="px-3 py-1 rounded-full text-caption bg-green-100 text-green-800 font-bold flex items-center gap-1">
                                                    <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                                    Sukses
                                                </span>
                                            @elseif($tb->payment_status === 'pending')
                                                <span class="px-3 py-1 rounded-full text-caption bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                                                    <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">schedule</span>
                                                    Pending
                                                </span>
                                            @else
                                                <span class="px-3 py-1 rounded-full text-caption bg-surface-container text-secondary font-bold flex items-center gap-1">
                                                    {{ ucfirst($tb->payment_status) }}
                                                </span>
                                            @endif

                                            @if($tb->is_used)
                                                <span class="text-[10px] font-bold text-primary">Hadir</span>
                                            @else
                                                <span class="text-[10px] font-bold text-secondary">Belum Hadir</span>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex justify-end gap-2">
                                            <form action="{{ route('admin.events.tickets.toggle-checkin', [$event->id_event, $tb->id]) }}" method="POST">
                                                @csrf
                                                <button type="submit" class="p-2 text-secondary hover:text-primary transition-colors" title="Check-in Toggle">
                                                    @if($tb->is_used)
                                                        <span class="material-symbols-outlined" style="color:#b22110">toggle_on</span>
                                                    @else
                                                        <span class="material-symbols-outlined">toggle_off</span>
                                                    @endif
                                                </button>
                                            </form>
                                            
                                            @if($tb->payment_status === 'success')
                                            <button type="button" class="p-2 text-error hover:bg-error-container/20 rounded transition-colors" onclick="openRefundModal('{{ $tb->id }}', '{{ addslashes($tb->user->full_name ?? 'Guest') }}', '{{ $tb->gross_amount }}')" title="Refund 93%">
                                                <span class="material-symbols-outlined">assignment_return</span>
                                            </button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <!-- Tenant Tab Content -->
        <div id="tab-tenant" class="tab-content hidden">
            <!-- Tenant Actions -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div class="relative w-full md:w-80">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary" data-icon="search">search</span>
                    <input class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-colors text-body-sm" placeholder="Cari nama tenant..." type="text"/>
                </div>
                <button type="button" onclick="openAddTenantModal()" class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-body-sm hover:opacity-90 transition-opacity">
                    <span class="material-symbols-outlined" data-icon="add">add</span>
                    Tambah Tenant
                </button>
            </div>
            <!-- Tenant List Table Container -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Nama Tenant</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Jenis Booth</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Total Penjualan</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Tenant Cut</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Status Withdrawal</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-[0.5px] divide-outline-variant">
                            @if($tenants->isEmpty())
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-secondary">
                                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">storefront</span>
                                        <p>Belum ada tenant untuk event ini.</p>
                                    </td>
                                </tr>
                            @else
                                @foreach($tenants as $tenant)
                                @php
                                    $sales = \App\Models\WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $tenant->id_user)->sum('amount');
                                    // Use feePercent for cut if applicable, or typical 10%. We use config organizer_tenant_cut which is $tenantCut percentage variable.
                                    // $tenantCut in controller is the total sum.
                                    $tenantCutPct = config('services.platform.organizer_tenant_cut', 10);
                                    $cutAmount = $sales * $tenantCutPct / 100;
                                    $wd = \App\Models\WalletTransaction::where('user_id', $tenant->id_user)->where('type', 'withdrawal')->latest()->first();
                                    
                                    // Use first char for avatar
                                    $initial = strtoupper(substr($tenant->full_name ?? 'T', 0, 1));
                                @endphp
                                <tr class="hover:bg-surface-container-low transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-[0.5px] border-outline-variant text-primary font-bold">
                                                {{ $initial }}
                                            </div>
                                            <span class="font-medium">{{ $tenant->full_name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-secondary">Tenant</td>
                                    <td class="px-6 py-4 font-medium">Rp {{ number_format($sales, 0, ',', '.') }}</td>
                                    <td class="px-6 py-4 text-on-surface-variant">
                                        Rp {{ number_format($cutAmount, 0, ',', '.') }} 
                                        <span class="text-caption bg-surface-container px-1.5 py-0.5 rounded ml-1">({{ $tenantCutPct }}%)</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        @if(!$wd)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-secondary-container text-secondary">Belum Ada</span>
                                        @elseif($wd->status === 'pending_admin' || $wd->status === 'pending_superadmin' || $wd->status === 'pending')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-yellow-100 text-yellow-800">Menunggu</span>
                                        @elseif($wd->status === 'success')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-green-100 text-green-800">Selesai</span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-red-100 text-red-800">Gagal</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        @if($wd && $wd->status === 'pending_admin')
                                            <form action="{{ route('admin.events.withdraw.approve', [$event->id_event, $wd->id]) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-caption font-bold hover:opacity-90 active:scale-95 transition-all">Setujui Withdrawal</button>
                                            </form>
                                        @else
                                            <div class="flex justify-end gap-1 items-center">
                                                <button type="button" onclick="openEditTenantModal({{ $tenant->id_user }}, '{{ htmlspecialchars($tenant->full_name, ENT_QUOTES) }}', '{{ htmlspecialchars($tenant->email, ENT_QUOTES) }}')" class="p-2 text-secondary hover:text-primary transition-colors">
                                                    <span class="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <form action="{{ route('admin.events.tenants.destroy', [$event->id_event, $tenant->id_user]) }}" method="POST" class="m-0 inline" onsubmit="return confirm('Peringatan: Apakah Anda yakin ingin menghapus tenant ini?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="p-2 text-secondary hover:text-error transition-colors flex items-center justify-center">
                                                        <span class="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </form>
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Summary Card -->
            <div class="bg-primary-fixed/30 border-[0.5px] border-primary/20 rounded-xl p-6 flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                    <div>
                        <p class="text-secondary text-caption font-medium uppercase tracking-tight">Estimasi Pendapatan Penyelenggara</p>
                        <h3 class="font-h3 text-on-primary-fixed-variant">Total Tenant Cut masuk ke pendapatan event: <span class="font-bold">Rp {{ number_format($tenantCut, 0, ',', '.') }}</span></h3>
                    </div>
                </div>
                <button class="hidden md:block text-primary font-label-md hover:underline decoration-2 underline-offset-4" onclick="document.querySelector('[data-target=\'tab-keuangan\']').click()">Lihat Laporan Keuangan</button>
            </div>
        </div>



        <!-- Keuangan Tab Content -->
        @php
            $endDateOnly = \Carbon\Carbon::parse($event->end_date)->format('Y-m-d');
            $endDateTimeStr = $endDateOnly . ' ' . ($event->end_time ?? '23:59:00');
            $endDateTime = \Carbon\Carbon::parse($endDateTimeStr, 'Asia/Makassar');
            $isEventEnded = ($event->status === 'ended') || now('Asia/Makassar')->gt($endDateTime);
        @endphp
        <div id="tab-keuangan" class="tab-content hidden">
            <!-- Bento Grid Financial Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Financial Breakdown Card -->
                <div class="lg:col-span-2 bg-white rounded-xl border-[0.5px] border-outline-variant p-6 h-fit">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-h3 text-h3 text-on-surface">Rincian Pendapatan</h3>
                        <span class="material-symbols-outlined text-secondary" data-icon="info">info</span>
                    </div>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Pendapatan Kotor (Tiket + Tenant)</span>
                            <span class="text-body-sm font-medium text-on-surface">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Biaya Platform ({{ $feePercent ?? 10 }}%)</span>
                            <span class="text-body-sm font-medium text-error">–Rp {{ number_format($platformFee, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Potongan Tenant</span>
                            <span class="text-body-sm font-medium text-tertiary">+Rp {{ number_format($tenantCut, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center pt-4">
                            <span class="text-body-lg font-bold text-on-surface">Total Pendapatan Bersih</span>
                            <span class="text-h2 font-black text-primary">Rp {{ number_format($netIncome, 0, ',', '.') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Withdrawal Status Card -->
                <div class="bg-surface-container-low rounded-xl border-[0.5px] border-outline-variant p-6 flex flex-col justify-between">
                    <div>
                        <p class="text-caption text-secondary uppercase tracking-wider font-bold mb-1">Saldo Tersedia</p>
                        <h4 class="text-h2 font-black text-on-surface mb-2">Rp {{ number_format($sisaBisaDitarik, 0, ',', '.') }}</h4>
                        <div class="flex items-center gap-2 text-caption text-secondary">
                            <span class="material-symbols-outlined text-sm" data-icon="account_balance">account_balance</span>
                            <span>Bank Central Asia • **** 8829</span>
                        </div>
                    </div>
                    @if($sisaBisaDitarik > 0)
                        @if($isEventEnded)
                        <button class="w-full mt-8 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onclick="openWithdrawalModal()">
                            <span class="material-symbols-outlined text-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                            Ajukan Penarikan
                        </button>
                        @else
                        <button class="w-full mt-8 bg-surface-container text-secondary py-3 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2" disabled title="Penarikan hanya dapat dilakukan setelah event berakhir">
                            <span class="material-symbols-outlined text-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                            Belum Berakhir
                        </button>
                        @endif
                    @else
                    <button class="w-full mt-8 bg-surface-container text-secondary py-3 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <span class="material-symbols-outlined text-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                        Tidak Ada Saldo
                    </button>
                    @endif
                </div>

                <!-- Withdrawal History Table -->
                <div class="lg:col-span-3 bg-white rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                    <div class="px-6 py-4 border-b-[0.5px] border-outline-variant bg-surface-container-lowest flex justify-between items-center">
                        <h3 class="font-h3 text-h3 text-on-surface">Riwayat Penarikan</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-surface-container-low">
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Tanggal Pengajuan</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">ID Transaksi</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Jumlah</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Status</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-[0.5px] divide-outline-variant">
                                @forelse($eventWithdrawals as $wd)
                                <tr class="hover:bg-surface-container-lowest transition-colors">
                                    <td class="px-6 py-4 text-body-sm text-on-surface">{{ $wd->created_at->format('d M Y, H:i') }}</td>
                                    <td class="px-6 py-4 text-body-sm text-secondary">{{ $wd->order_id }}</td>
                                    <td class="px-6 py-4 text-body-sm font-bold text-on-surface">Rp {{ number_format($wd->amount, 0, ',', '.') }}</td>
                                    <td class="px-6 py-4">
                                        @if($wd->status === 'success')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-green-100 text-green-800">Berhasil</span>
                                        @elseif($wd->status === 'pending_superadmin' || $wd->status === 'pending_admin' || $wd->status === 'pending')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-yellow-100 text-yellow-800">Diproses</span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-red-100 text-red-800">Gagal</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button class="text-secondary hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined" data-icon="description">description</span>
                                        </button>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-8 text-center text-secondary text-body-sm">Belum ada riwayat penarikan.</td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    </section>
</main>

<!-- Mobile Bottom Navigation -->
<nav class="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.dashboard') }}">
        <span class="material-symbols-outlined">grid_view</span>
        <span class="font-label-md text-label-md">Dashboard</span>
    </a>
    <a class="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.events.index') }}">
        <span class="material-symbols-outlined">confirmation_number</span>
        <span class="font-label-md text-label-md">Events</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.scanner') }}">
        <div class="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span class="material-symbols-outlined">center_focus_weak</span>
        </div>
        <span class="font-label-md text-label-md mt-1">Scan</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.finance') }}">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="font-label-md text-label-md">Finance</span>
    </a>
</nav>

<!-- Modal: Konfirmasi Refund -->
<div class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay" id="refund-modal">
    <div class="bg-white w-full max-w-md rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
        <div class="px-6 py-5 border-b-[0.5px] border-outline-variant flex justify-between items-center">
            <h3 class="font-h3 text-h3 text-on-surface">Konfirmasi Refund</h3>
            <button class="text-secondary hover:text-on-surface" onclick="toggleModal('refund-modal')">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6">
            <div class="bg-error-container/20 p-4 rounded-lg mb-6 flex gap-3">
                <span class="material-symbols-outlined text-error">warning</span>
                <p class="text-error font-body-sm">Tindakan ini tidak dapat dibatalkan. Dana (93%) akan dikembalikan ke pembeli, dan tiket akan dibatalkan.</p>
            </div>
            <div class="space-y-4">
                <div>
                    <p class="text-secondary font-label-md mb-1">Nama Peserta</p>
                    <p class="font-bold text-on-surface" id="refund-participant-name">-</p>
                </div>
                <div>
                    <p class="text-secondary font-label-md mb-1">Nama Event</p>
                    <p class="font-bold text-on-surface">{{ $event->title }}</p>
                </div>
                <div>
                    <p class="text-secondary font-label-md mb-1">Jumlah Refund (93%)</p>
                    <p class="text-h2 font-black text-primary" id="refund-amount-text">Rp 0</p>
                </div>
            </div>
        </div>
        <div class="px-6 py-5 bg-surface-container-low flex flex-col md:flex-row-reverse gap-3">
            <form id="refund-form" action="#" method="POST" class="flex-1 w-full">
                @csrf
                <button type="submit" class="w-full py-2.5 bg-error text-white font-bold rounded-lg hover:opacity-90 transition-all active:scale-95">
                    Konfirmasi Refund
                </button>
            </form>
            <button class="flex-1 py-2.5 bg-transparent border-[0.5px] border-outline text-secondary font-bold rounded-lg hover:bg-surface-container-high transition-all" onclick="toggleModal('refund-modal')">
                Batal
            </button>
        </div>
    </div>
</div>

<script>
    // Tab switching logic
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state from all tabs
            tabs.forEach(t => {
                t.classList.remove('border-primary', 'text-primary', 'font-bold');
                t.classList.add('border-transparent', 'text-secondary');
            });
            // Add active state to clicked tab
            tab.classList.remove('border-transparent', 'text-secondary');
            tab.classList.add('border-primary', 'text-primary', 'font-bold');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            // Show target tab content
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Modal Logic
    function toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    function openRefundModal(transactionId, participantName, grossAmount) {
        document.getElementById('refund-participant-name').innerText = participantName;
        
        const amountNum = parseFloat(grossAmount) * 0.93;
        document.getElementById('refund-amount-text').innerText = 'Rp ' + new Intl.NumberFormat('id-ID').format(amountNum);
        
        // Setup form action correctly (Need base URL from Laravel)
        const baseUrl = '{{ url("/admin/events/".$event->id_event."/tickets/") }}';
        document.getElementById('refund-form').action = baseUrl + '/' + transactionId + '/refund';
        
        toggleModal('refund-modal');
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('refund-modal');
            if (modal && !modal.classList.contains('hidden')) toggleModal('refund-modal');
        }
    });
</script>

<!-- Withdrawal Modal Overlay -->
<div class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4" id="withdrawalModal">
    <div class="bg-surface w-full max-w-md rounded-2xl border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
        <div class="p-6 pb-2 border-b-0 flex justify-between items-center mb-2">
            <h3 class="font-h3 text-[22px] font-bold text-on-surface">Tarik Dana</h3>
            <button type="button" class="text-secondary hover:text-on-surface transition-colors" onclick="closeWithdrawalModal()">
                <span class="material-symbols-outlined" data-icon="close">close</span>
            </button>
        </div>
        <form action="{{ route('admin.events.withdraw.event', $event->id_event) }}" method="POST" class="p-6 pt-2">
            @csrf
            
            <div class="mb-5">
                <label class="block font-label-md text-label-md text-secondary mb-1">Nominal (Rp)</label>
                <input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-body-md" 
                       type="number" 
                       name="amount" 
                       max="{{ $sisaBisaDitarik }}" 
                       placeholder="Misal: 1500000" 
                       required />
                <p class="text-caption text-secondary mt-1">Maksimal: Rp {{ number_format($sisaBisaDitarik, 0, ',', '.') }}</p>
            </div>

            <div class="mb-5">
                <label class="block font-label-md text-label-md text-secondary mb-1">Nama Bank / E-Wallet</label>
                <input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-body-md" 
                       type="text" 
                       name="bank_name" 
                       placeholder="Misal: Bank BCA / GoPay" 
                       required />
            </div>

            <div class="mb-8">
                <label class="block font-label-md text-label-md text-secondary mb-1">Nomor Rekening</label>
                <input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-body-md" 
                       type="text" 
                       name="account_number" 
                       placeholder="0123456789" 
                       required />
            </div>
            
            <div class="flex gap-3">
                <button type="button" class="w-1/2 bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeWithdrawalModal()">
                    Batal
                </button>
                <button type="submit" class="w-1/2 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                    Konfirmasi
                </button>
            </div>
        </form>
    </div>
</div>


<!-- Add Tier Modal -->
<div id="addTierModal" class="fixed inset-0 z-[100] hidden bg-on-surface/50 backdrop-blur-sm transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog">
    <div class="flex min-h-screen items-center justify-center p-4">
        <div class="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="addTierModalContent">
            <div class="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 class="text-h3 font-h3 font-bold text-on-surface">Tambah Tier Tiket Baru</h3>
                <button type="button" class="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors" onclick="closeAddTierModal()">
                    <span class="material-symbols-outlined" data-icon="close">close</span>
                </button>
            </div>
            
            <form action="{{ route('admin.events.tiers.store', $event->id_event) }}" method="POST" class="p-6">
                @csrf
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Nama Tier</label>
                        <input name="tier_name" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: VIP, Early Bird" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Harga (IDR)</label>
                        <input name="price" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: 250000" type="number" min="0"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Kuota / Stok Tiket</label>
                        <input name="quota" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: 100" type="number" min="1"/>
                    </div>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                        Simpan Tier
                    </button>
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeAddTierModal()">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openAddTierModal() {
        const modal = document.getElementById('addTierModal');
        const content = document.getElementById('addTierModalContent');
        modal.classList.remove('hidden');
        // trigger reflow
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }

    function closeAddTierModal() {
        const modal = document.getElementById('addTierModal');
        const content = document.getElementById('addTierModalContent');
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
</script>


<!-- Edit Tier Modal -->
<div id="editTierModal" class="fixed inset-0 z-[100] hidden bg-on-surface/50 backdrop-blur-sm transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog">
    <div class="flex min-h-screen items-center justify-center p-4">
        <div class="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="editTierModalContent">
            <div class="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 class="text-h3 font-h3 font-bold text-on-surface">Edit Tier Tiket</h3>
                <button type="button" class="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors" onclick="closeEditTierModal()">
                    <span class="material-symbols-outlined" data-icon="close">close</span>
                </button>
            </div>
            
            <form id="editTierForm" action="" method="POST" class="p-6">
                @csrf
                @method('PUT')
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Nama Tier</label>
                        <input id="edit_tier_name" name="tier_name" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: VIP" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Harga (IDR)</label>
                        <input id="edit_price" name="price" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: 250000" type="number" min="0"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Kuota / Stok Tiket</label>
                        <input id="edit_quota" name="quota" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: 100" type="number" min="1"/>
                    </div>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                        Simpan Perubahan
                    </button>
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeEditTierModal()">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openEditTierModal(tierId, tierName, price, capacity) {
        const modal = document.getElementById('editTierModal');
        const content = document.getElementById('editTierModalContent');
        const form = document.getElementById('editTierForm');
        
        // Populate fields
        document.getElementById('edit_tier_name').value = tierName;
        document.getElementById('edit_price').value = price;
        document.getElementById('edit_quota').value = capacity;
        
        // Update form action dynamically
        form.action = `/admin/events/{{ $event->id_event }}/tiers/${tierId}`;

        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }

    function closeEditTierModal() {
        const modal = document.getElementById('editTierModal');
        const content = document.getElementById('editTierModalContent');
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
</script>


<!-- Add Tenant Modal -->
<div id="addTenantModal" class="fixed inset-0 z-[100] hidden bg-on-surface/50 backdrop-blur-sm transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog">
    <div class="flex min-h-screen items-center justify-center p-4">
        <div class="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="addTenantModalContent">
            <div class="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 class="text-h3 font-h3 font-bold text-on-surface">Tambah Akun Tenant</h3>
                <button type="button" class="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors" onclick="closeAddTenantModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <form action="{{ route('admin.events.tenants.store', $event->id_event) }}" method="POST" class="p-6">
                @csrf
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Nama Tenant (Usaha)</label>
                        <input name="full_name" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: Kedai Kopi" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Email</label>
                        <input name="email" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="email@contoh.com" type="email"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Password</label>
                        <input name="password" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Minimal 8 karakter" type="password" minlength="8"/>
                    </div>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                        Simpan Tenant
                    </button>
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeAddTenantModal()">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Tenant Modal -->
<div id="editTenantModal" class="fixed inset-0 z-[100] hidden bg-on-surface/50 backdrop-blur-sm transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog">
    <div class="flex min-h-screen items-center justify-center p-4">
        <div class="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="editTenantModalContent">
            <div class="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 class="text-h3 font-h3 font-bold text-on-surface">Edit Tenant</h3>
                <button type="button" class="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors" onclick="closeEditTenantModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <form id="editTenantForm" action="" method="POST" class="p-6">
                @csrf
                @method('PUT')
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Nama Tenant (Usaha)</label>
                        <input id="edit_tenant_name" name="full_name" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Email</label>
                        <input id="edit_tenant_email" name="email" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" type="email"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Password Baru (Opsional)</label>
                        <input id="edit_tenant_password" name="password" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" placeholder="Kosongkan jika tidak ingin mengubah password" type="password" minlength="8"/>
                    </div>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                        Simpan Perubahan
                    </button>
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeEditTenantModal()">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    // Withdrawal Modal Functions
    function openWithdrawalModal() {
        const modal = document.getElementById('withdrawalModal');
        modal.classList.remove('hidden');
        // If there's an animation class to reset, do it here. The current HTML uses CSS fade-in
    }

    function closeWithdrawalModal() {
        const modal = document.getElementById('withdrawalModal');
        modal.classList.add('hidden');
    }

    // Add Tenant Modal Functions
    function openAddTenantModal() {
        const modal = document.getElementById('addTenantModal');
        const content = document.getElementById('addTenantModalContent');
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }

    function closeAddTenantModal() {
        const modal = document.getElementById('addTenantModal');
        const content = document.getElementById('addTenantModalContent');
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // Edit Tenant Modal Functions
    function openEditTenantModal(tenantId, tenantName, tenantEmail) {
        const modal = document.getElementById('editTenantModal');
        const content = document.getElementById('editTenantModalContent');
        const form = document.getElementById('editTenantForm');
        
        document.getElementById('edit_tenant_name').value = tenantName;
        document.getElementById('edit_tenant_email').value = tenantEmail;
        document.getElementById('edit_tenant_password').value = ''; // Reset password field
        
        form.action = `/admin/events/{{ $event->id_event }}/tenants/${tenantId}`;

        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }

    function closeEditTenantModal() {
        const modal = document.getElementById('editTenantModal');
        const content = document.getElementById('editTenantModalContent');
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
</script>

</body>
</html>
