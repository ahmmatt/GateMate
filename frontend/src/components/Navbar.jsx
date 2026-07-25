import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../lib/api'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const searchInputRef = useRef(null)
  const debounceTimer = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when search popup is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
      setSearchResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get(`/events?search=${encodeURIComponent(query)}`);
      setSearchResults((res.data.data || []).slice(0, 6));
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchInput = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSearchResults(q), 350);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = (ev) => {
    setSearchOpen(false);
    navigate(user ? `/events/${ev.id || ev.id_event}` : '/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const formatDate = (start, end) => {
    if (!start) return '';
    const s = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!end) return s;
    const e = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${s} – ${e}`;
  };

  return (
    <>
      {/* ── SEARCH POPUP OVERLAY ─────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Search Input Row */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <span className="material-symbols-outlined text-gray-400 text-2xl shrink-0">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search event..."
                className="flex-1 text-base text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </form>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchLoading ? (
                <div className="flex flex-col gap-3 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-24 h-16 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-50">
                  {searchResults.map((ev) => (
                    <li key={ev.id || ev.id_event}>
                      <button
                        onClick={() => handleResultClick(ev)}
                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left group"
                      >
                        {/* Thumbnail */}
                        <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{ev.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(ev.start_date, ev.end_date)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {ev.location_type === 'online'
                              ? 'Online Event'
                              : [ev.venue_name || ev.location_details, ev.city].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-[#B22110] transition-colors shrink-0">arrow_forward_ios</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.trim() ? (
                <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                  <span className="material-symbols-outlined text-5xl">search_off</span>
                  <p className="text-sm font-medium">Tidak ada event untuk "{searchQuery}"</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                  <span className="material-symbols-outlined text-5xl">travel_explore</span>
                  <p className="text-sm font-medium">Ketik nama event untuk mencari</p>
                </div>
              )}
            </div>

            {/* Footer hint */}
            {searchResults.length > 0 && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400">Tekan <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500 font-mono">Enter</kbd> untuk lihat semua hasil</p>
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-[#B22110] hover:underline"
                >
                  Lihat semua →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-md border-border-light/50 shadow-sm' 
          : 'bg-white border-border-light'
      }`}>
        <div className="flex justify-between items-center px-container-padding h-16 max-w-[1280px] mx-auto gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0">
            <span className="font-headline-md text-headline-md font-bold text-[#B22110]">SecureGate</span>
          </Link>

          {/* Search — now triggers popup */}
          <div className="flex-1 max-w-md hidden md:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="relative w-full flex items-center gap-3 bg-[#F5F5F7] border border-border-light rounded-[10px] pl-10 pr-4 py-2 text-body-md text-gray-400 hover:border-[#B22110]/40 hover:bg-[#F0F0F0] transition-all cursor-text text-left"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <span>Cari event...</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <Link 
                to="/discover" 
                className={`font-bold transition-colors py-5 ${
                  location.pathname === '/discover' || location.pathname.startsWith('/events') || location.pathname === '/'
                    ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                    : 'text-on-surface-variant hover:text-[#B22110]'
                }`}
              >
                Explore
              </Link>
              <Link 
                to={user ? "/user/tickets" : "/login"} 
                className={`font-bold transition-colors py-5 ${
                  location.pathname.startsWith('/user/ticket') || location.pathname === '/my-tickets'
                    ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                    : 'text-on-surface-variant hover:text-[#B22110]'
                }`}
              >
                My Tickets
              </Link>
              <Link 
                to={user ? "/user/wallet" : "/login"} 
                className={`font-bold transition-colors py-5 ${
                  location.pathname.startsWith('/user/wallet') || location.pathname === '/wallet'
                    ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                    : 'text-on-surface-variant hover:text-[#B22110]'
                }`}
              >
                Wallet
              </Link>
            </nav>

            {/* User / Auth CTA */}
            <div className="flex items-center ml-2 border-l border-border-light pl-6">
              {user ? (
                <div className="relative group cursor-pointer flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/user/profile')}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-sm cursor-pointer hover:opacity-90 hover:scale-105 transition-all overflow-hidden border-2 border-transparent hover:border-gray-400"
                    title="Edit Profil"
                  >
                    {(() => {
                      let raw = user.profile_picture_url || user.profile_picture;
                      let avatar = null;
                      if (raw) {
                        if (raw.includes('Media/uploads/http')) {
                          avatar = raw.substring(raw.lastIndexOf('http'));
                        } else if (raw.startsWith('http')) {
                          avatar = raw;
                        } else {
                          const baseUrl = (import.meta.env && import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:8000/api';
                          avatar = `${baseUrl.replace('/api', '')}/Media/uploads/${raw}`;
                        }
                      }
                      if (avatar) return <img src={avatar} alt="Profile" className="w-full h-full object-cover" />;
                      return user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                    })()}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#B22110] text-white px-[22px] py-[10px] rounded-[22px] font-medium hover:bg-[#921a0d] transition-all active:scale-95"
                >
                  Masuk
                </button>
              )}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-[#B22110] p-2" onClick={() => setSearchOpen(true)}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              className="p-2 text-on-surface-variant"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden py-3 px-6 space-y-1 bg-white border-t border-border-light shadow-md">
            <Link to="/discover" className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname === '/discover' || location.pathname === '/' || location.pathname.startsWith('/events') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Explore</Link>
            <Link to={user ? "/user/tickets" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/ticket') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>My Tickets</Link>
            <Link to={user ? "/user/wallet" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/wallet') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Wallet</Link>
            
            {!user ? (
              <div className="pt-3 flex flex-col gap-2 border-t border-border-light mt-2">
                <Link 
                  to="/login" 
                  className="block px-3 py-2.5 text-sm text-center font-bold rounded-full bg-[#B22110] text-white shadow-sm" 
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2.5 text-sm text-center font-bold rounded-full border border-[#B22110] text-[#B22110]" 
                  onClick={() => setIsOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-border-light mt-2">
                <button onClick={() => { setIsOpen(false); navigate('/user/profile'); }} className="block w-full text-left px-3 py-2.5 text-sm text-on-surface hover:bg-gray-50 rounded-xl font-medium">Edit Profil</button>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-[#B22110] hover:bg-gray-50 rounded-xl font-medium">Keluar</button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
