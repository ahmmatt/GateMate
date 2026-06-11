import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Ticket, Settings, Bell, Search, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-dark rounded-r-3xl my-4 ml-4 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white font-bold shadow-lg shadow-coral-500/20">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Gate<span className="text-coral-500">Mate</span></span>
        </div>

        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">Signed in as</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              {user?.profile_picture_url ? (
                <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white/70" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.full_name}</p>
              <p className="text-xs text-coral-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-coral-500/10 text-coral-400 border border-coral-500/20 transition-all">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="tickets" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all">
            <Ticket className="w-5 h-5" /> My Tickets
          </Link>
          <Link to="settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl w-full text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-secondary/5 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input 
                type="text" 
                placeholder="Search events, tickets, or users..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-secondary/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-secondary/60 hover:text-coral-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral-500 border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Decorative Backdrops */}
          <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-coral-400/10 blur-[80px] pointer-events-none" />
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}
