import re

file_path = r'd:\laragon\www\JVC26\gatemate\resources\views\admin\events\show.blade.php'

content = r"""<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>SecureGate - Kelola Event</title>
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
<body class="bg-background text-on-surface">

@php
    $banner = !empty($event->banner_image) ? asset('Media/uploads/'.$event->banner_image) : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
@endphp

<!-- Desktop Side Navigation -->
<aside class="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant py-page-padding hidden md:flex flex-col z-40">
    <div class="px-6 mb-8">
        <h1 class="font-h2 text-h2 font-black text-on-surface">SecureGate</h1>
        <p class="font-caption text-caption text-secondary">Organizer</p>
    </div>
    <nav class="flex-grow">
        <ul class="space-y-1">
            <li class="px-2">
                <a class="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-surface-container-low transition-colors group" href="{{ route('admin.dashboard') }}">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="font-body-sm text-body-sm">Dashboard</span>
                </a>
            </li>
            <li class="px-2">
                <!-- Active State: Event Saya -->
                <a class="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors" href="{{ route('admin.events.index') }}">
                    <span class="material-symbols-outlined">event</span>
                    <span class="font-body-sm text-body-sm">Event Saya</span>
                </a>
            </li>
            <li class="px-2">
                <a class="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-surface-container-low transition-colors" href="{{ route('admin.scanner') }}">
                    <span class="material-symbols-outlined">qr_code_scanner</span>
                    <span class="font-body-sm text-body-sm">Scanner</span>
                </a>
            </li>
            <li class="px-2">
                <a class="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-surface-container-low transition-colors" href="#">
                    <span class="material-symbols-outlined">payments</span>
                    <span class="font-body-sm text-body-sm">Keuangan</span>
                </a>
            </li>
            <li class="px-2">
                <a class="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-surface-container-low transition-colors" href="#">
                    <span class="material-symbols-outlined">settings</span>
                    <span class="font-body-sm text-body-sm">Pengaturan</span>
                </a>
            </li>
        </ul>
    </nav>
    <div class="mt-auto px-2">
        <a class="flex items-center gap-3 px-4 py-3 rounded text-secondary hover:bg-surface-container-low transition-colors" href="#">
            <span class="material-symbols-outlined">help</span>
            <span class="font-body-sm text-body-sm">Bantuan</span>
        </a>
        <form action="{{ route('logout') }}" method="POST" style="display:inline-block; width:100%;">
            @csrf
            <button type="submit" class="w-full text-left flex items-center gap-3 px-4 py-3 text-error mt-2 cursor-pointer active:opacity-80">
                <span class="material-symbols-outlined">logout</span>
                <span class="font-body-sm text-body-sm">Keluar</span>
            </button>
        </form>
    </div>
</aside>

<!-- Mobile Top Bar -->
<header class="md:hidden flex justify-between items-center px-page-padding h-16 w-full bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-40">
    <h1 class="font-h1-mobile text-h1-mobile font-bold text-primary">SecureGate</h1>
    <button class="active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-on-surface">menu</span>
    </button>
</header>

<!-- Main Content Area -->
<main class="md:ml-sidebar-width min-h-screen pb-24 md:pb-page-padding">
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
            <div class="flex gap-3">
                <a href="{{ route('event.show', $event->id_event) }}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-low transition-colors">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                    <span class="font-label-md text-label-md">Public</span>
                </a>
                <a href="{{ route('admin.events.edit', $event->id_event) }}" class="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold active:scale-95 transition-transform">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                    <span class="font-label-md text-label-md">Edit Event</span>
                </a>
            </div>
        </div>
    </section>

    <!-- Tabs Navigation -->
    <section class="max-w-max-container mx-auto mt-10 px-page-padding">
        <div class="flex border-b border-outline-variant overflow-x-auto no-scrollbar">
            <button class="px-8 py-4 border-b-2 border-primary text-primary font-bold font-body-sm text-body-sm whitespace-nowrap">
                Tiket
            </button>
            <button class="px-8 py-4 border-b-2 border-transparent text-secondary hover:text-on-surface font-body-sm text-body-sm transition-colors whitespace-nowrap">
                Peserta
            </button>
            <button class="px-8 py-4 border-b-2 border-transparent text-secondary hover:text-on-surface font-body-sm text-body-sm transition-colors whitespace-nowrap">
                Tenant
            </button>
            <button class="px-8 py-4 border-b-2 border-transparent text-secondary hover:text-on-surface font-body-sm text-body-sm transition-colors whitespace-nowrap">
                Keuangan
            </button>
        </div>

        <!-- Tiket Tab Content -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
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
                    <div class="flex gap-1">
                        <button class="p-2 text-secondary hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button class="p-2 text-secondary hover:text-error transition-colors">
                            <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
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
            <button class="col-span-1 md:col-span-2 lg:col-span-3 mt-4 py-8 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary-fixed/30 hover:border-primary transition-all group">
                <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined">add</span>
                </div>
                <span class="font-body-sm text-body-sm font-bold">+ Tambah Tier Tiket</span>
            </button>
        </div>
    </section>
</main>

<!-- Mobile Bottom Navigation -->
<nav class="md:hidden fixed bottom-0 w-full z-50 bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center gap-1 text-secondary" href="{{ route('admin.dashboard') }}">
        <span class="material-symbols-outlined text-[24px]">grid_view</span>
        <span class="font-label-md text-label-md">Dashboard</span>
    </a>
    <a class="flex flex-col items-center gap-1 text-primary font-bold" href="{{ route('admin.events.index') }}">
        <span class="material-symbols-outlined text-[24px]">confirmation_number</span>
        <span class="font-label-md text-label-md">Events</span>
    </a>
    <a class="flex flex-col items-center gap-1 text-secondary" href="{{ route('admin.scanner') }}">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center -translate-y-4 shadow-lg border-4 border-surface">
            <span class="material-symbols-outlined text-on-primary text-[24px]">center_focus_weak</span>
        </div>
        <span class="font-label-md text-label-md -translate-y-3">Scan</span>
    </a>
    <a class="flex flex-col items-center gap-1 text-secondary" href="#">
        <span class="material-symbols-outlined text-[24px]">account_balance_wallet</span>
        <span class="font-label-md text-label-md">Finance</span>
    </a>
</nav>

<script>
    // Simple micro-interaction for cards
    document.querySelectorAll('.bg-surface-container-lowest').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('scale-[1.01]');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('scale-[1.01]');
        });
    });

    // Tab switching logic (visual only for this prototype)
    const tabs = document.querySelectorAll('button[class*="border-b-2"]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('border-primary', 'text-primary', 'font-bold');
                t.classList.add('border-transparent', 'text-secondary');
            });
            tab.classList.remove('border-transparent', 'text-secondary');
            tab.classList.add('border-primary', 'text-primary', 'font-bold');
        });
    });
</script>
</body>
</html>
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
