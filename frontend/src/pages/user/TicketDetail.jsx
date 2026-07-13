import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MatchmakingLoader from '../../components/modals/MatchmakingLoader';
import VibeBioForm from '../../components/modals/VibeBioForm';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [isVibeBioOpen, setIsVibeBioOpen] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [otherAttendees, setOtherAttendees] = useState([]);
  const [matchingMatches, setMatchingMatches] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    import('../../lib/api').then(({ default: api }) => {
      api.get(`/tickets/${id}`)
        .then(res => {
          if (res.data && res.data.data) {
            const t = res.data.data.ticket;
            // Map the API data to the format used in this component
            setTicket({
              id: t.id,
              ticketCode: t.order_id,
              eventTitle: t.event?.title || 'Unknown Event',
              eventLocation: t.event?.city || t.event?.venue_name || 'Unknown Location',
              eventDate: t.event?.start_date,
              eventTime: t.event?.start_time,
              qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(t.order_id)}`,
              attendeeName: t.user?.full_name || 'Peserta',
              category: t.ticket_tier?.name || 'General',
              seatNumber: t.seat_number,
              status: t.is_used ? 'used' : 'active',
              checkedInAt: t.scanned_at
            });
            setAttendeeData(res.data.data.my_attendee);
            setOtherAttendees(res.data.data.other_attendees || []);
          }
        })
        .catch(err => console.error("Gagal memuat tiket:", err))
        .finally(() => setLoading(false));
    });
  }, [id]);

  const handleMatchmaking = async () => {
    if (!attendeeData?.vibe_bio) {
      setIsVibeBioOpen(true);
      return;
    }
    setIsMatching(true);
    setLoadingMatches(true);
    const startTime = Date.now();
    try {
      const { default: api } = await import('../../lib/api');
      const res = await api.get(`/tickets/${id}/ai-match`);
      if (res.data.success && res.data.data) {
        const fetchedMatches = res.data.data;
        setMatchingMatches(fetchedMatches);
        try {
          localStorage.setItem('last_ai_matches', JSON.stringify(fetchedMatches));
        } catch (e) {}
        
        // Pastikan animasi loader berjalan minimal 2.5 detik agar interaksi AI matchmaking terasa smooth
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 2500 - elapsed);
        
        setTimeout(() => {
          setIsMatching(false);
          setLoadingMatches(false);
          navigate('/user/matchmaking', { state: { matches: fetchedMatches } });
        }, delay);
      } else {
        setIsMatching(false);
        setLoadingMatches(false);
        alert(res.data.message || 'Gagal matchmaking');
      }
    } catch (err) {
      console.error(err);
      setIsMatching(false);
      setLoadingMatches(false);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat AI Matchmaking');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Memuat tiket...</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 font-body-md text-on-surface">
        <p className="text-secondary">Tiket tidak ditemukan</p>
        <button onClick={() => navigate('/user/tickets')} className="bg-primary text-on-primary px-4 py-2 rounded-full mt-4">Kembali</button>
      </div>
    );
  }

  const isUsed = ticket.status === 'used';
  
  // Format date helper
  const formattedDate = ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : 'Invalid Date';

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      
      <main className="max-w-[1280px] mx-auto flex-1 w-full pb-20 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Ticket QR Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Event Header */}
            <div className="flex flex-col gap-1">
              <h1 className="font-headline-lg text-headline-lg md:text-headline-lg font-bold tracking-tight">{ticket.eventTitle}</h1>
              <div className="flex items-center gap-4 text-secondary">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="font-body-md text-body-md">{formattedDate} {ticket.eventTime && `• ${ticket.eventTime.substring(0,5)}`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="font-body-md text-body-md">{ticket.eventLocation}</span>
                </div>
              </div>
            </div>
            
            {/* QR Ticket Card */}
            <div className={`bg-white border border-[#EBEBEB] rounded-[14px] p-8 flex flex-col items-center gap-6 shadow-sm ${isUsed ? 'opacity-80 grayscale-[0.3]' : ''}`}>
              {/* QR Image */}
              <div className="w-64 h-64 bg-white border-2 border-on-surface p-4 flex items-center justify-center relative">
                <div className="w-full h-full relative">
                  {ticket.qrCode ? (
                    <img src={ticket.qrCode} alt="QR Code" className="w-full h-full object-contain" />
                  ) : null}
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
              </div>
              
              <div className="text-center flex flex-col gap-2">
                <p className="font-label-md text-label-md text-secondary tracking-widest uppercase">TICKET ID</p>
                <p className="font-headline-sm text-headline-sm font-bold">{ticket.ticketCode}</p>
              </div>
              
              {/* Details Section */}
              <div className="w-full border-t border-[#EBEBEB] pt-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-caption text-caption text-secondary">Attendee</p>
                  <p className="font-body-md text-body-md font-medium">{ticket.attendeeName}</p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <p className="font-caption text-caption text-secondary">Tier</p>
                  <div className="flex justify-end">
                    <span className="bg-[#FFF0EE] text-[#B83020] px-3 py-0.5 rounded-[10px] font-label-md text-label-md w-fit">
                      {ticket.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-caption text-caption text-secondary">Seat/Section</p>
                  <p className="font-body-md text-body-md font-medium">{ticket.seatNumber || '-'}</p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <p className="font-caption text-caption text-secondary">Status</p>
                  <p className={`font-body-md text-body-md font-medium ${isUsed ? 'text-secondary' : 'text-tertiary'}`}>
                    {isUsed ? 'Used' : 'Active'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-3 rounded-xl w-full justify-center text-center">
                <span className="material-symbols-outlined text-sm">{isUsed ? 'check_circle' : 'info'}</span>
                <p className="font-body-md text-body-md">{isUsed ? (ticket.checkedInAt ? 'Tiket sudah digunakan pada ' + new Date(ticket.checkedInAt).toLocaleString('id-ID') : 'Tiket sudah digunakan') : 'Tunjukkan QR ini ke panitia di pintu masuk'}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Networking Hub Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md font-bold">Networking Hub</h2>
            </div>
            
            {/* AI Vibe Bio Setup Card */}
            <div className="bg-white border border-[#EBEBEB] rounded-[14px] p-card-padding flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm font-bold">AI Vibe Bio Setup</h3>
                  <p className="font-body-md text-body-md text-secondary">Let AI craft your professional networking persona.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsVibeBioOpen(true)}
                className={`w-full ${attendeeData?.vibe_bio ? 'bg-[#FFF0EE] text-primary border border-primary' : 'bg-primary text-on-primary'} py-[10px] px-[22px] rounded-full font-body-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
              >
                {attendeeData?.vibe_bio ? 'Edit Vibe Bio' : 'Isi Vibe Bio'}
              </button>
            </div>

            {/* AI Matchmaking Card */}
            <div className="bg-[#FFF0EE] border border-outline-variant rounded-[14px] p-card-padding flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm font-bold text-[#B83020]">AI Matchmaking</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">We've found {otherAttendees.length} potential partners for your industry.</p>
              </div>
              <button 
                onClick={handleMatchmaking}
                disabled={!attendeeData?.vibe_bio || loadingMatches}
                className={`w-full py-[10px] px-[22px] rounded-full font-body-md font-medium transition-all ${
                  attendeeData?.vibe_bio 
                    ? 'border border-primary text-primary hover:bg-primary hover:text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border-none'
                }`}
              >
                {loadingMatches ? 'Sedang Mencocokkan...' : 'Mulai Pencocokan AI'}
              </button>
            </div>

            {/* Jika sudah ada hasil Matchmaking */}
            {matchingMatches && (
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="font-label-md text-label-md text-secondary tracking-widest uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">stars</span>
                  Rekomendasi Terbaik
                </h3>
                <div className="flex flex-col gap-3">
                  {matchingMatches.map((m, i) => {
                    const avatarUrl = m.avatar || null;
                    return (
                      <div key={i} className="bg-white border-2 border-primary/20 rounded-[14px] p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {avatarUrl ? (
                              <img alt={m.name} className="w-12 h-12 rounded-full object-cover" src={avatarUrl} />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                                {m.name ? m.name.substring(0, 2).toUpperCase() : 'US'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold">{m.name || 'Peserta'}</p>
                              <div className="bg-[#FFF0EE] text-[#B83020] text-xs px-2 py-0.5 rounded-full w-fit mt-1">
                                {m.score}% Match
                              </div>
                            </div>
                          </div>
                          <button onClick={() => navigate('/user/chat', { state: { targetUserId: m.id_user, targetUserName: m.name } })} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">
                            <span className="material-symbols-outlined text-sm">chat</span>
                          </button>
                        </div>
                        <p className="text-sm text-secondary bg-surface-container-lowest p-2 rounded-lg italic">"{m.reason}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Daftar Peserta Preview */}
            <div className="flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-secondary tracking-widest uppercase">Daftar Semua Peserta</h3>
              <div className="flex flex-col gap-2">
                {otherAttendees.length > 0 ? (
                  otherAttendees.slice(0, 5).map((p, i) => {
                    const avatarUrl = p.profile_picture_url || null;
                    return (
                      <div key={i} onClick={() => navigate('/user/chat', { state: { targetUserId: p.id_user, targetUserName: p.user_name } })} className="bg-white border border-[#EBEBEB] rounded-[14px] p-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img alt={p.user_name} className="w-10 h-10 rounded-full object-cover" src={avatarUrl} />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                              {p.user_name ? p.user_name.substring(0, 2).toUpperCase() : 'US'}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <p className="font-body-md text-body-md font-bold">{p.user_name || 'Peserta'}</p>
                            <p className="font-caption text-caption text-secondary">{p.vibe_bio ? p.vibe_bio.substring(0, 40) + (p.vibe_bio.length > 40 ? '...' : '') : 'Belum mengisi bio'}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">chat</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-secondary text-sm">Belum ada peserta lain yang terdaftar.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-outline-variant px-6 py-3 flex justify-around items-center z-50">
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate('/events')}>
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px]">Explore</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigate('/user/tickets')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
          <span className="text-[10px] font-bold">Tickets</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate('/user/chat')}>
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px]">Chat</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate('/user/profile')}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Profile</span>
        </div>
      </div>

      <MatchmakingLoader 
        isOpen={isMatching} 
        onCancel={() => setIsMatching(false)} 
        matches={matchingMatches}
      />
      <VibeBioForm 
        isOpen={isVibeBioOpen} 
        onClose={() => setIsVibeBioOpen(false)}
        onSave={() => {
          setIsVibeBioOpen(false);
          setLoading(true);
          import('../../lib/api').then(({ default: api }) => {
            api.get(`/tickets/${id}`).then(res => {
              setAttendeeData(res.data.data.my_attendee);
              setLoading(false);
            });
          });
        }} 
        ticketId={id}
        initialData={attendeeData}
      />
    </div>
  );
}
