import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-tagqO0YtUtBkIEIA';

export default function WalletPage() {
  const { user } = useAuthStore();
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('100000');
  const [topupLoading, setTopupLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [showScanModal, setShowScanModal] = useState(false);
  const [tenantIdInput, setTenantIdInput] = useState('');
  const [scanError, setScanError] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const CHIPS = [50000, 100000, 200000, 500000];

  useEffect(() => {
    fetchWallet();
    // Load Midtrans Snap
    if (!document.getElementById('midtrans-snap')) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      document.body.appendChild(script);
    }
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWalletData(res.data.data);
      setTransactions(res.data.data?.transactions || []);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const handleTopup = async () => {
    const amount = parseInt(topupAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 10000) { alert('Minimal top-up adalah Rp 10.000'); return; }
    setTopupLoading(true);
    try {
      const res = await api.post('/wallet/topup', { amount });
      const snapToken = res.data.data?.snap_token;
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => { setToast('Top-up berhasil!'); setShowTopup(false); fetchWallet(); },
          onPending: () => { setToast('Menunggu pembayaran...'); setShowTopup(false); },
          onError: () => alert('Pembayaran gagal!'),
          onClose: () => {},
        });
      }
    } catch (err) { alert(err.response?.data?.message || 'Gagal memproses top-up'); }
    finally { setTopupLoading(false); }
  };

  const handleQrSuccess = async (decodedText) => {
    try {
      const res = await api.get(`/wallet/tenant/${decodedText}`);
      setTenantInfo({ id: decodedText, ...res.data.data });
      setShowScanModal(false);
      setShowPaymentModal(true);
      setScanError('');
      setTenantIdInput('');
    } catch (err) {
      setScanError('Tenant tidak ditemukan atau ID salah.');
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!tenantIdInput) return;
    handleQrSuccess(tenantIdInput);
  };

  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode;
    
    if (showScanModal) {
      // Delay to ensure the DOM element is rendered
      setTimeout(() => {
        const qrElement = document.getElementById("qr-reader");
        if (qrElement && !scannerRef.current) {
          html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;

          html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              // On success
              html5QrCode.stop().then(() => {
                html5QrCode.clear();
                scannerRef.current = null;
                handleQrSuccess(decodedText);
              }).catch(console.error);
            },
            () => {} // Ignore empty frames
          ).catch((err) => {
            setScanError('Kamera tidak tersedia. Silakan masukkan ID manual.');
            console.error(err);
          });
        }
      }, 300);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch(console.error).finally(() => {
          scannerRef.current = null;
        });
      }
    };
  }, [showScanModal]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(paymentAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 1000) { alert('Minimal pembayaran adalah Rp 1.000'); return; }
    setPaymentLoading(true);
    try {
      const res = await api.post(`/wallet/pay/${tenantInfo.id}`, { amount });
      setToast(`Pembayaran Rp ${amount.toLocaleString('id-ID')} ke ${tenantInfo.full_name} berhasil!`);
      setShowPaymentModal(false);
      setPaymentAmount('');
      fetchWallet();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const TX_TYPE_LABEL = { topup: 'Top-up Saldo', ticket_refund: 'Refund Tiket', tenant_revenue: 'Pendapatan Tenant', payment: 'Pembayaran QR', withdrawal: 'Penarikan Dana', ticket_purchase: 'Pembayaran Tiket' };
  const isIncome = (type) => ['topup', 'ticket_refund', 'tenant_revenue'].includes(type);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '36px' }}>progress_activity</span>
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto">
      {toast && (
        <div className="mb-4 bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
          <span className="material-symbols-outlined">check_circle</span> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gap-default items-start">
        {/* Main Section */}
        <div className="lg:col-span-8 flex flex-col gap-gap-default">
          {/* Balance Card */}
          <div className="rounded-[22px] p-8 text-white relative overflow-hidden flex flex-col gap-6 shadow-sm" style={{ background: '#F04E37', boxShadow: '0 10px 30px -10px rgba(178,33,16,0.3)' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>account_balance_wallet</span>
            </div>
            <div className="z-10">
              <p className="font-label-md text-label-md opacity-80 uppercase tracking-wider mb-2">Total Saldo</p>
              <h1 className="font-headline-lg text-headline-lg font-bold">{formatRp(walletData?.wallet_balance)}</h1>
            </div>
            <div className="flex z-10">
              <button onClick={() => setShowTopup(true)} className="bg-white font-label-md text-label-md font-bold active:scale-95 transition-all hover:bg-surface-container-low" style={{ color: '#F04E37', padding: '10px 22px', borderRadius: '22px' }}>
                Top Up
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4">
            <button onClick={() => setShowTopup(true)} className="flex-1 flex items-center justify-center gap-2 font-label-md text-label-md font-bold hover:bg-surface-container-low transition-all active:scale-95" style={{ border: '1px solid #F04E37', color: '#F04E37', borderRadius: '22px', padding: '10px 22px' }}>
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Top Up
            </button>
            <button onClick={() => setShowScanModal(true)} className="flex-1 flex items-center justify-center gap-2 font-label-md text-label-md font-bold hover:bg-surface-container-low transition-all active:scale-95" style={{ border: '1px solid #F04E37', color: '#F04E37', borderRadius: '22px', padding: '10px 22px' }}>
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span> Scan QR / Bayar
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-surface-container-lowest rounded-[14px] border border-[#EBEBEB] p-6 flex flex-col gap-gap-tight">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Riwayat Transaksi</h3>
              <button className="text-primary font-label-md text-label-md hover:underline">Lihat Semua</button>
            </div>
            <div className="flex flex-col">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-secondary font-body-md">Belum ada riwayat transaksi.</div>
              ) : transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#EBEBEB] hover:bg-[#F9F9F9] transition-colors px-2 -mx-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome(tx.type) ? 'bg-[#E8F5E9]' : 'bg-surface-container-low'}`}>
                      <span className="material-symbols-outlined" style={{ color: isIncome(tx.type) ? '#2E7D32' : '#F04E37' }}>{isIncome(tx.type) ? 'north_east' : 'south_west'}</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg font-medium text-on-surface">{TX_TYPE_LABEL[tx.type] || tx.type}</p>
                      <p className="font-caption text-caption text-secondary">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body-lg text-body-lg font-bold" style={{ color: isIncome(tx.type) ? '#2E7D32' : '#F04E37' }}>
                      {isIncome(tx.type) ? '+' : '-'}{formatRp(tx.amount)}
                    </p>
                    <p className="font-caption text-caption text-secondary capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-gap-default">
          {/* Security Info */}
          <div className="rounded-[14px] p-4 border border-[#F9DCD7] flex gap-4" style={{ background: '#FFF0EE' }}>
            <span className="material-symbols-outlined" style={{ color: '#F04E37', fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
            <div>
              <p className="font-body-md text-body-md font-bold text-on-surface mb-1">Keamanan Terjamin</p>
              <p className="font-caption text-caption text-on-surface-variant">Transaksi dilindungi dengan enkripsi end-to-end dan otentikasi dua faktor.</p>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-surface-container-lowest rounded-[14px] border border-[#EBEBEB] p-6 flex flex-col gap-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Pengaturan Wallet</h3>
            {[{ icon: 'credit_card', label: 'Metode Pembayaran' }, { icon: 'lock', label: 'Ubah PIN Wallet' }, { icon: 'notifications', label: 'Notifikasi Transaksi' }].map(({ icon, label }) => (
              <button key={label} className="flex items-center justify-between w-full py-3 text-left hover:bg-[#F9F9F9] transition-colors rounded-lg px-2 -mx-2 group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">{icon}</span>
                  <span className="font-body-md text-body-md text-on-surface">{label}</span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[18px]">chevron_right</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Top Up Balance</h2>
              <button onClick={() => setShowTopup(false)} className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Enter Amount</div>
              <div className="flex items-center justify-center gap-2 border-b-2 border-outline-variant focus-within:border-primary transition-all pb-2 mb-8">
                <span className="text-headline-md font-bold text-on-surface-variant">Rp</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-[40px] font-bold text-on-surface w-full max-w-[280px] text-center p-0 outline-none"
                  value={Number(topupAmount.replace(/[^0-9]/g, '') || 0).toLocaleString('id-ID')}
                  onChange={(e) => setTopupAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  type="text"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {CHIPS.map(chip => (
                  <button key={chip} onClick={() => setTopupAmount(String(chip))}
                    className={`px-6 py-3 rounded-full border font-label-md text-label-md transition-all active:scale-95 ${topupAmount === String(chip) ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                    Rp {chip.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low border border-[#EBEBEB] rounded-[10px] mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-outline-variant p-1">
                    <img alt="Midtrans" className="w-full h-auto grayscale opacity-80" src="https://midtrans.com/assets/img/midtrans-logo.svg" />
                  </div>
                  <div>
                    <div className="font-headline-sm text-headline-sm">Midtrans</div>
                    <div className="font-caption text-caption text-on-surface-variant">Virtual Account, CC, E-wallet</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </div>
              <button onClick={handleTopup} disabled={topupLoading}
                className="w-full bg-[#F04E37] text-white py-4 rounded-full font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
                style={{ boxShadow: '0 10px 30px -10px rgba(178,33,16,0.3)' }}>
                {topupLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan QR Modal (Simulasi) */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${showScanModal ? '' : 'hidden'}`}>
        <div className="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
          <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Scan QR Tenant</h2>
            <button onClick={() => { setShowScanModal(false); setScanError(''); }} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="p-6 flex flex-col gap-6 items-center">
            <div id="qr-reader" className="w-full max-w-[280px] h-auto rounded-xl overflow-hidden shadow-sm border border-outline-variant relative min-h-[200px] flex items-center justify-center bg-surface-container-low">
              <span className="material-symbols-outlined text-secondary absolute z-0" style={{ fontSize: '48px' }}>qr_code_scanner</span>
            </div>
            <p className="text-secondary font-body-md text-center">
              Arahkan kamera ke QR Code Tenant. Atau masukkan ID Tenant secara manual di bawah ini:
            </p>
            <form onSubmit={handleScanSubmit} className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="Contoh ID: 15"
                className="w-full p-4 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-center font-bold text-lg"
                value={tenantIdInput}
                onChange={(e) => setTenantIdInput(e.target.value)}
                required={showScanModal}
              />
              {scanError && <p className="text-[#F04E37] text-sm text-center">{scanError}</p>}
              <button type="button" onClick={handleScanSubmit} className="w-full py-4 mt-2 rounded-full bg-primary text-white font-bold hover:brightness-110 active:scale-95 transition-all">
                Lanjutkan
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && tenantInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div className="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Pembayaran ke Tenant</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  {tenantInfo.full_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface">{tenantInfo.full_name}</h3>
                  <p className="font-caption text-secondary text-sm">Tenant di {tenantInfo.event?.title}</p>
                </div>
              </div>
              <form onSubmit={handlePaymentSubmit} className="w-full flex flex-col gap-4">
                <div>
                  <label className="block font-label-md text-secondary mb-2">Jumlah Pembayaran</label>
                  <div className="relative flex items-center justify-center p-6 bg-surface-container-low border border-[#EBEBEB] rounded-[16px]">
                    <span className="absolute left-6 font-headline-sm text-secondary">Rp</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-[32px] font-bold text-on-surface w-full max-w-[280px] text-center p-0 outline-none pl-10"
                      value={Number(paymentAmount.replace(/[^0-9]/g, '') || 0).toLocaleString('id-ID')}
                      onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="0"
                      type="text"
                    />
                  </div>
                </div>
                <button type="submit" disabled={paymentLoading} className="w-full mt-2 py-4 rounded-full bg-[#F04E37] text-white font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-70">
                  {paymentLoading ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
