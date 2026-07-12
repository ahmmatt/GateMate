import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, Info, Navigation, ArrowLeft, X, ChevronDown } from 'lucide-react'
import { dummyEvents } from '../../data/dummyEvents'
import { formatDate, formatPrice } from '../../utils/formatDate'

// ─── Purchase Confirmation Modal ──────────────────────────────────────────────
function PurchaseModal({ event, tier, onClose, onConfirm }) {
  const [motivation, setMotivation] = useState('')
  const [source, setSource] = useState('')
  const [isClosing, setIsClosing] = useState(false)

  // Lock background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
  }

  const handleConfirm = () => {
    onConfirm({ motivation, source })
  }

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 248, 246, 0.8)',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        className="relative bg-surface-container-lowest border border-outline-variant rounded-[14px] shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col"
        style={{
          transform: isClosing ? 'scale(0.96)' : 'scale(1)',
          opacity: isClosing ? 0 : 1,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-white shrink-0">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            Konfirmasi Pembelian
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
          {/* Selected Ticket */}
          <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-label-md text-label-md text-primary mb-1">Tiket Terpilih</p>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">{tier.name}</h4>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">{tier.description}</p>
            </div>
            <p className="font-headline-sm text-headline-sm text-primary font-bold shrink-0 ml-4">
              {formatPrice(tier.price)}
            </p>
          </div>

          {/* Additional Questions Section */}
          <div className="space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Informasi Tambahan
            </h3>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Apa motivasi Anda mengikuti event ini?
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tuliskan motivasi Anda di sini..."
                rows={3}
                className="w-full bg-surface border border-outline-variant rounded-[10px] p-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                Dari mana Anda mengetahui event ini?
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-[10px] p-3 pr-10 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all"
                >
                  <option value="" disabled>Pilih sumber informasi</option>
                  <option value="sosmed">Media Sosial (Instagram/Twitter)</option>
                  <option value="email">Email Newsletter</option>
                  <option value="teman">Teman atau Kolega</option>
                  <option value="iklan">Iklan Digital</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="pt-4 border-t border-outline-variant">
            <div className="flex justify-between items-center mb-1">
              <span className="font-body-md text-body-md text-secondary">Total Tagihan</span>
              <span className="font-headline-md text-headline-md text-primary font-extrabold">
                {formatPrice(tier.price)}
              </span>
            </div>
            <p className="font-caption text-caption text-secondary">Termasuk pajak dan biaya layanan.</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-5 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white font-body-md text-body-md font-bold py-3 px-6 rounded-full hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all"
          >
            Lanjutkan ke Pembayaran
          </button>
          <button
            onClick={handleClose}
            className="sm:w-auto border border-primary text-primary font-body-md text-body-md font-bold py-3 px-6 rounded-full hover:bg-coral-light active:opacity-80 transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main EventDetail Page ─────────────────────────────────────────────────────
export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = dummyEvents.find(e => e.id === parseInt(id))

  const [modalTier, setModalTier] = useState(null) // null = closed, or tier object

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-surface">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Event Tidak Ditemukan</h2>
        <p className="text-on-surface-variant mb-6">Event yang Anda cari tidak tersedia.</p>
        <Link
          to="/events"
          className="rounded-[22px] px-6 py-2.5 bg-coral-red text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-200"
        >
          Kembali ke Events
        </Link>
      </div>
    )
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleBuyTicket = (tier) => {
    if (!user) {
      navigate('/login')
    } else {
      setModalTier(tier)
    }
  }

  const handleConfirmPurchase = ({ motivation, source }) => {
    // TODO: integrate with payment gateway / API
    alert(
      `Pembayaran untuk "${modalTier.name}" akan diproses!\n` +
      `Event: ${event.title}\n` +
      `Harga: ${formatPrice(modalTier.price)}\n` +
      (motivation ? `Motivasi: ${motivation}\n` : '') +
      (source ? `Sumber: ${source}` : '')
    )
    setModalTier(null)
  }

  // Ticket tiers
  const ticketTiers = [
    {
      name: 'VIP Card',
      description: 'Akses baris depan + Meet & Greet',
      price: 1500000,
      tag: 'TERBATAS',
      disabled: false,
    },
    {
      name: 'Regular Card',
      description: 'Akses festival umum',
      price: event.price > 0 ? event.price : 450000,
      disabled: false,
    },
    {
      name: 'Early Bird Card',
      description: 'Akses festival umum',
      price: 250000,
      tag: 'SOLDOUT',
      disabled: true,
    },
  ]

  return (
    <div className="bg-surface font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen pb-20">

      {/* Purchase Modal */}
      {modalTier && (
        <PurchaseModal
          event={event}
          tier={modalTier}
          onClose={() => setModalTier(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}

      {/* Back Button Overlay */}
      <div className="absolute z-10 top-[88px] left-4 md:left-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-on-surface-variant hover:text-coral-red transition-all shadow-sm group font-label-md text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
      </div>

      {/* Hero Section */}
      <section className="w-full relative aspect-video md:aspect-[21/9] lg:aspect-[3/1] bg-surface-variant overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

      <div className="max-w-[1280px] mx-auto px-container-padding mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gap-default">

          {/* ── Left Column ──────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-gap-default">

            {/* Header Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-coral-light text-coral-dark px-3 py-1 rounded-[10px] font-label-md text-[11px] uppercase tracking-wider">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-[10px] font-label-md text-[11px] uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-on-surface-variant py-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-body-md text-body-md">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-body-md text-body-md">{event.city}, Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-body-md text-body-md">{event.time} - {event.endTime} WIB</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-container-lowest border border-divider rounded-[14px] p-6 flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Tentang Event</h2>
              <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface px-1">Lokasi</h2>
              <div className="w-full h-64 bg-surface-f5 border border-divider rounded-[14px] overflow-hidden group relative cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Map Location"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTpLoBD7bSlhLcc89k37gzncITVRHqH7XhzFNNAioxPiclrOnaVKOGOHVlJPwXKE_t7FNTCkT9j7iSI-nW82NB81pULsbt8A2nwJVc3Vv_xUFbfudNUYBki2b72ezWiFe7xSCJ4cXtHMDNV7U60D8myQPj7nWunO9gGLoZ3bXfNj8Fysz1poOORgPjWbLXIYCUpLGikyV3u_GeJNK2m95ukyDnERZ0CgZteKdV2w4TcXV9Wx6i30wZLunoqG4q-FO2usN4838mDz4"
                />
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-[14px] border border-divider flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-coral-red fill-coral-red" />
                  <span className="font-label-md text-label-md">Buka di Maps</span>
                </div>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md px-1">
                {event.location}, {event.city}.
              </p>
            </div>
          </div>

          {/* ── Right Column: Ticket Tiers ────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-gap-tight">
              <h2 className="font-headline-sm text-headline-sm text-on-surface px-1">Pilih Tiket</h2>

              {ticketTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`${tier.disabled
                    ? 'bg-surface-f5 opacity-70'
                    : 'bg-white hover:border-coral-red/40 hover:shadow-sm'
                    } border border-divider rounded-[14px] p-card-padding flex flex-col gap-3 transition-all duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-headline-sm text-headline-sm ${tier.disabled ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                        {tier.name}
                      </h3>
                      <p className={`font-caption text-caption text-on-surface-variant mt-0.5 ${tier.disabled ? 'line-through' : ''}`}>
                        {tier.disabled ? 'Habis Terjual' : tier.description}
                      </p>
                    </div>
                    {tier.tag && (
                      <span className={`${tier.disabled
                        ? 'bg-outline-variant text-on-surface-variant'
                        : 'bg-coral-light text-coral-dark'
                        } px-2 py-0.5 rounded-[10px] font-label-md text-[10px] shrink-0 ml-2`}>
                        {tier.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className={`font-headline-md text-headline-md ${tier.disabled ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                      {formatPrice(tier.price)}
                    </span>
                    <button
                      onClick={() => !tier.disabled && handleBuyTicket(tier)}
                      disabled={tier.disabled}
                      className={`${tier.disabled
                        ? 'bg-secondary cursor-not-allowed opacity-60'
                        : 'bg-coral-red hover:opacity-90 active:scale-95'
                        } text-white px-6 py-2 rounded-[22px] font-label-md text-label-md transition-all duration-200`}
                    >
                      {tier.disabled ? 'Habis Terjual' : 'Beli Tiket'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Info Card */}
              <div className="mt-2 p-4 rounded-xl bg-surface-container border border-outline-variant flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="font-caption text-caption text-on-surface-variant">
                  Tiket bersifat digital dan akan langsung terbit di menu "My Tickets" setelah pembayaran diverifikasi secara otomatis.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
