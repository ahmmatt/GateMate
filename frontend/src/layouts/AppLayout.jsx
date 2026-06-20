import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const notifRef = useRef(null);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Scroll State
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifPopup(false);
      }
      // Note: Search popup close logic is now handled by the backdrop onClick and close button
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll for navbar blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Search Logic
  useEffect(() => {
    if (!isSearchOpen) return;
    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        let url = '/events';
        if (searchQuery.trim()) {
          url += `?search=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await api.get(url);
        let evs = res.data?.data || [];
        
        if (!searchQuery.trim()) {
           // Filter upcoming only (start_date > now)
           const now = new Date();
           evs = evs.filter(e => new Date(e.start_date) > now);
           // Sort by newly released (created_at desc)
           evs.sort((a,b) => new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date));
        }
        setSearchResults(evs.slice(0, 5));
      } catch(e) {}
      setIsSearching(false);
    };

    const delay = setTimeout(fetchSearch, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, isSearchOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unread_count || 0);
      }
    } catch (_) {}
  };

  const handleOpenNotif = async () => {
    setShowNotifPopup(!showNotifPopup);
    if (!showNotifPopup && unreadCount > 0) {
      try {
        await api.post('/notifications/read');
        setUnreadCount(0);
        // Optimistically mark all local notifications as read
        setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      } catch (_) {}
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  const navLink = (path, label) => {
    const isExplore = label === 'Explore' && (location.pathname === '/' || location.pathname === '/discover');
    const active = location.pathname === path || isExplore;
    return (
      <Link
        to={path}
        className={`py-5 transition-colors ${active ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
      >
        {label}
      </Link>
    );
  };

  const getNavLinks = () => {
    if (!isAuthenticated) return (
      <>
        {navLink('/discover', 'Explore')}
        {navLink('/login', 'My Tickets')}
        {navLink('/login', 'Wallet')}
      </>
    );
    switch (user?.role) {
      case 'user': return (<>{navLink('/discover', 'Explore')}{navLink('/my-tickets', 'My Tickets')}{navLink('/wallet', 'Wallet')}</>);
      case 'admin': return (<>{navLink('/admin/dashboard', 'Dashboard Event')}{navLink('/admin/scanner', 'Scanner')}</>);
      case 'superadmin': return navLink('/superadmin/dashboard', 'Superadmin Panel');
      case 'tenant': return navLink('/tenant/dashboard', 'Tenant Dashboard');
      default: return null;
    }
  };

  const getBottomNav = () => {
    if (!isAuthenticated) return (
      <Link to="/" className="flex flex-col items-center justify-center text-secondary font-label-md text-label-md">
        <span className="material-symbols-outlined">explore</span><span>Explore</span>
      </Link>
    );
    switch (user?.role) {
      case 'user': return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-outline-variant px-6 py-3 flex justify-between items-center z-50">
          <Link to="/discover" className={`flex flex-col items-center gap-1 ${location.pathname === '/discover' ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined">explore</span>
            <span className="text-[10px] font-medium">Explore</span>
          </Link>
          <Link to="/my-tickets" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/my-tickets') || location.pathname.startsWith('/tickets') ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="text-[10px] font-medium">Tickets</span>
          </Link>
          <Link to="/chat" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/chat') ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined">chat</span>
            <span className="text-[10px] font-medium">Chat</span>
          </Link>
          <Link to="/wallet" className={`flex flex-col items-center gap-1 ${location.pathname === '/wallet' ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>);
      case 'admin': return (<>
        <Link to="/admin/dashboard" className="flex flex-col items-center justify-center text-secondary font-label-md text-label-md"><span className="material-symbols-outlined">table_chart</span><span>Dashboard</span></Link>
        <Link to="/admin/scanner" className="flex flex-col items-center justify-center text-secondary font-label-md text-label-md"><span className="material-symbols-outlined">qr_code_scanner</span><span>Scanner</span></Link>
      </>);
      case 'superadmin': return (
        <Link to="/superadmin/dashboard" className="flex flex-col items-center justify-center text-secondary font-label-md text-label-md"><span className="material-symbols-outlined">admin_panel_settings</span><span>Superadmin</span></Link>
      );
      case 'tenant': return (
        <Link to="/tenant/dashboard" className="flex flex-col items-center justify-center text-secondary font-label-md text-label-md"><span className="material-symbols-outlined">storefront</span><span>Tenant</span></Link>
      );
      default: return null;
    }
  };

  const userInitial = user?.full_name ? user.full_name[0].toUpperCase() : 'U';

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* TopNavBar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-md border-border-light/50 shadow-sm' 
          : 'bg-white border-border-light'
      }`}>
        <div className="flex justify-between items-center px-container-padding h-16 max-w-[1280px] mx-auto gap-gap-default">
          <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all">
            <span className="font-headline-md text-headline-md font-bold text-primary">SecureGate</span>
          </Link>
          
          {/* Navbar Search Trigger */}
          <div className="flex-1 max-w-md hidden md:flex">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="relative w-full text-left focus:outline-none group"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-hover:text-primary transition-colors">search</span>
              <div className="w-full bg-[#F5F5F7] border border-border-light rounded-[10px] pl-10 pr-4 py-2 text-body-md text-on-surface-variant group-hover:border-[#F04E37] transition-all cursor-text">
                Cari event...
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {getNavLinks()}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="relative" ref={notifRef}>
                  <button onClick={handleOpenNotif} className="relative w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-container-high rounded-full transition-colors focus:outline-none">
                    <span className="material-symbols-outlined">notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full" />
                    )}
                  </button>
                  
                  {/* Notifications Popup */}
                  <div className={`absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-white border border-outline-variant rounded-2xl shadow-xl transition-all origin-top-right ${showNotifPopup ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="p-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10 flex justify-between items-center">
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Notifikasi</h3>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-secondary font-body-md text-body-md">
                          <span className="material-symbols-outlined block text-[40px] mb-2 opacity-50">notifications_paused</span>
                          Belum ada notifikasi
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className={`p-3 rounded-xl flex gap-3 items-start transition-colors ${!notif.read_at ? 'bg-primary-fixed/30 hover:bg-primary-fixed/50' : 'hover:bg-surface-container-lowest'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.read_at ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>
                              <span className="material-symbols-outlined text-[20px]">
                                {notif.type.includes('Ticket') ? 'confirmation_number' : notif.type.includes('Wallet') ? 'account_balance_wallet' : 'notifications'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-body-md text-body-md text-on-surface line-clamp-2">
                                {notif.data?.message || 'Notifikasi baru'}
                              </p>
                              <span className="text-[11px] text-secondary mt-1 block">
                                {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-colors focus:outline-none">
                    {user?.profile_picture_url
                      ? <img src={user.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                      : <div className="w-full h-full bg-primary text-white flex items-center justify-center font-bold">{userInitial}</div>
                    }
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-on-surface hover:bg-surface-container-low rounded-t-lg font-body-md text-body-md">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-error hover:bg-surface-container-low rounded-b-lg font-body-md text-body-md">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="bg-[#B22110] text-white px-[22px] py-[10px] rounded-[22px] font-medium hover:bg-primary-container transition-all active:scale-95">Masuk</Link>
              </div>
            )}
            <div className="md:hidden text-primary">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="pt-20 pb-24 md:pb-12 max-w-[1280px] mx-auto px-container-padding w-full min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 mb-16 md:mb-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">SecureGate</span>
            <p className="font-caption text-caption text-secondary-fixed-dim">© 2026 SecureGate. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy','Terms of Service','Help Center','Contact Us'].map(l => (
              <a key={l} className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Bottom Nav untuk User & Unauthenticated Mobile */}
      {getBottomNav()}

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          {/* Modal Backdrop (Blurred) */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[20px] overflow-hidden flex flex-col mx-4 transform transition-all">
            {/* Big Search Input */}
            <div className="relative border-b border-border-light/50 shrink-0">
               <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-2xl">search</span>
               <input 
                 autoFocus
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent pl-14 pr-12 py-5 text-lg focus:outline-none placeholder-secondary font-medium text-on-surface" 
                 placeholder="Ketik untuk mencari event..." 
                 type="text" 
               />
               <button onClick={() => setIsSearchOpen(false)} className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-secondary hover:text-on-surface transition-colors">
                 <span className="material-symbols-outlined text-sm">close</span>
               </button>
            </div>

            {/* Results Area */}
            <div className="flex flex-col overflow-y-auto max-h-[55vh] no-scrollbar p-3">
              <div className="px-3 py-2 shrink-0">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                  {searchQuery ? 'Hasil Pencarian' : 'Baru Rilis & Belum Dimulai'}
                </p>
              </div>
              
              {isSearching ? (
                  <div className="py-12 text-center text-secondary text-sm flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                    Mencari event...
                  </div>
              ) : searchResults.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-5xl mb-3 opacity-30">search_off</span>
                    <span className="text-sm">Tidak ada event yang ditemukan.</span>
                  </div>
              ) : (
                  searchResults.map(ev => (
                      <Link 
                        key={ev.id || ev.id_event} 
                        to={isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login'} 
                        onClick={() => {setIsSearchOpen(false); setSearchQuery('');}}
                        className="flex items-center gap-4 p-3 hover:bg-white/60 rounded-[14px] transition-colors border border-transparent hover:border-white/50 group cursor-pointer"
                      >
                        <img src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=100'} className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0" alt={ev.title} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">{ev.title}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-secondary mt-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            <span className="truncate">{new Date(ev.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})} • {ev.city || 'Online'}</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
                      </Link>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* OTP Verification Modal — muncul global jika phone belum diverifikasi */}
      <OtpVerificationModal />
    </div>
  );
}
