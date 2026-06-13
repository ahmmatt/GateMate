import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function ETicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Matchmaking states
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [vibeBio, setVibeBio] = useState('');
  const [hasVibeBio, setHasVibeBio] = useState(false);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then(res => {
        setTicket(res.data.data);
      })
      .catch(err => {
        console.error(err);
        navigate('/my-tickets');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const handleSaveVibe = (e) => {
    e.preventDefault();
    if (!vibeBio.trim()) return;
    setHasVibeBio(true);
    setShowVibeModal(false);
    // You would call api.post('/ticket/vibe', { vibe_bio }) here
  };

  const startMatchmaking = () => {
    if (!hasVibeBio) return;
    setShowMatchModal(true);
    setTimeout(() => {
      setShowMatchModal(false);
      setShowMatchResult(true);
    }, 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );
  if (!ticket) return null;

  return (
    <div className="max-w-[1280px] mx-auto py-8">
      <Link to="/my-tickets" className="inline-flex items-center text-secondary hover:text-primary mb-6 gap-2 transition-colors">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        <span className="font-label-md text-label-md">Kembali ke Tiket Saya</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Ticket QR */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Event Banner */}
          <div className="w-full aspect-[21/9] rounded-[14px] overflow-hidden border border-outline-variant bg-surface-container shadow-sm">
            <img 
              src={ticket.event.banner_image_url || `http://localhost:8000/Media/uploads/${ticket.event.banner_image}`} 
              alt={ticket.event.title} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200'; }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{ticket.event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-secondary mt-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span className="font-body-md text-body-md">{new Date(ticket.event.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="font-body-md text-body-md">
                  {ticket.event.location_type === 'online' ? 'Virtual Meeting' : `${ticket.event.venue_name}, ${ticket.event.city}`}
                </span>
              </div>
            </div>
          </div>

          {/* QR Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-8 flex flex-col items-center gap-6 shadow-sm">
            <div className="w-64 h-64 border-2 border-on-surface p-4 flex items-center justify-center relative bg-white">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.order_id}&color=000000&bgcolor=ffffff`} alt="QR Code" className="w-full h-full object-contain relative z-10 p-1" />
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <p className="font-label-md text-label-md text-secondary tracking-widest uppercase">TICKET ID</p>
              <p className="font-headline-sm text-headline-sm font-bold tracking-wider text-on-surface">{ticket.order_id}</p>
            </div>

            <div className="w-full border-t border-outline-variant pt-6 grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex flex-col gap-1">
                <p className="font-caption text-caption text-secondary">Attendee</p>
                <p className="font-body-md text-body-md font-medium text-on-surface">{ticket.user.full_name}</p>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <p className="font-caption text-caption text-secondary">Tier</p>
                <div className="flex justify-end">
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-0.5 rounded-[10px] font-label-md text-label-md">{ticket.ticketTier.tier_name}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-caption text-caption text-secondary">Start Time</p>
                <p className="font-body-md text-body-md font-medium text-on-surface">{ticket.event.start_time.slice(0, 5)}</p>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <p className="font-caption text-caption text-secondary">End Time</p>
                <p className="font-body-md text-body-md font-medium text-on-surface">{ticket.event.end_time.slice(0, 5)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Networking Hub */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Networking Hub</h2>
            <span className="bg-primary text-on-primary px-2 py-0.5 rounded-full font-label-md text-[10px]">BETA</span>
          </div>

          {/* Bio Setup */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">AI Vibe Bio Setup</h3>
                <p className="font-body-md text-body-md text-secondary">Biarkan AI menyusun persona networking profesional Anda.</p>
              </div>
            </div>
            <button onClick={() => setShowVibeModal(true)} className="w-full py-[10px] rounded-full font-body-md text-body-md font-medium transition-all bg-primary text-white hover:opacity-90">
              {hasVibeBio ? 'Edit Vibe Bio' : 'Isi Vibe Bio'}
            </button>
          </div>

          {/* AI Matchmaking */}
          <div className="bg-primary-fixed border border-outline-variant rounded-[14px] p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">AI Matchmaking</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Temukan partner potensial di industri yang sama.</p>
            </div>
            <button 
              onClick={startMatchmaking} 
              disabled={!hasVibeBio}
              className={`w-full border py-[10px] rounded-full font-body-md text-body-md font-medium transition-all ${hasVibeBio ? 'border-primary text-primary hover:bg-primary hover:text-white bg-white' : 'border-outline-variant text-secondary bg-surface-container-lowest opacity-50 cursor-not-allowed'}`}
            >
              Mulai Pencocokan AI
            </button>
          </div>
        </div>
      </div>

      {/* Vibe Bio Modal */}
      {showVibeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <form onSubmit={handleSaveVibe}>
              <div className="p-8 flex flex-col gap-6">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[28px]">psychology</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Buat Vibe Bio Kamu</h2>
                  <p className="font-body-md text-body-md text-secondary mt-1">Bantu peserta lain mengenalmu lebih baik lewat profil singkat.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-secondary">Bio Deskripsi</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-[10px] p-4 font-body-md text-body-md focus:ring-0 focus:border-primary transition-colors resize-none" 
                    rows="4" 
                    value={vibeBio}
                    onChange={(e) => setVibeBio(e.target.value)}
                    placeholder="Ceritakan minat atau tujuanmu hadir di event ini..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowVibeModal(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-full font-medium hover:bg-surface-variant transition-colors">Batal</button>
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-full font-medium hover:brightness-110 transition-colors">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matchmaking Loading Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-[16px] rounded-[22px] shadow-xl p-8 flex flex-col items-center text-center border border-white/50 animate-in fade-in duration-300">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-8 font-bold">Mencari Partner...</h3>
            <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '3s' }}>
                <circle cx="50" cy="50" fill="none" r="45" stroke="#F04E37" strokeDasharray="283" strokeDashoffset="100" strokeWidth="6"></circle>
              </svg>
              <div className="bg-surface-container w-20 h-20 rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[40px] text-primary">psychology</span>
              </div>
            </div>
            <div className="w-full space-y-3 mb-8">
              <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-xl"><span className="material-symbols-outlined text-primary">check_circle</span> <span className="text-body-md">Menganalisis minat...</span></div>
              <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-xl"><span className="material-symbols-outlined text-primary animate-spin">sync</span> <span className="text-body-md">Mencari kecocokan...</span></div>
            </div>
            <button onClick={() => setShowMatchModal(false)} className="w-full border border-primary text-primary py-3 rounded-full font-medium hover:bg-primary-fixed/20 transition-colors">Batal</button>
          </div>
        </div>
      )}

      {/* Match Result Modal */}
      {showMatchResult && (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-outline-variant h-16 flex items-center justify-between px-6 z-10">
            <div className="font-bold text-primary text-[20px]">GateMate Match</div>
            <button onClick={() => setShowMatchResult(false)} className="text-secondary hover:text-primary"><span className="material-symbols-outlined">close</span></button>
          </nav>
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-primary-fixed text-primary px-4 py-1.5 rounded-full font-label-md font-bold uppercase tracking-wider mb-4"><span className="material-symbols-outlined text-[18px]">auto_awesome</span> AI Powered</span>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Temukan Teman Sefrekuensi</h1>
              <p className="font-body-lg text-body-lg text-secondary">Hasil pencocokan AI berdasarkan minat dan preferensi Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`bg-white rounded-[14px] p-6 flex flex-col items-center relative transition-transform hover:-translate-y-1 shadow-sm ${i === 1 ? 'border-2 border-primary' : 'border border-outline-variant'}`}>
                  {i === 1 && <div className="absolute -top-3 bg-primary text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">star</span> Best Match</div>}
                  <div className={`w-24 h-24 rounded-full overflow-hidden mb-4 border-4 ${i === 1 ? 'border-primary-fixed' : 'border-surface-container'}`}>
                    <img src={`https://ui-avatars.com/api/?name=Partner+${i}&background=random&color=fff`} alt="User" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Partner {i}</h3>
                  <div className="bg-surface-container-low px-2 py-0.5 rounded-full mb-3"><span className="text-[11px] font-medium text-primary">Peserta</span></div>
                  <p className="font-body-md text-body-md text-secondary text-center mb-6 line-clamp-3">Sangat antusias dengan inovasi teknologi terbaru. Ingin mencari partner diskusi tentang AI dan Web3.</p>
                  <button onClick={() => alert('Fitur Chat segera hadir!')} className="mt-auto w-full py-2.5 border border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">chat</span> Say Hello
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
