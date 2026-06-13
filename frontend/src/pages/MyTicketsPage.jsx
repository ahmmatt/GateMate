import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/my-tickets')
      .then(res => setTickets(res.data.data || { upcoming: [], past: [] }))
      .catch(() => setTickets({ upcoming: [], past: [] }))
      .finally(() => setLoading(false));
  }, []);

  const upcomingTickets = Array.isArray(tickets.upcoming) ? tickets.upcoming : [];
  const pastTickets = Array.isArray(tickets.past) ? tickets.past : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(+h, +m);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  };

  const TicketCard = ({ ticket }) => {
    const ev = ticket.event || {};
    const bannerSrc = ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400';

    return (
      <div className="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center text-xs font-bold text-secondary">
          <span>{formatDate(ev.start_date)}</span>
          <span className="text-[#f04e37]">{formatTime(ev.start_time)}</span>
        </div>
        <div className="w-full aspect-[16/9] overflow-hidden rounded-lg bg-surface-container-low">
          <img 
            alt={ev.title} 
            className="w-full h-full object-cover" 
            src={bannerSrc} 
            onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"; }}
          />
        </div>
        <h2 className="text-lg font-bold text-on-surface line-clamp-1">{ev.title}</h2>
        <div className="flex items-center gap-2 text-secondary text-xs">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="truncate">
            {ev.location_type === 'online' ? 'Online' : `${ev.city || ''}${ev.city ? ', ' : ''}${ev.location_details || ''}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant">
          <div className="flex justify-between items-center text-xs">
            <span className="text-secondary">Order ID</span>
            <span className="font-medium">{ticket.order_id}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-secondary">Total</span>
            <span className="text-on-surface">{formatCurrency(ticket.gross_amount)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">qr_code_2</span>
          Lihat E-Ticket
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-secondary">
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
        <span className="font-body-lg">Memuat tiket...</span>
      </div>
    </div>
  );

  return (
    <div className="flex-grow max-w-[1280px] mx-auto w-full">
      {/* Header & Segmented Control */}
      <div className="flex flex-col gap-6 mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">My Tickets</h1>
        <div className="flex gap-8 border-b border-outline-variant">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 transition-all ${activeTab === 'upcoming' ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-on-surface'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 transition-all ${activeTab === 'past' ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-on-surface'}`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Upcoming Tickets */}
      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-between mt-2 col-span-full">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Upcoming Events</span>
            <span className="font-label-md text-label-md text-primary">{upcomingTickets.length} Active</span>
          </div>
          {upcomingTickets.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>confirmation_number</span>
              <p className="mt-4 font-body-lg text-secondary text-center">Anda belum memiliki tiket upcoming.</p>
              <Link to="/discover" className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full font-label-md font-bold hover:opacity-90 transition-opacity">
                Cari Event
              </Link>
            </div>
          ) : (
            upcomingTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      )}

      {/* Past Tickets */}
      {activeTab === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-between col-span-full mt-4">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Past History</span>
          </div>
          <div className="opacity-60 col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTickets.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant border-dashed">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>history</span>
                <p className="mt-4 font-body-lg text-secondary text-center">Belum ada riwayat tiket.</p>
              </div>
            ) : (
              pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
