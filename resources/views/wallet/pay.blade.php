<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bayar ke {{ $tenant->full_name }} — GateMate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root{--bg:#06090f;--glass:rgba(13,20,38,.75);--border:rgba(255,255,255,.08);
            --text:#f1f5f9;--muted:#64748b;--primary:#6366f1;--teal:#2dd4bf;--danger:#ef4444;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;
            display:flex;flex-direction:column;align-items:center;padding:80px 16px 60px;overflow-x:hidden;}
        body::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;
            background:radial-gradient(ellipse 60% 50% at 80% 20%,rgba(45,212,191,.1) 0%,transparent 60%);}
        .top-nav{position:fixed;top:0;left:0;right:0;height:64px;display:flex;align-items:center;
            gap:16px;padding:0 24px;background:rgba(6,9,15,.88);backdrop-filter:blur(20px);
            border-bottom:1px solid var(--border);z-index:100;}
        .nav-back{color:var(--muted);text-decoration:none;font-size:.9rem;font-weight:600;transition:color .2s;}
        .nav-back:hover{color:var(--text);}
        .nav-title{font-size:1rem;font-weight:700;}

        .pay-card{width:100%;max-width:440px;background:var(--glass);backdrop-filter:blur(20px);
            border:1px solid var(--border);border-radius:28px;padding:36px;}

        /* Tenant Header */
        .tenant-header{text-align:center;margin-bottom:28px;}
        .tenant-avatar{width:72px;height:72px;border-radius:50%;margin:0 auto 14px;
            background:linear-gradient(135deg,var(--primary),var(--teal));
            display:flex;align-items:center;justify-content:center;
            font-size:1.8rem;font-weight:900;color:#fff;box-shadow:0 0 30px rgba(99,102,241,.4);}
        .tenant-name{font-size:1.3rem;font-weight:800;}
        .tenant-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(45,212,191,.1);
            color:var(--teal);border:1px solid rgba(45,212,191,.25);padding:4px 12px;
            border-radius:100px;font-size:.72rem;font-weight:700;margin-top:8px;}

        /* Saldo & locked amount bars */
        .info-bar{background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:14px;
            padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
        .ib-label{font-size:.8rem;color:var(--muted);font-weight:600;}
        .ib-value{font-size:1.1rem;font-weight:800;}
        .ib-value.teal{color:var(--teal);}

        /* Locked QR Amount Banner */
        .locked-banner{background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.25);
            border-radius:14px;padding:18px;text-align:center;margin-bottom:18px;}
        .lb-label{font-size:.78rem;color:var(--muted);font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;}
        .lb-amount{font-size:2rem;font-weight:900;color:var(--teal);}
        .lb-hint{font-size:.75rem;color:var(--muted);margin-top:4px;}
        .lb-lock{color:var(--teal);margin-right:4px;}

        /* Error */
        .error-msg{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);
            color:#f87171;padding:12px 16px;border-radius:12px;font-size:.85rem;margin-bottom:18px;}

        /* Nominals (hidden when amount is locked) */
        .nominals-section{margin-bottom:18px;}
        .nominals{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
        .btn-nom{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
            color:var(--text);padding:12px 6px;border-radius:12px;
            font-weight:700;font-size:.8rem;cursor:pointer;transition:all .2s;}
        .btn-nom:hover{background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.3);}
        .btn-nom.active{background:rgba(99,102,241,.2);border-color:var(--primary);color:#fff;}

        .input-wrap{display:flex;align-items:center;background:rgba(0,0,0,.3);
            border:1px solid var(--border);border-radius:14px;padding:0 16px;
            transition:border-color .2s;}
        .input-wrap:focus-within{border-color:rgba(99,102,241,.5);}
        .input-wrap.locked{border-color:rgba(45,212,191,.3);background:rgba(45,212,191,.04);}
        .input-wrap span{color:var(--muted);font-weight:700;font-size:1rem;}
        .input-wrap input{flex:1;background:transparent;border:none;color:#fff;
            padding:18px 12px;font-size:1.2rem;font-weight:700;font-family:'Inter',sans-serif;outline:none;}
        .input-wrap input[readonly]{color:var(--teal);cursor:default;}
        .input-wrap input::placeholder{color:rgba(255,255,255,.2);}

        /* Pay Button */
        .btn-pay{width:100%;background:var(--teal);color:#0f172a;border:none;padding:18px;
            border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;transition:all .2s;
            display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;}
        .btn-pay:hover:not(:disabled){box-shadow:0 6px 24px rgba(45,212,191,.4);transform:translateY(-2px);}
        .btn-pay:disabled{opacity:.5;cursor:not-allowed;}

        .divider{border:none;border-top:1px solid var(--border);margin:20px 0;}
        .warning{font-size:.78rem;color:var(--muted);text-align:center;}
    </style>
</head>
<body>
    <nav class="top-nav">
        <a href="{{ route('wallet.scan') }}" class="nav-back"><i class="fa-solid fa-arrow-left"></i> Scan Ulang</a>
        <div class="nav-title">Konfirmasi Pembayaran</div>
    </nav>

    <div class="pay-card">

        {{-- Tenant Avatar --}}
        <div class="tenant-header">
            <div class="tenant-avatar">{{ strtoupper(substr($tenant->full_name, 0, 1)) }}</div>
            <div class="tenant-name">{{ $tenant->full_name }}</div>
            <div class="tenant-badge"><i class="fa-solid fa-store"></i> Tenant Terverifikasi</div>
        </div>

        {{-- Saldo Pembeli --}}
        <div class="info-bar">
            <span class="ib-label"><i class="fa-solid fa-wallet"></i> Saldo Anda</span>
            <span class="ib-value teal">Rp {{ number_format($buyer->wallet_balance, 0, ',', '.') }}</span>
        </div>

        {{-- Error --}}
        @if($errors->any())
            <div class="error-msg"><i class="fa-solid fa-triangle-exclamation"></i> {{ $errors->first() }}</div>
        @endif

        {{-- Form Pembayaran --}}
        <form action="{{ route('wallet.pay.process', $tenant->id_user) }}" method="POST" id="payForm">
            @csrf

            @if($amount)
                {{-- ── MODE TERKUNCI: Nominal dari QR Tagihan ── --}}
                <div class="locked-banner">
                    <div class="lb-label"><i class="lb-lock fa-solid fa-lock"></i> Tagihan dari Kasir</div>
                    <div class="lb-amount">Rp {{ number_format($amount, 0, ',', '.') }}</div>
                    <div class="lb-hint">Nominal dikunci berdasarkan QR tagihan. Tekan tombol di bawah untuk membayar.</div>
                </div>
                <div class="input-wrap locked" style="display:none;">
                    <span>Rp</span>
                    <input type="number" name="amount" id="amountInput" value="{{ $amount }}" readonly>
                </div>
                {{-- Hidden input yang aktif --}}
                <input type="hidden" name="amount" value="{{ $amount }}">

            @else
                {{-- ── MODE BEBAS: Pilih Nominal ── --}}
                <div class="nominals-section">
                    <div class="nominals">
                        <button type="button" class="btn-nom" onclick="setNominal(5000)">Rp 5.000</button>
                        <button type="button" class="btn-nom" onclick="setNominal(10000)">Rp 10.000</button>
                        <button type="button" class="btn-nom" onclick="setNominal(20000)">Rp 20.000</button>
                        <button type="button" class="btn-nom" onclick="setNominal(25000)">Rp 25.000</button>
                        <button type="button" class="btn-nom" onclick="setNominal(50000)">Rp 50.000</button>
                        <button type="button" class="btn-nom" onclick="setNominal(100000)">Rp 100.000</button>
                    </div>
                    <div class="input-wrap">
                        <span>Rp</span>
                        <input type="number" name="amount" id="amountInput" placeholder="Masukkan nominal..." min="1000" required value="{{ old('amount') }}">
                    </div>
                </div>
            @endif

            <button type="submit" class="btn-pay" id="btnPay">
                @if($amount)
                    <i class="fa-solid fa-check-circle"></i> Konfirmasi Pembayaran
                @else
                    <i class="fa-solid fa-paper-plane"></i> Bayar Sekarang
                @endif
            </button>
        </form>

        <hr class="divider">
        <p class="warning"><i class="fa-solid fa-lock"></i> Transaksi dilindungi &amp; tidak dapat dibatalkan setelah diproses.</p>
    </div>

    <script>
        function setNominal(amount) {
            document.getElementById('amountInput').value = amount;
            document.querySelectorAll('.btn-nom').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
        }
        document.getElementById('payForm').addEventListener('submit', function() {
            const btn = document.getElementById('btnPay');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        });
    </script>
</body>
</html>
