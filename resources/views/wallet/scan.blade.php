<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Scan &amp; Pay — GateMate Wallet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
    <style>
        :root{--bg:#06090f;--glass:rgba(13,20,38,.75);--border:rgba(255,255,255,.08);
            --text:#f1f5f9;--muted:#64748b;--primary:#6366f1;--teal:#2dd4bf;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;
            display:flex;flex-direction:column;align-items:center;padding:80px 16px 60px;overflow-x:hidden;}
        body::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;
            background:radial-gradient(ellipse 60% 50% at 20% 20%,rgba(99,102,241,.12) 0%,transparent 55%);}

        .top-nav{position:fixed;top:0;left:0;right:0;height:64px;display:flex;align-items:center;
            gap:16px;padding:0 24px;background:rgba(6,9,15,.88);backdrop-filter:blur(20px);
            border-bottom:1px solid var(--border);z-index:100;}
        .nav-back{color:var(--muted);text-decoration:none;font-size:.9rem;font-weight:600;transition:color .2s;}
        .nav-back:hover{color:var(--text);}
        .nav-title{font-size:1rem;font-weight:700;}

        .scanner-card{width:100%;max-width:440px;background:var(--glass);backdrop-filter:blur(20px);
            border:1px solid var(--border);border-radius:28px;padding:32px;text-align:center;}
        .sc-title{font-size:1.3rem;font-weight:800;margin-bottom:6px;}
        .sc-sub{font-size:.85rem;color:var(--muted);margin-bottom:24px;}

        #reader{border-radius:16px;overflow:hidden;border:2px solid var(--border);
            min-height:280px;background:rgba(0,0,0,.3);}
        #reader video{border-radius:14px!important;}
        #reader img{display:none!important;}

        .status-bar{margin-top:18px;padding:12px 16px;border-radius:12px;font-size:.85rem;
            font-weight:600;display:flex;align-items:center;gap:8px;
            background:rgba(255,255,255,.04);border:1px solid var(--border);color:var(--muted);transition:all .3s;}
        .status-bar.active{background:rgba(45,212,191,.08);border-color:rgba(45,212,191,.25);color:var(--teal);}
        .status-bar.error{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color:#f87171;}

        .btn-start{margin-top:20px;width:100%;background:var(--primary);color:#fff;border:none;
            padding:16px;border-radius:14px;font-weight:700;font-size:.95rem;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:8px;
            box-shadow:0 4px 20px rgba(99,102,241,.35);transition:all .2s;}
        .btn-start:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.45);}
        .btn-start:disabled{opacity:.5;cursor:not-allowed;}

        .balance-pill{display:inline-flex;align-items:center;gap:8px;
            background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.2);
            color:var(--teal);padding:8px 16px;border-radius:100px;font-size:.8rem;font-weight:700;margin-bottom:20px;}
    </style>
</head>
<body>
    <nav class="top-nav">
        <a href="{{ route('wallet.index') }}" class="nav-back"><i class="fa-solid fa-arrow-left"></i></a>
        <div class="nav-title"><i class="fa-solid fa-qrcode"></i> Scan &amp; Pay</div>
    </nav>

    <div class="scanner-card">
        <div class="sc-title">Scan QR Tenant</div>
        <div class="sc-sub">Arahkan kamera ke QR Code tagihan penjual untuk membayar.</div>

        <div class="balance-pill">
            <i class="fa-solid fa-wallet"></i>
            Saldo: Rp {{ number_format($user->wallet_balance, 0, ',', '.') }}
        </div>

        <div id="reader"></div>

        <div class="status-bar" id="statusBar">
            <i class="fa-solid fa-circle-dot"></i>
            <span id="statusText">Tekan tombol untuk mengaktifkan kamera</span>
        </div>

        <button class="btn-start" id="btnStart" onclick="startScanner()">
            <i class="fa-solid fa-camera"></i> Aktifkan Kamera
        </button>
    </div>

    <script>
        let scanner = null;

        function setStatus(type, msg) {
            const bar = document.getElementById('statusBar');
            bar.className = 'status-bar' + (type === 'active' ? ' active' : type === 'error' ? ' error' : '');
            document.getElementById('statusText').textContent = msg;
        }

        function onScanSuccess(decodedText) {
            try {
                const data = JSON.parse(decodedText);
                // Payload baru dari POS: { id, amount }
                // Payload lama dari dashboard statis: { type, tenant_id, tenant_name }
                const tenantId = data.id ?? data.tenant_id;
                const amount   = data.amount ?? null;

                if (!tenantId) {
                    setStatus('error', 'QR tidak valid — tidak ada ID tenant.');
                    return;
                }

                if (scanner) scanner.stop().catch(() => {});
                setStatus('active', 'QR terdeteksi! Mengalihkan ke halaman pembayaran...');

                let redirectUrl = '/wallet/pay/' + tenantId;
                if (amount) redirectUrl += '?amount=' + amount;

                window.location.href = redirectUrl;

            } catch (e) {
                setStatus('error', 'Format QR tidak dikenali. Pastikan memindai QR GateMate yang valid.');
            }
        }

        function startScanner() {
            const btn = document.getElementById('btnStart');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memulai...';
            setStatus('active', 'Meminta izin kamera...');

            scanner = new Html5Qrcode('reader', { verbose: false });

            Html5Qrcode.getCameras().then(devices => {
                if (!devices || !devices.length) {
                    setStatus('error', 'Tidak ada kamera yang terdeteksi.');
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-camera"></i> Aktifkan Kamera';
                    return;
                }
                let cameraId = devices[0].id;
                for (const d of devices) {
                    if (d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')) {
                        cameraId = d.id; break;
                    }
                }
                scanner.start(cameraId, { fps: 15, qrbox: { width: 240, height: 240 } }, onScanSuccess)
                    .then(() => {
                        btn.style.display = 'none';
                        setStatus('active', 'Kamera aktif — arahkan ke QR tagihan tenant');
                    })
                    .catch(err => {
                        setStatus('error', 'Gagal memulai kamera. Pastikan izin diberikan.');
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fa-solid fa-camera"></i> Coba Lagi';
                    });
            }).catch(() => {
                setStatus('error', 'Kamera diblokir browser. Cek izin keamanan.');
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-camera"></i> Coba Lagi';
            });
        }
    </script>
</body>
</html>
