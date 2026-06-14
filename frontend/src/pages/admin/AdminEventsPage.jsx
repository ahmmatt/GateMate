import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function AdminEventsPage() {
  const { user, logout } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || '';

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/events', {
        params: { search: currentSearch, status: currentStatus }
      });
      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentSearch, currentStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const s = fd.get('search');
    if (s) {
      searchParams.set('search', s);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus event ini? Tindakan ini tidak bisa dibatalkan.')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Gagal menghapus event.');
    }
  };

  const setStatusFilter = (status) => {
    if (status) {
      searchParams.set('status', status);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Mobile Top Bar */}
      <header className="flex justify-between items-center px-page-padding h-16 w-full bg-surface border-b-[0.5px] border-outline-variant md:hidden fixed top-0 z-[60]">
        <span className="font-h1-mobile text-h1-mobile font-bold text-primary">GateMate</span>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </header>

      {/* Side Navigation (Desktop) */}
      <aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-body-sm text-body-sm">Dashboard</span>
          </Link>
          <Link to="/admin/events" className="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer">
            <span className="material-symbols-outlined mr-3">event</span>
            <span className="font-body-sm text-body-sm">Event Saya</span>
          </Link>
          <Link to="/admin/scanner" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span className="font-body-sm text-body-sm">Scanner</span>
          </Link>
          <Link to="/admin/finance" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">payments</span>
            <span className="font-body-sm text-body-sm">Keuangan</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">settings</span>
            <span className="font-body-sm text-body-sm">Pengaturan</span>
          </Link>
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <a className="flex items-center py-3 text-secondary hover:text-on-surface transition-colors cursor-pointer" href="#">
            <span className="material-symbols-outlined mr-3">help</span>
            <span className="font-body-sm text-body-sm">Bantuan</span>
          </a>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center">
              {user?.profile_picture ? (
                <img alt="Organizer Profile" className="w-8 h-8 rounded-full object-cover bg-surface-container-high" src={`http://localhost:8000/Media/uploads/${user.profile_picture}`}/>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {(user?.full_name || 'O').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-2 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate">{user?.full_name || 'Organizer'}</p>
                <p className="font-caption text-caption text-secondary">ID: SG-{user?.id_user || '1'}</p>
              </div>
            </div>
            <button onClick={logout} className="text-primary active:opacity-70 mt-1">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-sidebar-width min-h-screen pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-max-container mx-auto p-page-padding">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface">Event Saya</h2>
              <p className="font-body-sm text-body-sm text-secondary">Kelola semua tiket dan jadwal acara Anda di sini.</p>
            </div>
            <Link to="/admin/events/create" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-none">
              <span className="material-symbols-outlined font-bold text-[20px]">add</span>
              <span className="font-label-lg text-label-lg font-normal">Event Baru</span>
            </Link>
          </div>

          {/* Bento Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2 relative">
              <form onSubmit={handleSearch} className="w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  name="search" 
                  defaultValue={currentSearch} 
                  className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm focus:border-primary-container focus:ring-0 transition-colors" 
                  placeholder="Cari nama event..." 
                  type="text"
                  onFocus={(e) => e.target.parentElement.classList.add('ring-1', 'ring-primary-container')}
                  onBlur={(e) => e.target.parentElement.classList.remove('ring-1', 'ring-primary-container')}
                />
              </form>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-1">
              <button onClick={() => setStatusFilter('')} className={`px-4 py-2 ${!currentStatus ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container'} rounded-lg text-label-md shrink-0 transition-colors`}>Semua</button>
              <button onClick={() => setStatusFilter('active')} className={`px-4 py-2 ${currentStatus === 'active' ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container'} rounded-lg text-label-md shrink-0 transition-colors`}>Active</button>
              <button onClick={() => setStatusFilter('ended')} className={`px-4 py-2 ${currentStatus === 'ended' ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container'} rounded-lg text-label-md shrink-0 transition-colors`}>Ended</button>
            </div>
          </div>

          {/* Events Table Container */}
          <div className="bg-surface border-[0.5px] border-outline-variant rounded-xl overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="text-center py-16 px-4 text-primary"><span className="material-symbols-outlined animate-spin text-[40px]">progress_activity</span></div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 px-4">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">calendar_month</span>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">Belum Ada Event</h3>
                <p className="font-body-sm text-body-sm text-secondary mb-6">Mulai buat event pertama Anda dan jual tiket dengan aman.</p>
                <Link to="/admin/events/create" className="inline-flex items-center justify-center space-x-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-none">
                  <span className="material-symbols-outlined font-bold">add</span>
                  <span className="font-label-md text-label-md font-bold uppercase tracking-wider">Buat Event Pertama</span>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Poster</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Nama Event</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Kategori</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Tanggal</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[0.5px] divide-outline-variant">
                  {events.map(event => {
                    const banner = event.poster_image_url || event.banner_image_url 
                      ? (event.poster_image_url || event.banner_image_url)
                      : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';
                    const isEnded = event.status !== 'active';
                    const rowClass = isEnded ? 'hover:bg-surface-container-lowest transition-colors opacity-70' : 'hover:bg-surface-container-lowest transition-colors';
                    
                    return (
                      <tr key={event.id} className={rowClass}>
                        <td className="px-6 py-4">
                          <div className={`w-12 h-16 rounded overflow-hidden bg-surface-container-high ${isEnded ? 'grayscale' : ''}`}>
                            <img 
                              src={banner} 
                              className="w-full h-full object-cover" 
                              alt="Banner Event" 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-body-sm text-body-sm font-bold text-on-surface">{event.title}</p>
                          <p className="text-caption text-secondary">{event.city || event.location_type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-surface-container-high px-2 py-1 rounded text-caption text-on-surface-variant">{event.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-body-sm text-body-sm text-on-surface">{dayjs(event.start_date).format('DD MMM YYYY')}</p>
                          <p className="text-caption text-secondary">{event.start_time.substring(0, 5)} WIB</p>
                        </td>
                        <td className="px-6 py-4">
                          {event.status === 'active' ? (
                            <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#DCFCE7] text-[#15803D]">Active</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-caption font-bold bg-error-container text-error">Ended</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <Link to={`/admin/events/${event.id}`} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Detail">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </Link>
                            <button onClick={() => handleDelete(event.id)} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Hapus">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
        <Link to="/admin/dashboard" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link to="/admin/events" className="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label-md text-label-md">Events</span>
        </Link>
        <Link to="/admin/scanner" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <div className="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined">center_focus_weak</span>
          </div>
          <span className="font-label-md text-label-md mt-1">Scan</span>
        </Link>
        <Link to="/admin/finance" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-md text-label-md">Finance</span>
        </Link>
      </nav>
    </div>
  );
}
