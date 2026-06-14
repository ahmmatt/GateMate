import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-tagqO0YtUtBkIEIA';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [takenSeats, setTakenSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        setEvent(res.data.data);
        setHasPurchased(res.data.has_purchased || false);
        setTakenSeats(res.data.taken_seats || []);
      })
      .catch(() => navigate('/discover'))
      .finally(() => setLoading(false));

    if (!document.getElementById('midtrans-snap')) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      document.body.appendChild(script);
    }
  }, [id]);

  const handleCheckout = async () => {
    if (!selectedTier) { alert('Pilih tier tiket terlebih dahulu.'); return; }
    if (event.seat_assignment === 'pilih' && !selectedSeat) {
      alert('Silakan pilih kursi terlebih dahulu.');
      return;
    }
    setCheckoutLoading(true);
    try {
      const payload = { event_id: event.id_event, tier_id: selectedTier.id_tier };
      if (event.seat_assignment === 'pilih' && selectedSeat) {
        payload.seat_number = selectedSeat;
      }
      const res = await api.post('/checkout', payload);
      const snapToken = res.data.data?.snap_token;
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => { setShowModal(false); navigate('/my-tickets'); },
          onPending: () => { setShowModal(false); navigate('/my-tickets'); },
          onError: () => alert('Pembayaran gagal!'),
          onClose: () => {},
        });
      }
    } catch (err) { alert(err.response?.data?.message || 'Gagal memproses checkout'); }
    finally { setCheckoutLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );
  if (!event) return null;

  const bannerSrc = event.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200';

  const adminName = event.admin?.full_name || 'GateMate User';
  const adminInitial = adminName[0].toUpperCase();

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':'); const d = new Date(); d.setHours(+h, +m); return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); };
  const formatRp = (n) => n == 0 ? 'Free' : 'Rp ' + Number(n).toLocaleString('id-ID');

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Layout */}
        <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col gap-6">
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden border border-outline-variant shadow-sm aspect-[4/3]">
            <img src={bannerSrc} alt="Event Cover" className="w-full h-full object-cover" />
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">{adminInitial}</div>
            <div>
              <p className="font-caption text-caption text-secondary">Organized By</p>
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1">
                {adminName}
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </h3>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-3">Location</h4>
            <div className="flex items-start gap-2 text-secondary">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <p className="font-body-md text-body-md">
                {event.location_type === 'online' ? 'Virtual Meeting (Tautan ada di E-Ticket)' : `${event.venue_name || event.location_details}`}
              </p>
            </div>
            {event.city && <p className="font-caption text-caption text-secondary mt-1 ml-7">{event.city}</p>}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full w-fit">
            <span className="material-symbols-outlined text-primary text-[18px]">category</span>
            <span className="font-label-md text-label-md text-on-surface">{event.category}</span>
          </div>
        </div>

        {/* Right Layout */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Title */}
          <h1 className="font-headline-lg text-headline-lg text-on-surface">{event.title}</h1>

          {/* Date & Time & Tiers */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 flex-1">
              {/* Date Card */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-2xl font-bold leading-none">{new Date(event.start_date).getDate()}</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{formatDate(event.start_date)}</h3>
                  <p className="font-body-md text-body-md text-secondary">{formatTime(event.start_time)} – {formatTime(event.end_time)}</p>
                </div>
              </div>
              {/* Venue */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{event.venue_name || 'Event Location'}</h3>
                  <p className="font-body-md text-body-md text-secondary">{event.location_type === 'online' ? 'Online Event (Zoom / Virtual Meet)' : `${event.city || ''}${event.city ? ', ' : ''}${event.location_details || ''}`}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              {(event.ticket_tiers || []).map((tier) => {
                const isSoldOut = !tier.is_unlimited && tier.remaining_seats <= 0;
                
                return (
                  <button
                    key={tier.id_tier}
                    disabled={hasPurchased || isSoldOut}
                    onClick={() => { 
                      if (!hasPurchased && !isSoldOut) {
                        setSelectedTier(tier); 
                        setShowModal(true); 
                      }
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      hasPurchased || isSoldOut ? 'opacity-60 cursor-not-allowed border-outline-variant bg-surface-container-low' : 
                      selectedTier?.id_tier === tier.id_tier ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">{tier.tier_name?.toLowerCase() === 'vip' ? 'star' : 'confirmation_number'}</span>
                        <p className="font-label-md text-label-md text-on-surface-variant uppercase">{tier.tier_name}</p>
                      </div>
                      {isSoldOut && (
                        <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold uppercase">Sold Out</span>
                      )}
                    </div>
                    <p className="font-headline-sm text-headline-sm text-primary font-bold">{formatRp(tier.price)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Registration Card */}
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">Registration</h4>
            <p className="font-body-md text-body-md text-secondary mb-4">Welcome! To join the event, please select a ticket and register below.</p>
            <div className="flex items-center gap-3 mb-6 p-3 bg-surface rounded-xl border border-outline-variant">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface">{user?.full_name}</p>
                <p className="font-caption text-caption text-secondary">{user?.email}</p>
              </div>
            </div>
            {event.status === 'ended' ? (
              <button disabled className="w-full py-3 bg-surface-container text-secondary rounded-full font-headline-sm font-bold cursor-not-allowed">Event Has Ended</button>
            ) : hasPurchased ? (
              <button disabled className="w-full py-3 bg-surface-container text-secondary rounded-full font-headline-sm font-bold cursor-not-allowed text-center">
                Anda sudah memiliki tiket
              </button>
            ) : (
              <button onClick={() => setShowModal(true)} className="w-full py-3 bg-[#F04E37] text-white rounded-full font-headline-sm text-headline-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                Buy Ticket
              </button>
            )}
          </div>

          {/* About Event */}
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-3">About Event</h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Registration Details</h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="font-body-md text-body-md text-secondary">Pilih tier tiket Anda:</p>
              <div className="flex flex-col gap-2">
                {(event.ticket_tiers || []).map((tier) => (
                  <button key={tier.id_tier} onClick={() => setSelectedTier(tier)}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${selectedTier?.id_tier === tier.id_tier ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant hover:border-primary'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-headline-sm text-headline-sm text-on-surface">{tier.tier_name}</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">{formatRp(tier.price)}</span>
                    </div>
                  </button>
                ))}
              </div>

              {event.seat_assignment === 'pilih' && event.seat_numbers && event.seat_numbers.length > 0 && (
                <div className="mt-4">
                  <p className="font-body-md text-body-md text-secondary mb-2">Pilih Kursi Anda:</p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-outline-variant rounded-xl bg-surface-container-lowest">
                    {event.seat_numbers.map((seat) => {
                      const isTaken = takenSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          disabled={isTaken}
                          onClick={() => setSelectedSeat(seat)}
                          className={`px-3 py-2 border rounded-lg text-sm font-bold transition-all ${
                            isTaken 
                              ? 'bg-surface-container-highest border-outline text-outline cursor-not-allowed opacity-50' 
                              : selectedSeat === seat 
                                ? 'bg-primary text-white border-primary shadow-md' 
                                : 'bg-surface border-outline-variant hover:border-primary hover:text-primary'
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button onClick={handleCheckout} disabled={!selectedTier || (event.seat_assignment === 'pilih' && !selectedSeat) || checkoutLoading}
                className="w-full mt-4 bg-[#F04E37] text-white py-4 rounded-full font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">payment</span>
                {checkoutLoading ? 'Memproses...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
