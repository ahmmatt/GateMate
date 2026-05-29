<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Match Result – SecureGate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        /* ── Reset & Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg: #f8fafc; /* Sangat terang */
            --surface: rgba(255, 255, 255, 0.85); /* Putih dengan transparansi */
            --text: #0f172a;
            --muted: #64748b;
            --border: rgba(0, 0, 0, 0.06);
            --primary: #f43f5e; /* Rose / Pinkish red for matchmaking vibe */
            --secondary: #8b5cf6; /* Violet */
            --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', system-ui, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* ── Bright Aurora Background Effects ── */
        .aurora-bg {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            overflow: hidden;
            background: var(--bg);
        }
        .aurora-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            opacity: 0.15;
            animation: float-orb 15s ease-in-out infinite alternate;
        }
        .orb-1 {
            width: 500px; height: 500px;
            background: var(--primary);
            top: -10%; left: -10%;
        }
        .orb-2 {
            width: 600px; height: 600px;
            background: var(--secondary);
            bottom: -20%; right: -10%;
            animation-delay: -5s;
        }
        @keyframes float-orb {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(120px, 60px) scale(1.1); }
        }

        /* ── LOADING OVERLAY ── */
        #loading-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        #loading-overlay.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        
        .loading-animation {
            font-size: 5rem;
            margin-bottom: 20px;
            animation: float-heart 2s ease-in-out infinite alternate;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 10px 15px rgba(244, 63, 94, 0.3));
        }
        @keyframes float-heart {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-15px) scale(1.1); }
        }

        .loading-text {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text);
            animation: pulse-text 1.5s ease-in-out infinite alternate;
        }
        @keyframes pulse-text {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
        }

        /* ── MAIN CONTENT ── */
        #main-content {
            opacity: 0;
            transition: opacity 1s ease 0.2s;
        }
        #main-content.visible {
            opacity: 1;
        }

        /* ── Navbar ── */
        .navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            height: 70px;
            border-bottom: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .navbar h1 {
            font-size: 1.3rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--muted);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            transition: color 0.2s;
        }
        .nav-back:hover { color: var(--text); }

        /* ── Page Frame ── */
        .page-frame {
            max-width: 800px;
            margin: 0 auto;
            padding: 48px 24px 80px;
        }

        /* ── Hero ── */
        .match-hero {
            text-align: center;
            margin-bottom: 48px;
        }
        .match-hero h1 {
            font-size: clamp(2rem, 4vw, 2.8rem);
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 16px;
            color: var(--text);
            letter-spacing: -1px;
        }
        .match-hero h1 span {
            display: inline-block;
            animation: wiggle 2s infinite;
        }
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        
        .event-chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 100px;
            padding: 8px 20px;
            font-size: 0.9rem;
            color: var(--muted);
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        /* ── Light Glassmorphism Card Base ── */
        .glass-card {
            background: var(--surface);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 28px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.05);
        }

        /* ── Vibe Bio Card ── */
        .my-vibe-card {
            padding: 28px 32px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }
        .my-vibe-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 4px;
            background: var(--gradient);
        }
        .my-vibe-card .label {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--primary);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .my-vibe-card p {
            font-size: 1.1rem;
            color: var(--text);
            line-height: 1.6;
            font-weight: 500;
        }

        /* ── AI Result Card ── */
        .result-card {
            padding: 40px;
        }
        .result-card-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
        }
        .ai-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(244, 63, 94, 0.1);
            border: 1px solid rgba(244, 63, 94, 0.2);
            border-radius: 12px;
            padding: 8px 16px;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--primary);
        }
        .result-card-header h2 {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--text);
        }

        /* ── AI Response Formatting ── */
        .ai-response {
            line-height: 1.8;
            font-size: 1.05rem;
            color: #334155;
        }
        .ai-response strong, .ai-response b {
            color: var(--text);
            font-weight: 700;
        }
        .ai-response h1, .ai-response h2, .ai-response h3 {
            color: var(--text);
            font-weight: 800;
            margin: 28px 0 16px;
            font-size: 1.2rem;
        }
        .ai-response p {
            margin-bottom: 16px;
        }
        .ai-response ul, .ai-response ol {
            padding-left: 20px;
            margin-bottom: 16px;
        }
        .ai-response li {
            margin-bottom: 10px;
        }

        /* ── Connect Section ── */
        .connect-section {
            margin-top: 56px;
        }
        .connect-section-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--text);
            margin-bottom: 32px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 24px;
        }
        
        .contact-card {
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            background: #ffffff;
        }
        .contact-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
            border-color: rgba(244, 63, 94, 0.3);
        }
        
        .contact-avatar {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            border: 3px solid #fff;
        }
        .contact-initial {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            background: var(--gradient);
            color: #fff;
            font-size: 2rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(244, 63, 94, 0.3);
            border: 3px solid #fff;
        }
        
        .contact-name {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text);
            margin-bottom: 8px;
        }
        
        .contact-ig-text {
            font-size: 0.9rem;
            color: var(--muted);
            margin-bottom: 24px;
            font-weight: 500;
        }
        
        .btn-ig {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 100px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #fff;
            text-decoration: none;
            background: linear-gradient(45deg, #e1306c, #833ab4);
            border: none;
            box-shadow: 0 6px 16px rgba(225, 48, 108, 0.3);
            transition: all 0.2s;
            width: 100%;
            justify-content: center;
            margin-top: auto;
        }
        .btn-ig:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(225, 48, 108, 0.4);
        }

        /* ── Action Buttons ── */
        .result-actions {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 56px;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 32px;
            border-radius: 100px;
            font-size: 1rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }
        .btn-action:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .btn-back {
            background: #ffffff;
            border: 1px solid var(--border);
            color: var(--text);
        }
        .btn-retry {
            background: var(--gradient);
            color: #ffffff;
            box-shadow: 0 8px 24px rgba(244, 63, 94, 0.3);
            border: none;
        }
        .btn-retry:hover {
            box-shadow: 0 12px 32px rgba(244, 63, 94, 0.4);
        }

        @media (max-width: 640px) {
            .result-card { padding: 32px 24px; }
            .my-vibe-card { padding: 24px; }
        }
    </style>
</head>
<body>

    <div class="aurora-bg">
        <div class="aurora-orb orb-1"></div>
        <div class="aurora-orb orb-2"></div>
    </div>

    {{-- ══ LOADING OVERLAY ══════════════════════════════════════════════════════ --}}
    <div id="loading-overlay">
        <div class="loading-animation">
            <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <p class="loading-text">Finding your perfect match... 🚀</p>
    </div>

    {{-- ══ MAIN CONTENT (revealed after loading) ══════════════════════════════ --}}
    <div id="main-content">
        {{-- Navbar --}}
        <nav class="navbar">
            <h1>SecureGate</h1>
            <a href="{{ route('my-tickets') }}" class="nav-back">
                <i class="fa-solid fa-arrow-left"></i> My Tickets
            </a>
        </nav>

        <div class="page-frame">
            {{-- Hero --}}
            <div class="match-hero">
                <h1>It's a Match! <span>🎉</span></h1>
                <div class="event-chip">
                    <i class="fa-solid fa-calendar-check" style="color:var(--primary)"></i>
                    {{ $myTicket->event->title }}
                </div>
            </div>

            {{-- My Vibe Bio --}}
            <div class="glass-card my-vibe-card">
                <div class="label"><i class="fa-solid fa-face-smile-wink"></i> Your Vibe</div>
                <p>"{{ $myTicket->vibe_bio }}"</p>
            </div>

            {{-- AI Result Card --}}
            <div class="glass-card result-card">
                <div class="result-card-header">
                    <span class="ai-badge">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Analysis
                    </span>
                    <h2>Match Recommendations</h2>
                </div>
                <div class="ai-response">
                    {!! \Illuminate\Support\Str::markdown($aiResponse) !!}
                </div>
            </div>

            {{-- Connect Section --}}
            <div class="connect-section">
                <h3 class="connect-section-title">
                    <i class="fa-solid fa-handshake-angle" style="color:var(--primary)"></i> 
                    Connect with your matches
                </h3>

                <div class="contact-grid">
                    @foreach ($otherAttendees as $attendee)
                        @php
                            $contactName    = $attendee->user?->full_name ?? 'Peserta Anonim';
                            $contactInitial = strtoupper(substr($contactName, 0, 1));
                            $contactPic     = $attendee->user?->profile_picture;
                            $igHandle       = !empty($attendee->ig_handle) ? $attendee->ig_handle : null;
                        @endphp
                        <div class="glass-card contact-card">
                            @if (!empty($contactPic))
                                <img src="{{ asset('Media/uploads/' . $contactPic) }}"
                                     alt="{{ $contactName }}" class="contact-avatar">
                            @else
                                <div class="contact-initial">{{ $contactInitial }}</div>
                            @endif

                            <p class="contact-name">{{ $contactName }}</p>
                            
                            <p class="contact-ig-text">
                                {{ $igHandle ? '@' . $igHandle : 'No Instagram' }}
                            </p>

                            <a href="https://instagram.com/{{ $igHandle ?? 'gatemate.id' }}"
                               target="_blank" rel="noopener noreferrer" class="btn-ig">
                                <i class="fa-brands fa-instagram" style="font-size:1.1rem"></i>
                                Say Hello! 👋
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Action Buttons --}}
            <div class="result-actions">
                <a href="{{ route('my-tickets') }}" class="btn-action btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Back to Tickets
                </a>
                <a href="{{ route('ticket.match', $myTicket->id_attendee) }}" class="btn-action btn-retry">
                    <i class="fa-solid fa-rotate-right"></i> Reroll Match ✨
                </a>
            </div>
        </div>
    </div>

    <script>
        // Simple and elegant fade out for loading overlay
        window.addEventListener('DOMContentLoaded', () => {
            const overlay = document.getElementById('loading-overlay');
            const mainContent = document.getElementById('main-content');
            
            // Show loading for 2.5 seconds, then transition
            setTimeout(() => {
                overlay.classList.add('fade-out');
                mainContent.classList.add('visible');
                
                // Remove from DOM after fade out completes
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 800);
            }, 2500);
        });
    </script>
</body>
</html>
