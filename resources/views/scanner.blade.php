<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Scanner – GateMate</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg:          #060d1a;
            --surface:     rgba(13, 20, 38, 0.85);
            --green:       #4ade80;
            --green-dim:   rgba(74, 222, 128, 0.12);
            --green-border:rgba(74, 222, 128, 0.25);
            --red:         #f87171;
            --red-dim:     rgba(248, 113, 113, 0.12);
            --red-border:  rgba(248, 113, 113, 0.3);
            --text:        #e2e8f0;
            --muted:       rgba(226, 232, 240, 0.45);
            --border:      rgba(255, 255, 255, 0.07);
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', system-ui, sans-serif;
            min-height: 100vh;
            background-image:
                radial-gradient(ellipse 70% 50% at 50% -5%,  rgba(74,222,128,.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 90% 90%, rgba(34,211,238,.05) 0%, transparent 60%);
        }

        /* ── Navbar ── */
        .navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 28px;
            height: 60px;
            border-bottom: 1px solid var(--border);
            backdrop-filter: blur(14px);
            background: rgba(6, 13, 26, 0.8);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .navbar-brand {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: -.5px;
            background: linear-gradient(135deg, var(--green), #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .navbar-role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--green-dim);
            border: 1px solid var(--green-border);
            border-radius: 100px;
            padding: 4px 12px;
            font-size: .75rem;
            font-weight: 600;
            color: var(--green);
        }
        .nav-back {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: var(--muted);
            text-decoration: none;
            font-size: .85rem;
            font-weight: 500;
            transition: color .2s;
        }
        .nav-back:hover { color: var(--text); }

        /* ── Page Layout ── */
        .page-wrapper {
            max-width: 560px;
            margin: 0 auto;
            padding: 40px 20px 80px;
        }

        /* ── Section Title ── */
        .section-header {
            text-align: center;
            margin-bottom: 32px;
        }
        .section-header h1 {
            font-size: 1.75rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 6px;
        }
        .section-header p {
            font-size: .9rem;
            color: var(--muted);
        }

        /* ── Scanner Card ── */
        .scanner-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 24px;
            backdrop-filter: blur(14px);
            box-shadow: 0 8px 40px rgba(0, 0, 0, .3);
        }

        /* ── QR Reader Container ── */
        #reader-wrapper {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--green-border);
            background: #000;
        }
        #reader {
            width: 100%;
        }
        /* Override html5-qrcode default ugly styles */
        #reader > img { display: none !important; }
        #reader__scan_region > img { display: none !important; }

        /* Corner overlay — scanning frame effect */
        .scan-corners {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 10;
        }
        .scan-corners::before,
        .scan-corners::after,
        .scan-corners > span::before,
        .scan-corners > span::after {
            content: '';
            position: absolute;
            width: 28px;
            height: 28px;
            border-color: var(--green);
            border-style: solid;
            border-width: 0;
        }
        .scan-corners::before { top: 14px; left: 14px; border-top-width: 3px; border-left-width: 3px; border-radius: 4px 0 0 0; }
        .scan-corners::after  { top: 14px; right: 14px; border-top-width: 3px; border-right-width: 3px; border-radius: 0 4px 0 0; }
        .scan-corners > span::before { bottom: 14px; left: 14px; border-bottom-width: 3px; border-left-width: 3px; border-radius: 0 0 0 4px; }
        .scan-corners > span::after  { bottom: 14px; right: 14px; border-bottom-width: 3px; border-right-width: 3px; border-radius: 0 0 4px 0; }

        /* Scanning beam */
        .scan-beam {
            position: absolute;
            left: 14px; right: 14px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--green), transparent);
            border-radius: 2px;
            animation: beam-scan 2.2s ease-in-out infinite;
            box-shadow: 0 0 12px rgba(74, 222, 128, .6);
            z-index: 11;
            pointer-events: none;
        }
        @keyframes beam-scan {
            0%   { top: 20%; opacity: 1; }
            50%  { top: 78%; opacity: .8; }
            100% { top: 20%; opacity: 1; }
        }

        /* ── Status Display ── */
        #scan-status {
            display: none;
            margin-top: 20px;
            border-radius: 16px;
            padding: 20px 22px;
            border: 1px solid;
            transition: all .3s ease;
        }
        #scan-status.status-success {
            background: var(--green-dim);
            border-color: var(--green-border);
        }
        #scan-status.status-error {
            background: var(--red-dim);
            border-color: var(--red-border);
        }

        .status-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        .status-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
        }
        .status-message {
            font-size: .85rem;
            color: var(--muted);
            margin-bottom: 14px;
        }

        /* Info Grid (for success) */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
        }
        .info-item {
            background: rgba(255, 255, 255, .04);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 13px;
        }
        .info-item-label {
            font-size: .68rem;
            text-transform: uppercase;
            letter-spacing: .06em;
            color: var(--muted);
            margin-bottom: 3px;
        }
        .info-item-value {
            font-size: .9rem;
            font-weight: 600;
            color: #fff;
        }

        /* ── Buttons ── */
        .btn-next-scan {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--green), #22c55e);
            border: none;
            border-radius: 12px;
            color: #062010;
            font-size: .9rem;
            font-weight: 700;
            cursor: pointer;
            transition: opacity .2s, transform .2s;
        }
        .btn-next-scan:hover { opacity: .88; transform: translateY(-1px); }

        /* ── Status indicator dot (top of card) ── */
        .scanner-live-dot {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: .78rem;
            color: var(--muted);
            margin-bottom: 14px;
        }
        .live-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: var(--green);
            animation: dot-pulse 1.4s ease-in-out infinite;
        }
        @keyframes dot-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: .4; transform: scale(.75); }
        }
        .live-dot.paused {
            background: var(--muted);
            animation: none;
        }

        /* ── Scan counter ── */
        .scan-counter {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            margin-top: 24px;
            padding-top: 18px;
            border-top: 1px solid var(--border);
        }
        .counter-item { text-align: center; }
        .counter-num {
            font-size: 1.4rem;
            font-weight: 800;
            color: #fff;
            display: block;
        }
        .counter-num.green { color: var(--green); }
        .counter-num.red   { color: var(--red); }
        .counter-label { font-size: .72rem; color: var(--muted); }
    </style>
</head>
<body>
    {{-- ─── Navbar ──────────────────────────────────────────────────────────── --}}
    <nav class="navbar">
        <span class="navbar-brand">GateMate</span>
        <span class="navbar-role-badge">
            <i class="fa-solid fa-shield-halved"></i>
            {{ ucwords(Auth::user()->role) }}
        </span>
        <a href="{{ route('discover') }}" class="nav-back">
            <i class="fa-solid fa-arrow-left"></i> Dashboard
        </a>
    </nav>

    {{-- ─── Page Content ─────────────────────────────────────────────────────── --}}
    <div class="page-wrapper">

        <div class="section-header">
            <h1><i class="fa-solid fa-qrcode" style="color:var(--green); margin-right:10px;"></i>QR Scanner</h1>
            <p>Arahkan kamera ke QR Code pada tiket peserta untuk melakukan check-in.</p>
        </div>

        <div class="scanner-card">

            {{-- Live indicator --}}
            <div class="scanner-live-dot" id="live-indicator">
                <span class="live-dot" id="live-dot"></span>
                <span id="live-text">Kamera Aktif – Siap Scan</span>
            </div>

            {{-- QR Reader + corner overlay --}}
            <div id="reader-wrapper">
                <div id="reader"></div>
                <div class="scan-corners"><span></span></div>
                <div class="scan-beam" id="scan-beam"></div>
            </div>

            {{-- Result Box --}}
            <div id="scan-status">
                <span class="status-icon" id="status-icon"></span>
                <h4 class="status-title" id="error-title"></h4>
                <p class="status-message" id="error-desc"></p>

                {{-- Attendee info grid (shown on success) --}}
                <div class="info-grid" id="info-grid" style="display:none; text-align: left;">
                    <div style="display: flex; align-items: center; gap: 15px; grid-column: span 2; margin-bottom: 10px;">
                        <img id="info-photo" src="" alt="User Photo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid #28a745; margin-right: 15px;">
                        <div>
                            <p class="info-item-value" id="info-name" style="font-size: 1.1rem; margin-bottom: 4px;">–</p>
                            <span id="badge-status" style="font-size: 0.75rem; background: rgba(234, 179, 8, 0.2); color: rgb(202, 138, 4); padding: 2px 8px; border-radius: 4px; font-weight: bold;">Menunggu Review</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <p class="info-item-label">Nomor Tiket</p>
                        <p class="info-item-value" id="info-ticket">–</p>
                    </div>
                    <div class="info-item">
                        <p class="info-item-label">Waktu Scan</p>
                        <p class="info-item-value" id="info-time">–</p>
                    </div>
                </div>

                <button type="button" id="btn-approve" style="display:none; width: 100%; margin-bottom: 10px; background: var(--green); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    <i class="fa-solid fa-check-circle"></i> Approve Check-in
                </button>

                <button type="button" class="btn-next-scan" id="btn-next-scan" onclick="resumeScanner()">
                    <i class="fa-solid fa-camera-rotate"></i> Scan Selanjutnya
                </button>
            </div>

            {{-- Scan statistics ── --}}
            <div class="scan-counter">
                <div class="counter-item">
                    <span class="counter-num" id="cnt-total">0</span>
                    <span class="counter-label">Total Scan</span>
                </div>
                <div class="counter-item">
                    <span class="counter-num green" id="cnt-success">0</span>
                    <span class="counter-label">Berhasil</span>
                </div>
                <div class="counter-item">
                    <span class="counter-num red" id="cnt-failed">0</span>
                    <span class="counter-label">Ditolak</span>
                </div>
            </div>
        </div>

    </div>

    <script>
        // ── State ────────────────────────────────────────────────────────────────
        let scanner      = null;
        let isProcessing = false;
        let cntTotal = 0, cntSuccess = 0, cntFailed = 0;

        const CSRF = document.querySelector('meta[name="csrf-token"]').content;
        const VALIDATE_URL = '{{ route("scanner.validate") }}';

        // ── DOM References ───────────────────────────────────────────────────────
        const scanStatus  = document.getElementById('scan-status');
        const statusIcon  = document.getElementById('status-icon');
        const statusTitle = document.getElementById('status-title');
        const statusMsg   = document.getElementById('status-message');
        const infoGrid    = document.getElementById('info-grid');
        const liveDot     = document.getElementById('live-dot');
        const liveText    = document.getElementById('live-text');
        const scanBeam    = document.getElementById('scan-beam');

        // ── Init Scanner ─────────────────────────────────────────────────────────
        function startScanner() {
            scanner = new Html5Qrcode("reader");

            const config = {
                fps: 10,
                qrbox: { width: 240, height: 240 },
                aspectRatio: 1.0,
            };

            scanner.start(
                { facingMode: "environment" },
                config,
                onScanSuccess
            ).catch(err => {
                liveText.textContent = "Gagal mengakses kamera: " + err;
                liveDot.classList.add('paused');
                scanBeam.style.display = 'none';
            });
        }

        // ── On Scan ──────────────────────────────────────────────────────────────
        async function onScanSuccess(qrToken) {
            if (isProcessing) return;
            isProcessing = true;

            // Pause scanner + update indicator
            await scanner.pause(true);
            liveDot.classList.add('paused');
            liveText.textContent = 'Memvalidasi tiket...';
            scanBeam.style.display = 'none';

            cntTotal++;
            document.getElementById('cnt-total').textContent = cntTotal;

            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const payload = { qr_code: qrToken }; // Pastikan nama key sesuai dengan yang ditangkap backend

            fetch("{{ route('scanner.validate') }}", {
                method: 'POST', // WAJIB HURUF BESAR
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                scanStatus.style.display = 'block';
                scanStatus.className = '';
                infoGrid.style.display = 'none';

                if(data.success || data.status === 'success') {
                    // Tampilkan UI Sukses
                    document.getElementById('error-title').innerText = "Berhasil!";
                    document.getElementById('error-desc').innerText = data.message;
                    document.getElementById('error-title').parentElement.style.backgroundColor = 'rgba(74, 222, 128, 0.12)';
                    document.getElementById('error-title').parentElement.style.borderColor = 'rgba(74, 222, 128, 0.25)';
                    statusIcon.textContent = '✅';
                    
                    if (data.data) {
                        document.getElementById('info-name').textContent    = data.data.user_name     ?? '–';
                        document.getElementById('info-ticket').textContent  = data.data.ticket_number ?? '–';
                        document.getElementById('info-time').textContent    = data.data.check_in_time ?? '–';
                        if (data.data.user_photo) {
                            document.getElementById('info-photo').src = data.data.user_photo;
                        }

                        let badge = document.getElementById('badge-status');
                        badge.textContent = 'Menunggu Review';
                        badge.style.background = 'rgba(234, 179, 8, 0.2)';
                        badge.style.color = 'rgb(202, 138, 4)';

                        document.getElementById('btn-approve').style.display = 'block';

                        // Setup event listener untuk tombol approve
                        let btnApprove = document.getElementById('btn-approve');
                        btnApprove.onclick = function() {
                            fetch("{{ route('scanner.approve') }}", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken
                                },
                                body: JSON.stringify({ qr_code: qrToken }) // pakai qrToken yang tadi didapat
                            })
                            .then(r => r.json())
                            .then(approveData => {
                                if(approveData.success) {
                                    badge.textContent = 'Telah Check-in';
                                    badge.style.background = 'var(--green-dim)';
                                    badge.style.color = 'var(--green)';
                                    btnApprove.style.display = 'none';

                                    // Update counter setelah benar-benar check-in
                                    cntSuccess++;
                                    document.getElementById('cnt-success').textContent = cntSuccess;
                                } else {
                                    alert(approveData.message ?? 'Gagal Approve');
                                }
                            });
                        };

                        infoGrid.style.display = 'grid';
                    }
                } else {
                    // Tampilkan UI Gagal
                    document.getElementById('error-title').innerText = "Gagal: " + (data.message ?? 'Validasi Gagal');
                    document.getElementById('error-desc').innerText = "Silakan cek kembali.";
                    document.getElementById('error-title').parentElement.style.backgroundColor = 'rgba(248, 113, 113, 0.12)';
                    document.getElementById('error-title').parentElement.style.borderColor = 'rgba(248, 113, 113, 0.3)';
                    statusIcon.textContent = '❌';
                    
                    cntFailed++;
                    document.getElementById('cnt-failed').textContent = cntFailed;
                }
                
                isProcessing = false;
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                scanStatus.style.display = 'block';
                scanStatus.className = '';
                infoGrid.style.display = 'none';
                statusIcon.textContent = '❌';
                document.getElementById('error-title').innerText = "Network Error";
                document.getElementById('error-desc').innerText = "Gagal terhubung ke server. Pastikan URL POST benar.";
                document.getElementById('error-title').parentElement.style.backgroundColor = 'rgba(248, 113, 113, 0.12)';
                document.getElementById('error-title').parentElement.style.borderColor = 'rgba(248, 113, 113, 0.3)';
                
                cntFailed++;
                document.getElementById('cnt-failed').textContent = cntFailed;
                
                isProcessing = false;
            });
        }

        // ── Render Result ─────────────────────────────────────────────────────────
        function showResult(type, json) {
            scanStatus.style.display = 'block';
            scanStatus.className = '';
            scanStatus.classList.add(type === 'success' ? 'status-success' : 'status-error');

            if (type === 'success') {
                statusIcon.textContent  = '✅';
                document.getElementById('error-title').textContent = json.message ?? 'Akses Diterima!';
                document.getElementById('error-desc').textContent = 'Check-in berhasil. Selamat datang!';

                // Populate info grid
                document.getElementById('info-name').textContent  = json.data?.attendee_name ?? '–';
                document.getElementById('info-tier').textContent  = json.data?.tier          ?? '–';
                document.getElementById('info-event').textContent = json.data?.event_name    ?? '–';
                infoGrid.style.display = 'grid';
            } else {
                statusIcon.textContent  = '❌';
                document.getElementById('error-title').textContent = json.message ?? 'Validasi Gagal';
                document.getElementById('error-desc').textContent = 'Silakan cek kembali status tiket ini.';
                infoGrid.style.display  = 'none';
            }
        }

        // ── Resume Scanner ────────────────────────────────────────────────────────
        function resumeScanner() {
            scanStatus.style.display = 'none';
            isProcessing = false;

            scanner.resume();
            liveDot.classList.remove('paused');
            liveText.textContent = 'Kamera Aktif – Siap Scan';
            scanBeam.style.display = 'block';
        }

        // ── Boot ──────────────────────────────────────────────────────────────────
        document.addEventListener('DOMContentLoaded', startScanner);
    </script>
</body>
</html>
