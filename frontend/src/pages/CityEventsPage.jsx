import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function CityEventsPage() {
  const { cityName } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const topCategories = [
    { id: 'Technology', label: 'Teknologi', icon: 'computer' },
    { id: 'Music', label: 'Musik', icon: 'music_note' },
    { id: 'Sports', label: 'Olahraga', icon: 'sports_soccer' },
    { id: 'Education', label: 'Pendidikan', icon: 'school' },
    { id: 'Business', label: 'Bisnis', icon: 'work' }
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('city', cityName);
      if (category !== 'All') params.append('category', category);
      const res = await api.get(`/events?${params.toString()}`);
      
      // Additional client-side filter just in case the backend doesn't exact match
      let fetchedEvents = res.data.data || [];
      // Make case insensitive exact match for robustness
      fetchedEvents = fetchedEvents.filter(e => e.city && e.city.toLowerCase() === cityName.toLowerCase());
      setEvents(fetchedEvents);
    } catch (_) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [cityName, category]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'FREE';
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-12 pb-16 pt-8 max-w-[1280px] mx-auto px-4 md:px-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-[#B22110] mb-4 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="font-bold text-sm">Kembali</span>
          </button>
          <h1 className="text-4xl font-black">
            Event Menarik di <span className="text-[#B22110]">{cityName}</span>
          </h1>
        </div>
        
        {/* Category Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-full text-on-surface hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            <span className="font-bold text-sm">
              {category === 'All' 
                ? 'Semua Kategori' 
                : (topCategories.find(c => c.id === category)?.label || category)}
            </span>
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-border-light rounded-[14px] shadow-lg overflow-hidden z-50">
              <div className="p-2 border-b border-border-light">
                <div className="flex items-center bg-gray-50 border border-border-light rounded-md px-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">search</span>
                  <input 
                    type="text" 
                    placeholder="Ketik kategori lain..." 
                    className="w-full px-2 py-1.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleCategoryClick(e.target.value.trim());
                        setShowCategoryDropdown(false);
                      }
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => { handleCategoryClick('All'); setShowCategoryDropdown(false); }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${category === 'All' ? 'bg-red-50 text-[#B22110] font-bold' : 'text-on-surface hover:bg-gray-50'}`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                Semua Kategori
              </button>
              {topCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { handleCategoryClick(cat.id); setShowCategoryDropdown(false); }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${category === cat.id ? 'bg-red-50 text-[#B22110] font-bold' : 'text-on-surface hover:bg-gray-50'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[14px] border-[0.5px] border-border-light animate-pulse h-[350px]"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center text-secondary border border-dashed border-border-light rounded-[14px] bg-white">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">event_busy</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Belum ada event</h3>
            <p>Wah, belum ada event yang sesuai dengan kategori di kota {cityName}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((ev) => (
              <div key={ev.id || ev.id_event} className="bg-white rounded-[14px] border-[0.5px] border-border-light overflow-hidden event-card-shadow group cursor-pointer flex flex-col h-full" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#B22110]">{ev.category?.name || ev.category || 'EVENT'}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-body-md line-clamp-1 mb-2">{ev.title}</h3>
                  <div className="space-y-1 mt-auto">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{formatDate(ev.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="line-clamp-1">{ev.location_type === 'online' ? 'Online Event' : `${ev.city}, ${ev.venue_name || ev.location_details}`}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-light flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Harga Mulai</span>
                      <span className="font-bold text-body-md text-[#B22110]">
                        {formatPrice(ev.ticket_tiers && ev.ticket_tiers.length > 0 ? Math.min(...ev.ticket_tiers.map(t => t.price)) : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
