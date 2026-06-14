import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import { Html5Qrcode } from 'html5-qrcode';
import dayjs from 'dayjs';

export default function AdminScannerPage() {
  const { user, logout } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualTicketId, setManualTicketId] = useState('');
  const scannerRef = useRef(null);

  // Recent activity mock or state
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/events')
      .then(res => {
        const activeEvents = res.data.data.filter(e => e.status === 'active');
        setEvents(activeEvents);
        if (activeEvents.length > 0) setSelectedEventId(activeEvents[0].id_event);
      })
      .catch(console.error);
  }, []);

  const handleScan = async (qrCode) => {
    try {
      const res = await api.post('/admin/scanner/verify', { order_id: qrCode });
      
      if (res.data.success) {
        const data = res.data.data;
        setScanResult({ type: 'success', data });
        addLog({ name: data.holder_name || 'Guest', status: 'Approved', type: 'success' });
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
            await handleScan(decodedText);
            stopScanner();
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

  const handleManualEntry = (e) => {
    e.preventDefault();
    if (!selectedEventId) { alert('Pilih event terlebih dahulu'); return; }
    if (!manualTicketId) return;
    handleScan(manualTicketId);
    setManualTicketId('');
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

      {/* Side Navigation (Desktop) */}
      <aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-body-sm text-body-sm">Dashboard</span>
          </Link>
          <Link to="/admin/events" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">event</span>
            <span className="font-body-sm text-body-sm">Event Saya</span>
          </Link>
          <Link to="/admin/scanner" className="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer">
            <span className="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span className="font-body-sm text-body-sm">Scanner</span>
          </Link>
          <Link to="/admin/finance" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">payments</span>
            <span className="font-body-sm text-body-sm">Keuangan</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">settings</span>
            <span className="font-body-sm text-body-sm">Pengaturan</span>
          </Link>
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <a className="flex items-center py-3 text-secondary hover:text-on-surface transition-colors cursor-pointer" href="#">
            <span className="material-symbols-outlined mr-3">help</span>
            <span className="font-body-sm text-body-sm">Bantuan</span>
          </a>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center">
              {user?.profile_picture ? (
                <img alt="Organizer Profile" className="w-8 h-8 rounded-full object-cover bg-surface-container-high" src={`http://localhost:8000/Media/uploads/${user.profile_picture}`}/>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {(user?.full_name || 'O').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-2 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate">{user?.full_name || 'Organizer'}</p>
                <p className="font-caption text-caption text-secondary">ID: SG-{user?.id_user || '1'}</p>
              </div>
            </div>
            <button onClick={logout} className="text-primary active:opacity-70 mt-1">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Top App Bar */}
      <header className="flex justify-between items-center h-16 px-gutter fixed top-0 left-0 right-0 md:ml-sidebar-width bg-surface border-b border-outline-variant z-30">
        <div className="flex items-center gap-4">
          <h1 className="font-h3 text-[24px] font-black text-primary md:hidden tracking-tight">GateMate</h1>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant focus-within:border-primary transition-all w-80">
            <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-full ml-2" placeholder="Cari tiket, nama, atau ID..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:bg-surface-container-low rounded-full p-2 text-secondary transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
          <span className="font-label-md text-label-md text-secondary hidden md:block">
            {dayjs ? dayjs().locale('id').format('dddd, DD MMM YYYY') : new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-16 md:ml-sidebar-width min-h-screen pb-24 md:pb-0">
        <div className="max-w-[1200px] mx-auto p-6 md:p-6">
          <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-h1 text-[32px] leading-10 font-medium text-on-surface tracking-tight">Pemindaian Tiket</h2>
              <p className="font-body-lg text-[15px] text-secondary mt-1">Arahkan kamera ke QR code tiket atau masukkan ID secara manual.</p>
            </div>
            
            <div className="md:w-64">
              <label className="block text-caption font-bold text-secondary mb-1 uppercase tracking-wider">Event Aktif</label>
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
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={{borderWidth: '0.5px'}}>
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">videocam</span>
                    <span className="font-label-md font-bold">Kamera Scanner</span>
                  </div>
                  {isScanning && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      <span className="font-caption uppercase tracking-wider font-bold text-primary">Live</span>
                    </div>
                  )}
                </div>
                
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {!isScanning ? (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-surface-container-lowest z-10">
                      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-4">
                        <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
                      </div>
                      <button onClick={startScanner} className="bg-primary text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                        Aktifkan Kamera
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black flex items-center justify-center">
                        <div id="reader" className="w-full h-full"></div>
                      </div>
                      <div className="scanner-viewport absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-20 pointer-events-none">
                        <div className="scanner-line"></div>
                      </div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                        <p className="text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full font-label-md text-[12px]">Posisikan QR Code di tengah</p>
                        <button onClick={stopScanner} className="bg-error text-white p-2 rounded-full hover:bg-error/80 backdrop-blur-md">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Manual Entry Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6" style={{borderWidth: '0.5px'}}>
                <label className="font-label-md font-bold text-on-surface mb-2 block">Input Manual ID Tiket</label>
                <form onSubmit={handleManualEntry} className="flex gap-3">
                  <input 
                    className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all text-body-sm" 
                    placeholder="Contoh: SG-99283-AX" 
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
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant h-full overflow-hidden flex flex-col" style={{borderWidth: '0.5px'}}>
                <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                  <h3 className="font-label-md font-bold text-on-surface">Hasil Pemindaian</h3>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  {!scanResult ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50">
                      <span className="material-symbols-outlined text-[64px] mb-4">document_scanner</span>
                      <p className="text-body-lg font-medium">Menunggu hasil scan...</p>
                    </div>
                  ) : scanResult.type === 'success' ? (
                    <>
                      {/* Attendee Profile */}
                      <div className="flex flex-col items-center mb-6 animate-in zoom-in duration-300">
                        <div className="relative mb-4">
                          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary bg-surface-container flex items-center justify-center text-primary text-[48px] font-bold">
                            {(scanResult.data.buyer_name || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-[#2E7D32] text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest">
                            <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                          </div>
                        </div>
                        <h2 className="text-[24px] text-on-surface font-black leading-8">{scanResult.data.buyer_name}</h2>
                        <div className="mt-2 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                          <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                          <span className="text-[11px] font-bold uppercase tracking-wider">{scanResult.data.tier_name}</span>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                          <span className="text-[12px] font-medium text-secondary">ID Transaksi</span>
                          <span className="text-[12px] font-bold text-on-surface">{scanResult.data.transaction_id || '#'}</span>
                        </div>
                        
                        {/* Status Check */}
                        <div className="bg-surface-container-low p-4 rounded-lg border-[0.5px] border-outline-variant">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-[#2E7D32]">
                              <span className="material-symbols-outlined">verified_user</span>
                              <span className="text-[12px] font-bold">Tiket Valid</span>
                            </div>
                            <span className="text-[11px] font-black text-tertiary">Verified</span>
                          </div>
                          <p className="text-[11px] text-secondary">Check-in berhasil. Sistem telah mencatat kehadiran peserta pada event ini.</p>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button onClick={() => setScanResult(null)} className="w-full bg-primary text-white py-4 rounded-xl text-[20px] font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                          Scan Berikutnya
                        </button>
                      </div>
                    </>
                  ) : scanResult.type === 'error' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in">
                      <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6 border border-error">
                        <span className="material-symbols-outlined text-[48px] text-error">cancel</span>
                      </div>
                      <h3 className="font-h2 text-[28px] font-black text-error mb-2">Tiket Ditolak</h3>
                      <p className="text-body-lg text-secondary max-w-md">{scanResult.message}</p>
                      
                      {scanResult.details && (
                        <div className="mt-4 bg-surface-container rounded-lg p-3 border border-outline-variant inline-block">
                          <p className="text-body-sm font-bold text-on-surface-variant flex items-center gap-2">
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
          <div className="mt-8">
            <h3 className="font-h3 text-h3 text-on-surface mb-4">Aktivitas Terkini</h3>
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
                    <div className="overflow-hidden">
                      <p className="font-label-md text-label-md font-bold truncate">{log.name}</p>
                      <p className="font-caption text-caption text-secondary">{log.status} • {timeAgo(log.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
        <Link to="/admin/dashboard" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link to="/admin/events" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label-md text-label-md">Events</span>
        </Link>
        <Link to="/admin/scanner" className="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors">
          <div className="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined">center_focus_weak</span>
          </div>
          <span className="font-label-md text-label-md mt-1">Scan</span>
        </Link>
        <Link to="/admin/finance" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-md text-label-md">Finance</span>
        </Link>
      </nav>
    </div>
  );
}
