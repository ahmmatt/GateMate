<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureGate - Discover</title>
    <link rel="stylesheet" href="{{ asset('CSS/discover.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
                <a href="{{ url('/events') }}">Event</a>
            </div>
        </div>
        <div class="right-nav">

            @php
                $navName    = Auth::user()->full_name;
                $navInitial = strtoupper(substr($navName, 0, 1));
                $navPic     = Auth::user()->profile_picture;
            @endphp

            {{-- Profile Trigger --}}
            <div id="profile-dropdown-trigger"
                 class="profile-dropdown-trigger"
                 title="{{ $navName }}">
                @if (!empty($navPic))
                    <img src="{{ asset('Media/uploads/' . $navPic) }}"
                         alt="Profile"
                         class="profile-pic-small">
                @else
                    <div class="profile-initial-small">{{ $navInitial }}</div>
                @endif
            </div>

            {{-- Profile Dropdown --}}
            <div id="profile-dropdown-menu" class="profile-dropdown-menu">
                <div class="dropdown-header">
                    @if (!empty($navPic))
                        <img src="{{ asset('Media/uploads/' . $navPic) }}"
                             class="profile-pic-large">
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

                    {{-- Logout via POST Form --}}
                    <form method="POST" action="{{ route('logout') }}" id="logout-form">
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
            <h1>Discover Event</h1>
            <p>Find whats happening nearby, pick your favorite category, or search instantly.</p>
        </div>

        {{-- ─── Search Bar ─────────────────────────────────────────────────── --}}
        <div class="search-bar-wrapper">
            <div class="search-bar">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <form action="{{ route('discover') }}" method="GET" style="width:100%; margin:0;">
                    <input type="hidden" name="city"     value="{{ $selectedCity }}">
                    <input type="hidden" name="category" value="{{ $selectedCategory }}">
                    <input type="text"   name="search"
                           placeholder="Search event by title..."
                           value="{{ $searchKeyword }}"
                           style="width:100%; background:transparent; border:none; outline:none; color:#fff;">
                </form>
            </div>
        </div>

        {{-- ─── Active Location ────────────────────────────────────────────── --}}
        <div class="event-location-wrapper">
            <a href="{{ route('discover', ['city' => 'All', 'category' => $selectedCategory ?? 'All']) }}" 
            style="text-decoration: none; color: inherit; display: block;">
                <div class="event-location-now">
                    <i class="fa-solid fa-location-dot location-icon icon-green-accent"></i>
                    <h3>{{ (!isset($selectedCity) || $selectedCity === 'All') ? 'All Locations' : $selectedCity . ', ID' }}</h3>
                </div>
            </a>
        </div>

        {{-- ─── Category Filter ────────────────────────────────────────────── --}}
        <h3 class="browse">Browse by Category</h3>
        <div class="category-wrapper">

            @php
                $categories = [
                    'Music Concert'      => ['label' => 'Konser',   'icon' => 'fa-music',             'color' => 'icon-yellow'],
                    'Workshop & Training'=> ['label' => 'Workshop', 'icon' => 'fa-chalkboard-user',    'color' => 'icon-green'],
                    'Tech Seminar'       => ['label' => 'Seminar',  'icon' => 'fa-microphone-lines',   'color' => 'icon-orange'],
                ];
            @endphp

            @foreach ($categories as $catKey => $catMeta)
                <a href="{{ route('discover', ['category' => $catKey, 'city' => $selectedCity, 'search' => $searchKeyword]) }}"
                   class="filter-card-link category-card {{ $selectedCategory === $catKey ? 'active-filter' : '' }}">
                    <div class="category-card-content">
                        <div class="icon-box {{ $catMeta['color'] }}">
                            <i class="fa-solid {{ $catMeta['icon'] }}"></i>
                        </div>
                        <div class="category-card-info">
                            <h3>{{ $catMeta['label'] }}</h3>
                            <div class="number-of-event">
                                <p>{{ $catCounts->get($catKey, 0) }}</p>
                                <p>Events</p>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach

            <a href="{{ route('discover', ['category' => 'All', 'city' => $selectedCity, 'search' => $searchKeyword]) }}"
               class="filter-card-link category-card {{ $selectedCategory === 'All' ? 'active-filter' : '' }}">
                <div class="category-card-content">
                    <div class="icon-box icon-purple">
                        <i class="fa-solid fa-layer-group"></i>
                    </div>
                    <div class="category-card-info">
                        <h3>All Events</h3>
                        <div class="number-of-event">
                            <p>{{ $catCounts->sum() }}</p>
                            <p>Events</p>
                        </div>
                    </div>
                </div>
            </a>

        </div>

        <hr>

        {{-- ─── Event Carousel ─────────────────────────────────────────────── --}}
        <h3>Recently Added</h3>
        <div class="carousel-container">
            <button class="carousel-btn left-btn" id="slide-left">
                <i class="fa-solid fa-chevron-left"></i>
            </button>

            <div class="upcoming-event">
                @forelse ($events as $event)
                    <div class="event-card-detail">
                        <a href="{{ route('event.show', $event->id_event) }}" class="card-link-wrapper">

                            <div class="card-top-header">
                                <div class="header-left">
                                    <h4>{{ \Carbon\Carbon::parse($event->start_date)->format('M j, l') }}</h4>
                                </div>
                                <div class="header-right">
                                    <h4>{{ \Carbon\Carbon::createFromTimeString($event->start_time)->format('g:i A') }}</h4>
                                </div>
                            </div>
                            <hr class="card-divider">

                            <h2 class="card-title">{{ $event->title }}</h2>

                            <div class="event-card-img">
                                @php
                                    $bannerSrc = !empty($event->banner_image)
                                        ? asset('Media/uploads/' . $event->banner_image)
                                        : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
                                @endphp
                                <img src="{{ $bannerSrc }}" alt="{{ $event->title }}">
                            </div>

                            {{-- Author --}}
                            @php
                                $authorName    = !empty($event->author_name) ? $event->author_name : 'Unknown Admin';
                                $authorInitial = strtoupper(substr($authorName, 0, 1));
                            @endphp
                            <div class="card-author-wrapper author-mb-12">
                                <div class="card-author-left">
                                    @if (!empty($event->author_image))
                                        <img src="{{ asset('Media/uploads/' . $event->author_image) }}"
                                             alt="Author Logo"
                                             class="author-img-small">
                                    @else
                                        <div class="author-initial-small">{{ $authorInitial }}</div>
                                    @endif
                                    <span class="author-name-text">{{ $authorName }}</span>
                                </div>
                            </div>

                            {{-- Location & Price --}}
                            <div class="card-info-blocks info-blocks-compact">
                                <div class="info-block info-block-expanded">
                                    <div class="block-icon icon-mt-2">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div class="block-text text-flex-1">
                                        <h3 class="location-title-small">
                                            @if ($event->location_type === 'online')
                                                Online
                                            @else
                                                {{ !empty($event->venue_name) ? $event->venue_name : 'Offline' }}
                                            @endif
                                        </h3>
                                        <p class="location-desc-small">
                                            @if ($event->location_type === 'online')
                                                Online Event / Virtual Meeting
                                            @else
                                                {{ (!empty($event->city) ? $event->city . ', ' : '') . $event->location_details }}
                                            @endif
                                        </p>
                                    </div>
                                </div>

                                <div class="price-mini-block price-mt-2">
                                    <i class="fas fa-tag"></i>
                                    <span class="price-text-green">
                                        @if ($event->has_free > 0 || $event->min_price == 0)
                                            Free
                                        @else
                                            Rp {{ number_format($event->min_price, 0, ',', '.') }}
                                        @endif
                                    </span>
                                </div>
                            </div>

                        </a>
                    </div>
                @empty
                    <div class="empty-state">
                        <i class="fa-solid fa-calendar-xmark"></i>
                        <h3>No Events Available</h3>
                        <p>There are no upcoming events at the moment. Please check back later.</p>
                    </div>
                @endforelse
            </div>

            <button class="carousel-btn right-btn" id="slide-right">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>

        <hr>

        {{-- ─── City Explorer ──────────────────────────────────────────────── --}}
        <h3>Explore Your City</h3>
        <div class="city-wrapper">

            @php
                $cityMeta = [
                    'Jakarta'    => ['color' => 'logo-orange',  'icon' => 'fa-monument'],
                    'Bali'       => ['color' => 'logo-cyan',    'icon' => 'fa-gopuram'],
                    'Bandung'    => ['color' => 'logo-green',   'icon' => 'fa-mountain'],
                    'Surabaya'   => ['color' => 'logo-red',     'icon' => 'fa-city'],
                    'Yogyakarta' => ['color' => 'logo-yellow',  'icon' => 'fa-landmark'],
                    'Makassar'   => ['color' => 'logo-blue',    'icon' => 'fa-anchor'],
                    'Medan'      => ['color' => 'logo-purple',  'icon' => 'fa-map-location-dot'],
                    'Semarang'   => ['color' => 'logo-pink',    'icon' => 'fa-train-subway'],
                ];
            @endphp

            @foreach ($cityMeta as $cityName => $meta)
                <a href="{{ route('discover', ['city' => $cityName, 'category' => $selectedCategory]) }}"
                   class="filter-card-link">
                    <div class="city-card">
                        <div class="city-card-logo {{ $meta['color'] }}">
                            <i class="fa-solid {{ $meta['icon'] }}"></i>
                        </div>
                        <div class="city-card-info">
                            <h3>{{ $cityName }}</h3>
                            <div class="value-city-event">
                                <p>{{ $cityCounts->get($cityName, 0) }}</p>
                                <p>Events</p>
                            </div>
                        </div>
                    </div>
                </a>
            @endforeach

        </div>

        <hr>

        {{-- ─── Footer ─────────────────────────────────────────────────────── --}}
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

    <script src="{{ asset('JS/discover.js') }}"></script>
</body>
</html>
