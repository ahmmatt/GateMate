import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, MapPin, Calendar, Heart, ChevronDown, X, Ticket,
  Home as HomeIcon, Compass, Wallet, User
} from 'lucide-react'
import { dummyEvents } from '../../data/dummyEvents'

const formatPrice = (price) =>
  price === 0
    ? 'Gratis'
    : `Rp ${price.toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const sisa = (event) => event.maxAttendees - event.soldTickets

export default function Events() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [activeCity, setActiveCity] = useState('Semua')
  const [sortBy, setSortBy] = useState('newest')
  const [likedEvents, setLikedEvents] = useState([])
  const [visibleLimit, setVisibleLimit] = useState(6)

  const categories = ['Semua', 'Konser', 'Workshop', 'Sport', 'Festival', 'Pameran']
  
  const popularCities = [
    { name: 'Jakarta' },
    { name: 'Bandung' },
    { name: 'Surabaya' },
    { name: 'Bali' }
  ]

  const getCityEventCount = (cityName) => {
    return dummyEvents.filter(e => e.city.toLowerCase() === cityName.toLowerCase()).length
  }

  const toggleLike = (eventId) => {
    setLikedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    )
  }

  // Filtering
  const filtered = dummyEvents.filter(event => {
    // Search filter
    const matchSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.city.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
    
    // Category filter mapping
    const matchCategory = activeCategory === 'Semua' || 
      event.category === activeCategory ||
      (activeCategory === 'Sport' && event.category === 'Olahraga') ||
      (activeCategory === 'Workshop' && (event.category === 'Bisnis' || event.category === 'Teknologi'))
      
    // City filter
    const matchCity = activeCity === 'Semua' || event.city.toLowerCase() === activeCity.toLowerCase()

    return matchSearch && matchCategory && matchCity
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date)
    return b.id - a.id // newest
  })

  const displayedEvents = filtered.slice(0, visibleLimit)

  return (
    <div className="bg-[#fff8f6] min-h-screen text-[#271815] py-8 px-4 md:px-8 pb-24 md:pb-12">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <p className="text-[#b22110] text-xs font-bold uppercase tracking-wider mb-2">Discovery</p>
          <h1 className="text-3xl md:text-[40px] font-extrabold text-[#271815] leading-tight mb-3">
            Temukan Event Terbaikmu
          </h1>
          <p className="text-sm text-[#5f5e5e]">
            Jelajahi konser musik, workshop, olahraga, dan festival seru di sekitarmu.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f5e5e]/60" />
            <input
              type="text"
              placeholder="Cari judul event, lokasi, atau kota..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleLimit(6) // Reset limit on search
              }}
              className="w-full bg-white rounded-full pl-12 pr-12 py-3.5 text-sm text-[#271815] placeholder-[#5f5e5e]/50 focus:outline-none focus:ring-2 focus:ring-[#b22110]/20 transition-all border border-[#e3beb8]/30 shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5f5e5e]/60 hover:text-[#271815] p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Chips and Dropdowns */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 scrollbar-none flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleLimit(6) // Reset limit
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-[#b22110] text-white shadow-sm'
                    : 'bg-white text-[#5f5e5e] hover:bg-[#fff0ee] hover:text-[#b22110] border border-[#e3beb8]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Location & Sort Selects */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* City Select */}
            <div className="relative flex-1 md:flex-initial min-w-[140px]">
              <select
                value={activeCity}
                onChange={(e) => {
                  setActiveCity(e.target.value)
                  setVisibleLimit(6)
                }}
                className="w-full bg-white rounded-full pl-4 pr-10 py-2.5 text-xs font-semibold text-[#271815] appearance-none focus:outline-none focus:ring-2 focus:ring-[#b22110]/20 border border-[#e3beb8]/20 cursor-pointer shadow-sm"
              >
                <option value="Semua">Semua Kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bali">Bali</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e] pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="relative flex-1 md:flex-initial min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white rounded-full pl-4 pr-10 py-2.5 text-xs font-semibold text-[#271815] appearance-none focus:outline-none focus:ring-2 focus:ring-[#b22110]/20 border border-[#e3beb8]/20 cursor-pointer shadow-sm"
              >
                <option value="newest">Terbaru</option>
                <option value="date">Terdekat</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Termahal</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-[#5f5e5e]">
            Menampilkan <span className="font-bold text-[#271815]">{filtered.length}</span> event
            {activeCity !== 'Semua' && <> di <span className="font-bold text-[#b22110]">{activeCity}</span></>}
            {activeCategory !== 'Semua' && <> kategori <span className="font-bold text-[#b22110]">{activeCategory}</span></>}
          </p>

          {/* Reset Filters Option if filtered results differ from original */}
          {(search || activeCategory !== 'Semua' || activeCity !== 'Semua') && (
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('Semua')
                setActiveCity('Semua')
                setVisibleLimit(6)
              }}
              className="text-xs text-[#b22110] hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Event Grid Section */}
        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedEvents.map(event => {
              const isLiked = likedEvents.includes(event.id)
              return (
                <div
                  key={event.id}
                  className="bg-white border border-[#e3beb8]/20 rounded-[14px] overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:shadow-[0_8px_30px_rgb(178,33,16,0.04)] hover:-translate-y-0.5"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden bg-[#fff0ee]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#fff8f6] text-[#b22110] border border-[#e3beb8]/30 text-[10px] font-bold px-2.5 py-1 rounded-[8px] tracking-wide uppercase">
                        {event.category}
                      </span>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleLike(event.id)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-150 active:scale-90 hover:bg-white"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-[#b22110] text-[#b22110]' : 'text-[#5f5e5e] hover:text-[#b22110]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Event Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Date & Location Line */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5f5e5e] mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#b22110]" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#b22110]" />
                          {event.city}
                        </span>
                      </div>

                      <Link to={`/events/${event.id}`} className="block">
                        <h3 className="text-[#271815] font-bold text-base mb-3 leading-tight line-clamp-2 hover:text-[#b22110] transition-colors">
                          {event.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e3beb8]/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#5f5e5e] block font-medium">Mulai dari</span>
                        <span className="text-base font-bold text-[#b22110]">{formatPrice(event.price)}</span>
                      </div>
                      
                      <span className="bg-[#fff0ee] text-[#b22110] text-[10px] font-bold px-2 py-1 rounded-[8px]">
                        Sisa {sisa(event)} Tiket
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#e3beb8]/20 rounded-[14px] mb-12 shadow-sm">
            <div className="w-16 h-16 bg-[#fff0ee] rounded-full flex items-center justify-center mx-auto mb-4 text-[#b22110]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-[#271815] font-bold text-lg mb-2">Event Tidak Ditemukan</h3>
            <p className="text-[#5f5e5e] text-sm max-w-md mx-auto">
              Coba sesuaikan kata kunci pencarian Anda atau atur ulang filter kategori dan kota.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filtered.length > visibleLimit && (
          <div className="flex justify-center mb-16">
            <button
              onClick={() => setVisibleLimit(prev => prev + 6)}
              className="px-8 py-3 bg-[#b22110] text-white text-sm font-semibold rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}

        {/* Popular Cities Section */}
        <div className="mt-12 pt-10 border-t border-[#e3beb8]/30">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#271815]">Kota Populer</h2>
            <p className="text-xs text-[#5f5e5e] mt-1">
              Temukan event menarik berdasarkan kota pilihan Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCities.map((city) => {
              const count = getCityEventCount(city.name)
              const isActive = activeCity.toLowerCase() === city.name.toLowerCase()
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setActiveCity(city.name)
                    setVisibleLimit(6)
                  }}
                  className={`group relative overflow-hidden rounded-[14px] border p-4 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-[#fff0ee] border-[#b22110] shadow-sm'
                      : 'bg-white border-[#e3beb8]/20 hover:border-[#b22110] hover:shadow-[0_8px_30px_rgb(178,33,16,0.04)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#b22110] text-white' : 'bg-[#fff0ee] text-[#b22110]'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#271815]">{city.name}</h4>
                      <p className="text-xs text-[#5f5e5e] mt-0.5">{count} Event</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Bottom Navigation for Mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 rounded-t-xl shadow-lg"
        style={{
          background: 'rgba(255,248,246,0.85)',
          backdropFilter: 'blur(12px)',
          borderTop: '0.5px solid rgba(227,190,184,0.3)',
        }}
      >
        {[
          { icon: HomeIcon,  label: 'Home',      to: '/',           active: false },
          { icon: Compass,   label: 'Discover',    to: '/events',     active: true  },
          { icon: Ticket,    label: 'My tickets',  to: '/user/tickets', active: false },
          { icon: Wallet,    label: 'Wallet',      to: '/user/wallet', active: false },
          { icon: User,      label: 'Profile',     to: '/login',      active: false },
        ].map(({ icon: Icon, label, to, active }) => (
          <Link
            key={label}
            to={to}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors ${
              active
                ? 'text-[#b22110] bg-[#ffdad4]/20'
                : 'text-[#5f5e5e]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-0.5">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom nav spacer on mobile */}
      <div className="md:hidden h-20" />
    </div>
  )
}
