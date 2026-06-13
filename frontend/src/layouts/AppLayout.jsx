import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  const navLink = (path, label) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`font-body-md text-body-md transition-colors ${active ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
      >
        {label}
      </Link>
    );
  };

  const getNavLinks = () => {
    if (!isAuthenticated) return navLink('/', 'Explore');
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
      case 'user': return (<>
        <Link to="/discover" className={`flex flex-col items-center justify-center font-label-md text-label-md ${location.pathname === '/discover' ? 'text-primary bg-primary-fixed/20 rounded-full px-3 py-1' : 'text-secondary'}`}>
          <span className="material-symbols-outlined" style={location.pathname === '/discover' ? { fontVariationSettings: "'FILL' 1" } : {}}>explore</span><span>Discover</span>
        </Link>
        <Link to="/my-tickets" className={`flex flex-col items-center justify-center font-label-md text-label-md ${location.pathname === '/my-tickets' ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined">confirmation_number</span><span>My Tickets</span>
        </Link>
        <Link to="/wallet" className={`flex flex-col items-center justify-center font-label-md text-label-md ${location.pathname === '/wallet' ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined">account_balance_wallet</span><span>Wallet</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center font-label-md text-label-md ${location.pathname === '/profile' ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined">person</span><span>Profile</span>
        </Link>
      </>);
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
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50">
        <div className="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-primary">GateMate</Link>
            <nav className="hidden md:flex gap-6 items-center">
              {getNavLinks()}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </button>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-colors">
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
                <Link to="/login" className="font-body-md text-body-md font-bold text-primary">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-full font-label-md text-label-md font-bold hover:bg-surface-tint transition-all">Sign Up</Link>
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
            <span className="font-headline-sm text-headline-sm font-bold text-primary">GateMate</span>
            <p className="font-caption text-caption text-secondary-fixed-dim">© 2026 GateMate. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy','Terms of Service','Help Center','Contact Us'].map(l => (
              <a key={l} className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-t border-outline-variant/30 flex justify-around items-center px-2 py-3">
        {getBottomNav()}
      </nav>
    </div>
  );
}
