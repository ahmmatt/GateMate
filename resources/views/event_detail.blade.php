<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{-- CSRF token dibaca oleh ticket.js untuk AJAX request ke /checkout --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $event->title }} - SecureGate</title>
    <link rel="stylesheet" href="{{ asset('CSS/ticket.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        if (localStorage.getItem('securegate_theme') === 'light') {
            document.documentElement.classList.add('light-mode');
        }
    </script>
</head>

<body>
    @include('components.navbar')

    {{-- ─── Page Content ─────────────────────────────────────────────────────── --}}
    <div class="page-frame">
        <div class="create-wrapper-layout">

            {{-- ══════════════════════════════ LEFT LAYOUT ══════════════════════════════ --}}
            <div class="left-layout">

                {{-- Banner Image --}}
                <div class="add-pict-card view-mode">
                    @php
                    $bannerSrc = !empty($event->banner_image)
                    ? asset('Media/uploads/' . $event->banner_image)
                    : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
                    @endphp
                    <img src="{{ $bannerSrc }}" alt="Event Cover">
                </div>

                {{-- Organizer Card --}}
                @php
                $adminName = $event->admin?->full_name ?? 'SecureGate User';
                $adminInitial = strtoupper(substr($adminName, 0, 1));
                $adminPic = $event->admin?->profile_picture;
                @endphp
                <div class="presented-wrapper">
                    <div class="presented-left">
                        <div class="presented-logo">
                            @if (!empty($adminPic))
                            <img src="{{ asset('Media/uploads/' . $adminPic) }}"
                                alt="Organizer"
                                style="width:36px; height:36px; border-radius:8px; object-fit:cover;">
                            @else
                            <div style="width:36px; height:36px; border-radius:8px; background-color:#f97316; color:#fff; display:flex; justify-content:center; align-items:center; font-size:14px; font-weight:bold;">
                                {{ $adminInitial }}
                            </div>
                            @endif
                        </div>
                        <div class="presented-detail">
                            <p>Organized By</p>
                            <h3>{{ $adminName }} <i class="fa-solid fa-circle-check verified-icon"></i></h3>
                        </div>
                    </div>
                </div>
                <hr>

                {{-- Location Card --}}
                <div class="maps-or-link-card">
                    <h4>Location or Virtual Link</h4>
                    <div class="link-wrapper">
                        @if ($event->location_type === 'online')
                        <i class="fa-solid fa-link link-icon-main"></i>
                        <div class="url-box">
                            <span id="virtual-link-text" class="is-virtual"
                                title="Virtual Meeting (Tautan ada di E-Ticket)">
                                Virtual Meeting (Tautan ada di E-Ticket)
                            </span>
                        </div>
                        @else
                        @php
                        $copyTarget = !empty($event->maps_link) && $event->maps_link !== 'NULL'
                        ? $event->maps_link
                        : $event->location_details;
                        @endphp
                        <i class="fa-solid fa-map-location-dot link-icon-main"></i>
                        <div class="url-box">
                            <span id="virtual-link-text" title="{{ $copyTarget }}">
                                {{ $copyTarget }}
                            </span>
                            <i class="fa-regular fa-copy copy-icon-btn"
                                id="copy-link-btn"
                                title="Copy Link"
                                data-url="{{ $copyTarget }}"></i>
                        </div>
                        @endif
                    </div>
                </div>
                <hr>

                {{-- 3D Space Video (opsional) --}}
                @if (!empty($event->space_3d_file) && $event->space_3d_file !== 'NULL')
                <div class="space-3d-container">
                    <h3 class="space-3d-title">Event 3D Space</h3>
                    <div class="space-3d-wrapper">
                        <video controls playsinline>
                            <source src="{{ asset('Media/uploads/' . $event->space_3d_file) }}"
                                type="video/mp4">
                        </video>
                    </div>
                </div>
                <hr>
                @endif

                {{-- Category Badge --}}
                <div class="category-card">
                    <i class="fa-solid fa-layer-group"></i>
                    <h3>{{ $event->category }}</h3>
                </div>

            </div>
            {{-- END LEFT LAYOUT --}}


            {{-- ══════════════════════════════ RIGHT LAYOUT ═════════════════════════════ --}}
            <div class="right-layout">

                {{-- Event Title --}}
                <div class="event-name view-mode-title">
                    <h1>{{ $event->title }}</h1>
                </div>

                {{-- Date / Time / Location + Ticket Tiers --}}
                <div class="time-loc-and-price-wrapper">
                    <div class="time-loc-left">

                        {{-- Date Card --}}
                        <div class="time-date-wrapper">
                            @php
                            $startDate = \Carbon\Carbon::parse($event->start_date);
                            @endphp
                            <div class="time-date-card">
                                <span>{{ strtoupper($startDate->format('M')) }}</span>
                                <h4>{{ $startDate->format('d') }}</h4>
                            </div>
                            <div class="time-date-detail">
                                <h3>{{ $startDate->format('l, F j') }}</h3>
                                <p>
                                    {{ \Carbon\Carbon::createFromTimeString($event->start_time)->format('g:i A') }}
                                    -
                                    {{ \Carbon\Carbon::createFromTimeString($event->end_time)->format('g:i A') }}
                                </p>
                            </div>
                        </div>

                        {{-- Venue --}}
                        <div class="event-loc-wrapper">
                            <div class="event-loc-icon">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="time-date-detail">
                                <h3>
                                    {{ !empty($event->venue_name) ? $event->venue_name : 'Event Location' }}
                                    <i class="fa-solid fa-arrow-up-right-from-square arrow-icon-small"></i>
                                </h3>
                                <p>
                                    @if ($event->location_type === 'online')
                                    Online Event (Zoom / Virtual Meet)
                                    @else
                                    {{ (!empty($event->city) ? $event->city . ', ' : '') . $event->location_details }}
                                    @endif
                                </p>
                            </div>
                        </div>

                    </div>

                    {{-- Ticket Tier Cards --}}
                    <div class="price-cards-wrapper">
                        @foreach ($event->ticketTiers as $tier)
                        <div class="price-right-card ticket-option-card {{ strtolower($tier->tier_name) === 'vip' ? 'vip-card' : '' }}"
                            data-id="{{ $tier->id_tier }}"
                            data-price="{{ $tier->price }}"
                            data-name="{{ $tier->tier_name }}">
                            <i class="fa-solid {{ strtolower($tier->tier_name) === 'vip' ? 'fa-crown' : 'fa-ticket' }}"></i>
                            <p>{{ $tier->tier_name }}</p>
                            <h3>
                                @if ($tier->price == 0)
                                Free
                                @else
                                Rp {{ number_format($tier->price, 0, ',', '.') }}
                                @endif
                            </h3>
                        </div>
                        @endforeach
                    </div>
                </div>

                {{-- Register Card --}}
                <div class="register-card">
                    <div class="register-header">
                        <h4>Registration</h4>
                    </div>
                    <h3>Welcome! To join the event, please register below.</h3>

                    <div class="profile-detail">
                        @if (!empty($navPic))
                        <img src="{{ asset('Media/uploads/' . $navPic) }}"
                            alt="User Avatar" class="profile-img-reg">
                        @else
                        <div class="user-avatar-reg">{{ $navInitial }}</div>
                        @endif
                        <div class="user-info-reg">
                            <h3>{{ Auth::user()->full_name }}</h3>
                            <h3 class="email-text">{{ Auth::user()->email }}</h3>
                        </div>
                    </div>

                    @if ($event->status === 'ended')
                    <button type="button" class="btn-register btn-disabled" disabled>
                        Event Has Ended
                    </button>
                    {{-- BYPASS SEMENTARA UNTUK TESTING CHECKOUT --}}
                    {{-- @elseif (empty($navPic))
                    <button type="button" class="btn-register btn-setup-photo" id="btn-setup-photo">
                        <i class="fa-solid fa-camera"></i> Setup Profile Photo
                    </button> --}}
                    @else
                    <button type="button" class="btn-register" id="open-register-modal">
                        Buy Ticket
                    </button>
                    @endif
                </div>

                {{-- Register Modal --}}
                <div class="register-modal" id="register-modal">
                    <i class="fa-solid fa-xmark close-modal" id="close-register-modal"></i>

                    <form method="POST" action="{{ route('checkout.process') }}" id="checkout-form">
                        @csrf
                        <input type="hidden" name="id_event" value="{{ $event->id_event }}">

                        <div id="step-1-form" class="modal-step">
                            <h3 class="modal-step-title-text">Registration Details</h3>

                            {{-- Error: Tiket Habis --}}
                            @error('id_tier')
                            <div class="alert-error" style="margin-bottom:12px;">
                                <i class="fa-solid fa-circle-exclamation"></i> {{ $message }}
                            </div>
                            @enderror

                            <input type="hidden" name="id_tier" id="selected-tier-id" required>

                            {{-- Custom Questions --}}
                            @foreach ($event->customQuestions as $question)
                            <div class="modal-input-group">
                                <span class="modal-label">{{ $question->question_text }}</span>
                                <input type="text"
                                    name="answers[{{ $question->id_question }}]"
                                    required
                                    class="modal-input">
                            </div>
                            @endforeach

                            {{-- Seat Number (hanya jika seat_assignment = 'pilih') --}}
                            <div class="modal-input-group {{ $event->seat_assignment === 'bebas' ? 'hidden-step' : '' }}">
                                <span class="modal-label">Choose your seat number (Optional)</span>
                                <input type="text" name="seat_num"
                                    placeholder="e.g. A-12" class="modal-input">
                            </div>

                            <button type="button" class="btn-proceed btn-green" id="btn-to-payment">
                                Proceed to Payment
                            </button>
                        </div>
                    </form>
                </div>
                <div id="modal-overlay" class="modal-overlay-bg"></div>

                {{-- About Event --}}
                <div class="event-description">
                    <h4 class="about-event-title">About Event</h4>
                    <p>{!! nl2br(e($event->description)) !!}</p>
                </div>

            </div>
            {{-- END RIGHT LAYOUT --}}

        </div>
    </div>

    {{--
        Midtrans Snap JS (Sandbox) — harus dimuat SEBELUM ticket.js
        agar window.snap tersedia saat btnToPayment diklik.
        Gunakan config() bukan env() agar aman saat config di-cache.
    --}}
    <script src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key="{{ config('services.midtrans.client_key') }}"></script>
    <script src="{{ asset('JS/ticket.js') }}"></script>
</body>

</html>