import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-tagqO0YtUtBkIEIA';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const extractCoordinates = (iframeString) => {
    if (!iframeString) return null;
    const lonMatch = iframeString.match(/!2d(-?\d+\.\d+)/);
    const latMatch = iframeString.match(/!3d(-?\d+\.\d+)/);
    if (lonMatch && latMatch) {
      return { longitude: parseFloat(lonMatch[1]), latitude: parseFloat(latMatch[1]) };
    }
    return null;
  };
  const { user, checkAuth } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [takenSeats, setTakenSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flow State
  const [selectedTier, setSelectedTier] = useState(null);
  
  // Modals
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState('');

  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [answers, setAnswers] = useState({});

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '', data: null });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        setEvent(res.data.data.event || res.data.data);
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
    
    return () => stopCamera();
  }, [id]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Akses kamera ditolak. Verifikasi wajah diperlukan untuk membeli tiket.");
      setShowKycModal(false);
    }
  };

  const checkKycNeeded = () => {
    if (!user) {
      alert("Silakan Masuk/Login terlebih dahulu untuk membeli tiket.");
      navigate('/login');
      return true;
    }
    if (!user.profile_picture_url || !user.face_verified_at) return true;
    
    const lastVerified = new Date(user.face_verified_at);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastVerified < threeMonthsAgo;
  };

  const handleBuyClick = (tier) => {
    if (hasPurchased) return;
    if (!tier.is_unlimited && tier.remaining_seats <= 0) return;

    setSelectedTier(tier);

    if (checkKycNeeded()) {
      setShowKycModal(true);
      startCamera();
      return;
    }
    proceedAfterKyc();
  };

  const proceedAfterKyc = () => {
    if (event.seat_assignment === 'pilih' && event.seat_numbers?.length > 0) {
      setShowSeatModal(true);
    } else {
      proceedAfterSeat();
    }
  };

  const proceedAfterSeat = () => {
    if (event.custom_questions && event.custom_questions.length > 0) {
      setShowQuestionsModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setKycLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Calculate the center square of the video to prevent black bars
    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    // Draw only the cropped center square onto the 400x400 canvas
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    
    const base64 = canvas.toDataURL('image/jpeg');
    stopCamera();

    try {
      await api.post('/account/face-capture', { image: base64 });
      await checkAuth(); 
      setShowKycModal(false);
      proceedAfterKyc();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan verifikasi wajah.");
      startCamera();
    } finally {
      setKycLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setShowQuestionsModal(false);
    try {
      const payload = { event_id: event.id || event.id_event, tier_id: selectedTier.id_tier || selectedTier.id };
      if (event.seat_assignment === 'pilih' && selectedSeat) {
        payload.seat_number = selectedSeat;
      }
      
      const res = await api.post('/checkout', payload);
      const snapToken = res.data.data?.snap_token;
      
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => navigate('/my-tickets'),
          onPending: () => navigate('/my-tickets'),
          onError: () => setErrorModal({ show: true, message: 'Pembayaran gagal!' }),
          onClose: () => {},
        });
      } else {
        // Direct success via wallet
        navigate('/my-tickets');
      }
    } catch (err) { 
      const data = err.response?.data;
      const errMsg = data?.message || 'Gagal memproses pembelian';
      setErrorModal({ show: true, message: errMsg, data: data });
    } finally { 
      setCheckoutLoading(false); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );
  if (!event) return null;

  const bannerSrc = event.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200';
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':'); return `${h}:${m} WIB`; };
  const formatRp = (n) => n == 0 ? 'Free' : 'Rp ' + Number(n).toLocaleString('id-ID');

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="w-full relative aspect-video md:aspect-[21/9] lg:aspect-[3/1] bg-surface-variant overflow-hidden">
        <img className="w-full h-full object-cover" src={bannerSrc} alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info & Details */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#FFF0EE] text-[#B83020] px-3 py-1 rounded-[10px] font-label-md text-[11px] uppercase tracking-wider">
                  {event.category || 'Event'}
                </span>
              </div>
              <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-on-surface">{event.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-on-surface-variant py-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span className="font-body-md">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span className="font-body-md">{event.location_type === 'online' ? 'Online Event' : (event.city || 'Indonesia')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  <span className="font-body-md">{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-[#EBEBEB] rounded-[14px] p-6 flex flex-col gap-4">
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">Tentang Event</h2>
              <div className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-headline-sm text-lg font-bold text-on-surface px-1">Lokasi</h2>
              <div className="w-full h-[320px] bg-[#1a1a1a] border border-[#EBEBEB] rounded-[14px] overflow-hidden relative group">
                {(() => {
                  if (event.location_type === 'online') {
                    return (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-secondary">
                        <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">public</span>
                        <p className="font-body-sm">Acara diselenggarakan secara Online</p>
                      </div>
                    );
                  }
                  
                  const coords = extractCoordinates(event.maps_link) || { longitude: 106.8016, latitude: -6.2183 }; // Fallback Gelora Bung Karno
                  
                  return (
                    <Map
                      initialViewState={{
                        longitude: coords.longitude,
                        latitude: coords.latitude,
                        zoom: 14
                      }}
                      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                      interactive={true}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <NavigationControl position="bottom-right" />
                      <Marker longitude={coords.longitude} latitude={coords.latitude} anchor="bottom">
                        <div className="relative flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 group-marker">
                          <div className="absolute w-8 h-8 bg-[#F04E37]/30 rounded-full animate-ping"></div>
                          <div className="relative w-4 h-4 bg-[#F04E37] border-2 border-[#1a1a1a] rounded-full shadow-[0_0_15px_rgba(240,78,55,0.8)]"></div>
                          
                          {/* Sleek Tooltip */}
                          <div className="absolute bottom-full mb-3 bg-[#1e1e1e] border border-white/10 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            {event.location_details || event.city || 'Lokasi Event'}
                            <div className="text-[10px] font-normal text-white/50 mt-0.5">{event.city || 'Indonesia'}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1e1e]"></div>
                          </div>
                        </div>
                      </Marker>
                    </Map>
                  );
                })()}

                {event.location_type !== 'online' && (
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="bg-[#1e1e1e]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                      <span className="font-caption text-white text-[10px] font-bold tracking-widest opacity-80">MAPCN.DEV</span>
                    </div>
                  </div>
                )}
                
                {event.maps_link && (
                  <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
                    <a 
                      href={
                        (() => {
                          const c = extractCoordinates(event.maps_link);
                          if (c) return `https://www.google.com/maps?q=${c.latitude},${c.longitude}`;
                          return event.maps_link.match(/src="([^"]+)"/)?.[1] || '#';
                        })()
                      } 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-[14px] border border-[#EBEBEB] flex items-center gap-2 transition-colors cursor-pointer shadow-lg text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[#F04E37] text-[18px]">directions</span>
                      <span className="font-label-md text-sm font-bold">Buka di Maps</span>
                    </a>
                  </div>
                )}
              </div>
              <p className="text-on-surface-variant font-body-md px-1">{event.location_type === 'online' ? 'Tautan akan diberikan di E-Ticket' : event.location_details}</p>
            </div>
          </div>

          {/* Right Column: Tiers */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-4">
              <h2 className="font-headline-sm text-lg font-bold text-on-surface px-1">Pilih Tiket</h2>
              
              {(event.ticket_tiers || []).map(tier => {
                const isSoldOut = !tier.is_unlimited && tier.remaining_seats <= 0;
                const isVip = tier.tier_name?.toLowerCase().includes('vip');

                return (
                  <div key={tier.id_tier || tier.id} className={`bg-white border border-[#EBEBEB] rounded-[14px] p-4 flex flex-col gap-3 transition-all ${isSoldOut || hasPurchased ? 'opacity-70 bg-[#F5F5F7]' : 'hover:border-[#F04E37]/30'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-headline-sm text-base font-bold ${isSoldOut ? 'text-on-surface-variant' : 'text-on-surface'}`}>{tier.tier_name}</h3>
                        <p className={`font-caption text-xs ${isSoldOut ? 'line-through' : ''} text-on-surface-variant`}>
                          {isVip ? 'Akses VIP & Baris Depan' : 'Akses festival umum'}
                        </p>
                      </div>
                      {isSoldOut ? (
                        <span className="bg-[#EBEBEB] text-on-surface-variant px-2 py-0.5 rounded-[10px] font-label-md text-[10px]">SOLDOUT</span>
                      ) : (
                        <span className="bg-[#FFF0EE] text-[#B83020] px-2 py-0.5 rounded-[10px] font-label-md text-[10px]">TERSEDIA</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`font-headline-md text-xl font-bold ${isSoldOut ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                        {formatRp(tier.price)}
                      </span>
                      <button 
                        onClick={() => handleBuyClick(tier)}
                        disabled={isSoldOut || hasPurchased || checkoutLoading}
                        className={`px-6 py-2 rounded-[22px] font-label-md font-bold transition-all ${
                          hasPurchased ? 'bg-secondary text-white opacity-50 cursor-not-allowed' :
                          isSoldOut ? 'bg-secondary text-white opacity-50 cursor-not-allowed' : 
                          'bg-[#F04E37] text-white hover:opacity-90 active:scale-95'
                        }`}
                      >
                        {checkoutLoading && selectedTier?.id_tier === tier.id_tier ? 'Loading...' : hasPurchased ? 'Dimiliki' : isSoldOut ? 'Habis' : 'Beli Tiket'}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 p-4 rounded-xl bg-surface-container border border-outline-variant flex gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
                  Tiket bersifat digital dan akan langsung terbit di menu "My Tickets" setelah pembayaran berhasil diverifikasi secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. KYC Webcam Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center">
              <h2 className="font-headline-sm font-bold">Keamanan Identitas (KYC)</h2>
              <button onClick={() => { setShowKycModal(false); stopCamera(); }} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <p className="text-sm text-center text-secondary mb-2">Sebagai pengguna baru atau pembaruan 3 bulan, kami mewajibkan scan wajah Anda untuk anti-calo dan keamanan tiket.</p>
              <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-[6px] border-[#F04E37] shadow-inner bg-black flex items-center justify-center">
                {!cameraStream && !kycLoading && <span className="text-white text-xs">Memuat kamera...</span>}
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                <canvas ref={canvasRef} width="400" height="400" className="hidden" />
              </div>
              <button 
                onClick={captureFace} 
                disabled={kycLoading || !cameraStream}
                className="w-full mt-4 bg-[#F04E37] text-white py-3 rounded-[22px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                {kycLoading ? 'Memproses Wajah...' : 'Ambil Foto & Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Seat Selection Modal */}
      {showSeatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[20px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center">
              <h2 className="font-headline-sm font-bold">Pilih Kursi</h2>
              <button onClick={() => setShowSeatModal(false)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-secondary">Silakan pilih nomor kursi yang tersedia.</p>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-4 border border-[#EBEBEB] rounded-[14px] bg-[#F5F5F7]">
                {(event.seat_numbers || []).map((seat) => {
                  const isTaken = takenSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      disabled={isTaken}
                      onClick={() => setSelectedSeat(seat)}
                      className={`px-4 py-2 border rounded-lg text-sm font-bold transition-all ${
                        isTaken 
                          ? 'bg-[#EBEBEB] text-on-surface-variant cursor-not-allowed opacity-50' 
                          : selectedSeat === seat 
                            ? 'bg-[#F04E37] text-white border-[#F04E37] shadow-md' 
                            : 'bg-white border-[#EBEBEB] hover:border-[#F04E37] hover:text-[#F04E37]'
                      }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowSeatModal(false)} className="flex-1 py-3 border border-[#EBEBEB] text-on-surface rounded-[22px] font-bold">Batal</button>
                <button 
                  onClick={() => { setShowSeatModal(false); proceedAfterSeat(); }} 
                  disabled={!selectedSeat}
                  className="flex-1 py-3 bg-[#F04E37] text-white rounded-[22px] font-bold disabled:opacity-50"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Questions Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center">
              <h2 className="font-headline-sm font-bold">Pertanyaan Tambahan</h2>
              <button onClick={() => setShowQuestionsModal(false)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {event.custom_questions.map((q, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface">{q}</label>
                  <input 
                    type="text" 
                    value={answers[idx] || ''}
                    onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                    placeholder="Jawaban Anda..."
                    className="w-full px-4 py-2 border border-[#EBEBEB] rounded-[10px] focus:outline-none focus:border-[#F04E37]"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowQuestionsModal(false)} className="flex-1 py-3 border border-[#EBEBEB] text-on-surface rounded-[22px] font-bold">Batal</button>
                <button 
                  onClick={() => { setShowQuestionsModal(false); setShowConfirmModal(true); }} 
                  className="flex-1 py-3 bg-[#F04E37] text-white rounded-[22px] font-bold flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Error / Insufficient Balance Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden flex flex-col items-center text-center p-8 transition-transform duration-300 transform scale-100"
            style={{ animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <style>{`
              @keyframes popIn {
                0% { opacity: 0; transform: scale(0.9); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>

            {errorModal.data?.status === 'insufficient_balance' ? (
              <>
                <div className="w-20 h-20 bg-[#FFF0EE] text-[#F04E37] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-[40px]">account_balance_wallet</span>
                </div>
                <h2 className="font-headline-sm font-bold text-on-surface mb-2 text-xl">Saldo Tidak Cukup</h2>
                <p className="text-on-surface-variant font-body-md mb-6 text-sm">
                  {errorModal.message}
                </p>
                <div className="w-full bg-[#F5F5F7] rounded-xl p-4 mb-6 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-on-surface-variant">Saldo Saat Ini:</span>
                    <span className="text-sm font-bold text-on-surface">{formatRp(errorModal.data.current_balance)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-on-surface-variant">Harga Tiket:</span>
                    <span className="text-sm font-bold text-on-surface">{formatRp(errorModal.data.required_amount)}</span>
                  </div>
                  <div className="h-px w-full bg-[#EBEBEB] my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#F04E37] font-bold">Kekurangan:</span>
                    <span className="text-sm font-bold text-[#F04E37]">{formatRp(errorModal.data.required_amount - errorModal.data.current_balance)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#FFF0EE] text-[#F04E37] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-[40px]">error</span>
                </div>
                <h2 className="font-headline-sm font-bold text-on-surface mb-2 text-xl">Transaksi Gagal</h2>
                <p className="text-on-surface-variant font-body-md mb-8">
                  {errorModal.message}
                </p>
              </>
            )}

            <div className="w-full flex flex-col gap-3">
              {(errorModal.data?.status === 'insufficient_balance' || errorModal.message.toLowerCase().includes('saldo') || errorModal.message.toLowerCase().includes('balance')) ? (
                <button 
                  onClick={() => navigate('/wallet')} 
                  className="w-full py-3 bg-[#F04E37] text-white rounded-[22px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">add_card</span>
                  Isi Saldo Wallet
                </button>
              ) : null}
              <button 
                onClick={() => setErrorModal({ show: false, message: '', data: null })} 
                className="w-full py-3 bg-[#F5F5F7] text-on-surface rounded-[22px] font-bold hover:bg-[#EBEBEB] active:scale-95 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden flex flex-col items-center text-center p-8 transition-transform duration-300 transform scale-100"
            style={{ animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="w-20 h-20 bg-[#FFF0EE] text-[#F04E37] rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-[40px]">confirmation_number</span>
            </div>
            <h2 className="font-headline-sm font-bold text-on-surface mb-2 text-xl">Konfirmasi Pembelian</h2>
            <p className="text-on-surface-variant font-body-md mb-8">
              Anda akan membeli tiket <strong>{selectedTier?.tier_name}</strong> seharga <strong>{formatRp(selectedTier?.price)}</strong>. Saldo wallet Anda akan terpotong secara otomatis. Lanjutkan?
            </p>
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="flex-1 py-3 bg-[#F5F5F7] text-on-surface rounded-[22px] font-bold hover:bg-[#EBEBEB] active:scale-95 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={() => { setShowConfirmModal(false); handleCheckout(); }} 
                className="flex-1 py-3 bg-[#F04E37] text-white rounded-[22px] font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Ya, Beli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
