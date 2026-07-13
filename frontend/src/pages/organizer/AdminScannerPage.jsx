import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import OrganizerSidebar from '../../components/OrganizerSidebar';
import { Html5Qrcode } from 'html5-qrcode';
import dayjs from 'dayjs';

export default function AdminScannerPage() {
  const { user, logout } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [manualTicketId, setManualTicketId] = useState('');
  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  // Recent activity mock or state
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchScannerEvents = async () => {
      try {
        const res = await api.get('/admin/events', { params: { status: 'active' } });
        if (res.data?.data) {
          setEvents(res.data.data);
          return;
        }
      } catch (err) {
        console.warn('Gagal memuat event untuk scanner dari API, menggunakan fallback.', err.message);
      }
      setEvents([]);
    };
    fetchScannerEvents();
  }, []);

  const handleScan = async (qrCode) => {
    try {
      const res = await api.post('/admin/scanner/verify', { order_id: qrCode });
      
      if (res.data.success) {
        const data = res.data.data;
        // Data diverifikasi tapi belum di-approve (2-step)
        setScanResult({ type: 'pending_approval', data });
      } else {
        const message = res.data.message || 'Tiket tidak valid';
        setScanResult({ type: 'error', message, details: res.data.scanned_at ? `Di-scan pada: ${res.data.scanned_at}` : '' });
        addLog({ name: qrCode || 'Manual ID', status: 'Denied', type: 'error' });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Terjadi kesalahan sistem / rute tidak ditemukan';
      setScanResult({ type: 'error', message });
      addLog({ name: qrCode || 'Manual ID', status: 'Error', type: 'error' });
    }
  };

  const handleApprove = async () => {
    if (!scanResult || scanResult.type !== 'pending_approval') return;
    setIsApproving(true);
    try {
      const res = await api.post('/admin/scanner/approve', { order_id: scanResult.data.order_id });
      if (res.data.success) {
        setScanResult(prev => ({ type: 'success', data: { ...prev.data, scanned_at: res.data.scanned_at } }));
        addLog({ name: scanResult.data.holder_name || 'Guest', status: 'Checked In', type: 'success' });
      } else {
        setScanResult({ type: 'error', message: res.data.message });
      }
    } catch (err) {
      setScanResult({ type: 'error', message: err.response?.data?.message || 'Gagal approve check-in' });
    } finally {
      setIsApproving(false);
    }
  };

  const addLog = (log) => {
    setRecentLogs(prev => [{ ...log, time: new Date() }, ...prev].slice(0, 4));
  };

  const startScanner = async () => {
    if (!selectedEventId) {
      alert('Pilih event terlebih dahulu');
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);

    // Gunakan setTimeout agar React sempat merender <div id="reader"> terlebih dahulu
    setTimeout(async () => {
      try {
        scannerRef.current = new Html5Qrcode("reader");
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10 },
          async (decodedText) => {
            if (processingRef.current) return;
            processingRef.current = true;
            
            // Hentikan scanner terlebih dahulu sebelum proses API agar tidak double-request
            stopScanner();
            await handleScan(decodedText);
            
            processingRef.current = false;
          },
          (error) => {}
        );
      } catch (err) {
        console.error(err);
        setIsScanning(false);
        alert('Gagal mengakses kamera: ' + (err?.message || err));
      }
    }, 150);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
        setIsScanning(false);
      }).catch(console.error);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    if (!selectedEventId) { alert('Pilih event terlebih dahulu'); return; }
    if (!manualTicketId) return;
    
    if (processingRef.current) return;
    processingRef.current = true;
    
    await handleScan(manualTicketId);
    setManualTicketId('');
    
    processingRef.current = false;
  };

  const timeAgo = (date) => {
    const minutes = Math.floor((new Date() - date) / 60000);
    return minutes < 1 ? 'Just now' : `${minutes}m ago`;
  };

  return (
    <div className="bg-surface text-on-surface font-body-sm min-h-screen" style={{ fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .scanner-viewport::before {
            content: "";
            position: absolute;
            inset: 0;
            border: 2px solid transparent;
            background: linear-gradient(to right, #b22110 20px, transparent 20px) 0 0,
                        linear-gradient(to bottom, #b22110 20px, transparent 20px) 0 0,
                        linear-gradient(to left, #b22110 20px, transparent 20px) 100% 0,
                        linear-gradient(to bottom, #b22110 20px, transparent 20px) 100% 0,
                        linear-gradient(to right, #b22110 20px, transparent 20px) 0 100%,
                        linear-gradient(to top, #b22110 20px, transparent 20px) 0 100%,
                        linear-gradient(to left, #b22110 20px, transparent 20px) 100% 100%,
                        linear-gradient(to top, #b22110 20px, transparent 20px) 100% 100%;
            background-repeat: no-repeat;
            background-size: 40px 40px;
            z-index: 10;
        }
        .scanner-line {
            height: 2px;
            background: linear-gradient(to right, transparent, #b22110, transparent);
            position: absolute;
            width: 100%;
            top: 0;
            animation: scan 3s ease-in-out infinite;
            z-index: 5;
        }
        @keyframes scan {
            0%, 100% { top: 10%; }
            50% { top: 90%; }
        }
        #reader { width: 100% !important; height: 100% !important; border: none !important; }
        #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
      `}} />
      <OrganizerSidebar activeNav="scanner" />

      {/* Main Content Area */}
      <main className="md:ml-[240px] min-h-screen pt-16 md:pt-0 pb-24 md:pb-0 relative flex-1"> <div className="p-6 md:p-8 w-full">
          <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-h1 text-[32px] leading-10 font-medium text-on-surface tracking-tight">Pemindaian Tiket</h2> <p className="font-body-lg text-[15px] text-secondary mt-1">Arahkan kamera ke QR code tiket atau masukkan ID secara manual.</p>
            </div>
            
            <div className="md:w-64"> <label className="block text-caption font-bold text-secondary mb-1 uppercase tracking-wider">Event Aktif</label>
              <select 
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary"
              >
                <option value="">Pilih Event</option>
                {events.map(ev => <option key={ev.id_event} value={ev.id_event}>{ev.title}</option>)}
              </select>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scanner Interface Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Camera Viewfinder Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={{borderWidth: '0.5px'}}> <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <div className="flex items-center gap-2"> <span className="material-symbols-outlined text-primary">videocam</span>
                    <span className="font-label-md font-bold">Kamera Scanner</span>
                  </div>
                  {isScanning && (
                    <div className="flex items-center gap-2"> <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      <span className="font-caption uppercase tracking-wider font-bold text-primary">Live</span>
                    </div>
                  )}
                </div>
                
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {!isScanning ? (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-surface-container-lowest z-10"> <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-4">
                        <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
                      </div>
                      <button onClick={startScanner} className="bg-primary text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                        Aktifkan Kamera
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black flex items-center justify-center"> <div id="reader" className="w-full h-full"></div>
                      </div>
                      <div className="scanner-viewport absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-20 pointer-events-none"> <div className="scanner-line"></div>
                      </div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3"> <p className="text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full font-label-md text-[12px]">Posisikan QR Code di tengah</p>
                        <button onClick={stopScanner} className="bg-error text-white p-2 rounded-full hover:bg-error/80 backdrop-blur-md"> <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Manual Entry Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6" style={{borderWidth: '0.5px'}}> <label className="font-label-md font-bold text-on-surface mb-2 block">Input Manual ID Tiket</label>
                <form onSubmit={handleManualEntry} className="flex gap-3">
                  <input 
                    className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all text-body-sm" placeholder="Contoh: GM-99283-AX" 
                    type="text"
                    value={manualTicketId}
                    onChange={(e) => setManualTicketId(e.target.value)}
                  />
                  <button type="submit" className="bg-primary text-white font-label-md px-8 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all font-bold">
                    Verifikasi
                  </button>
                </form>
              </div>
            </div>

            {/* Results Panel Column */}
            <div className="lg:col-span-5"> <div className="bg-surface-container-lowest rounded-xl border border-outline-variant h-full overflow-hidden flex flex-col" style={{borderWidth: '0.5px'}}>
                <div className="p-4 border-b border-outline-variant bg-surface-container-low"> <h3 className="font-label-md font-bold text-on-surface">Hasil Pemindaian</h3>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  {!scanResult ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50"> <span className="material-symbols-outlined text-[64px] mb-4">document_scanner</span>
                      <p className="text-body-lg font-medium">Menunggu hasil scan...</p>
                    </div>
                  ) : (scanResult.type === 'pending_approval' || scanResult.type === 'success') ? (
                    <>
                      {/* Attendee Profile */}
                      <div className="flex flex-col items-center mb-6 animate-in zoom-in duration-300"> <div className="relative mb-4">
                          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary bg-surface-container flex items-center justify-center text-primary text-[48px] font-bold">
                            {scanResult.data.profile_picture_url ? (
                                <img src={scanResult.data.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                (scanResult.data.holder_name || 'G').charAt(0).toUpperCase()
                            )}
                          </div>
                          {scanResult.type === 'success' && (
                            <div className="absolute -bottom-2 -right-2 bg-[#2E7D32] text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest animate-bounce"> <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                            </div>
                          )}
                        </div>
                        <h2 className="text-[24px] text-on-surface font-black leading-8">{scanResult.data.holder_name}</h2> <div className="mt-2 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                          <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>stars</span> <span className="text-[11px] font-bold uppercase tracking-wider">{scanResult.data.tier_name}</span>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="space-y-4 mb-6 flex-grow"> <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                          <span className="text-[12px] font-medium text-secondary">ID Transaksi</span> <span className="text-[12px] font-bold text-on-surface">{scanResult.data.order_id || '#'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-outline-variant"> <span className="text-[12px] font-medium text-secondary">Nomor Kursi</span>
                          <span className="text-[12px] font-bold text-on-surface">{scanResult.data.seat_number || 'Tidak ada kursi'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-outline-variant"> <span className="text-[12px] font-medium text-secondary">Jenis Kelamin</span>
                          <span className="text-[12px] font-bold text-on-surface capitalize">{scanResult.data.holder_gender || '—'}</span>
                        </div>
                        
                        {/* Status Check */}
                        {scanResult.type === 'success' ? (
                          <div className="bg-[#2E7D32]/10 p-4 rounded-lg border-[0.5px] border-[#2E7D32]/30 mt-4"> <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-[#2E7D32]"> <span className="material-symbols-outlined">verified_user</span>
                                <span className="text-[12px] font-bold">Check-in Berhasil</span>
                              </div>
                              <span className="text-[11px] font-black text-[#2E7D32]">Tervalidasi</span>
                            </div>
                            <p className="text-[11px] text-secondary">Peserta diperbolehkan masuk. Waktu scan: {scanResult.data.scanned_at}</p>
                          </div>
                        ) : (
                          <div className="bg-surface-container-low p-4 rounded-lg border-[0.5px] border-outline-variant mt-4"> <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-primary"> <span className="material-symbols-outlined">info</span>
                                <span className="text-[12px] font-bold">Tiket Valid</span>
                              </div>
                              <span className="text-[11px] font-black text-tertiary">Menunggu Konfirmasi</span>
                            </div>
                            <p className="text-[11px] text-secondary">Pastikan wajah peserta sesuai dengan foto profil di atas sebelum melakukan konfirmasi Check-In.</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        {scanResult.type === 'pending_approval' ? (
                          <>
                            <button 
                              onClick={handleApprove} 
                              disabled={isApproving}
                              className="w-full bg-[#2E7D32] text-white py-4 rounded-xl text-[18px] font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                            >
                              {isApproving ? 'Memproses...' : 'Konfirmasi Check-In'}
                            </button>
                            <button onClick={() => setScanResult(null)} className="w-full bg-surface-container-high text-on-surface py-3 rounded-xl text-[16px] font-bold hover:bg-surface-container-highest transition-colors">
                              Batalkan
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setScanResult(null)} className="w-full bg-primary text-white py-4 rounded-xl text-[20px] font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                            Scan Berikutnya
                          </button>
                        )}
                      </div>
                    </>
                  ) : scanResult.type === 'error' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in"> <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6 border border-error">
                        <span className="material-symbols-outlined text-[48px] text-error">cancel</span>
                      </div>
                      <h3 className="font-h2 text-[28px] font-black text-error mb-2">Tiket Ditolak</h3> <p className="text-body-lg text-secondary max-w-md">{scanResult.message}</p>
                      
                      {scanResult.details && (
                        <div className="mt-4 bg-surface-container rounded-lg p-3 border border-outline-variant inline-block"> <p className="text-body-sm font-bold text-on-surface-variant flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">info</span>
                            {scanResult.details}
                          </p>
                        </div>
                      )}
                      
                      <button onClick={() => setScanResult(null)} className="mt-8 bg-surface-container-high text-on-surface px-8 py-3 rounded-lg font-bold hover:bg-surface-container-highest transition-colors w-full max-w-[200px]">
                        Scan Ulang
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Log (Asymmetric/Bento Style) */}
          <div className="mt-8"> <h3 className="font-h3 text-h3 text-on-surface mb-4">Aktivitas Terkini</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {recentLogs.length === 0 ? (
                <div className="col-span-full py-8 text-center text-secondary border border-dashed border-outline-variant rounded-xl">
                  Belum ada log pemindaian saat ini.
                </div>
              ) : (
                recentLogs.map((log, i) => (
                  <div key={i} className="bg-surface-container-lowest border-[0.5px] border-outline-variant p-4 rounded-xl flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className="material-symbols-outlined text-[20px]">{log.type === 'success' ? 'check' : 'close'}</span>
                    </div>
                    <div className="overflow-hidden"> <p className="font-label-md text-label-md font-bold truncate">{log.name}</p>
                      <p className="font-caption text-caption text-secondary">{log.status} • {timeAgo(log.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
