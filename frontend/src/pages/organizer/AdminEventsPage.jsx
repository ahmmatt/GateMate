import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import OrganizerSidebar from '../../components/OrganizerSidebar';

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
      const res = await api.get('/admin/events', { params: { search: currentSearch, status: currentStatus } });
      if (res.data?.data) {
        setEvents(res.data.data);
      } else if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.warn('Gagal memuat event dari API, menggunakan fallback list kosong.', err.message);
      setEvents([]);
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
    <div className="bg-surface text-on-surface min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}> <OrganizerSidebar activeNav="events" />

      {/* Main Content Canvas */}
      <main className="md:ml-[240px] min-h-screen pt-16 md:pt-0 pb-20 md:pb-0 flex-1"> <div className="max-w-[1200px] mx-auto p-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface">Event Saya</h2> <p className="font-body-sm text-body-sm text-secondary">Kelola semua tiket dan jadwal acara Anda di sini.</p>
            </div>
            <Link to="/organizer/events/create" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-none"> <span className="material-symbols-outlined font-bold text-[20px]">add</span>
              <span className="font-label-lg text-label-lg font-normal">Event Baru</span>
            </Link>
          </div>

          {/* Bento Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> <div className="col-span-1 md:col-span-2 relative">
              <form onSubmit={handleSearch} className="w-full"> <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  name="search" 
                  defaultValue={currentSearch} 
                  className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm focus:border-primary-container focus:ring-0 transition-colors" placeholder="Cari nama event..." 
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
              <div className="text-center py-16 px-4"> <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">calendar_month</span>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">Belum Ada Event</h3> <p className="font-body-sm text-body-sm text-secondary mb-6">Mulai buat event pertama Anda dan jual tiket dengan aman.</p>
                <Link to="/organizer/events/create" className="inline-flex items-center justify-center space-x-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-none"> <span className="material-symbols-outlined font-bold">add</span>
                  <span className="font-label-md text-label-md font-bold uppercase tracking-wider">Buat Event Pertama</span>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]"> <thead className="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Poster</th> <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Nama Event</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Kategori</th> <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Tanggal</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Status</th> <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight text-right">Aksi</th>
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
                              className="w-full h-full object-cover" alt="Banner Event" 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4"> <p className="font-body-sm text-body-sm font-bold text-on-surface">{event.title}</p>
                          <p className="text-caption text-secondary">{event.city || event.location_type}</p>
                        </td>
                        <td className="px-6 py-4"> <span className="bg-surface-container-high px-2 py-1 rounded text-caption text-on-surface-variant">{event.category}</span>
                        </td>
                        <td className="px-6 py-4"> <p className="font-body-sm text-body-sm text-on-surface">{dayjs(event.start_date).format('DD MMM YYYY')}</p>
                          <p className="text-caption text-secondary">{event.start_time.substring(0, 5)} WIB</p>
                        </td>
                        <td className="px-6 py-4">
                          {event.status === 'active' ? (
                            <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#DCFCE7] text-[#15803D]">Active</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-caption font-bold bg-error-container text-error">Ended</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right"> <div className="flex justify-end space-x-1">
                            <Link to={`/organizer/events/${event.id}`} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Detail"> <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </Link>
                            <button onClick={() => handleDelete(event.id)} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Hapus"> <span className="material-symbols-outlined text-[18px]">delete</span>
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

      
    </div>
  );
}
