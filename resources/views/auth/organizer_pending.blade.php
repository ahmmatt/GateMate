<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menunggu Verifikasi - SecureGate</title>
    <meta name="description" content="Akun penyelenggara Anda sedang dalam proses verifikasi oleh Super Admin SecureGate.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary:    #050811;
            --glass-bg:      rgba(255,255,255,0.04);
            --glass-border:  rgba(255,255,255,0.09);
            --accent-purple: #7c3aed;
            --accent-cyan:   #06b6d4;
            --accent-amber:  #f59e0b;
            --text-primary:  #f1f5f9;
            --text-secondary:#94a3b8;
            --text-muted:    #475569;
        }

        html, body {
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            overflow: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
                radial-gradient(ellipse 70% 50% at 50% 30%, rgba(245,158,11,0.12) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 20% 80%, rgba(124,58,237,0.15) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 80% 10%, rgba(6,182,212,0.10) 0%, transparent 60%);
            pointer-events: none;
        }

        /* ── Pulse rings ───────────────────────────────────────── */
        .pulse-rings {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
        }
        .ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(245,158,11,0.12);
            animation: pulseRing 4s ease-out infinite;
        }
        .ring:nth-child(1) { width: 200px; height: 200px; animation-delay: 0s; }
        .ring:nth-child(2) { width: 350px; height: 350px; animation-delay: 0.8s; }
        .ring:nth-child(3) { width: 500px; height: 500px; animation-delay: 1.6s; }
        .ring:nth-child(4) { width: 680px; height: 680px; animation-delay: 2.4s; }
        @keyframes pulseRing {
            0%   { transform: scale(0.8); opacity: 0.6; }
            100% { transform: scale(1.2); opacity: 0; }
        }

        /* ── Navbar ────────────────────────────────────────────── */
        .navbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 40px;
            background: rgba(5,8,17,0.7);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass-border);
        }
        .navbar-brand {
            display: flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .logo-icon {
            width: 32px; height: 32px;
            background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
            border-radius: 8px; display: flex; align-items: center;
            justify-content: center; font-size: 15px; color: white;
        }
        .navbar-brand span {
            font-size: 1.25rem; font-weight: 800;
            background: linear-gradient(135deg, #a78bfa, var(--accent-cyan));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── Layout ────────────────────────────────────────────── */
        .page-center {
            position: relative; z-index: 1;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            padding: 80px 24px;
        }

        /* ── Card ──────────────────────────────────────────────── */
        .pending-card {
            width: 100%; max-width: 520px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 28px;
            padding: 48px 44px;
            backdrop-filter: blur(24px);
            text-align: center;
            box-shadow:
                0 0 0 1px rgba(245,158,11,0.06),
                0 32px 80px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.06);
            animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideUp {
            from { opacity:0; transform:translateY(40px); }
            to   { opacity:1; transform:translateY(0); }
        }

        /* ── Icon hourglass ────────────────────────────────────── */
        .icon-wrapper {
            width: 88px; height: 88px; border-radius: 50%;
            background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08));
            border: 2px solid rgba(245,158,11,0.25);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 28px;
            animation: iconPulse 3s ease-in-out infinite;
        }
        .icon-wrapper i {
            font-size: 2.2rem;
            background: linear-gradient(135deg, #f59e0b, #fbbf24);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        @keyframes iconPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.25); }
            50%       { box-shadow: 0 0 0 16px rgba(245,158,11,0); }
        }

        /* ── Status badge ──────────────────────────────────────── */
        .status-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(245,158,11,0.1);
            border: 1px solid rgba(245,158,11,0.25);
            border-radius: 100px; padding: 6px 14px;
            font-size: 0.72rem; font-weight: 700;
            color: #fbbf24; letter-spacing: 0.06em;
            text-transform: uppercase; margin-bottom: 20px;
        }
        .status-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #f59e0b;
            animation: blinkDot 1.5s ease-in-out infinite;
        }
        @keyframes blinkDot {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.2; }
        }

        .pending-title {
            font-size: 1.65rem; font-weight: 800; line-height: 1.25;
            margin-bottom: 14px;
            background: linear-gradient(135deg, var(--text-primary) 0%, #fbbf24 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .pending-message {
            font-size: 0.9375rem; color: var(--text-secondary);
            line-height: 1.7; margin-bottom: 28px;
        }
        .pending-message strong { color: var(--text-primary); }

        /* ── Process steps ─────────────────────────────────────── */
        .steps-list {
            list-style: none;
            text-align: left;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 20px 22px;
            margin-bottom: 28px;
            display: flex; flex-direction: column; gap: 14px;
        }
        .step-item {
            display: flex; align-items: flex-start; gap: 14px;
        }
        .step-num {
            width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.7rem; font-weight: 800;
        }
        .step-num.done   { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
        .step-num.active { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); animation: blinkDot 1.5s ease-in-out infinite; }
        .step-num.wait   { background: rgba(71,85,105,0.2); color: var(--text-muted); border: 1px solid rgba(71,85,105,0.3); }
        .step-text strong { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .step-text span   { font-size: 0.78rem; color: var(--text-muted); }

        /* ── Action buttons ────────────────────────────────────── */
        .btn-home {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: 12px; border: none;
            font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600;
            color: white; text-decoration: none; cursor: pointer;
            background: linear-gradient(135deg, var(--accent-purple), #5b21b6);
            box-shadow: 0 4px 16px rgba(124,58,237,0.35);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-home:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.5); }

        .btn-logout {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 22px; border-radius: 12px;
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
            font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 500;
            color: var(--text-secondary); cursor: pointer; text-decoration: none;
            transition: background 0.2s, color 0.2s;
        }
        .btn-logout:hover { background: rgba(255,255,255,0.09); color: var(--text-primary); }

        .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 540px) {
            .pending-card { padding: 32px 20px; }
            .navbar { padding: 14px 20px; }
        }
    </style>
</head>
<body>
    <!-- Pulse rings background -->
    <div class="pulse-rings">
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
    </div>

    <!-- Navbar -->
    <nav class="navbar">
        <a href="{{ route('landing') }}" class="navbar-brand">
            <div class="logo-icon"><i class="fas fa-shield-halved"></i></div>
            <span>SecureGate</span>
        </a>
    </nav>

    <!-- Main Content -->
    <div class="page-center">
        <div class="pending-card">

            <div class="icon-wrapper">
                <i class="fas fa-hourglass-half"></i>
            </div>

            <div class="status-badge">
                <div class="status-dot"></div>
                Sedang Diverifikasi
            </div>

            <h1 class="pending-title">Akun Anda Sedang<br>Dalam Proses Verifikasi</h1>

            <p class="pending-message">
                Akun Anda sedang dalam proses verifikasi oleh <strong>Super Admin</strong>
                untuk mencegah penipuan tiket. Tim kami akan meninjau identitas organisasi
                dan akun media sosial yang Anda daftarkan.
            </p>

            <!-- Proses verifikasi steps -->
            <ul class="steps-list">
                <li class="step-item">
                    <div class="step-num done"><i class="fas fa-check"></i></div>
                    <div class="step-text">
                        <strong>Registrasi Selesai</strong>
                        <span>Data akun dan media sosial berhasil dikirim</span>
                    </div>
                </li>
                <li class="step-item">
                    <div class="step-num active"><i class="fas fa-magnifying-glass"></i></div>
                    <div class="step-text">
                        <strong>Peninjauan Super Admin</strong>
                        <span>Tim kami sedang memverifikasi identitas organisasi Anda</span>
                    </div>
                </li>
                <li class="step-item">
                    <div class="step-num wait">3</div>
                    <div class="step-text">
                        <strong>Akses Penuh Diberikan</strong>
                        <span>Anda bisa mengelola event dan scan tiket</span>
                    </div>
                </li>
            </ul>

            <div class="btn-group">
                <a href="{{ route('landing') }}" class="btn-home">
                    <i class="fas fa-house"></i>
                    Kembali ke Beranda
                </a>
                <form action="{{ route('logout') }}" method="POST" style="display:contents;">
                    @csrf
                    <button type="submit" class="btn-logout">
                        <i class="fas fa-arrow-right-from-bracket"></i>
                        Logout
                    </button>
                </form>
            </div>

        </div>
    </div>
</body>
</html>
