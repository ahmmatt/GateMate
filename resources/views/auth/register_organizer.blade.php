<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar sebagai Penyelenggara - SecureGate</title>
    <meta name="description" content="Daftarkan organisasi Anda sebagai penyelenggara event resmi di platform SecureGate.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary:    #050811;
            --bg-secondary:  #0a0f1e;
            --glass-bg:      rgba(255, 255, 255, 0.04);
            --glass-border:  rgba(255, 255, 255, 0.09);
            --glass-hover:   rgba(255, 255, 255, 0.07);
            --accent-purple: #7c3aed;
            --accent-violet: #6d28d9;
            --accent-pink:   #ec4899;
            --accent-cyan:   #06b6d4;
            --text-primary:  #f1f5f9;
            --text-secondary:#94a3b8;
            --text-muted:    #475569;
            --error-color:   #f87171;
            --error-bg:      rgba(248, 113, 113, 0.08);
            --success-color: #34d399;
            --input-bg:      rgba(255, 255, 255, 0.05);
            --input-border:  rgba(255, 255, 255, 0.1);
            --input-focus:   rgba(124, 58, 237, 0.5);
        }

        html, body {
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
        }

        /* ── Animated background ─────────────────────────────────── */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 20% 10%, rgba(124, 58, 237, 0.18) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse 70% 40% at 50% 50%, rgba(236, 72, 153, 0.07) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        /* Floating particles */
        .particles {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0;
            animation: floatParticle linear infinite;
        }
        @keyframes floatParticle {
            0%   { transform: translateY(100vh) scale(0); opacity: 0; }
            10%  { opacity: 0.6; }
            90%  { opacity: 0.3; }
            100% { transform: translateY(-20px) scale(1); opacity: 0; }
        }

        /* ── Navbar ──────────────────────────────────────────────── */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 40px;
            background: rgba(5, 8, 17, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass-border);
        }
        .navbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }
        .navbar-brand .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            color: white;
        }
        .navbar-brand span {
            font-size: 1.25rem;
            font-weight: 800;
            background: linear-gradient(135deg, #a78bfa, var(--accent-cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .navbar-link {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.2s;
        }
        .navbar-link:hover { color: var(--text-primary); }

        /* ── Page layout ─────────────────────────────────────────── */
        .page-wrapper {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 100px 24px 60px;
        }

        /* ── Card ────────────────────────────────────────────────── */
        .register-card {
            width: 100%;
            max-width: 560px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 40px 44px;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            box-shadow:
                0 0 0 1px rgba(124,58,237,0.08),
                0 32px 64px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.06);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Badge ───────────────────────────────────────────────── */
        .admin-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15));
            border: 1px solid rgba(124,58,237,0.3);
            border-radius: 100px;
            padding: 6px 14px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #a78bfa;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 20px;
        }
        .admin-badge i { font-size: 0.7rem; }

        /* ── Heading ─────────────────────────────────────────────── */
        .card-title {
            font-size: 1.75rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 8px;
            background: linear-gradient(135deg, var(--text-primary) 0%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .card-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 28px;
            line-height: 1.6;
        }

        /* ── Alert ───────────────────────────────────────────────── */
        .alert-error {
            background: var(--error-bg);
            border: 1px solid rgba(248,113,113,0.2);
            border-radius: 12px;
            padding: 12px 16px;
            color: var(--error-color);
            font-size: 0.875rem;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 20px;
            animation: fadeIn 0.3s ease;
        }
        .alert-error i { margin-top: 2px; flex-shrink: 0; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Form ────────────────────────────────────────────────── */
        .form-group {
            margin-bottom: 18px;
        }
        .form-label {
            display: block;
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 7px;
            letter-spacing: 0.02em;
        }
        .form-label .required-star {
            color: var(--accent-pink);
            margin-left: 2px;
        }
        .input-wrapper {
            position: relative;
        }
        .input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 0.875rem;
            pointer-events: none;
            transition: color 0.2s;
        }
        .form-control {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            border-radius: 12px;
            padding: 12px 16px 12px 40px;
            font-size: 0.9rem;
            font-family: 'Inter', sans-serif;
            color: var(--text-primary);
            outline: none;
            transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .form-control::placeholder {
            color: var(--text-muted);
        }
        .form-control:focus {
            border-color: var(--accent-purple);
            background: rgba(124,58,237,0.05);
            box-shadow: 0 0 0 3px var(--input-focus);
        }
        .form-control:focus + .focus-ring,
        .input-wrapper:focus-within .input-icon {
            color: #a78bfa;
        }
        .form-control.is-error {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(248,113,113,0.15);
        }
        .field-error {
            font-size: 0.78rem;
            color: var(--error-color);
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* ── Section dividers ────────────────────────────────────── */
        .section-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 24px 0 18px;
        }
        .section-divider::before,
        .section-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--glass-border);
        }
        .section-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            white-space: nowrap;
        }

        /* Social media inputs */
        .social-prefix {
            position: absolute;
            left: 40px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.9rem;
            color: var(--accent-purple);
            font-weight: 600;
            pointer-events: none;
        }
        .form-control.has-prefix {
            padding-left: 60px;
        }

        /* Two columns */
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        /* ── Submit button ────────────────────────────────────────── */
        .btn-submit {
            width: 100%;
            padding: 14px;
            margin-top: 8px;
            border: none;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9375rem;
            font-weight: 700;
            color: white;
            background: linear-gradient(135deg, var(--accent-purple) 0%, #5b21b6 50%, var(--accent-violet) 100%);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 20px rgba(124,58,237,0.4);
        }
        .btn-submit::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.2s;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(124,58,237,0.55);
        }
        .btn-submit:hover::before { opacity: 1; }
        .btn-submit:active { transform: translateY(0); }

        /* Loading state */
        .btn-submit .btn-text  { transition: opacity 0.2s; }
        .btn-submit .btn-loader {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .btn-submit.loading .btn-text   { opacity: 0; }
        .btn-submit.loading .btn-loader { opacity: 1; }
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Info box ─────────────────────────────────────────────── */
        .info-box {
            background: rgba(6,182,212,0.06);
            border: 1px solid rgba(6,182,212,0.15);
            border-radius: 12px;
            padding: 14px 16px;
            margin-top: 20px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }
        .info-box i {
            color: var(--accent-cyan);
            font-size: 1rem;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .info-box p {
            font-size: 0.8125rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }
        .info-box strong { color: var(--text-primary); }

        /* ── Footer link ─────────────────────────────────────────── */
        .card-footer {
            text-align: center;
            margin-top: 24px;
            font-size: 0.8125rem;
            color: var(--text-muted);
        }
        .card-footer a {
            color: #a78bfa;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }
        .card-footer a:hover { color: var(--accent-cyan); }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 600px) {
            .register-card { padding: 28px 22px; }
            .navbar { padding: 14px 20px; }
            .form-row { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Floating particles -->
    <div class="particles" id="particles-container"></div>

    <!-- Navbar -->
    <nav class="navbar">
        <a href="{{ route('landing') }}" class="navbar-brand">
            <div class="logo-icon"><i class="fas fa-shield-halved"></i></div>
            <span>SecureGate</span>
        </a>
        <a href="{{ route('signin') }}" class="navbar-link">
            <i class="fas fa-arrow-left" style="margin-right:6px; font-size:0.75rem;"></i>
            Sudah punya akun?
        </a>
    </nav>

    <!-- Main content -->
    <div class="page-wrapper">
        <div class="register-card">

            <div class="admin-badge">
                <i class="fas fa-crown"></i>
                Registrasi Penyelenggara
            </div>

            <h1 class="card-title">Bergabung sebagai<br>Organizer Resmi</h1>
            <p class="card-subtitle">
                Daftarkan organisasi Anda dan mulai kelola event dengan sistem tiket terenkripsi SecureGate.
            </p>

            {{-- ── Global error bag ──────────────────────────────── --}}
            @if ($errors->any())
                <div class="alert-error" role="alert">
                    <i class="fas fa-circle-exclamation"></i>
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            <form id="organizer-form" action="{{ route('organizer.register.process') }}" method="POST" enctype="multipart/form-data" novalidate>
                @csrf

                {{-- ── Informasi Pribadi ─────────────────────────── --}}
                <div class="form-group">
                    <label for="full_name" class="form-label">
                        Nama Lengkap <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <i class="fas fa-user input-icon"></i>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            class="form-control @error('full_name') is-error @enderror"
                            placeholder="Nama lengkap Anda"
                            value="{{ old('full_name') }}"
                            required
                            autocomplete="name"
                        >
                    </div>
                    @error('full_name')
                        <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">
                        Alamat Email <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <i class="fas fa-envelope input-icon"></i>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-control @error('email') is-error @enderror"
                            placeholder="organizer@email.com"
                            value="{{ old('email') }}"
                            required
                            autocomplete="email"
                        >
                    </div>
                    @error('email')
                        <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="phone" class="form-label">
                        Nomor Telepon / WhatsApp <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <i class="fas fa-phone input-icon"></i>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            class="form-control @error('phone') is-error @enderror"
                            placeholder="Contoh: 08123456789"
                            value="{{ old('phone') }}"
                            required
                        >
                    </div>
                    @error('phone')
                        <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                    @enderror
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="password" class="form-label">
                            Password <span class="required-star">*</span>
                        </label>
                        <div class="input-wrapper">
                            <i class="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="form-control @error('password') is-error @enderror"
                                placeholder="Min. 8 karakter"
                                required
                                autocomplete="new-password"
                            >
                        </div>
                        @error('password')
                            <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="password_confirmation" class="form-label">
                            Konfirmasi Password <span class="required-star">*</span>
                        </label>
                        <div class="input-wrapper">
                            <i class="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                class="form-control"
                                placeholder="Ulangi password"
                                required
                                autocomplete="new-password"
                            >
                        </div>
                    </div>
                </div>

                {{-- ── Informasi Organisasi ──────────────────────── --}}
                <div class="section-divider">
                    <span class="section-label"><i class="fas fa-building" style="margin-right:5px;"></i>Informasi Organisasi</span>
                </div>

                <div class="form-group">
                    <label for="organization_name" class="form-label">
                        Nama Organisasi / Event Organizer <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <i class="fas fa-building input-icon"></i>
                        <input
                            type="text"
                            id="organization_name"
                            name="organization_name"
                            class="form-control @error('organization_name') is-error @enderror"
                            placeholder="Contoh: Spektra Event Management"
                            value="{{ old('organization_name') }}"
                            required
                        >
                    </div>
                    @error('organization_name')
                        <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="ktp_document" class="form-label">
                        Dokumen Identitas (KTP / Legalitas) <span class="required-star">*</span>
                    </label>
                    <div class="input-wrapper">
                        <i class="fas fa-id-card input-icon"></i>
                        <input
                            type="file"
                            id="ktp_document"
                            name="ktp_document"
                            class="form-control @error('ktp_document') is-error @enderror"
                            style="padding: 10px 16px 10px 40px;"
                            accept="image/*,.pdf"
                            required
                        >
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:5px;">Maks. 2MB (JPG, PNG, PDF)</div>
                    @error('ktp_document')
                        <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                    @enderror
                </div>

                {{-- ── Verifikasi Sosial Media ───────────────────── --}}
                <div class="section-divider">
                    <span class="section-label"><i class="fas fa-share-nodes" style="margin-right:5px;"></i>Verifikasi Media Sosial</span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="ig_handle" class="form-label">
                            Handle Instagram <span class="required-star">*</span>
                        </label>
                        <div class="input-wrapper">
                            <i class="fab fa-instagram input-icon" style="color: #e1306c;"></i>
                            <span class="social-prefix">@</span>
                            <input
                                type="text"
                                id="ig_handle"
                                name="ig_handle"
                                class="form-control has-prefix @error('ig_handle') is-error @enderror"
                                placeholder="namaakun"
                                value="{{ ltrim(old('ig_handle', ''), '@') }}"
                                required
                                autocomplete="off"
                            >
                        </div>
                        @error('ig_handle')
                            <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="tiktok_handle" class="form-label">
                            Handle TikTok <span class="required-star">*</span>
                        </label>
                        <div class="input-wrapper">
                            <i class="fab fa-tiktok input-icon" style="color: #69C9D0;"></i>
                            <span class="social-prefix">@</span>
                            <input
                                type="text"
                                id="tiktok_handle"
                                name="tiktok_handle"
                                class="form-control has-prefix @error('tiktok_handle') is-error @enderror"
                                placeholder="namaakun"
                                value="{{ ltrim(old('tiktok_handle', ''), '@') }}"
                                required
                                autocomplete="off"
                            >
                        </div>
                        @error('tiktok_handle')
                            <div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
                        @enderror
                    </div>
                </div>

                {{-- ── Info notice ───────────────────────────────── --}}
                <div class="info-box">
                    <i class="fas fa-circle-info"></i>
                    <p>
                        <strong>Mengapa data media sosial diperlukan?</strong><br>
                        Handle Instagram dan TikTok digunakan untuk memverifikasi identitas organisasi Anda dan mencegah pembuatan akun penyelenggara palsu. Data ini akan ditinjau oleh tim Super Admin kami.
                    </p>
                </div>

                <button type="submit" id="submit-btn" class="btn-submit">
                    <span class="btn-text">
                        <i class="fas fa-paper-plane" style="margin-right:8px;"></i>
                        Kirim Permintaan Registrasi
                    </span>
                    <span class="btn-loader"><div class="spinner"></div></span>
                </button>
            </form>

            <div class="card-footer">
                Sudah punya akun?
                <a href="{{ route('signin') }}">Masuk di sini</a>
                &nbsp;·&nbsp;
                Daftar sebagai peserta?
                <a href="{{ route('signup') }}">Sign Up biasa</a>
            </div>

        </div>
    </div>

    <script>
        // ── Floating particles ────────────────────────────────────
        (function () {
            const container = document.getElementById('particles-container');
            const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,'];
            for (let i = 0; i < 18; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                const size = Math.random() * 4 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                p.style.cssText = `
                    width:${size}px; height:${size}px;
                    left:${Math.random() * 100}%;
                    background:${color}${(Math.random() * 0.4 + 0.2).toFixed(2)});
                    animation-duration:${Math.random() * 15 + 10}s;
                    animation-delay:${Math.random() * 10}s;
                `;
                container.appendChild(p);
            }
        })();

        // ── Form submission loader ────────────────────────────────
        document.getElementById('organizer-form').addEventListener('submit', function (e) {
            const btn = document.getElementById('submit-btn');
            btn.classList.add('loading');
            btn.disabled = true;
        });

        // ── Strip "@" prefix on input to prevent double "@" ──────
        ['ig_handle', 'tiktok_handle'].forEach(function (id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', function () {
                if (this.value.startsWith('@')) {
                    this.value = this.value.replace(/^@+/, '');
                }
            });
        });
    </script>
</body>
</html>
