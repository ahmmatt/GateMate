<nav class="navbar">
    <div class="left-nav">
        <i class="fa-solid fa-bars hamburger-btn" id="hamburger-btn"></i>
        <h1>GateMate</h1>
    </div>
    
    <div class="main-nav">
        @guest
            <div class="main-nav-discover">
                <i class="fa-regular fa-compass"></i>
                <a href="{{ route('landing') }}">Discover</a>
            </div>
        @else
            @if(Auth::user()->role === 'user')
                <div class="main-nav-discover">
                    <i class="fa-regular fa-compass"></i>
                    <a href="{{ route('discover') }}">Discover</a>
                </div>
                <div class="main-nav-event">
                    <i class="fa-solid fa-ticket"></i>
                    <a href="{{ route('my-tickets') }}">My Tickets</a>
                </div>
                <div class="main-nav-event">
                    <i class="fa-solid fa-wallet"></i>
                    <a href="{{ route('wallet.index') }}">Wallet</a>
                </div>

            @elseif(Auth::user()->role === 'admin')
                <div class="main-nav-discover">
                    <i class="fa-solid fa-table-columns"></i>
                    <a href="{{ route('admin.dashboard') }}">Dashboard Event</a>
                </div>
                <div class="main-nav-event">
                    <i class="fa-solid fa-qrcode"></i>
                    <a href="{{ route('admin.scanner') }}">Scanner</a>
                </div>
            @elseif(Auth::user()->role === 'superadmin')
                <div class="main-nav-discover">
                    <i class="fa-solid fa-shield-halved"></i>
                    <a href="{{ route('superadmin.dashboard') }}">Superadmin Panel</a>
                </div>
            @elseif(Auth::user()->role === 'tenant')
                <div class="main-nav-discover">
                    <i class="fa-solid fa-store"></i>
                    <a href="{{ route('tenant.dashboard') }}">Tenant Dashboard</a>
                </div>
            @endif
        @endguest
    </div>
    
    <div class="right-nav">
        @auth
            @php
                $navName    = Auth::user()->full_name ?? 'User';
                $navInitial = strtoupper(substr($navName, 0, 1));
                $navPic     = Auth::user()->profile_picture ?? null;
            @endphp
            
            {{-- Profile Trigger --}}
            <div id="profile-dropdown-trigger" class="profile-dropdown-trigger" title="{{ $navName }}">
                @if (!empty($navPic))
                    <img src="{{ asset('Media/uploads/' . $navPic) }}" alt="Profile" class="profile-pic-small">
                @else
                    <div class="profile-initial-small">{{ $navInitial }}</div>
                @endif
            </div>

            {{-- Profile Dropdown --}}
            <div id="profile-dropdown-menu" class="profile-dropdown-menu">
                <div class="dropdown-header">
                    @if (!empty($navPic))
                        <img src="{{ asset('Media/uploads/' . $navPic) }}" class="profile-pic-large">
                    @else
                        <div class="profile-initial-large">{{ $navInitial }}</div>
                    @endif
                    <div class="dropdown-user-info">
                        <h4 class="dropdown-user-name">{{ $navName }}</h4>
                        <p class="dropdown-user-role" style="text-transform: capitalize;">{{ Auth::user()->role }}</p>
                    </div>
                </div>

                <div class="dropdown-menu-links">
                    <a href="{{ url('/settings') }}" class="dropdown-link">
                        <i class="fa-solid fa-gear dropdown-link-icon"></i> Settings
                    </a>
                    
                    {{-- Logout via POST Form --}}
                    <form method="POST" action="{{ route('logout') }}" id="logout-form">
                        @csrf
                        <button type="submit" class="dropdown-link logout-link" style="width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:0;">
                            <i class="fa-solid fa-arrow-right-from-bracket dropdown-link-icon"></i> Logout
                        </button>
                    </form>
                </div>
            </div>
        @else
            <div style="display:flex; gap:12px; align-items:center;">
                <a href="{{ route('signin') }}" style="color:#f1f5f9; text-decoration:none; font-size:0.9rem; font-weight:600;">Sign In</a>
                <a href="{{ route('signup') }}" style="background:#4ade80; color:#0f172a; padding:8px 18px; border-radius:100px; text-decoration:none; font-size:0.9rem; font-weight:700;">Sign Up</a>
            </div>
        @endauth
    </div>
</nav>
