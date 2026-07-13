import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';

const NAV = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/organizer/dashboard' },
  { key: 'events', icon: 'event', label: 'Event Saya', to: '/organizer/events' },
  { key: 'scanner', icon: 'qr_code_scanner', label: 'Scanner', to: '/organizer/check-in' },
  { key: 'finance', icon: 'payments', label: 'Keuangan', to: '/organizer/finance' },
  { key: 'settings', icon: 'settings', label: 'Pengaturan', to: '/organizer/settings' },
];

export default function OrganizerSidebar({ activeNav }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    window.location.href = '/login';
  };

  const adminInitial = (user?.full_name || 'O')[0].toUpperCase();

  return (
    <>
      {/* Sidebar (Desktop) */}
      <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant hidden md:flex flex-col py-6 z-40" style={{ borderRightWidth: '0.5px' }}>
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ key, icon, label, to }) => {
            const isActive = activeNav === key;
            return (
              <Link key={key} to={to}
                className={`flex items-center px-6 py-3 transition-colors cursor-pointer font-body-md text-body-md ${isActive ? 'border-l-4 border-primary bg-primary-fixed text-primary font-bold' : 'text-secondary hover:bg-surface-container-low'}`}>
                <span className="material-symbols-outlined mr-3">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{adminInitial}</div>
              <div className="ml-2 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate">{user?.full_name || 'Organizer'}</p>
                <p className="font-caption text-caption text-secondary">ID: GM-{user?.id_user || '1'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-primary active:opacity-70 mt-1">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="flex justify-between items-center px-6 h-16 w-full fixed top-0 bg-surface border-b border-outline-variant z-50 md:hidden" style={{ borderBottomWidth: '0.5px' }}>
        <h1 className="text-[24px] font-bold text-primary">GateMate</h1>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t border-outline-variant flex justify-around items-center h-16 pb-safe" style={{ borderTopWidth: '0.5px' }}>
        {NAV.map(({ key, icon, label, to }) => {
          const isActive = activeNav === key;
          const shortLabel = label === 'Event Saya' ? 'Events' : (label === 'Keuangan' ? 'Finance' : (label === 'Pengaturan' ? 'Settings' : label));
          return key === 'scanner' ? (
            <Link key={key} to={to} className="flex flex-col items-center text-secondary px-4 py-1">
              <div className="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
                <span className="material-symbols-outlined">center_focus_weak</span>
              </div>
              <span className="font-label-md text-label-md mt-1">Scan</span>
            </Link>
          ) : (
            <Link key={key} to={to} className={`flex flex-col items-center px-4 py-1 transition-colors font-label-md text-label-md ${isActive ? 'text-primary font-bold' : 'text-secondary'}`}>
              <span className="material-symbols-outlined">{icon === 'dashboard' ? 'grid_view' : (icon === 'event' ? 'confirmation_number' : (icon === 'payments' ? 'account_balance_wallet' : icon))}</span>
              <span>{shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
