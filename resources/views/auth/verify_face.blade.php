<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Verifikasi Wajah – SecureGate</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    {{-- face-api.js – TinyFaceDetector real-time detection --}}
    <script defer src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>

    <style>
        /* ─── Design tokens ────────────────────────────────────────────────────── */
        :root {
            --bg:       #06090f;
            --glass:    rgba(13, 20, 38, 0.82);
            --glass-2:  rgba(20, 30, 54, 0.70);
            --border:   rgba(255, 255, 255, 0.08);
            --border-g: rgba(74, 222, 128, 0.22);
            --text:     #f1f5f9;
            --muted:    #64748b;
            --primary:  #4ade80;
            --blue:     #3b82f6;
            --warn:     #f59e0b;
            --success:  #10b981;
            --danger:   #ef4444;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 88px 16px 48px;
            position: relative;
            overflow-x: hidden;
        }

        /* ── Ambient background ── */
        body::before {
            content: '';
            position: fixed; inset: 0;
            background:
                radial-gradient(ellipse 75% 55% at 12% 8%,   rgba(59,130,246,0.13) 0%, transparent 60%),
                radial-gradient(ellipse 55% 50% at 88% 90%,  rgba(74,222,128,0.10) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 50% 50%,  rgba(99,102,241,0.05) 0%, transparent 70%);
            z-index: -1; pointer-events: none;
        }

        /* ── Navbar ── */
        .top-nav {
            position: fixed;
            top: 0; left: 0; right: 0; height: 64px;
            display: flex; align-items: center; padding: 0 28px;
            background: rgba(6, 9, 15, 0.88);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
            z-index: 100;
        }
        .brand {
            font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px;
            background: linear-gradient(135deg, var(--blue), var(--primary));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 auto;
        }
        .nav-back {
            font-size: 0.88rem; font-weight: 600; color: var(--muted);
            text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
            transition: color 0.2s;
        }
        .nav-back:hover { color: var(--text); }

        /* ── Two-column layout ── */
        .kyc-layout {
            width: 100%; max-width: 1020px;
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 28px;
            align-items: start;
        }

        /* ── Glassmorphism card ── */
        .glass-card {
            background: var(--glass);
            backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 24px 60px -12px rgba(0,0,0,0.6);
            position: relative; overflow: hidden;
        }
        /* Top edge glow */
        .glass-card::before {
            content: '';
            position: absolute; top: 0; left: 50%; transform: translateX(-50%);
            width: 50%; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent);
        }

        /* ══════════════════════════════════════════
           LEFT: Camera Panel
        ══════════════════════════════════════════ */
        .cam-header {
            display: flex; align-items: center; gap: 12px;
            margin-bottom: 18px;
        }
        .cam-header-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2);
            display: flex; align-items: center; justify-content: center;
            color: var(--primary); font-size: 0.95rem; flex-shrink: 0;
        }
        .cam-header-text h2 { font-size: 0.97rem; font-weight: 700; color: var(--text); }
        .cam-header-text p  { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }

        /* ── Viewport (video / preview canvas share the same slot) ── */
        .viewport-wrap {
            position: relative;
            width: 100%;
            aspect-ratio: 4/3;
            border-radius: 16px;
            background: #000;
            overflow: hidden;
        }

        /* Placeholder overlay (shown before camera starts) */
        #viewportPlaceholder {
            position: absolute; inset: 0; z-index: 15;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 12px;
            background: rgba(0,0,0,0.72);
            transition: opacity 0.35s;
        }
        #viewportPlaceholder.hidden { opacity: 0; pointer-events: none; }

        .ph-icon {
            width: 68px; height: 68px; border-radius: 50%;
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.7rem; color: rgba(74,222,128,0.4);
        }
        .ph-text { font-size: 0.82rem; color: var(--muted); text-align: center; line-height: 1.4; }

        /* Live video element */
        #kycVideo {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            display: none;           /* hidden until camera starts */
            transform: scaleX(-1);   /* mirror */
        }
        #kycVideo.active { display: block; }

        /* Canvas overlay for bounding box (mirrored to match video) */
        #kycCanvas {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            transform: scaleX(-1);
            z-index: 5;
        }

        /* Preview canvas (shown after capture, full slot) */
        #previewCanvas {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            border-radius: 16px;
            display: none;           /* hidden until capture */
            z-index: 12;
        }
        #previewCanvas.visible { display: block; }

        /* Corner bracket decorations */
        .vp-corner {
            position: absolute;
            width: 26px; height: 26px;
            border-color: var(--primary); border-style: solid;
            z-index: 10;
            opacity: 0.7;
        }
        .vp-tl { top:10px; left:10px;   border-width:3px 0 0 3px; border-radius:4px 0 0 0; }
        .vp-tr { top:10px; right:10px;  border-width:3px 3px 0 0; border-radius:0 4px 0 0; }
        .vp-bl { bottom:10px; left:10px;  border-width:0 0 3px 3px; border-radius:0 0 0 4px; }
        .vp-br { bottom:10px; right:10px; border-width:0 3px 3px 0; border-radius:0 0 4px 0; }

        /* Scan beam */
        .scan-beam {
            position: absolute; left:0; right:0; height:2px;
            background: linear-gradient(90deg, transparent, rgba(74,222,128,0.9) 50%, transparent);
            box-shadow: 0 0 12px rgba(74,222,128,0.55);
            z-index: 8;
            top: 0%;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .scan-beam.active {
            opacity: 1;
            animation: beamSweep 2.2s ease-in-out infinite;
        }
        @keyframes beamSweep {
            0%   { top:8%; }
            100% { top:92%; }
        }

        /* Face oval guide */
        .face-oval {
            position: absolute; top:50%; left:50%;
            transform: translate(-50%,-50%);
            width: 42%; height: 72%;
            border: 2px solid rgba(74,222,128,0.28);
            border-radius: 50%;
            z-index: 8;
            transition: border-color 0.25s, box-shadow 0.25s;
        }
        .face-oval.detected {
            border-color: rgba(74,222,128,0.85);
            box-shadow: 0 0 26px rgba(74,222,128,0.3) inset,
                        0 0 26px rgba(74,222,128,0.25);
        }

        /* ── Status bar below viewport ── */
        .status-bar {
            margin-top: 12px;
            display: flex; align-items: center; gap: 9px;
            padding: 9px 13px;
            background: rgba(0,0,0,0.28);
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 0.8rem; color: var(--muted); min-height: 40px;
            transition: border-color 0.3s;
        }
        .status-bar.face-found { border-color: rgba(74,222,128,0.35); }
        .status-bar.captured   { border-color: rgba(16,185,129,0.4); }
        .status-bar.uploading  { border-color: rgba(59,130,246,0.4); }
        .status-bar.error-bar  { border-color: rgba(239,68,68,0.4); }

        .status-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: var(--muted); flex-shrink: 0;
            transition: background 0.3s;
        }
        .status-dot.loading   { background: var(--warn);    animation: dotBlink 1s ease-in-out infinite; }
        .status-dot.ready     { background: var(--blue); }
        .status-dot.scanning  { background: var(--primary); animation: dotBlink 0.9s ease-in-out infinite; }
        .status-dot.detected  { background: var(--primary); }
        .status-dot.captured  { background: var(--success); }
        .status-dot.uploading { background: var(--blue);    animation: dotBlink 0.6s ease-in-out infinite; }
        .status-dot.error     { background: var(--danger); }
        @keyframes dotBlink {
            0%,100% { opacity:1; transform:scale(1); }
            50%      { opacity:0.35; transform:scale(0.65); }
        }

        /* ── Action button row below viewport ── */
        .cam-actions {
            margin-top: 14px;
            display: flex;
            gap: 10px;
        }

        /* ── Generic button styles ── */
        .btn {
            flex: 1; padding: 12px 16px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700;
            border: none; cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.22s;
            position: relative; overflow: hidden;
            white-space: nowrap;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

        /* Button A – Ambil Foto (green accent) */
        .btn-capture {
            background: linear-gradient(135deg, var(--primary), #22c55e);
            color: #052e16;
            box-shadow: 0 4px 18px rgba(74,222,128,0.28);
        }
        .btn-capture:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 7px 26px rgba(74,222,128,0.42);
        }

        /* Button B – Gunakan Foto Ini (blue/indigo) */
        .btn-use {
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            color: #fff;
            box-shadow: 0 4px 18px rgba(99,102,241,0.28);
        }
        .btn-use:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 7px 26px rgba(99,102,241,0.42);
        }

        /* Button C – Foto Ulang (ghost/muted) */
        .btn-retake {
            background: rgba(255,255,255,0.06);
            color: var(--text);
            border: 1px solid var(--border);
            flex: 0 0 auto; padding: 12px 18px;
        }
        .btn-retake:hover:not(:disabled) {
            background: rgba(255,255,255,0.12);
            transform: translateY(-1px);
        }

        /* Main CTA in right panel */
        .btn-start {
            width: 100%; padding: 14px;
            background: linear-gradient(135deg, var(--primary), #22c55e);
            color: #052e16;
            font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 800;
            border: none; border-radius: 14px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 10px;
            box-shadow: 0 4px 22px rgba(74,222,128,0.28);
            transition: all 0.25s; letter-spacing: -0.2px;
            margin-bottom: 20px;
        }
        .btn-start:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(74,222,128,0.42);
        }
        .btn-start:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ══════════════════════════════════════════
           RIGHT: Info Panel
        ══════════════════════════════════════════ */
        .kyc-icon-wrap {
            width: 60px; height: 60px; border-radius: 16px;
            background: rgba(74,222,128,0.09); border: 1px solid rgba(74,222,128,0.2);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.65rem; color: var(--primary);
            margin-bottom: 18px;
        }
        .kyc-title {
            font-size: 1.4rem; font-weight: 800; line-height: 1.25;
            margin-bottom: 9px; color: var(--text);
        }
        .kyc-subtitle {
            font-size: 0.84rem; color: var(--muted); line-height: 1.65;
            margin-bottom: 22px;
        }

        /* Policy banner */
        .policy-banner {
            background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.2);
            border-radius: 13px; padding: 13px 14px;
            display: flex; align-items: flex-start; gap: 10px;
            margin-bottom: 22px;
        }
        .policy-banner > i { color: var(--warn); font-size: 0.9rem; margin-top: 2px; flex-shrink: 0; }
        .policy-text { font-size: 0.78rem; color: #cbd5e1; line-height: 1.6; }
        .policy-text strong { color: var(--warn); }

        /* Confidence badge */
        .conf-badge {
            display: none; align-items: center; gap: 8px;
            padding: 7px 12px;
            background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
            border-radius: 10px; font-size: 0.76rem; color: var(--primary);
            margin-bottom: 14px;
            transition: opacity 0.3s;
        }
        .conf-badge.visible { display: flex; }

        /* Steps */
        .divider { height: 1px; background: var(--border); margin: 18px 0; }
        .steps { display: flex; flex-direction: column; gap: 8px; }
        .step {
            display: flex; align-items: flex-start; gap: 10px;
            font-size: 0.78rem; color: var(--muted); line-height: 1.45;
            transition: color 0.3s;
        }
        .step-num {
            width: 21px; height: 21px; min-width: 21px; border-radius: 50%;
            background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25);
            color: var(--blue); font-size: 0.68rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .step.done { color: var(--text); }
        .step.done .step-num {
            background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.3);
            color: var(--primary);
        }
        .step.active { color: var(--text); }
        .step.active .step-num {
            background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.35);
            color: #818cf8; animation: dotBlink 1.2s ease-in-out infinite;
        }

        /* Success state card overlay */
        .success-banner {
            display: none;
            flex-direction: column; align-items: center; gap: 10px;
            padding: 20px 16px;
            background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25);
            border-radius: 14px; text-align: center; margin-bottom: 16px;
        }
        .success-banner.visible { display: flex; }
        .success-banner i { font-size: 2.4rem; color: var(--success); }
        .success-banner p { font-size: 0.88rem; color: #a7f3d0; line-height: 1.5; }
        .success-banner strong { color: var(--success); font-size: 1rem; }

        /* Responsive */
        @media (max-width: 860px) {
            .kyc-layout { grid-template-columns: 1fr; max-width: 560px; }
        }
        @media (max-width: 480px) {
            body { padding-left: 10px; padding-right: 10px; }
            .glass-card { padding: 20px 16px; }
            .kyc-title { font-size: 1.25rem; }
            .btn { font-size: 0.82rem; padding: 11px 12px; }
        }
    </style>
</head>
<body>

    {{-- ── Navbar ── --}}
    <nav class="top-nav">
        <a href="{{ route('landing') }}" class="nav-back">
            <i class="fa-solid fa-arrow-left"></i> Kembali
        </a>
        <span class="brand">SecureGate</span>
    </nav>

    {{-- ══════════════════════════════════════════
         Main layout
    ══════════════════════════════════════════ --}}
    <div class="kyc-layout">

        {{-- ═══ LEFT: Camera Panel ═══ --}}
        <div class="glass-card">

            <div class="cam-header">
                <div class="cam-header-icon"><i class="fa-solid fa-video"></i></div>
                <div class="cam-header-text">
                    <h2>Kamera Langsung</h2>
                    <p>Posisikan wajah, lalu tekan <strong style="color:var(--primary)">Ambil Foto</strong></p>
                </div>
            </div>

            {{-- ── Viewport ── --}}
            <div class="viewport-wrap" id="viewportWrap">

                {{-- Placeholder sebelum kamera aktif --}}
                <div id="viewportPlaceholder">
                    <div class="ph-icon"><i class="fa-solid fa-camera"></i></div>
                    <p class="ph-text" id="placeholderText">Tekan tombol di bawah<br>untuk mengaktifkan kamera</p>
                </div>

                {{-- Live video stream --}}
                <video id="kycVideo" autoplay muted playsinline></video>

                {{-- Bounding-box canvas (mirrors video) --}}
                <canvas id="kycCanvas"></canvas>

                {{-- Preview canvas (hasil tangkapan) --}}
                <canvas id="previewCanvas"></canvas>

                {{-- Corner brackets --}}
                <div class="vp-corner vp-tl"></div>
                <div class="vp-corner vp-tr"></div>
                <div class="vp-corner vp-bl"></div>
                <div class="vp-corner vp-br"></div>

                {{-- Scan beam (animasi saat scanning) --}}
                <div class="scan-beam" id="scanBeam"></div>

                {{-- Face oval guide --}}
                <div class="face-oval" id="faceOval"></div>

            </div>{{-- /.viewport-wrap --}}

            {{-- ── Status bar ── --}}
            <div class="status-bar" id="statusBar">
                <div class="status-dot loading" id="statusDot"></div>
                <span id="statusText">Memuat Model AI...</span>
            </div>

            {{-- ── Action buttons ── --}}
            <div class="cam-actions" id="camActions">

                {{-- Button A: Ambil Foto — enabled only when face detected --}}
                <button class="btn btn-capture" id="btnCapture"
                        onclick="doCapture()" disabled>
                    <i class="fa-solid fa-camera"></i> Ambil Foto
                </button>

                {{-- Button B: Gunakan Foto Ini — hidden until capture --}}
                <button class="btn btn-use" id="btnUse"
                        onclick="doUpload()"
                        style="display:none;" disabled>
                    <i class="fa-solid fa-circle-check"></i> Gunakan Foto Ini
                </button>

                {{-- Button C: Foto Ulang — hidden until capture --}}
                <button class="btn btn-retake" id="btnRetake"
                        onclick="doRetake()"
                        style="display:none;">
                    <i class="fa-solid fa-rotate-left"></i> Foto Ulang
                </button>

            </div>

        </div>{{-- /.glass-card camera-panel --}}

        {{-- ═══ RIGHT: Info Panel ═══ --}}
        <div class="glass-card">

            <div class="kyc-icon-wrap">
                <i class="fa-solid fa-face-viewfinder"></i>
            </div>

            <h1 class="kyc-title">Verifikasi Wajah<br>untuk Lanjutkan Pembelian</h1>
            <p class="kyc-subtitle">
                SecureGate menggunakan biometrik wajah untuk memastikan setiap tiket terhubung dengan identitas asli pemesan.
            </p>

            {{-- Policy banner --}}
            <div class="policy-banner">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p class="policy-text">
                    <strong>Kebijakan Data Fresh 5 Bulan.</strong>
                    Foto wajah wajib diperbarui jika data terakhir sudah
                    <strong>lebih dari 5 bulan</strong> atau belum pernah dilakukan sebelumnya.
                </p>
            </div>

            {{-- Confidence badge (ditampilkan saat wajah terdeteksi) --}}
            <div class="conf-badge" id="confBadge">
                <i class="fa-solid fa-waveform-lines"></i>
                <span id="confText">Confidence: —</span>
            </div>

            {{-- Success state banner (muncul setelah upload berhasil) --}}
            <div class="success-banner" id="successBanner">
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    <strong>Verifikasi Berhasil!</strong>
                    <p>Foto wajah Anda telah disimpan.<br>Mengarahkan kembali ke halaman event...</p>
                </div>
            </div>

            {{-- CTA: aktifkan kamera --}}
            <button class="btn-start" id="btnStart"
                    onclick="startVerification()" disabled>
                <i class="fa-solid fa-spinner fa-spin" id="startIcon"></i>
                <span id="startLabel">Memuat Model AI...</span>
            </button>

            {{-- Steps tracker --}}
            <div class="steps" id="stepsList">
                <div class="step active" id="step1">
                    <span class="step-num">1</span>
                    Izinkan akses kamera pada browser Anda
                </div>
                <div class="step" id="step2">
                    <span class="step-num">2</span>
                    Posisikan wajah di dalam oval hingga kotak hijau muncul
                </div>
                <div class="step" id="step3">
                    <span class="step-num">3</span>
                    Tekan <strong style="color:var(--primary)">Ambil Foto</strong> — tinjau preview, lalu konfirmasi
                </div>
            </div>

            <div class="divider"></div>

            <p style="font-size:0.7rem; color:var(--muted); text-align:center; line-height:1.5;">
                <i class="fa-solid fa-lock" style="margin-right:4px;"></i>
                Foto hanya disimpan di server SecureGate untuk keperluan verifikasi panitia.
            </p>

        </div>{{-- /.glass-card info-panel --}}

    </div>{{-- /.kyc-layout --}}

    {{-- ════════════════════════════════════════════════════════════════════════
         JAVASCRIPT — Manual Capture Mode
         Alur: loadModels → getUserMedia → detectionLoop (only shows box, no auto-capture)
               → doCapture() → doUpload() | doRetake()
    ════════════════════════════════════════════════════════════════════════ --}}
    <script>
    'use strict';

    /* ── DOM refs ─────────────────────────────────────────────────────────── */
    const video          = document.getElementById('kycVideo');
    const bbCanvas       = document.getElementById('kycCanvas');   // bounding-box overlay
    const prevCanvas     = document.getElementById('previewCanvas'); // capture preview
    const placeholder    = document.getElementById('viewportPlaceholder');
    const placeholderTxt = document.getElementById('placeholderText');
    const scanBeam       = document.getElementById('scanBeam');
    const faceOval       = document.getElementById('faceOval');
    const statusBar      = document.getElementById('statusBar');
    const statusDot      = document.getElementById('statusDot');
    const statusText     = document.getElementById('statusText');
    const btnStart       = document.getElementById('btnStart');
    const startIcon      = document.getElementById('startIcon');
    const startLabel     = document.getElementById('startLabel');
    const btnCapture     = document.getElementById('btnCapture');
    const btnUse         = document.getElementById('btnUse');
    const btnRetake      = document.getElementById('btnRetake');
    const confBadge      = document.getElementById('confBadge');
    const confText       = document.getElementById('confText');
    const successBanner  = document.getElementById('successBanner');

    /* ── State ───────────────────────────────────────────────────────────── */
    let modelsLoaded     = false;
    let cameraActive     = false;
    let mediaStream      = null;
    let detectionRafId   = null;   // requestAnimationFrame id
    let lastScore        = 0;
    let faceDetected     = false;
    let inPreviewMode    = false;
    let uploading        = false;

    /* ── Helpers ─────────────────────────────────────────────────────────── */
    function setStatus(type, msg) {
        statusDot.className  = 'status-dot ' + type;
        statusText.textContent = msg;
        // Mirror state on bar
        statusBar.className  = 'status-bar' + (type === 'detected' ? ' face-found' :
                                               type === 'captured'  ? ' captured'  :
                                               type === 'uploading' ? ' uploading' :
                                               type === 'error'     ? ' error-bar' : '');
    }

    function markStep(n, state = 'done') {   // state: 'done' | 'active'
        const el = document.getElementById('step' + n);
        if (!el) return;
        el.classList.remove('done', 'active');
        el.classList.add(state);
    }

    function setStartBtn(icon, label, disabled = false) {
        startIcon.className    = icon;
        startLabel.textContent = label;
        btnStart.disabled      = disabled;
    }

    /* ════════════════════════════════════════
       STEP 1 — Load face-api.js models
    ════════════════════════════════════════ */
    async function loadModels() {
        const MODEL_CDN = 'https://justadudewhohacks.github.io/face-api.js/models';
        setStatus('loading', 'Memuat Model AI...');

        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_CDN);
            modelsLoaded = true;
            setStatus('ready', 'Model siap. Tekan tombol untuk mengaktifkan kamera.');
            setStartBtn('fa-solid fa-video', 'Aktifkan Kamera', false);
        } catch (err) {
            console.error('[face-api] model load failed:', err);
            setStatus('error', 'Gagal memuat model AI. Periksa koneksi internet.');
            setStartBtn('fa-solid fa-rotate-right', 'Muat Ulang', false);
            btnStart.onclick = () => location.reload();
        }
    }

    /* ════════════════════════════════════════
       STEP 2 — Activate webcam
    ════════════════════════════════════════ */
    async function activateCamera() {
        placeholderTxt.textContent = 'Meminta izin kamera...';
        setStatus('loading', 'Menginisialisasi kamera...');
        setStartBtn('fa-solid fa-spinner fa-spin', 'Memulai kamera...', true);

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 720 }, height: { ideal: 560 }, facingMode: 'user' }
            });

            video.srcObject = mediaStream;

            await new Promise(resolve => {
                video.onloadedmetadata = () => { video.play(); resolve(); };
            });

            // Size bounding-box canvas to actual video resolution
            bbCanvas.width  = video.videoWidth  || 720;
            bbCanvas.height = video.videoHeight || 560;

            // Show video, hide placeholder
            video.classList.add('active');
            placeholder.classList.add('hidden');
            cameraActive = true;

            markStep(1, 'done');
            markStep(2, 'active');

            setStatus('scanning', 'Arahkan wajah ke kamera...');
            setStartBtn('fa-solid fa-video-slash', 'Kamera Aktif', true);
            scanBeam.classList.add('active');

            // Start detection loop
            startDetectionLoop();

        } catch (err) {
            console.error('[camera]', err);
            let msg = 'Kamera tidak dapat diakses.';
            if (err.name === 'NotAllowedError') msg = 'Izin kamera ditolak. Silakan izinkan di pengaturan browser.';
            if (err.name === 'NotFoundError')   msg = 'Tidak ada kamera yang ditemukan.';
            placeholderTxt.textContent = msg;
            setStatus('error', msg);
            setStartBtn('fa-solid fa-camera-slash', 'Kamera Tidak Tersedia', true);
        }
    }

    /* ════════════════════════════════════════
       STEP 3 — Detection loop (rAF-based)
       ONLY draws detection box + updates UI.
       NO auto-capture. User must press Button A.
    ════════════════════════════════════════ */
    const tfOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.38 });

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

                confBadge.classList.add('visible');
                confText.textContent = `Confidence: ${(lastScore * 100).toFixed(1)}%`;

                // Draw bounding box
                const { x, y, width, height } = det.box;
                ctx.strokeStyle = faceDetected ? 'rgba(74,222,128,0.9)' : 'rgba(245,158,11,0.7)';
                ctx.lineWidth   = 2.5;
                ctx.strokeRect(x, y, width, height);

                if (faceDetected) {
                    faceOval.classList.add('detected');
                    setStatus('detected', `Wajah terdeteksi (${(lastScore*100).toFixed(0)}%) — siap diambil`);
                    statusBar.classList.add('face-found');
                    markStep(2, 'done');
                    markStep(3, 'active');
                    btnCapture.disabled = false;
                } else {
                    faceOval.classList.remove('detected');
                    setStatus('scanning', 'Wajah ditemukan — perbaiki posisi dan pencahayaan');
                    statusBar.classList.remove('face-found');
                    btnCapture.disabled = true;
                }
            } else {
                faceDetected         = false;
                lastScore            = 0;
                confBadge.classList.remove('visible');
                faceOval.classList.remove('detected');
                statusBar.classList.remove('face-found');
                setStatus('scanning', 'Arahkan wajah ke kamera...');
                btnCapture.disabled = true;

                const ctx2 = bbCanvas.getContext('2d');
                ctx2.clearRect(0, 0, bbCanvas.width, bbCanvas.height);
            }
        } catch (_) { /* per-frame errors are non-fatal */ }

        detectionRafId = requestAnimationFrame(detectionTick);
    }

    function startDetectionLoop() {
        if (detectionRafId) cancelAnimationFrame(detectionRafId);
        // Wrap in rAF schedule to avoid blocking
        video.addEventListener('play', () => {
            detectionRafId = requestAnimationFrame(detectionTick);
        }, { once: true });
    }

    /* ════════════════════════════════════════
       Button A — doCapture()
       Pause video → draw frame to previewCanvas
       → switch UI to preview mode
    ════════════════════════════════════════ */
    function doCapture() {
        if (!faceDetected || inPreviewMode) return;

        // Stop the detection loop while in preview
        if (detectionRafId) cancelAnimationFrame(detectionRafId);
        inPreviewMode = true;

        // Size preview canvas to match video
        prevCanvas.width  = video.videoWidth  || 720;
        prevCanvas.height = video.videoHeight || 560;

        // Draw video frame mirrored (natural orientation for human face)
        const ctx = prevCanvas.getContext('2d');
        ctx.save();
        ctx.translate(prevCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, prevCanvas.width, prevCanvas.height);
        ctx.restore();

        // Clear bounding-box canvas
        const bbCtx = bbCanvas.getContext('2d');
        bbCtx.clearRect(0, 0, bbCanvas.width, bbCanvas.height);

        // Hide video, show preview canvas
        video.classList.remove('active');
        prevCanvas.classList.add('visible');

        // Pause webcam tracks (freeze)
        if (mediaStream) mediaStream.getTracks().forEach(t => t.enabled = false);

        // Stop scan beam, clear oval
        scanBeam.classList.remove('active');
        faceOval.classList.remove('detected');

        // Switch buttons: hide A, show B & C
        btnCapture.style.display = 'none';
        btnUse.style.display     = '';
        btnRetake.style.display  = '';
        btnUse.disabled          = false;

        setStatus('captured', 'Preview foto — periksa sebelum dikirim');
        statusBar.classList.add('captured');
        markStep(3, 'done');
        confBadge.classList.remove('visible');
    }

    /* ════════════════════════════════════════
       Button C — doRetake()
       Resume camera, go back to detection mode
    ════════════════════════════════════════ */
    function doRetake() {
        if (!inPreviewMode) return;
        inPreviewMode = false;

        // Re-enable camera tracks
        if (mediaStream) mediaStream.getTracks().forEach(t => t.enabled = true);

        // Hide preview canvas, show video
        prevCanvas.classList.remove('visible');
        video.classList.add('active');

        // Restore buttons: show A, hide B & C
        btnCapture.style.display = '';
        btnCapture.disabled      = true;   // will re-enable when face detected again
        btnUse.style.display     = 'none';
        btnRetake.style.display  = 'none';

        scanBeam.classList.add('active');
        setStatus('scanning', 'Arahkan wajah ke kamera...');
        statusBar.classList.remove('captured');
        markStep(3, 'active');
        markStep(2, 'active');

        // Restart detection loop
        detectionRafId = requestAnimationFrame(detectionTick);
    }

    /* ════════════════════════════════════════
       Button B — doUpload()
       Get base64 from previewCanvas → POST
    ════════════════════════════════════════ */
    async function doUpload() {
        if (uploading) return;
        uploading = true;

        btnUse.disabled    = true;
        btnRetake.disabled = true;
        btnUse.innerHTML   = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

        const base64Image = prevCanvas.toDataURL('image/jpeg', 0.82);

        setStatus('uploading', 'Mengirim foto ke server...');
        statusBar.classList.remove('captured');
        statusBar.classList.add('uploading');

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
                /* ── SUCCESS ─────────────────────────────────────────── */
                // Stop camera entirely
                if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());

                setStatus('captured', 'Verifikasi berhasil! Mengalihkan...');
                statusBar.classList.remove('uploading');
                statusBar.classList.add('captured');

                // Show success banner in right panel
                successBanner.classList.add('visible');
                btnUse.innerHTML = '<i class="fa-solid fa-check-circle"></i> Terverifikasi!';

                // Redirect to the intended event page (or landing)
                setTimeout(() => {
                    window.location.href = data.redirect_url || '{{ route('landing') }}';
                }, 1800);

            } else {
                /* ── SERVER ERROR ────────────────────────────────────── */
                const errMsg = data.message ?? 'Terjadi kesalahan server.';
                setStatus('error', errMsg);
                statusBar.classList.remove('uploading');
                statusBar.classList.add('error-bar');

                btnUse.innerHTML   = '<i class="fa-solid fa-circle-check"></i> Gunakan Foto Ini';
                btnUse.disabled    = false;
                btnRetake.disabled = false;
                uploading = false;
            }

        } catch (networkErr) {
            console.error('[upload]', networkErr);
            setStatus('error', 'Koneksi ke server gagal. Periksa jaringan Anda.');
            statusBar.classList.remove('uploading');
            statusBar.classList.add('error-bar');

            btnUse.innerHTML   = '<i class="fa-solid fa-circle-check"></i> Gunakan Foto Ini';
            btnUse.disabled    = false;
            btnRetake.disabled = false;
            uploading = false;
        }
    }

    /* ════════════════════════════════════════
       Entry point: btn-start click
    ════════════════════════════════════════ */
    function startVerification() {
        if (!modelsLoaded) { location.reload(); return; }
        if (!cameraActive) { activateCamera(); }
    }

    /* ════════════════════════════════════════
       Boot: wait for face-api.js (loaded defer)
       then trigger model download
    ════════════════════════════════════════ */
    window.addEventListener('load', () => {
        let tries = 0;
        const waitForLib = setInterval(() => {
            tries++;
            if (typeof faceapi !== 'undefined') {
                clearInterval(waitForLib);
                loadModels();
            }
            if (tries > 80) {   // ~8 sec timeout
                clearInterval(waitForLib);
                setStatus('error', 'face-api.js gagal dimuat. Periksa koneksi internet.');
                setStartBtn('fa-solid fa-rotate-right', 'Muat Ulang', false);
                btnStart.onclick = () => location.reload();
                btnStart.disabled = false;
            }
        }, 100);
    });
    </script>

</body>
</html>
