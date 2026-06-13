import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  const userInitial = user?.full_name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Profil Saya</h1>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 flex flex-col items-center gap-6 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-[36px] font-bold">
          {userInitial}
        </div>
        
        <div className="text-center">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{user?.full_name || 'User Name'}</h2>
          <p className="font-body-md text-body-md text-secondary mt-1">{user?.email}</p>
          <p className="font-caption text-caption text-outline uppercase tracking-widest mt-2">{user?.role || 'Peserta'}</p>
        </div>

        <div className="w-full border-t border-outline-variant pt-6 flex flex-col gap-3">
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors">
            <div className="flex items-center gap-3 text-on-surface">
              <span className="material-symbols-outlined text-secondary">person</span>
              <span className="font-body-md font-bold">Informasi Pribadi</span>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors">
            <div className="flex items-center gap-3 text-on-surface">
              <span className="material-symbols-outlined text-secondary">lock</span>
              <span className="font-body-md font-bold">Keamanan & Password</span>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors">
            <div className="flex items-center gap-3 text-on-surface">
              <span className="material-symbols-outlined text-secondary">notifications</span>
              <span className="font-body-md font-bold">Pengaturan Notifikasi</span>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-red-50 text-error hover:bg-red-100 rounded-xl transition-colors font-bold active:scale-[0.98]">
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
