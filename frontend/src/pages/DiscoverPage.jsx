import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

const CATEGORIES = [
  { key: 'All', label: 'Semua' },
  { key: 'Music Concert', label: 'Konser' },
  { key: 'Workshop & Training', label: 'Workshop' },
  { key: 'Sport', label: 'Sport' },
  { key: 'Festival', label: 'Festival' },
  { key: 'Exhibition', label: 'Pameran' },
  { key: 'Tech Seminar', label: 'Seminar' },
];

const CITIES = ['All', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang'];

const CITY_META = {
  Jakarta:    { color: 'bg-primary-container text-on-primary-container', icon: 'location_city' },
  Bali:       { color: 'bg-tertiary-container text-on-tertiary-container', icon: 'holiday_village' },
  Bandung:    { color: 'bg-secondary-container text-on-secondary-container', icon: 'landscape' },
  Surabaya:   { color: 'bg-error-container text-on-error-container', icon: 'apartment' },
  Yogyakarta: { color: 'bg-surface-variant text-on-surface-variant', icon: 'account_balance' },
  Makassar:   { color: 'bg-primary-fixed text-on-primary-fixed', icon: 'sailing' },
  Medan:      { color: 'bg-tertiary-fixed text-on-tertiary-fixed', icon: 'map' },
  Semarang:   { color: 'bg-secondary-fixed text-on-secondary-fixed', icon: 'train' },
};

export default function DiscoverPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (city !== 'All') params.append('city', city);
      const res = await api.get(`/events?${params.toString()}`);
      setEvents(res.data.data || []);
    } catch (_) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [category, city]);

  const handleSearch = (e) => { e.preventDefault(); fetchEvents(); };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <section className="bg-surface-container-low rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-fixed/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-headline-lg text-headline-lg md:text-5xl font-bold text-on-surface mb-4">Discover Event</h1>
          <p className="font-body-lg text-body-lg text-secondary mb-8">Find what's happening nearby, pick your favorite category, or search instantly.</p>
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-surface-container-lowest rounded-full p-2 shadow-sm focus-within:ring-2 ring-primary transition-all">
            <span className="material-symbols-outlined text-secondary ml-3">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event by title..."
              className="w-full bg-transparent border-none outline-none text-on-surface font-body-md focus:ring-0"
            />
            <button type="submit" className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2 rounded-full font-label-md font-bold transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-gap-default mt-2">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${category === key ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative min-w-[160px]">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="appearance-none w-full bg-surface-container-low border border-outline-variant/30 rounded-[10px] px-4 py-2 font-body-md text-body-md focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="All">Semua Kota</option>
            {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary pointer-events-none">expand_more</span>
        </div>
      </section>

      {/* Events Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Recently Added</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-outline-variant animate-pulse">
                <div className="h-48 bg-surface-container-high" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  <div className="h-3 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant border-dashed">
            <span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontSize: '48px' }}>event_busy</span>
            <h3 className="mt-4 font-headline-sm font-bold text-on-surface">No Events Available</h3>
            <p className="text-secondary font-body-md mt-2 text-center max-w-md">There are no upcoming events at the moment. Please check back later or try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <div
                key={event.id_event}
                onClick={() => isAuthenticated ? navigate(`/events/${event.id_event}`) : navigate('/login')}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all flex flex-col h-full cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-primary font-label-md font-bold text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_month</span>
                    {formatDate(event.start_date)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-headline-sm font-bold text-on-surface mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-secondary font-caption mb-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                    <span className="truncate">{event.location_type === 'online' ? 'Online Event' : `${event.city || ''}${event.city ? ', ' : ''}${event.location_details || ''}`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-caption mb-4">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                    <span>{event.start_time}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[10px]">
                        {(event.author_name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="font-caption text-secondary truncate max-w-[100px]">{event.author_name || 'Admin'}</span>
                    </div>
                    <div className="font-label-md font-bold text-primary">{formatPrice(event.min_price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* City Explorer */}
      <section className="mb-16 mt-8">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-6">Cari Event di Kotamu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(CITY_META).map(([cityName, meta]) => (
            <button
              key={cityName}
              onClick={() => setCity(cityName)}
              className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer text-left"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.color}`}>
                <span className="material-symbols-outlined">{meta.icon}</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-[16px] text-on-surface">{cityName}</h4>
                <p className="font-body-md text-primary">Events</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
