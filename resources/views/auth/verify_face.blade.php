<!DOCTYPE html><html lang="id"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">

<!-- Bawaan Sistem Keamanan Fase 1 -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<script defer src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<title>Verifikasi Wajah - SecureGate</title>
<!-- Inter Font -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            securegate: {
              coral: '#f04e37',
              'coral-light': '#fff1f0',
              'coral-muted': 'rgba(240, 78, 55, 0.15)',
              surface: '#fff8f6',
            },
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          borderRadius: {
            'eight': '8px',
          }
        }
      }
    }
  </script>
<style data-purpose="background-animations">
    /* Subtle pulsing coral radial auras for the background */
    body {
      background-color: #fff8f6;
      overflow-x: hidden;
      position: relative;
    }
    .aura-1 {
      position: absolute;
      top: -10%;
      left: -5%;
      width: 40%;
      height: 60%;
      background: radial-gradient(circle, rgba(240,78,55,0.05) 0%, rgba(255,255,255,0) 70%);
      animation: pulse 8s infinite alternate;
      z-index: -1;
    }
    .aura-2 {
      position: absolute;
      bottom: -10%;
      right: -5%;
      width: 40%;
      height: 60%;
      background: radial-gradient(circle, rgba(240,78,55,0.05) 0%, rgba(255,255,255,0) 70%);
      animation: pulse 10s infinite alternate-reverse;
      z-index: -1;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.2); opacity: 1; }
    }
  </style>
<style data-purpose="camera-container-styles">
    /* Hexagonal clipping mask for the camera feed */
    .hex-clip {
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      background: #000;
      position: relative;
      overflow: hidden;
      border: 2px solid #f04e37;
      background: transparent !important;
    }
    /* Scanning line animation */
    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #f04e37;
      box-shadow: 0 0 15px 2px rgba(240,78,55,0.8);
      z-index: 10;
      display: none;
    }
    .scan-line.active {
      display: block;
      animation: scan 3s linear infinite;
    }
    @keyframes scan {
      0% { top: 0; }
      100% { top: 100%; }
    }
    /* Corner reticles */
    .reticle {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 3px solid #f04e37;
      z-index: 20;
      transition: border-color 0.3s;
    }
    .reticle-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
    .reticle-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
    .reticle-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
    .reticle-br { bottom: 20px; right: 20px; border-left: none; border-top: none; }

    .reticles-detected .reticle { border-color: #22c55e; } /* Green color on success detection */
  
    @keyframes soft-pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    .animate-soft-pulse {
      animation: soft-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes smooth-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-smooth-spin {
      animation: smooth-spin 1s linear infinite;
    }
  </style>
<style data-purpose="frosted-glass-card">
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 0.5px solid rgba(240, 78, 55, 0.15);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
    }
  </style>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"></head>
<body class="font-sans min-h-screen flex flex-col text-slate-800">
<!-- BEGIN: Aura Background Elements -->
<div class="aura-1"></div>
<div class="aura-2"></div>
<!-- END: Aura Background Elements -->

<!-- BEGIN: Navigation Header -->
<header class="w-full py-6 px-8 flex justify-between items-center" data-purpose="site-header">
<div class="flex items-center gap-2">
<div class="w-8 h-8 bg-securegate-coral rounded-lg flex items-center justify-center">
<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
</div>
<span class="text-xl font-bold tracking-tight text-slate-900">SecureGate</span>
</div>
<a href="{{ route('landing') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Batal & Kembali</a>
</header>
<!-- END: Navigation Header -->

<main class="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center max-w-6xl">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
<!-- BEGIN: Left Column - Camera -->
<section class="flex flex-col gap-6" data-purpose="camera-section">
<div class="flex items-center gap-4">
<div class="p-3 bg-securegate-coral-light rounded-xl">
<svg class="h-6 w-6 text-securegate-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
</div>
<div>
<h2 class="text-2xl font-bold text-slate-900">Kamera Langsung</h2>
<p class="text-slate-500 text-sm">Posisikan wajah, lalu tekan <span class="text-securegate-coral font-semibold">Ambil Foto</span></p>
</div>
</div>
<!-- Camera Feed Container -->
<div class="relative w-full aspect-video bg-white rounded-2xl border border-slate-100 shadow-xl p-8 flex items-center justify-center overflow-hidden" data-purpose="camera-feed-display">
<!-- Hexagonal Frame -->
<div id="reticleContainer" class="hex-clip w-full h-full max-w-md bg-slate-50 flex items-center justify-center">

<!-- INJEKSI ELEMEN RENDER KAMERA DARI FASE 1 -->
<video id="kycVideo" autoplay muted playsinline class="absolute inset-0 w-full h-full object-cover hidden" style="transform: scaleX(-1); z-index: 1;"></video>
<canvas id="kycCanvas" class="absolute inset-0 w-full h-full pointer-events-none z-[5]" style="transform: scaleX(-1);"></canvas>
<canvas id="previewCanvas" class="absolute inset-0 w-full h-full object-cover hidden z-[12]"></canvas>

<!-- Reticles -->
<div class="reticle reticle-tl"></div>
<div class="reticle reticle-tr"></div>
<div class="reticle reticle-bl"></div>
<div class="reticle reticle-br"></div>
<!-- Scan Line -->
<div id="scanBeam" class="scan-line"></div>
<!-- Placeholder Icon for Camera Content -->
<div class="flex flex-col items-center gap-4 text-slate-300 animate-soft-pulse z-10" id="viewportPlaceholder">
<span class="material-symbols-outlined !text-7xl">face_recognition</span>
<p class="text-slate-500 font-medium tracking-wide" id="placeholderText">Menunggu Akses Kamera...</p>
</div>
</div>
</div>
<!-- Camera Primary CTA -->
<div class="flex gap-4 w-full">
    <button id="btnCapture" onclick="doCapture()" disabled class="flex-grow py-4 bg-securegate-coral hover:bg-[#d8432f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-eight transition-all shadow-lg flex items-center justify-center gap-2" data-purpose="take-photo-btn">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
        </svg>
        Ambil Foto
    </button>

    <button id="btnUse" onclick="doUpload()" style="display:none;" class="flex-grow py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-eight transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fa-solid fa-circle-check"></i> Gunakan Foto
    </button>

    <button id="btnRetake" onclick="doRetake()" style="display:none;" class="py-4 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-eight transition-all flex items-center justify-center gap-2">
        <i class="fa-solid fa-rotate-left"></i>
    </button>
</div>
</section>
<!-- END: Left Column - Camera -->

<!-- BEGIN: Right Column - Information Card -->
<section class="flex flex-col" data-purpose="info-card-section">
<div class="glass-card rounded-2xl p-8 flex flex-col gap-8 h-full">
<!-- Card Header & Description -->
<div class="space-y-6">
<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
<svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
</div>
<div class="space-y-3">
<h1 class="text-3xl font-bold text-slate-900 leading-tight">Verifikasi Wajah untuk Lanjutkan Pembelian</h1>
<p class="text-slate-600 leading-relaxed">
                SecureGate menggunakan biometrik wajah untuk memastikan setiap tiket terhubung dengan identitas asli pemesan.
              </p>
</div>
</div>
<!-- Info Box (Warning) -->
<div class="bg-securegate-coral-light border-l-4 border-securegate-coral p-4 rounded-r-lg" data-purpose="info-box">
<div class="flex gap-3">
<svg class="h-5 w-5 text-securegate-coral shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fill-rule="evenodd"></path>
</svg>
<div class="text-sm text-slate-700">
<span class="font-bold text-securegate-coral">Kebijakan Data Fresh 5 Bulan.</span> Foto wajah wajib diperbarui jika data terakhir sudah lebih dari 5 bulan atau belum pernah dilakukan sebelumnya.
              </div>
</div>
</div>

<!-- AI Loading State -->
<div id="statusBar" class="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 transition-colors" data-purpose="ai-status">
<div class="flex items-center gap-3">
<div class="relative flex h-5 w-5" id="statusDotContainer">
  <span id="statusPing" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-securegate-coral opacity-75"></span>
  <span id="statusDot" class="relative inline-flex rounded-full h-5 w-5 bg-securegate-coral/20 border-2 border-securegate-coral border-t-transparent animate-smooth-spin"></span>
</div>
<span class="font-medium text-slate-700 tracking-tight" id="statusText">Memuat Model AI...</span>
</div>
</div>

<!-- Success Banner (Hidden by default) -->
<div id="successBanner" class="hidden flex-col items-center gap-2 p-6 border-2 border-green-500 bg-green-50 rounded-xl text-center">
    <div class="text-green-500 font-bold mb-1">
        <i class="fa-solid fa-circle-check text-4xl"></i>
    </div>
    <div class="font-bold text-slate-800 text-lg">Identitas Terverifikasi!</div>
    <div class="text-sm text-slate-600">Foto wajah Anda berhasil diamankan dan dienkripsi.<br>Mengarahkan Anda ke dasbor...</div>
</div>

<!-- Instructions List -->
<div class="space-y-4" data-purpose="instructions">
<div class="flex items-start gap-4" id="step1">
<span id="step1num" class="flex items-center justify-center w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors">1</span>
<p class="text-slate-700 text-sm font-medium">Izinkan akses kamera pada browser Anda</p>
</div>
<div class="flex items-start gap-4" id="step2">
<span id="step2num" class="flex items-center justify-center w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors">2</span>
<p class="text-slate-700 text-sm font-medium">Posisikan wajah di dalam bingkai hingga menyala <strong class="text-green-500">hijau</strong></p>
</div>
<div class="flex items-start gap-4" id="step3">
<span id="step3num" class="flex items-center justify-center w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors">3</span>
<div class="text-slate-700 text-sm font-medium">
                Tekan <span class="text-securegate-coral font-bold">Ambil Foto</span> — tinjau preview, lalu konfirmasi
              </div>
</div>
</div>
<!-- Footer Note -->
<footer class="mt-auto pt-6 border-t border-slate-100">
<div class="flex items-center gap-2 text-xs text-slate-400">
<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
<span class="">Foto hanya disimpan di server SecureGate untuk keperluan verifikasi keamanan.</span>
</div>
</footer>
</div>
</section>
<!-- END: Right Column - Information Card -->
</div>
</main>
<footer class="w-full py-8 text-center text-slate-400 text-sm" data-purpose="main-footer">
    © 2024 SecureGate. All rights reserved.
  </footer>

<script>
    'use strict';
    
    // ── DOM refs ───────────────────────────────────────────────────────────
    const video          = document.getElementById('kycVideo');
    const bbCanvas       = document.getElementById('kycCanvas');
    const prevCanvas     = document.getElementById('previewCanvas');
    const placeholder    = document.getElementById('viewportPlaceholder');
    const placeholderTxt = document.getElementById('placeholderText');
    const scanBeam       = document.getElementById('scanBeam');
    const reticleContainer = document.getElementById('reticleContainer');
    const statusBar      = document.getElementById('statusBar');
    const statusDot      = document.getElementById('statusDot');
    const statusPing     = document.getElementById('statusPing');
    const statusText     = document.getElementById('statusText');
    const btnCapture     = document.getElementById('btnCapture');
    const btnUse         = document.getElementById('btnUse');
    const btnRetake      = document.getElementById('btnRetake');
    const successBanner  = document.getElementById('successBanner');
    
    // ── State ─────────────────────────────────────────────────────────────
    let modelsLoaded     = false;
    let cameraActive     = false;
    let mediaStream      = null;
    let detectionRafId   = null;
    let lastScore        = 0;
    let faceDetected     = false;
    let inPreviewMode    = false;
    let uploading        = false;
    
    // ── Helpers ───────────────────────────────────────────────────────────
    function setStatus(type, msg) {
        statusText.textContent = msg;
        
        // Reset classes
        statusDot.className = "relative inline-flex rounded-full h-5 w-5 border-2 border-t-transparent animate-smooth-spin";
        statusPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75";
        statusBar.className = "flex items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors";
        
        if (type === 'loading' || type === 'scanning') {
            statusDot.classList.add('bg-securegate-coral/20', 'border-securegate-coral');
            statusPing.classList.add('bg-securegate-coral');
            statusBar.classList.add('border-slate-200', 'bg-white/50');
        } else if (type === 'detected' || type === 'captured' || type === 'ready') {
            statusDot.classList.add('bg-green-100', 'border-green-500');
            statusDot.classList.remove('animate-smooth-spin', 'border-t-transparent');
            statusPing.classList.add('bg-green-400');
            statusBar.classList.add('border-green-300', 'bg-green-50/50');
        } else if (type === 'error') {
            statusDot.classList.add('bg-red-100', 'border-red-500');
            statusDot.classList.remove('animate-smooth-spin', 'border-t-transparent');
            statusPing.classList.add('hidden');
            statusBar.classList.add('border-red-300', 'bg-red-50/50');
        }
    }
    
    function markStep(n, state = 'done') {
        const num = document.getElementById('step' + n + 'num');
        if (!num) return;
        
        if (state === 'done' || state === 'active') {
            num.className = "flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors shadow-lg shadow-green-500/30";
        } else {
            num.className = "flex items-center justify-center w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold shrink-0 mt-0.5 transition-colors";
        }
    }
    
    async function loadModels() {
        const MODEL_CDN = 'https://justadudewhohacks.github.io/face-api.js/models';
        setStatus('loading', 'Memuat Model AI...');
    
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_CDN);
            modelsLoaded = true;
            activateCamera(); // Automatically activate camera once models load
        } catch (err) {
            setStatus('error', 'Gagal memuat model AI. Periksa koneksi internet.');
        }
    }
    
    async function activateCamera() {
        placeholderTxt.textContent = 'Meminta izin kamera...';
        setStatus('loading', 'Menginisialisasi kamera...');
    
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 720 }, height: { ideal: 560 }, facingMode: 'user' }
            });
    
            video.srcObject = mediaStream;
    
            await new Promise(resolve => {
                video.onloadedmetadata = () => { video.play(); resolve(); };
            });
    
            bbCanvas.width  = video.videoWidth  || 720;
            bbCanvas.height = video.videoHeight || 560;
    
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            cameraActive = true;
    
            markStep(1, 'done');
            markStep(2, 'active');
    
            setStatus('scanning', 'Arahkan wajah ke kamera...');
            scanBeam.classList.add('active');
    
            startDetectionLoop();
        } catch (err) {
            setStatus('error', 'Kamera tidak dapat diakses atau izin ditolak.');
            placeholderTxt.textContent = 'Izin kamera ditolak.';
            placeholder.querySelector('.material-symbols-outlined').textContent = 'no_photography';
        }
    }
    
    async function detectionTick() {
        if (!cameraActive || inPreviewMode) {
            detectionRafId = requestAnimationFrame(detectionTick);
            return;
        }
    
        try {
            const det = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.38 }));
            const ctx  = bbCanvas.getContext('2d');
            ctx.clearRect(0, 0, bbCanvas.width, bbCanvas.height);
    
            if (det) {
                lastScore    = det.score;
                faceDetected = lastScore > 0.60;
    
                const { x, y, width, height } = det.box;
                ctx.strokeStyle = faceDetected ? 'rgba(34,197,94,0.9)' : 'rgba(240,78,55,0.7)';
                ctx.lineWidth   = 2.5;
                ctx.strokeRect(x, y, width, height);
    
                if (faceDetected) {
                    reticleContainer.classList.add('reticles-detected');
                    setStatus('detected', `Wajah terdeteksi — siap diambil`);
                    markStep(2, 'done');
                    markStep(3, 'active');
                    btnCapture.disabled = false;
                } else {
                    reticleContainer.classList.remove('reticles-detected');
                    setStatus('scanning', 'Wajah ditemukan — perbaiki posisi / pencahayaan');
                    btnCapture.disabled = true;
                }
            } else {
                faceDetected = false;
                reticleContainer.classList.remove('reticles-detected');
                setStatus('scanning', 'Arahkan wajah ke kamera...');
                btnCapture.disabled = true;
    
                const ctx2 = bbCanvas.getContext('2d');
                ctx2.clearRect(0, 0, bbCanvas.width, bbCanvas.height);
            }
        } catch (_) {}
    
        detectionRafId = requestAnimationFrame(detectionTick);
    }
    
    function startDetectionLoop() {
        if (detectionRafId) cancelAnimationFrame(detectionRafId);
        video.addEventListener('play', () => {
            detectionRafId = requestAnimationFrame(detectionTick);
        }, { once: true });
    }
    
    function doCapture() {
        if (!faceDetected || inPreviewMode) return;
    
        if (detectionRafId) cancelAnimationFrame(detectionRafId);
        inPreviewMode = true;
    
        prevCanvas.width  = video.videoWidth  || 720;
        prevCanvas.height = video.videoHeight || 560;
    
        const ctx = prevCanvas.getContext('2d');
        ctx.save();
        ctx.translate(prevCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, prevCanvas.width, prevCanvas.height);
        ctx.restore();
    
        const bbCtx = bbCanvas.getContext('2d');
        bbCtx.clearRect(0, 0, bbCanvas.width, bbCanvas.height);
    
        video.classList.add('hidden');
        prevCanvas.classList.remove('hidden');
    
        if (mediaStream) mediaStream.getTracks().forEach(t => t.enabled = false);
    
        scanBeam.classList.remove('active');
        reticleContainer.classList.remove('reticles-detected');
    
        btnCapture.style.display = 'none';
        btnUse.style.display     = 'flex';
        btnRetake.style.display  = 'flex';
        btnUse.disabled          = false;
    
        setStatus('captured', 'Preview foto — periksa sebelum dikirim');
        markStep(3, 'done');
    }
    
    function doRetake() {
        if (!inPreviewMode) return;
        inPreviewMode = false;
    
        if (mediaStream) mediaStream.getTracks().forEach(t => t.enabled = true);
    
        prevCanvas.classList.add('hidden');
        video.classList.remove('hidden');
    
        btnCapture.style.display = 'flex';
        btnCapture.disabled      = true;
        btnUse.style.display     = 'none';
        btnRetake.style.display  = 'none';
    
        scanBeam.classList.add('active');
        setStatus('scanning', 'Arahkan wajah ke kamera...');
        markStep(3, 'active');
    
        detectionRafId = requestAnimationFrame(detectionTick);
    }
    
    async function doUpload() {
        if (uploading) return;
        uploading = true;
    
        btnUse.disabled    = true;
        btnRetake.disabled = true;
        btnUse.innerHTML   = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    
        const base64Image = prevCanvas.toDataURL('image/jpeg', 0.82);
        setStatus('scanning', 'Mengirim foto ke server dan mengenkripsi...');
    
        try {
            const res = await fetch('{{ route('verify.face.capture') }}', {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ image: base64Image }),
            });
    
            const data = await res.json();
    
            if (res.ok && data.status === 'success') {
                if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
                
                statusBar.classList.add('hidden');
                successBanner.classList.remove('hidden');
                successBanner.classList.add('flex');
                btnUse.innerHTML = '<i class="fa-solid fa-check-circle"></i> Terverifikasi!';
    
                setTimeout(() => {
                    window.location.href = data.redirect_url || '{{ route('landing') }}';
                }, 1800);
            } else {
                setStatus('error', data.message ?? 'Terjadi kesalahan server saat menyimpan foto.');
                btnUse.innerHTML   = '<i class="fa-solid fa-circle-check"></i> Gunakan Foto';
                btnUse.disabled    = false;
                btnRetake.disabled = false;
                uploading = false;
            }
        } catch (networkErr) {
            setStatus('error', 'Koneksi ke server gagal. Periksa jaringan internet Anda.');
            btnUse.innerHTML   = '<i class="fa-solid fa-circle-check"></i> Gunakan Foto';
            btnUse.disabled    = false;
            btnRetake.disabled = false;
            uploading = false;
        }
    }
    
    // Boot: wait for face-api.js
    window.addEventListener('load', () => {
        let tries = 0;
        const waitForLib = setInterval(() => {
            tries++;
            if (typeof faceapi !== 'undefined') {
                clearInterval(waitForLib);
                loadModels();
            }
            if (tries > 80) { // ~8 sec timeout
                clearInterval(waitForLib);
                setStatus('error', 'face-api.js gagal dimuat dari CDN. Cek koneksi.');
            }
        }, 100);
    });
</script>
</body>
</html>
