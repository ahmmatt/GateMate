import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import BannerSlider from '../../components/BannerSlider';

const CITIES = [
  { name: 'Jakarta',    count: '120+', img: '/icon_jakarta_monas.png',          alt: 'Jakarta Monas' },
  { name: 'Bandung',    count: '85+',  img: '/icon_bandung_gedung_sate.png',     alt: 'Bandung Gedung Sate' },
  { name: 'Yogyakarta', count: '64+',  img: '/icon_yogyakarta_tugu.png',         alt: 'Tugu Yogyakarta' },
  { name: 'Bali',       count: '92+',  img: '/icon_bali_temple.png',             alt: 'Bali Temple' },
  { name: 'Surabaya',   count: '78+',  img: '/icon_surabaya_sura_baya.png',      alt: 'Surabaya' },
  { name: 'Makassar',   count: '45+',  img: '/icon_makassar_phinisi.png',        alt: 'Makassar Phinisi' },
  { name: 'Medan',      count: '38+',  img: '/icon_medan_istana_maimun.png',     alt: 'Medan Istana Maimun' },
  { name: 'Semarang',   count: '52+',  img: '/icon_semarang_lawang_sewu.png',    alt: 'Semarang Lawang Sewu' },
];

export default function DiscoverPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [pilihanTab, setPilihanTab] = useState('Populer');
  const [terdekatCity, setTerdekatCity] = useState('Makassar');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
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

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          const available = ['Jakarta', 'Bandung', 'Yogyakarta', 'Bali', 'Surabaya', 'Makassar', 'Medan', 'Semarang'];
          if (available.includes(data.city)) {
            setTerdekatCity(data.city);
          } else {
            setTerdekatCity('Jakarta');
          }
        }
      })
      .catch(() => setTerdekatCity('Jakarta'));
  }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchEvents(); };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return { month: '', day: '', weekday: '' };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
      day: d.toLocaleDateString('id-ID', { day: '2-digit' }),
      weekday: d.toLocaleDateString('id-ID', { weekday: 'short' }).substring(0,3).toUpperCase()
    };
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'FREE';
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
  };

  const handleCityClick = (c) => {
    setCity(c);
  };

  const getTicketsSold = (event) => {
    if (!event.ticket_tiers) return 0;
    return event.ticket_tiers.reduce((total, tier) => {
      if (tier.is_unlimited) return total;
      return total + ((tier.capacity || 0) - (tier.remaining_seats || 0));
    }, 0);
  };

  const isThisWeek = (dateStr) => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    eventDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + daysUntilSunday);
    endOfWeek.setHours(23,59,59,999);
    return eventDate >= today && eventDate <= endOfWeek;
  };

  const pilihanEvents = pilihanTab === 'Minggu Ini' 
    ? events.filter(e => isThisWeek(e.start_date)).sort((a,b) => new Date(a.start_date) - new Date(b.start_date)).slice(0, 5)
    : [...events].sort((a, b) => getTicketsSold(b) - getTicketsSold(a)).slice(0, 5);

  const getRelevanceScore = (event) => {
    let score = 0;
    if (event.city === terdekatCity) score += 1000;
    
    if (event.created_at) {
      const createdAt = new Date(event.created_at);
      const now = new Date();
      const hoursSinceRelease = (now - createdAt) / (1000 * 60 * 60);
      if (hoursSinceRelease <= 12) score += 500;
    }
    
    score += getTicketsSold(event);
    return score;
  };

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  
  const recommendedEvents = events
    .filter(e => new Date(e.start_date) >= todayDate)
    .map(e => ({ ...e, relevanceScore: getRelevanceScore(e) }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 4);

  const topCategories = [
    { id: 'Technology', label: 'Teknologi', icon: 'computer' },
    { id: 'Music', label: 'Musik', icon: 'music_note' },
    { id: 'Sports', label: 'Olahraga', icon: 'sports_soccer' },
    { id: 'Education', label: 'Pendidikan', icon: 'school' },
    { id: 'Business', label: 'Bisnis', icon: 'work' }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Section 1: Hero Banner */}
      <section className="w-full overflow-hidden">
        <BannerSlider />
      </section>

      {/* Section 2: Rekomendasi Event */}
      <section className="space-y-6">
        <div className="max-w-[1280px] mx-auto flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-headline-md">Rekomendasi Untukmu</h2>
            <p className="text-on-surface-variant text-body-md">Event pilihan yang mungkin kamu sukai</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
          {loading ? (
            <div className="flex gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px] h-[300px] bg-white rounded-[14px] border-[0.5px] border-border-light animate-pulse" />
              ))}
            </div>
          ) : recommendedEvents.length === 0 ? (
            <div className="w-full py-12 text-center text-secondary border border-dashed border-border-light rounded-[14px]">
              Tidak ada event yang direkomendasikan saat ini.
            </div>
          ) : recommendedEvents.map((ev) => (
            <div key={ev.id || ev.id_event} className="min-w-[280px] max-w-[280px] bg-white rounded-[14px] border-[0.5px] border-border-light overflow-hidden event-card-shadow group cursor-pointer flex flex-col shrink-0" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
              <div className="relative overflow-hidden aspect-[2048/768]">
                <img alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#B22110]">{ev.category?.name || 'EVENT'}</span>
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
                    <span className="truncate">{ev.location_type === 'online' ? 'Online Event' : `${ev.city || ''}${ev.city ? ', ' : ''}${ev.location_details || ''}`}</span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-border-light flex justify-between items-center">
                  <span className="text-[#B22110] font-bold">{formatPrice(ev.ticket_tiers ? Math.min(...ev.ticket_tiers.map(t => Number(t.price))) : 0)}</span>
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Event Pilihan + Sidebar */}
      <section className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#B22110] text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
              <h2 className="text-headline-md">Event Pilihan</h2>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setPilihanTab('Populer')} className={`px-4 py-1.5 text-caption font-bold rounded-md transition-all ${pilihanTab === 'Populer' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>Populer</button>
              <button onClick={() => setPilihanTab('Minggu Ini')} className={`px-4 py-1.5 text-caption font-bold rounded-md transition-all ${pilihanTab === 'Minggu Ini' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>Minggu Ini</button>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white border border-border-light rounded-xl animate-pulse" />)
            ) : pilihanEvents.length === 0 ? (
              <div className="py-8 text-center text-secondary border border-dashed border-border-light rounded-xl">
                Belum ada event pilihan.
              </div>
            ) : (
              pilihanEvents.map((ev) => {
                const dateParts = formatShortDate(ev.start_date);
                return (
                  <div key={ev.id || ev.id_event} className="flex items-center gap-6 p-4 rounded-xl border-[0.5px] border-border-light card-hover group cursor-pointer transition-all bg-white" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
                    <div className="w-16 flex flex-col items-center border-r border-border-light pr-6 shrink-0">
                      <span className="text-caption font-bold text-on-surface-variant">{dateParts.month}</span>
                      <span className="text-2xl font-bold text-[#B22110]">{dateParts.day}</span>
                      <span className="text-caption text-on-surface-variant">{dateParts.weekday}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-50 text-[#B22110]">{ev.category?.name?.toUpperCase() || 'EVENT'}</span>
                      </div>
                      <h3 className="font-bold text-body-md truncate">{ev.title}</h3>
                      <p className="text-caption text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> {ev.location_type === 'online' ? 'Online Event' : `${ev.city || ''}${ev.city ? ', ' : ''}${ev.location_details || ''}`}
                      </p>
                    </div>
                    <div className="w-40 aspect-[2048/768] rounded-lg overflow-hidden flex-shrink-0">
                      <img alt={ev.title} className="w-full h-full object-cover" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {events.length > 5 && (
            <button onClick={() => {}} className="w-full py-3 border border-border-light rounded-xl text-body-md font-medium text-on-surface-variant hover:bg-gray-50 transition-colors">
              Muat Lebih Banyak
            </button>
          )}
        </div>

        {/* Sidebar Promo */}
        <div className="space-y-8">
          <div className="w-full rounded-[14px] overflow-hidden border-[0.5px] border-border-light shadow-sm h-[600px]">
            <img
              alt="GateAI Matchmaking Poster"
              className="w-full h-full object-cover"
              src="../../../public/gateai.png"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Kategori Event */}
      <section className="max-w-[1280px] mx-auto space-y-6">
        <h2 className="text-headline-md">Telusuri Kategori</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map(({ id, icon, label }) => (
            <div key={label} className={`flex flex-col items-center justify-center p-6 border-[0.5px] rounded-xl card-hover cursor-pointer space-y-3 transition-colors ${category === id ? 'border-[#B22110] bg-[#B22110]/5' : 'border-border-light bg-white hover:border-[#B22110]/50'}`} onClick={() => handleCategoryClick(id)}>
              <span className={`material-symbols-outlined text-3xl ${category === id ? 'text-[#B22110]' : 'text-[#B22110]'}`}>{icon}</span>
              <span className={`text-caption font-bold ${category === id ? 'text-[#B22110]' : 'text-on-surface'}`}>{label}</span>
            </div>
          ))}
          <div className={`flex flex-col items-center justify-center p-6 border-[0.5px] rounded-xl cursor-pointer space-y-3 transition-colors ${category === 'All' ? 'border-[#B22110] bg-[#B22110]/5' : 'border-border-light bg-white hover:border-[#B22110]/50'}`} onClick={() => handleCategoryClick('All')}>
            <span className={`material-symbols-outlined text-3xl ${category === 'All' ? 'text-[#B22110]' : 'text-[#B22110]'}`}>grid_view</span>
            <span className={`text-caption font-bold ${category === 'All' ? 'text-[#B22110]' : 'text-on-surface'}`}>Semua Kategori</span>
          </div>
        </div>
      </section>

      {/* Section 5: Event Terdekat */}
      <section className="space-y-6">
        <div className="max-w-[1280px] mx-auto flex items-center gap-4">
          <h2 className="text-headline-md">Event Terdekat</h2>
          <div className="relative">
            <div onClick={() => setShowCityDropdown(!showCityDropdown)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full border border-border-light cursor-pointer transition-colors">
              <span className="text-[12px]">📍</span>
              <span className="text-caption font-bold">{terdekatCity}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
            {showCityDropdown && (
              <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-border-light rounded-xl shadow-lg z-50 py-2 overflow-hidden">
                {['Jakarta', 'Bandung', 'Yogyakarta', 'Bali', 'Surabaya', 'Makassar', 'Medan', 'Semarang'].map(c => (
                  <div key={c} onClick={() => { setTerdekatCity(c); setShowCityDropdown(false); }} className={`px-4 py-2 text-caption cursor-pointer hover:bg-gray-50 ${terdekatCity === c ? 'font-bold text-[#B22110] bg-[#B22110]/5' : 'text-on-surface'}`}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
          {events.filter(e => e.city === terdekatCity).length > 0 ? (
            events.filter(e => e.city === terdekatCity).map((ev) => (
              <div key={ev.id || ev.id_event} className="min-w-[280px] max-w-[280px] space-y-3 group cursor-pointer shrink-0" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
                <div className="rounded-xl overflow-hidden border border-border-light aspect-[2048/768]">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} alt={ev.title} />
                </div>
                <div>
                  <h4 className="font-bold text-body-md truncate">{ev.title}</h4>
                  <p className="text-caption text-on-surface-variant truncate">{ev.location_details || ev.city || 'TBA'}, {formatShortDate(ev.start_date).day} {formatShortDate(ev.start_date).month}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 px-4 w-full text-center text-secondary border border-dashed border-border-light rounded-xl">
              Belum ada event terdekat di {terdekatCity}.
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Kota Populer */}
      <section className="max-w-[1280px] mx-auto space-y-6">
        <h2 className="text-headline-md">Eksplor Kota Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CITIES.map(({ name, count, img, alt }) => (
            <div key={name} className={`bg-white rounded-[14px] border-[0.5px] p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform h-40 border-outline-variant`} onClick={() => navigate('/city/' + name)}>
              <div className="w-16 h-16 flex items-center justify-center">
                <img alt={alt} className="w-full h-full object-contain" src={img} />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#B22110] text-body-md">{name}</p>
                <p className="text-caption text-secondary">{count} Event</p>
              </div>
            </div>
          ))}
          {city !== 'All' && (
            <div className="bg-white rounded-[14px] border border-[#B22110] p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform h-40" onClick={() => handleCityClick('All')}>
               <span className="material-symbols-outlined text-[#B22110] text-4xl">travel_explore</span>
               <p className="font-bold text-[#B22110] text-body-md text-center">Semua Kota</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
