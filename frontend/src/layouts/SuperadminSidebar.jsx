import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';

export default function SuperadminSidebar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); 
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: 'dashboard' },
    { name: 'Verifikasi Organizer', path: '/superadmin/verifikasi-organizer', icon: 'verified_user' },
    { name: 'Penarikan Dana', path: '/superadmin/penarikan-dana', icon: 'account_balance_wallet' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-surface-container-high bg-surface-container-lowest flex flex-col justify-between py-8 z-50">
      <div className="flex flex-col">
        <div className="px-6 mb-10">
          <span className="font-headline-md text-headline-md font-bold text-primary">GateMate</span>
          <p className="font-label-md text-label-md text-secondary mt-1">Superadmin</p>
        </div>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== '/superadmin/dashboard';
            // For dashboard, require exact match to avoid false active state on other subpaths
            const isDashboardActive = item.path === '/superadmin/dashboard' && location.pathname === '/superadmin/dashboard';
            const finalIsActive = item.path === '/superadmin/dashboard' ? isDashboardActive : isActive;

            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                  finalIsActive 
                  ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' 
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container-low border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="px-6">
        <button onClick={handleLogout} className="flex items-center gap-3 text-error w-full py-3 hover:bg-error-container/10 transition-colors duration-200 rounded-lg border border-transparent">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
