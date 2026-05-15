<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Match Result – SecureGate</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* ── Reset & Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg: #09090b; /* Very dark zinc */
            --surface: rgba(24, 24, 27, 0.6); /* Slightly transparent zinc-900 */
            --text: #f4f4f5;
            --muted: #a1a1aa;
            --border: rgba(255, 255, 255, 0.08);
            --primary: #8b5cf6; /* Violet */
            --secondary: #3b82f6; /* Blue */
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', system-ui, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* ── Aurora Background Effects ── */
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
            filter: blur(80px);
            opacity: 0.4;
            animation: float-orb 20s ease-in-out infinite alternate;
        }
        .orb-1 {
            width: 400px; height: 400px;
            background: var(--primary);
            top: -10%; left: -10%;
        }
        .orb-2 {
            width: 500px; height: 500px;
            background: var(--secondary);
            bottom: -20%; right: -10%;
            animation-delay: -5s;
        }
        @keyframes float-orb {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(100px, 50px) scale(1.2); }
        }

        /* ── LOADING OVERLAY ── */
        #loading-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: var(--bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 1s ease, visibility 1s ease;
        }
        #loading-overlay.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        
        .loading-animation {
            position: relative;
            width: 120px;
            height: 120px;
            margin-bottom: 40px;
        }
        .pulse-circle {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 80px; height: 80px;
            border-radius: 50%;
            mix-blend-mode: screen;
            animation: pulse-intersect 3s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
        }
        .pulse-1 {
            background: rgba(139, 92, 246, 0.6);
            transform-origin: center right;
            animation-name: pulse-intersect-1;
        }
        .pulse-2 {
            background: rgba(59, 130, 246, 0.6);
            transform-origin: center left;
            animation-name: pulse-intersect-2;
            animation-delay: -1.5s;
        }
        @keyframes pulse-intersect-1 {
            0% { transform: translate(-80%, -50%) scale(0.8); opacity: 0.5; }
            100% { transform: translate(-30%, -50%) scale(1.2); opacity: 0.9; }
        }
        @keyframes pulse-intersect-2 {
            0% { transform: translate(-20%, -50%) scale(0.8); opacity: 0.5; }
            100% { transform: translate(-70%, -50%) scale(1.2); opacity: 0.9; }
        }

        .loading-text {
            font-size: 1.1rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            letter-spacing: 0.02em;
            animation: text-breathe 2s ease-in-out infinite;
        }
        @keyframes text-breathe {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
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
            height: 64px;
            border-bottom: 1px solid var(--border);
            background: rgba(9, 9, 11, 0.4);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .navbar h1 {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .nav-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--muted);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.2s;
        }
        .nav-back:hover { color: #fff; }

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
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 12px;
            color: #fff;
        }
        .event-chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 100px;
            padding: 6px 16px;
            font-size: 0.85rem;
            color: var(--muted);
            font-weight: 500;
        }

        /* ── Glassmorphism Card Base ── */
        .glass-card {
            background: var(--surface);
            backdrop-filter: blur(15px);
            border: 1px solid var(--border);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        /* ── Vibe Bio Card ── */
        .my-vibe-card {
            padding: 24px 28px;
            margin-bottom: 32px;
        }
        .my-vibe-card .label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--muted);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .my-vibe-card p {
            font-size: 1rem;
            color: var(--text);
            line-height: 1.6;
        }

        /* ── AI Result Card ── */
        .result-card {
            padding: 36px 40px;
        }
        .result-card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
        }
        .ai-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #c4b5fd;
        }
        .result-card-header h2 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
        }

        /* ── AI Response Formatting ── */
        .ai-response {
            line-height: 1.8;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
        }
        .ai-response strong, .ai-response b {
            color: #fff;
            font-weight: 600;
        }
        .ai-response h1, .ai-response h2, .ai-response h3 {
            color: #fff;
            font-weight: 700;
            margin: 24px 0 12px;
            font-size: 1.15rem;
        }
        .ai-response p {
            margin-bottom: 16px;
        }
        .ai-response ul, .ai-response ol {
            padding-left: 20px;
            margin-bottom: 16px;
        }
        .ai-response li {
            margin-bottom: 8px;
        }

        /* ── Connect Section ── */
        .connect-section {
            margin-top: 48px;
        }
        .connect-section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
        }
        
        .contact-card {
            padding: 28px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
        }
        .contact-card:hover {
            transform: translateY(-5px);
            background: rgba(39, 39, 42, 0.6);
        }
        
        .contact-avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 16px;
        }
        .contact-initial {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: #fff;
            font-size: 1.6rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }
        
        .contact-name {
            font-size: 1.05rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 6px;
        }
        
        .contact-ig-text {
            font-size: 0.85rem;
            color: var(--muted);
            margin-bottom: 20px;
        }
        
        .btn-ig {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
            color: #fff;
            text-decoration: none;
            background: linear-gradient(45deg, #e1306c, #833ab4);
            border: none;
            transition: opacity 0.2s;
            width: 100%;
            justify-content: center;
            margin-top: auto;
        }
        .btn-ig:hover {
            opacity: 0.9;
        }

        /* ── Action Buttons ── */
        .result-actions {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 48px;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 100px;
            font-size: 0.95rem;
            font-weight: 500;
            text-decoration: none;
            transition: transform 0.2s, background 0.2s;
        }
        .btn-action:hover {
            transform: translateY(-2px);
        }
        .btn-back {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text);
        }
        .btn-back:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        .btn-retry {
            background: #fff;
            color: #09090b;
        }
        .btn-retry:hover {
            background: #f4f4f5;
        }

        @media (max-width: 640px) {
            .result-card { padding: 24px; }
            .my-vibe-card { padding: 20px; }
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
            <div class="pulse-circle pulse-1"></div>
            <div class="pulse-circle pulse-2"></div>
        </div>
        <p class="loading-text">Finding your vibe connection...</p>
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
                <h1>The Vibe Match</h1>
                <div class="event-chip">
                    <i class="fa-solid fa-calendar-check"></i>
                    {{ $myTicket->event->title }}
                </div>
            </div>

            {{-- My Vibe Bio --}}
            <div class="glass-card my-vibe-card">
                <div class="label"><i class="fa-regular fa-user"></i> Your Vibe</div>
                <p>{{ $myTicket->vibe_bio }}</p>
            </div>

            {{-- AI Result Card --}}
            <div class="glass-card result-card">
                <div class="result-card-header">
                    <span class="ai-badge">
                        <i class="fa-solid fa-sparkles"></i> AI Analysis
                    </span>
                    <h2>Match Recommendations</h2>
                </div>
                <div class="ai-response">
                    {!! \Illuminate\Support\Str::markdown($aiResponse) !!}
                </div>
            </div>

            {{-- Connect Section --}}
            <div class="connect-section">
                <h3 class="connect-section-title">Connect with your matches</h3>

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
                                <i class="fa-brands fa-instagram"></i>
                                Connect
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Action Buttons --}}
            <div class="result-actions">
                <a href="{{ route('my-tickets') }}" class="btn-action btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Back
                </a>
                <a href="{{ route('ticket.match', $myTicket->id_attendee) }}" class="btn-action btn-retry">
                    <i class="fa-solid fa-rotate-right"></i> Reroll Match
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
                }, 1000);
            }, 2500);
        });
    </script>
</body>
</html>
