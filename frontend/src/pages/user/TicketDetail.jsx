import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MatchmakingLoader from '../../components/modals/MatchmakingLoader';
import VibeBioForm from '../../components/modals/VibeBioForm';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: Ganti dengan fetch dari API → ticketService.getById(id)
  // useEffect(() => { ticketService.getById(id).then(res => setTicket(res.data.data)) }, [id])
  const [ticket, setTicket] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isVibeBioOpen, setIsVibeBioOpen] = useState(false);

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
  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      
      

      <main className="max-w-[1280px] mx-auto px-container-padding py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Ticket QR Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Event Header */}
            <div className="flex flex-col gap-1">
              <h1 className="font-headline-lg text-headline-lg md:text-headline-lg font-bold tracking-tight">{ticket.eventTitle}</h1>
              <div className="flex items-center gap-4 text-secondary">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="font-body-md text-body-md">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="font-body-md text-body-md">{ticket.eventLocation}</span>
                </div>
              </div>
            </div>
            
            {/* QR Ticket Card */}
            <div className={`bg-white border border-[#EBEBEB] rounded-[14px] p-8 flex flex-col items-center gap-6 shadow-sm ${isUsed ? 'opacity-80 grayscale-[0.3]' : ''}`}>
              {/* QR Placeholder / Real QR Image */}
              <div className="w-64 h-64 bg-white border-2 border-on-surface p-4 flex items-center justify-center relative">
                <div className="w-full h-full relative">
                  {ticket.qrCode ? (
                    <img src={ticket.qrCode} alt="QR Code" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      {/* Fallback QR Visual */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-1">
                        <div className="bg-on-surface"></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div><div></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div>
                        <div className="bg-on-surface"></div><div></div><div className="bg-on-surface"></div><div></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div>
                        <div className="bg-on-surface"></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div><div></div><div></div><div className="bg-on-surface"></div>
                        <div></div><div></div><div></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div>
                        <div className="bg-on-surface"></div><div></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div><div></div><div className="bg-on-surface"></div>
                        <div className="bg-on-surface"></div><div className="bg-on-surface"></div><div></div><div></div><div className="bg-on-surface"></div><div className="bg-on-surface"></div>
                      </div>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#271815 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                    </>
                  )}
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
              </div>
              
              <div className="text-center flex flex-col gap-2">
                <p className="font-label-md text-label-md text-secondary tracking-widest uppercase">TICKET ID</p>
                <p className="font-headline-sm text-headline-sm font-bold">{ticket.ticketCode || ticket.id}</p>
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
              <div className="mt-4 flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-3 rounded-xl w-full justify-center">
                <span className="material-symbols-outlined text-sm">{isUsed ? 'check_circle' : 'info'}</span>
                <p className="font-body-md text-body-md">{isUsed ? 'Tiket sudah digunakan pada ' + new Date(ticket.checkedInAt).toLocaleString('id-ID') : 'Tunjukkan QR ini ke panitia di pintu masuk'}</p>
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
                className="w-full bg-primary text-on-primary py-[10px] px-[22px] rounded-full font-body-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Isi Vibe Bio
              </button>
            </div>

            {/* AI Matchmaking Card */}
            <div className="bg-[#FFF0EE] border border-outline-variant rounded-[14px] p-card-padding flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm font-bold text-[#B83020]">AI Matchmaking</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">We've found 12 potential partners for your industry.</p>
              </div>
              <button 
                onClick={() => setIsMatching(true)}
                className="w-full border border-primary text-primary py-[10px] px-[22px] rounded-full font-body-md font-medium hover:bg-primary hover:text-white transition-all"
              >
                Mulai Pencocokan AI
              </button>
            </div>

            {/* Daftar Peserta Preview */}
            <div className="flex flex-col gap-4">
              <h3 className="font-label-md text-label-md text-secondary tracking-widest uppercase">Daftar Peserta</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Sarah Chen', role: 'Lead AI Architect at NeuraLink', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuy8Mgb-y-2mtPSKihZW4SLUn5uTCNkS9AqjYy8L0ViUnjWGb_9Oq4_RGaxVTRjGYNpuCb2tktQm_yjhb1Vai5SjGuCRlgJzP8O6v9AF_AL13KZW50X3N2Hf5_nVCekYWkaAzFpPegFbYDWORkn4NwdJ-U91oyflGrxiJ2dzBfd8m0x0arQ422gCCy-MpytgKQU-tsvNCc9bhNxyp5Z78IRB4YqzUlKQriu6PxTvf7AJCr0PySPRCBH7nceXcWS-vZYywRx4R4yCs' },
                  { name: 'Marcus Thorne', role: 'Venture Partner, Peak Capital', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDisOJq7N40c_etBWMPgGndDVCM5kvPWQ7EVTmPQ8hnsw3C2HvZZOC_l_nraVXCh6uH-iTLKG9fZjLhEIYFDCRuF3_e98nai0EUHOrc1m-CwRJzq6XrT_hDy8gKhsNjf0q_qGS17AdS9fmRyGcfR_4HhaW3RJu2GvxBASd32243LLeCVNRAFd7ufv1r-Mq8KBUciNjuGQIMV9wQQAdJfLNMGVSWkaC1Pyunv4-RHEUlrfjR-aon2Ql0Vn3d6xIZBZry87uDX5cRUJ0' },
                  { name: 'Elena Rodriguez', role: 'CTO, GreenFlow Systems', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCas5pli3hA_YquaJZkZE_Mvjm9HXsxhBCbYEzOfnSMVCha1U0-m42S7QQl6e5CLAwiEgyekJvGLqnzaJ81gWT8_zKFviDOewnHS5ptKwb2gbnvAZzfhxwFoQ02iC_Jg7sCkqgAyKGcUvhgu66Bun6EX0vfGU9un4KB1aKKMJNyrzcCiYd4fCzyxfe1lSFBuFC7pIBMv8sqSlCcncfmN08-9D0uq4DziqaBaDd1PIZBgY9mugdj-ALy7m9UwMkgZL9TpZP0F76vh1w' }
                ].map((p, i) => (
                  <div key={i} className="bg-white border border-[#EBEBEB] rounded-[14px] p-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <img alt={p.name} className="w-10 h-10 rounded-full object-cover" src={p.img} />
                      <div className="flex flex-col">
                        <p className="font-body-md text-body-md font-bold">{p.name}</p>
                        <p className="font-caption text-caption text-secondary">{p.role}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant pb-16 md:pb-0">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto gap-4">
          <div className="font-headline-sm text-headline-sm font-bold text-primary">GateMate</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Security Standards</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
          </div>
          <p className="font-caption text-caption text-on-surface-variant">© 2024 GateMate. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-outline-variant px-6 py-3 flex justify-around items-center z-50">
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate('/user/tickets')}>
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px]">Explore</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigate('/user/tickets')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
          <span className="text-[10px] font-bold">Tickets</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate(`/events/${id}/attendees`)}>
          <span className="material-symbols-outlined">hub</span>
          <span className="text-[10px]">Connect</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-secondary cursor-pointer" onClick={() => navigate('/user/profile')}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Profile</span>
        </div>
      </div>

      <MatchmakingLoader isOpen={isMatching} onCancel={() => setIsMatching(false)} />
      <VibeBioForm isOpen={isVibeBioOpen} onClose={() => setIsVibeBioOpen(false)} />
    </div>
  );
}
