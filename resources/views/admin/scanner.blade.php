<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>Scanner QR Tiket - GateMate Organizer</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>

<style>
        body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .scanner-viewport::before {
            content: "";
            position: absolute;
            inset: 0;
            border: 2px solid transparent;
            background: linear-gradient(to right, #b22110 20px, transparent 20px) 0 0,
                        linear-gradient(to bottom, #b22110 20px, transparent 20px) 0 0,
                        linear-gradient(to left, #b22110 20px, transparent 20px) 100% 0,
                        linear-gradient(to bottom, #b22110 20px, transparent 20px) 100% 0,
                        linear-gradient(to right, #b22110 20px, transparent 20px) 0 100%,
                        linear-gradient(to top, #b22110 20px, transparent 20px) 0 100%,
                        linear-gradient(to left, #b22110 20px, transparent 20px) 100% 100%,
                        linear-gradient(to top, #b22110 20px, transparent 20px) 100% 100%;
            background-repeat: no-repeat;
            background-size: 40px 40px;
            z-index: 10;
        }
        .scanner-line {
            height: 2px;
            background: linear-gradient(to right, transparent, #b22110, transparent);
            position: absolute;
            width: 100%;
            top: 0;
            animation: scan 3s ease-in-out infinite;
            z-index: 5;
        }
        @keyframes scan {
            0%, 100% { top: 10%; }
            50% { top: 90%; }
        }

        #reader video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
        }

        .hidden-panel {
            display: none !important;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface": "#fbf9f8",
                      "surface-tint": "#b62413",
                      "on-tertiary-fixed-variant": "#004e5e",
                      "on-error": "#ffffff",
                      "primary-fixed-dim": "#ffb4a7",
                      "background": "#fbf9f8",
                      "surface-container": "#efeded",
                      "surface-dim": "#dbdad9",
                      "primary": "#b22110",
                      "on-tertiary": "#ffffff",
                      "on-primary-fixed": "#400200",
                      "inverse-primary": "#ffb4a7",
                      "on-background": "#1b1c1c",
                      "primary-fixed": "#ffdad4",
                      "secondary": "#5f5e5e",
                      "on-secondary": "#ffffff",
                      "on-primary-fixed-variant": "#910900",
                      "tertiary": "#006579",
                      "on-secondary-fixed-variant": "#474646",
                      "on-primary": "#ffffff",
                      "outline": "#8f706a",
                      "secondary-container": "#e5e2e1",
                      "on-surface": "#1b1c1c",
                      "on-error-container": "#93000a",
                      "inverse-on-surface": "#f2f0f0",
                      "tertiary-fixed-dim": "#68d4f3",
                      "surface-bright": "#fbf9f8",
                      "on-secondary-container": "#656464",
                      "on-primary-container": "#fffbff",
                      "surface-container-high": "#e9e8e7",
                      "primary-container": "#d63b27",
                      "error-container": "#ffdad6",
                      "surface-container-lowest": "#ffffff",
                      "secondary-fixed": "#e5e2e1",
                      "surface-variant": "#e4e2e2",
                      "secondary-fixed-dim": "#c8c6c5",
                      "tertiary-fixed": "#b2ebff",
                      "surface-container-low": "#f5f3f3",
                      "outline-variant": "#e3beb8",
                      "on-surface-variant": "#5b403c",
                      "on-tertiary-fixed": "#001f27",
                      "on-tertiary-container": "#f9fdff",
                      "on-secondary-fixed": "#1c1b1b",
                      "tertiary-container": "#007f99",
                      "inverse-surface": "#303031",
                      "error": "#ba1a1a",
                      "surface-container-highest": "#e4e2e2"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "max-container": "1200px",
                      "stack-md": "16px",
                      "stack-lg": "24px",
                      "page-padding": "24px",
                      "sidebar-width": "240px",
                      "gutter": "16px",
                      "stack-sm": "8px"
              },
              "fontFamily": {
                      "label-md": ["Inter"],
                      "h1-mobile": ["Inter"],
                      "body-sm": ["Inter"],
                      "h2": ["Inter"],
                      "caption": ["Inter"],
                      "body-lg": ["Inter"],
                      "h3": ["Inter"],
                      "h1": ["Inter"]
              },
              "fontSize": {
                      "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                      "h1-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "500"}],
                      "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                      "caption": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                      "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                      "h3": ["20px", {"lineHeight": "28px", "fontWeight": "500"}],
                      "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500"}]
              }
            },
          },
        }
    </script>
</head>
<body class="bg-surface text-on-surface">

<!-- Side Navigation (Desktop) -->
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
        <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.scanner') }}">
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

<!-- Top App Bar -->
<header class="flex justify-between items-center h-16 px-gutter fixed top-0 left-0 right-0 md:ml-[240px] bg-surface border-b border-outline-variant z-30">
    <div class="flex items-center gap-4">
        <h1 class="font-h3 text-h3 font-black text-primary md:hidden">GateMate</h1>
    </div>
    <div class="flex items-center gap-2">
        <span class="font-label-md text-label-md text-secondary hidden md:block" id="currentDateDisplay"></span>
    </div>
</header>

<!-- Main Content Area -->
<main class="pt-16 md:ml-[240px] min-h-screen">
<div class="max-w-max-container mx-auto p-page-padding">
    <header class="mb-stack-lg">
        <h2 class="font-h1 text-h1 text-on-surface">Pemindaian Tiket</h2>
        <p class="font-body-lg text-body-lg text-secondary">Arahkan kamera ke QR code tiket atau masukkan ID secara manual.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <!-- Scanner Interface Column -->
        <div class="lg:col-span-7 flex flex-col gap-stack-lg">
            <!-- Camera Viewfinder Card -->
            <div class="bg-surface-container-lowest rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                <div class="p-stack-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary" data-icon="videocam">videocam</span>
                        <span class="font-label-md text-label-md font-bold" id="camStatusLabel">Kamera Siap</span>
                    </div>
                    <div class="flex gap-2 items-center" id="camLiveIndicator" style="display:none;">
                        <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span class="font-caption text-caption uppercase tracking-wider font-bold text-primary">Live</span>
                    </div>
                </div>
                
                <div class="relative aspect-video bg-black overflow-hidden">
                    <!-- Target element for html5-qrcode -->
                    <div id="reader" class="absolute inset-0 w-full h-full object-cover z-10 bg-black"></div>

                    <!-- Scanner Overlay -->
                    <div class="scanner-viewport absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-20 pointer-events-none" id="scanOverlay" style="display:none;">
                        <div class="scanner-line"></div>
                    </div>
                    
                    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-2 w-full px-6 max-w-xs items-center">
                        <button id="btnStart" onclick="startScanner()" class="w-full text-white bg-primary backdrop-blur-md px-6 py-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-all font-bold shadow-lg flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined" style="font-size: 18px;">qr_code_scanner</span> Mulai Scanner
                        </button>
                        <button id="btnRescan" onclick="resetAll()" class="hidden w-full text-on-surface bg-white/90 backdrop-blur-md px-6 py-2 rounded-full font-label-md text-label-md hover:bg-white transition-all font-bold shadow flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span> Scan Berikutnya
                        </button>
                    </div>
                </div>
            </div>

            <!-- Manual Entry Card -->
            <div class="bg-surface-container-lowest rounded-xl border-[0.5px] border-outline-variant p-stack-lg">
                <label class="font-label-md text-label-md font-bold text-on-surface mb-2 block">Input Manual ID Tiket</label>
                <div class="flex gap-3">
                    <input id="manualInput" class="flex-grow bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all font-body-sm text-body-sm" placeholder="Contoh: SG-99283-AX" type="text"/>
                    <button onclick="processScan(document.getElementById('manualInput').value)" class="bg-primary text-white font-label-md text-label-md px-8 py-3 rounded-lg hover:opacity-90 active:opacity-80 transition-all font-bold">
                        Verifikasi
                    </button>
                </div>
            </div>
        </div>

        <!-- Results Panel Column -->
        <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest rounded-xl border-[0.5px] border-outline-variant h-full overflow-hidden flex flex-col">
                <div class="p-stack-md border-b border-outline-variant bg-surface-container-low">
                    <h3 class="font-label-md text-label-md font-bold text-on-surface" id="panelTitle">Hasil Pemindaian</h3>
                </div>
                
                <!-- Placeholder / Initial State -->
                <div id="resultPlaceholder" class="p-stack-lg flex flex-col flex-grow items-center justify-center text-center">
                    <span class="material-symbols-outlined text-6xl text-surface-variant mb-4">qr_code</span>
                    <p class="text-secondary font-body-sm">Belum ada tiket yang dipindai.</p>
                </div>

                <!-- Scan Result Content -->
                <div id="resultContent" class="p-stack-lg flex flex-col flex-grow hidden-panel">
                    
                    <!-- Attendee Profile -->
                    <div class="flex flex-col items-center mb-stack-lg">
                        <div class="relative mb-4">
                            <div class="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary">
                                <img id="resPhoto" alt="Attendee Photo" class="w-full h-full object-cover" src=""/>
                            </div>
                            <div id="resStatusIcon" class="absolute -bottom-2 -right-2 bg-tertiary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest">
                                <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                            </div>
                        </div>
                        <h2 class="font-h2 text-h2 text-on-surface font-black text-center" id="resName">Alex Thompson</h2>
                        <div id="resTierBadge" class="mt-2 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                            <span class="material-symbols-outlined text-[14px] mr-1" style="font-variation-settings: 'FILL' 1;">stars</span>
                            <span class="font-caption text-caption font-bold uppercase tracking-wider" id="resTier">VIP PASS</span>
                        </div>
                    </div>

                    <!-- Status Banner / KYC Section (Reused for messages) -->
                    <div id="resBanner" class="bg-surface-container-low p-4 rounded-lg border-[0.5px] border-outline-variant mb-stack-lg">
                        <div class="flex items-center gap-2 text-on-tertiary-fixed-variant mb-1">
                            <span class="material-symbols-outlined" id="resBannerIcon">verified_user</span>
                            <span class="font-label-md text-label-md font-bold" id="resBannerTitle">KYC Match Confirmed</span>
                        </div>
                        <p class="font-caption text-caption text-secondary" id="resBannerDesc">Identity verified.</p>
                    </div>

                    <!-- Ticket Details -->
                    <div class="space-y-4 mb-stack-lg flex-grow">
                        <div class="flex justify-between items-center py-3 border-b border-outline-variant border-dashed">
                            <span class="font-label-md text-label-md text-secondary">Nomor Tiket</span>
                            <span class="font-label-md text-label-md font-bold text-on-surface" id="resOrderId">#SG-99283-AX</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-outline-variant border-dashed">
                            <span class="font-label-md text-label-md text-secondary">Event</span>
                            <span class="font-label-md text-label-md font-bold text-on-surface text-right max-w-[60%]" id="resEventName">Summer Fest</span>
                        </div>
                    </div>

                    <!-- Stats/Info -->
                    <div class="grid grid-cols-2 gap-4 mb-stack-lg">
                        <div class="bg-surface p-3 rounded border-[0.5px] border-outline-variant">
                            <span class="block font-caption text-caption text-secondary uppercase">Waktu Scan</span>
                            <span class="block font-label-md text-label-md font-bold" id="resTime">14:32 PM</span>
                        </div>
                        <div class="bg-surface p-3 rounded border-[0.5px] border-outline-variant">
                            <span class="block font-caption text-caption text-secondary uppercase">Status</span>
                            <span class="block font-label-md text-label-md font-bold" id="resCheckStatus">Checked In</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-auto flex flex-col gap-3">
                        <button id="btnFinish" onclick="resetAll()" class="w-full bg-primary text-white py-4 rounded-xl font-h3 text-h3 font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                            Selesai & Scan Lagi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity Log (Asymmetric/Bento Style) -->
    <div class="mt-stack-lg">
        <h3 class="font-h3 text-h3 text-on-surface mb-stack-md">Aktivitas Terkini</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="histList">
            <!-- Items injected by JS -->
        </div>
    </div>
</div>
</main>

<!-- Bottom Nav for Mobile Only -->
<nav class="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.dashboard') }}">
        <span class="material-symbols-outlined">grid_view</span>
        <span class="font-label-md text-label-md">Dashboard</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.events.index') }}">
        <span class="material-symbols-outlined">confirmation_number</span>
        <span class="font-label-md text-label-md">Events</span>
    </a>
    <a class="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.scanner') }}">
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

<!-- Injecting Backend Variables & Scanner Logic -->
<script>
    'use strict';

    // Current Date Formatter
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('id-ID', dateOpts);

    /* ── Route URLs passed from Blade ── */
    const ROUTE_VERIFY  = '{{ route("admin.scanner.validate") }}';
    
    /* ── State ── */
    let scanner       = null;
    let isScanning    = false;
    let isProcessing  = false;
    let histCount     = 0;

    /* ── DOM Refs ── */
    const btnStart = document.getElementById('btnStart');
    const btnRescan = document.getElementById('btnRescan');
    const scanOverlay = document.getElementById('scanOverlay');
    const camStatusLabel = document.getElementById('camStatusLabel');
    const camLiveIndicator = document.getElementById('camLiveIndicator');
    const resultContent = document.getElementById('resultContent');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const histList = document.getElementById('histList');

    function beep(freq = 880, dur = 120, vol = 0.28) {
        try {
            const ctx  = new (window.AudioContext || window.webkitAudioContext)();
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type            = 'sine';
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur / 1000);
        } catch (_) {}
    }

    function addHistory(type, name, desc) {
        const item = document.createElement('div');
        item.className = 'bg-surface-container-lowest border-[0.5px] border-outline-variant p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300';
        
        let iconHtml = '';
        if(type === 'success') {
            iconHtml = `<div class="w-10 h-10 rounded-full bg-green-100 flex flex-shrink-0 items-center justify-center text-green-700">
                <span class="material-symbols-outlined text-[20px]">check</span>
            </div>`;
        } else {
            iconHtml = `<div class="w-10 h-10 rounded-full bg-red-100 flex flex-shrink-0 items-center justify-center text-red-700">
                <span class="material-symbols-outlined text-[20px]">close</span>
            </div>`;
        }
        
        item.innerHTML = `
            ${iconHtml}
            <div class="overflow-hidden">
                <p class="font-label-md text-label-md font-bold truncate">${name}</p>
                <p class="font-caption text-caption text-secondary truncate">${desc}</p>
            </div>
        `;
        
        histList.insertBefore(item, histList.firstChild);
        if(histList.children.length > 4) {
            histList.removeChild(histList.lastChild);
        }
    }

    function startScanner() {
        btnStart.disabled = true;
        btnStart.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Memulai...';
        camStatusLabel.textContent = "Mengakses Kamera...";

        scanner = new Html5Qrcode('reader', { verbose: false });

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                let cameraId = devices[0].id; 
                for (let i = 0; i < devices.length; i++) {
                    if (devices[i].label.toLowerCase().includes('back') || devices[i].label.toLowerCase().includes('environment')) {
                        cameraId = devices[i].id;
                        break;
                    }
                }
                
                scanner.start(
                    cameraId, 
                    { fps: 15, qrbox: { width: 250, height: 250 } },
                    processScan
                ).then(() => {
                    isScanning = true;
                    scanOverlay.style.display = 'block';
                    btnStart.classList.add('hidden');
                    btnRescan.classList.remove('hidden');
                    camStatusLabel.textContent = "Kamera Aktif";
                    camLiveIndicator.style.display = 'flex';
                }).catch(err => {
                    alert("Error Kamera: Pastikan URL menggunakan HTTPS dan izin kamera diberikan.");
                    resetCameraState();
                });
            } else {
                alert("Tidak ada kamera yang terdeteksi di perangkat ini.");
                resetCameraState();
            }
        }).catch(err => {
            alert("Kamera diblokir oleh browser. Cek izin keamanan Anda.");
            resetCameraState();
        });
    }

    function resetCameraState() {
        btnStart.disabled = false;
        btnStart.innerHTML = '<span class="material-symbols-outlined">qr_code_scanner</span> Mulai Scanner';
        camStatusLabel.textContent = "Kamera Ditolak";
    }

    async function processScan(decodedText) {
        if (!decodedText || isProcessing) return;
        isProcessing = true;

        if (scanner && isScanning) {
            try { await scanner.pause(true); } catch (_) {}
        }
        
        document.getElementById('manualInput').value = '';

        beep(880, 90, 0.2);
        
        resultPlaceholder.classList.add('hidden-panel');
        resultContent.classList.remove('hidden-panel');
        
        // Loading state
        document.getElementById('resName').textContent = 'Memverifikasi...';
        document.getElementById('resBannerDesc').textContent = 'Menghubungi server...';

        try {
            const res = await fetch(ROUTE_VERIFY, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ order_id: decodedText }),
            });

            const data = await res.json();
            const now = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
            
            // Elements
            const resPhoto = document.getElementById('resPhoto');
            const resStatusIcon = document.getElementById('resStatusIcon');
            const resTierBadge = document.getElementById('resTierBadge');
            const resBanner = document.getElementById('resBanner');
            const resBannerIcon = document.getElementById('resBannerIcon');
            const resBannerTitle = document.getElementById('resBannerTitle');
            const resBannerDesc = document.getElementById('resBannerDesc');

            if (data.success) {
                // SUCCESS
                const d = data.data;
                
                beep(880, 100, 0.3);
                setTimeout(() => beep(1047, 100, 0.3), 140);
                setTimeout(() => beep(1319, 180, 0.28), 280);

                resPhoto.src = d.profile_picture_url;
                resPhoto.onerror = function() {
                    this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(d.holder_name) + '&background=1e293b&color=94a3b8&size=200&bold=true';
                };
                
                document.getElementById('resName').textContent = d.holder_name;
                document.getElementById('resTier').textContent = d.tier_name;
                document.getElementById('resOrderId').textContent = '#' + d.order_id;
                document.getElementById('resEventName').textContent = d.event_name;
                document.getElementById('resTime').textContent = now;
                document.getElementById('resCheckStatus').textContent = 'Valid & Checked In';
                document.getElementById('resCheckStatus').className = 'block font-label-md text-label-md font-bold text-tertiary';

                resStatusIcon.className = "absolute -bottom-2 -right-2 bg-tertiary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest";
                resStatusIcon.innerHTML = `<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>`;
                
                resTierBadge.className = "mt-2 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full";
                
                resBanner.className = "bg-teal-50 p-4 rounded-lg border-[0.5px] border-teal-200 mb-stack-lg";
                resBannerIcon.textContent = "verified_user";
                resBannerIcon.className = "material-symbols-outlined text-teal-700";
                resBannerTitle.textContent = "Check-in Berhasil";
                resBannerTitle.className = "font-label-md text-label-md font-bold text-teal-800";
                resBannerDesc.textContent = data.message;
                resBannerDesc.className = "font-caption text-caption text-teal-700";
                
                document.getElementById('btnFinish').className = "w-full bg-primary text-white py-4 rounded-xl font-h3 text-h3 font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20";

                addHistory('success', d.holder_name, 'Approved • Just now');
                
            } else {
                // FAILED / INVALID
                beep(200, 380, 0.3);
                
                resPhoto.src = 'https://ui-avatars.com/api/?name=X&background=fee2e2&color=b91c1c&size=200';
                
                document.getElementById('resName').textContent = "Tiket Ditolak";
                document.getElementById('resTier').textContent = "INVALID";
                document.getElementById('resOrderId').textContent = decodedText.substring(0, 15) + '...';
                document.getElementById('resEventName').textContent = "—";
                document.getElementById('resTime').textContent = now;
                document.getElementById('resCheckStatus').textContent = 'Ditolak';
                document.getElementById('resCheckStatus').className = 'block font-label-md text-label-md font-bold text-error';
                
                resStatusIcon.className = "absolute -bottom-2 -right-2 bg-error text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest";
                resStatusIcon.innerHTML = `<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">cancel</span>`;
                
                resTierBadge.className = "mt-2 inline-flex items-center px-3 py-1 bg-error-container text-on-error-container rounded-full";
                
                resBanner.className = "bg-error-container p-4 rounded-lg border-[0.5px] border-error mb-stack-lg";
                resBannerIcon.textContent = "warning";
                resBannerIcon.className = "material-symbols-outlined text-error";
                resBannerTitle.textContent = "Validasi Gagal";
                resBannerTitle.className = "font-label-md text-label-md font-bold text-on-error-container";
                resBannerDesc.textContent = data.message;
                resBannerDesc.className = "font-caption text-caption text-on-error-container";
                
                document.getElementById('btnFinish').className = "w-full bg-surface-container-high text-on-surface py-4 rounded-xl font-h3 text-h3 font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2";

                addHistory('error', 'Invalid Scan', 'Denied • Just now');
            }

        } catch (err) {
            console.error(err);
            beep(200, 300, 0.3);
            alert("Koneksi gagal. Periksa jaringan Anda.");
        }
        
        isProcessing = false;
    }

    async function resetAll() {
        resultContent.classList.add('hidden-panel');
        resultPlaceholder.classList.remove('hidden-panel');
        document.getElementById('manualInput').value = '';

        if (scanner && isScanning) {
            try { await scanner.resume(); } catch (_) {}
        }
        isProcessing = false;
    }
</script>

</body></html>