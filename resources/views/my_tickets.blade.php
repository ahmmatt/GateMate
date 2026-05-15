<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureGate - Your Events</title>
    <link rel="stylesheet" href="{{ asset('CSS/mainpage.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* ── AI Vibe Modal ── */
        .vibe-modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(6px);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }

        .vibe-modal-overlay.active {
            display: flex;
        }

        .vibe-modal {
            background: rgba(18, 24, 38, 0.92);
            border: 1px solid rgba(74, 222, 128, 0.25);
            border-radius: 20px;
            padding: 32px 28px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 0 40px rgba(74, 222, 128, 0.12);
            position: relative;
            animation: vibeIn .25s ease;
        }

        @keyframes vibeIn {
            from {
                opacity: 0;
                transform: translateY(16px) scale(0.97);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .vibe-modal h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #4ade80;
            margin-bottom: 4px;
        }

        .vibe-modal p.vibe-subtitle {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.45);
            margin-bottom: 20px;
        }

        .vibe-modal textarea {
            width: 100%;
            min-height: 110px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(74, 222, 128, 0.2);
            border-radius: 12px;
            color: #fff;
            padding: 12px 14px;
            font-size: 0.85rem;
            resize: vertical;
            outline: none;
            transition: border .2s;
            box-sizing: border-box;
        }

        .vibe-modal textarea:focus {
            border-color: #4ade80;
        }

        .vibe-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 16px;
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
        }

        .vibe-toggle-row label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
        }

        .vibe-toggle {
            position: relative;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
        }

        .vibe-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .vibe-slider {
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            cursor: pointer;
            transition: background .25s;
        }

        .vibe-slider:before {
            content: '';
            position: absolute;
            width: 18px;
            height: 18px;
            left: 3px;
            top: 3px;
            background: #fff;
            border-radius: 50%;
            transition: transform .25s;
        }

        .vibe-toggle input:checked+.vibe-slider {
            background: #4ade80;
        }

        .vibe-toggle input:checked+.vibe-slider:before {
            transform: translateX(20px);
        }

        .vibe-modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn-vibe-save {
            flex: 1;
            padding: 11px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: #0a1628;
            font-weight: 700;
            font-size: 0.875rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: opacity .2s;
        }

        .btn-vibe-save:hover {
            opacity: .88;
        }

        .btn-vibe-cancel {
            padding: 11px 18px;
            background: rgba(255, 255, 255, 0.07);
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.875rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
        }

        .btn-open-vibe {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 14px;
            padding: 8px 14px;
            background: rgba(74, 222, 128, 0.1);
            border: 1px solid rgba(74, 222, 128, 0.3);
            border-radius: 10px;
            color: #4ade80;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            justify-content: center;
            transition: background .2s;
        }

        .btn-open-vibe:hover {
            background: rgba(74, 222, 128, 0.18);
        }

        .vibe-active-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.72rem;
            color: #4ade80;
            background: rgba(74, 222, 128, 0.1);
            border: 1px solid rgba(74, 222, 128, 0.25);
            border-radius: 6px;
            padding: 2px 8px;
            margin-bottom: 6px;
        }

        .vibe-success-alert {
            background: rgba(74, 222, 128, 0.12);
            border: 1px solid rgba(74, 222, 128, 0.35);
            border-radius: 10px;
            color: #4ade80;
            font-size: 0.8rem;
            padding: 8px 12px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .vibe-modal-close {
            position: absolute;
            top: 14px;
            right: 18px;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.35);
            font-size: 1.1rem;
            cursor: pointer;
        }

        .vibe-modal-close:hover {
            color: #fff;
        }
    </style>
    <script>
        if (localStorage.getItem('securegate_theme') === 'light') {
            document.documentElement.classList.add('light-mode');
        }
    </script>
</head>

<body>

    {{-- ─── Navbar ──────────────────────────────────────────────────────────── --}}
    <nav class="navbar">
        <div class="left-nav">
            <i class="fa-solid fa-bars hamburger-btn" id="hamburger-btn"></i>
            <h1>SecureGate</h1>
        </div>
        <div class="main-nav">
            <div class="main-nav-discover">
                <i class="fa-regular fa-compass"></i>
                <a href="{{ route('discover') }}">Discover</a>
            </div>
            <div class="main-nav-event">
                <i class="fa-solid fa-ticket"></i>
                <a href="{{ route('my-tickets') }}">Event</a>
            </div>
        </div>
        <div class="right-nav">

            @php
            $navName = Auth::user()->full_name;
            $navInitial = strtoupper(substr($navName, 0, 1));
            $navPic = Auth::user()->profile_picture;
            @endphp

            <div id="profile-dropdown-trigger"
                class="profile-dropdown-trigger"
                title="{{ $navName }}">
                @if (!empty($navPic))
                <img src="{{ asset('Media/uploads/' . $navPic) }}"
                    alt="Profile" class="profile-pic-small">
                @else
                <div class="profile-initial-small">{{ $navInitial }}</div>
                @endif
            </div>

            <div id="profile-dropdown-menu" class="profile-dropdown-menu">
                <div class="dropdown-header">
                    @if (!empty($navPic))
                    <img src="{{ asset('Media/uploads/' . $navPic) }}" class="profile-pic-large">
                    @else
                    <div class="profile-initial-large">{{ $navInitial }}</div>
                    @endif
                    <div class="dropdown-user-info">
                        <h4 class="dropdown-user-name">{{ $navName }}</h4>
                        <p class="dropdown-user-role">{{ Auth::user()->role }}</p>
                    </div>
                </div>
                <div class="dropdown-menu-links">
                    <a href="{{ url('/settings') }}" class="dropdown-link">
                        <i class="fa-solid fa-gear dropdown-link-icon"></i> Settings
                    </a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="dropdown-link logout-link"
                            style="width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:0;">
                            <i class="fa-solid fa-arrow-right-from-bracket dropdown-link-icon"></i> Logout
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </nav>

    {{-- ─── Page Content ─────────────────────────────────────────────────────── --}}
    <div class="page-frame">

        <div class="page-frame-nav">
            <h1>Your Event</h1>
            <div class="toggle-select-event">
                <a href="#" id="btn-upcoming" class="active">Upcoming</a>
                <a href="#" id="btn-past">Past</a>
            </div>
        </div>

        {{-- ════════════════ UPCOMING TICKETS ════════════════ --}}
        <div class="upcoming-event" id="view-upcoming">
            @forelse ($upcomingTickets as $ticket)
            @php
            $ev = $ticket->event;
            $authorName = $ev->admin?->full_name ?? 'Unknown Admin';
            $authorInitial= strtoupper(substr($authorName, 0, 1));
            $authorPic = $ev->admin?->profile_picture;
            $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
            @endphp

            <div class="event-card-detail">
                <a href="{{ url('/eticket/' . $ticket->id_attendee) }}">

                    <div class="card-top-header">
                        <div class="header-left">
                            <h4>{{ \Carbon\Carbon::parse($ev->start_date)->format('M j, l') }}</h4>
                        </div>
                        <div class="header-right">
                            <h4>{{ \Carbon\Carbon::createFromTimeString($ev->start_time)->format('g:i A') }}</h4>
                        </div>
                    </div>
                    <hr class="card-divider">

                    <div class="card-hero-img">
                        <img src="{{ $bannerSrc }}" alt="Event Banner">
                    </div>

                    <h3 class="card-title">{{ $ev->title }}</h3>

                    {{-- Author --}}
                    <div class="card-author author-info-wrapper">
                        @if (!empty($authorPic))
                        <img src="{{ asset('Media/uploads/' . $authorPic) }}"
                            alt="Author Profile" class="author-img-small">
                        @else
                        <div class="author-initial-small">{{ $authorInitial }}</div>
                        @endif
                        <span class="author-name-text">{{ $authorName }}</span>
                    </div>

                    {{-- Location + Status Badge --}}
                    <div class="card-info-blocks info-blocks-compact">
                        <div class="info-block info-block-expanded">
                            <div class="block-icon icon-mt-2">
                                <i class="fas fa-location-dot"></i>
                            </div>
                            <div class="block-text text-flex-1">
                                <h3 class="location-title-small">
                                    @if ($ev->location_type === 'online')
                                    Online
                                    @else
                                    {{ !empty($ev->venue_name) ? $ev->venue_name : 'Offline' }}
                                    @endif
                                </h3>
                                <p class="location-desc-small">
                                    @if ($ev->location_type === 'online')
                                    Online Event / Virtual Meeting
                                    @else
                                    {{ (!empty($ev->city) ? $ev->city . ', ' : '') . $ev->location_details }}
                                    @endif
                                </p>
                            </div>
                        </div>

                        <div class="price-mini-block-alt">
                            @switch($ticket->status)
                            @case('need_approval')
                            <span class="ticket-badge-pending">
                                <i class="fa-solid fa-clock-rotate-left badge-icon-mr"></i> Pending
                            </span>
                            @break
                            @case('awaiting_payment')
                            <span class="ticket-badge-pay">
                                <i class="fa-solid fa-wallet badge-icon-mr"></i> Pay Now
                            </span>
                            @break
                            @case('checked_in')
                            <span class="ticket-badge-scanned">
                                <i class="fa-solid fa-expand badge-icon-mr"></i> Scanned
                            </span>
                            @break
                            @default
                            <span class="ticket-badge-ready">
                                <i class="fa-solid fa-ticket-simple badge-icon-mr"></i> E-Ticket Ready
                            </span>
                            @endswitch
                        </div>
                    </div>

                    {{-- Tier & Ticket Code --}}
                    <div style="margin-top:8px; font-size:12px; opacity:0.6;">
                        <i class="fa-solid fa-tag" style="margin-right:4px;"></i>
                        {{ $ticket->ticketTier?->tier_name ?? '-' }}
                        &nbsp;·&nbsp;
                        <i class="fa-solid fa-barcode" style="margin-right:4px;"></i>
                        {{ $ticket->ticket_code }}
                    </div>

                    {{-- QR Code --}}
                    <div style="margin-top:12px; text-align:center;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ $ticket->qr_token }}"
                            alt="QR Code"
                            class="qr-image">
                    </div>

                </a>

                {{-- ✨ AI Matchmaking Section (di luar <a> agar tidak trigger navigasi) --}}
                <div style="padding: 0 4px 4px;">

                    {{-- Badge jika sudah aktif --}}
                    @if ($ticket->looking_for_match)
                    <div class="vibe-active-badge">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Match Aktif
                    </div>
                    @endif

                    {{-- Success flash per-tiket --}}
                    @if (session('vibe_success_' . $ticket->id_attendee))
                    <div class="vibe-success-alert">
                        <i class="fa-solid fa-circle-check"></i>
                        {{ session('vibe_success_' . $ticket->id_attendee) }}
                    </div>
                    @endif
                    {{-- Error flash message --}}
                    @if (session('error'))
                    <div class="vibe-success-alert"
                        style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35); color: #ef4444; margin-top:10px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        {{ session('error') }}
                    </div>
                    @endif

                    {{-- Tombol buka modal --}}
                    <button class="btn-open-vibe"
                        data-modal="vibe-modal-{{ $ticket->id_attendee }}">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Setup AI Match
                    </button>
                    @if($ticket->looking_for_match)
                    <a href="{{ route('ticket.match', $ticket->id_attendee) }}"
                        class="btn-open-vibe"
                        style="margin-top: 10px; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); border:none; text-align:center; display:block; text-decoration:none;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Temukan Match (AI)
                    </a>
                    @endif

                </div>
            </div>{{-- END .event-card-detail --}}

            {{-- ── Vibe Modal (per tiket) ─────────────────────────────── --}}
            <div class="vibe-modal-overlay" id="vibe-modal-{{ $ticket->id_attendee }}">
                <div class="vibe-modal">
                    <button class="vibe-modal-close"
                        data-close="vibe-modal-{{ $ticket->id_attendee }}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <h3><i class="fa-solid fa-wand-magic-sparkles"></i> AI Matchmaking</h3>
                    <p class="vibe-subtitle">Bantu AI mencarikan teman satu frekuensi untuk event ini.</p>

                    <form method="POST"
                        action="{{ route('ticket.vibe', $ticket->id_attendee) }}">
                        @csrf

                        <textarea name="vibe_bio"
                            maxlength="500"
                            placeholder="Ceritakan minatmu, tujuan ikut event ini, atau topik obrolan favoritmu agar AI bisa mencarikan teman yang pas...">{{ old('vibe_bio', $ticket->vibe_bio) }}</textarea>

                        {{-- Instagram Handle --}}
                        <div style="margin-top:12px;">
                            <label style="display:block; font-size:0.78rem; color:rgba(255,255,255,0.5); margin-bottom:5px; letter-spacing:.04em;">
                                <i class="fa-brands fa-instagram" style="margin-right:4px; background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); -webkit-background-clip:text; -webkit-text-fill-color:transparent;"></i>
                                Instagram Username <span style="opacity:.5;">(opsional, tanpa @)</span>
                            </label>
                            <input type="text"
                                   name="ig_handle"
                                   maxlength="50"
                                   value="{{ old('ig_handle', $ticket->ig_handle) }}"
                                   placeholder="contoh: johndoe"
                                   style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(74,222,128,0.2); border-radius:12px; color:#fff; padding:10px 14px; font-size:0.85rem; outline:none; box-sizing:border-box; transition:border .2s;"
                                   onfocus="this.style.borderColor='#4ade80'"
                                   onblur="this.style.borderColor='rgba(74,222,128,0.2)'">
                        </div>

                        <div class="vibe-toggle-row">
                            <label for="match-toggle-{{ $ticket->id_attendee }}">
                                Aktifkan pencarian teman satu frekuensi
                            </label>
                            <label class="vibe-toggle">
                                <input type="checkbox"
                                    id="match-toggle-{{ $ticket->id_attendee }}"
                                    name="looking_for_match"
                                    value="1"
                                    {{ $ticket->looking_for_match ? 'checked' : '' }}>
                                <span class="vibe-slider"></span>
                            </label>
                        </div>

                        <div class="vibe-modal-actions">
                            <button type="submit" class="btn-vibe-save">
                                <i class="fa-solid fa-floppy-disk"></i> Simpan
                            </button>
                            <button type="button" class="btn-vibe-cancel"
                                data-close="vibe-modal-{{ $ticket->id_attendee }}">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            @empty
            <div class="empty-state">
                <i class="fa-solid fa-calendar-xmark"></i>
                <h3>No Events Available</h3>
                <p>You haven't registered for any future events yet. Let's find some!</p>
            </div>
            @endforelse
        </div>

        {{-- ════════════════ PAST TICKETS ════════════════ --}}
        <div class="past-event hidden-display" id="view-past">
            @forelse ($pastTickets as $ticket)
            @php
            $ev = $ticket->event;
            $authorName = $ev->admin?->full_name ?? 'Unknown Admin';
            $authorInitial= strtoupper(substr($authorName, 0, 1));
            $authorPic = $ev->admin?->profile_picture;
            $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
            $startDate = \Carbon\Carbon::parse($ev->start_date);
            @endphp

            <div class="timeline-row">
                <div class="left-info">
                    <h3>{{ $startDate->format('M j') }}</h3>
                    <h3>{{ $startDate->format('l') }}</h3>
                </div>
                <div class="right-info">
                    <div class="past-event-card past-card-inner">

                        <div class="left-past-card past-card-left-col">
                            <div class="time-event">
                                <span class="begin-time">
                                    {{ \Carbon\Carbon::createFromTimeString($ev->start_time)->format('g:i A') }}
                                </span>
                                <span>·</span>
                                <span>
                                    {{ \Carbon\Carbon::createFromTimeString($ev->end_time)->format('g:i A') }}
                                </span>
                                <span>{{ $ev->timezone }}</span>
                            </div>

                            <h2>{{ $ev->title }}</h2>

                            <div class="author-past past-author-wrapper">
                                @if (!empty($authorPic))
                                <img src="{{ asset('Media/uploads/' . $authorPic) }}"
                                    alt="Author" class="past-author-img">
                                @else
                                <div class="past-author-initial">{{ $authorInitial }}</div>
                                @endif
                                <p class="past-author-by">By</p>
                                <p class="past-author-name">{{ $authorName }}</p>
                            </div>

                            <div class="past-location">
                                <i class="fas {{ $ev->location_type === 'online' ? 'fa-link' : 'fa-map-marker-alt' }}"></i>
                                <p>
                                    @if ($ev->location_type === 'online')
                                    Virtual Meeting / Online
                                    @else
                                    {{ !empty($ev->venue_name) ? $ev->venue_name : ($ev->city ?? '-') }}
                                    @endif
                                </p>
                            </div>

                            <p class="status-past past-status-ended">Ended</p>
                        </div>

                        <div class="right-past-card past-card-right-col">
                            <img src="{{ $bannerSrc }}" alt="Event Banner" class="past-card-img">
                        </div>

                    </div>
                </div>
            </div>
            @empty
            <div class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <h3>No Events Available</h3>
                <p>You haven't attended any events in the past.</p>
            </div>
            @endforelse
        </div>

        <hr class="garis-footer">
        <div class="page-footer">
            <div class="left-footer">
                <a href="{{ route('discover') }}">Discover</a>
                <a href="#">Help</a>
            </div>
            <div class="right-footer">
                <a href="#"><i class="fab fa-x"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>

    </div>

    <script src="{{ asset('JS/mainpage.js') }}"></script>
    <script>
        // ── Vibe Modal Open/Close ────────────────────────────────────────────
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById(btn.dataset.modal)?.classList.add('active');
            });
        });

        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById(btn.dataset.close)?.classList.remove('active');
            });
        });

        // Tutup saat klik overlay
        document.querySelectorAll('.vibe-modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });

        // Auto-buka modal jika ada success session (agar badge langsung terlihat)
        document.querySelectorAll('.vibe-success-alert').forEach(alert => {
            const card = alert.closest('.event-card-detail');
            if (card) card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    </script>
</body>

</html>