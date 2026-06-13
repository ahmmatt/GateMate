import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function AdminFinancePage() {
  const { user, logout } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [wdAmount, setWdAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [wdLoading, setWdLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/finance');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setWdLoading(true);
    
    try {
      await api.post('/admin/finance/withdraw', {
        amount: parseInt(wdAmount),
        bank_name: bankName,
        account_number: accNumber
      });
      setSuccessMsg('Pengajuan penarikan dana berhasil!');
      setShowWithdrawModal(false);
      setWdAmount('');
      setBankName('');
      setAccNumber('');
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengajukan penarikan');
    } finally {
      setWdLoading(false);
    }
  };

  const formatRp = (n) => new Intl.NumberFormat('id-ID').format(n || 0);

  return (
    <div className="bg-background text-on-surface min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-on-surface">GateMate</h2>
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
          <Link to="/admin/scanner" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span className="font-body-sm text-body-sm">Scanner</span>
          </Link>
          <Link to="/admin/finance" className="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer">
            <span className="material-symbols-outlined mr-3">payments</span>
            <span className="font-body-sm text-body-sm">Keuangan</span>
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

      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full h-[64px] px-page-padding lg:pl-[264px] bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="font-h3 text-h3 font-black text-on-surface">Keuangan</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-full border-[0.5px] border-outline-variant focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-48" placeholder="Cari transaksi..." type="text"/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-[240px] min-h-screen pb-20 lg:pb-10 relative">

        {successMsg && (
          <div className="max-w-[1200px] mx-auto p-page-padding pb-0">
            <div className="bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm mb-4">
              <span className="material-symbols-outlined">check_circle</span>
              {successMsg}
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="max-w-[1200px] mx-auto p-page-padding pb-0">
            <div className="bg-[#FFF0EE] border border-primary text-primary px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm mb-4">
              <span className="material-symbols-outlined">error</span>
              {errorMsg}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20 text-primary">
            <span className="material-symbols-outlined animate-spin text-[40px]">progress_activity</span>
          </div>
        ) : !data ? (
          <div className="text-center py-10 text-secondary">Gagal memuat data.</div>
        ) : (
          <div className="max-w-[1200px] mx-auto p-page-padding space-y-stack-lg">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-h1 text-h1 text-on-surface">Ringkasan Keuangan</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Kelola saldo, pantau arus kas, dan ajukan penarikan dana ke rekening Anda.</p>
              </div>
              <button onClick={() => setShowWithdrawModal(true)} className="flex items-center justify-center gap-2 px-6 h-[44px] bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium text-body-sm shadow-sm">
                <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                Ajukan Penarikan Dana
              </button>
            </div>

            {/* Summary Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Total Saldo */}
              <div className="bg-surface-container-lowest p-6 rounded-[14px] border-[0.5px] border-outline-variant flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Pendapatan</span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">payments</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-h1 text-h1 text-on-surface font-black">Rp {formatRp(data.net_income_total)}</h2>
                  <div className="flex items-center gap-1 mt-1 text-emerald-600 font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>Akumulasi Sejak Awal</span>
                  </div>
                </div>
              </div>
              
              {/* Saldo Tersedia */}
              <div className="bg-surface-container-lowest p-6 rounded-[14px] border-[0.5px] border-outline-variant flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Saldo Tersedia</span>
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">verified_user</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-h1 text-h1 text-on-surface font-black">Rp {formatRp(data.available_to_withdraw)}</h2>
                  <p className="text-on-surface-variant font-caption text-caption mt-1 italic">Siap untuk ditarik ke rekening utama</p>
                </div>
              </div>
              
              {/* Penarikan Tertunda */}
              <div className="bg-surface-container-lowest p-6 rounded-[14px] border-[0.5px] border-outline-variant flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Penarikan Tertunda</span>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">schedule</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-h1 text-h1 text-on-surface font-black">Rp {formatRp(data.pending_withdrawals)}</h2>
                  <p className="text-on-surface-variant font-caption text-caption mt-1">Status Sedang Diproses</p>
                </div>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden">
              <div className="p-6 border-b-[0.5px] border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-h3 text-h3 font-bold">Riwayat Transaksi Dompet (Wallet)</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-secondary-container transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    Filter Lanjut
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-variant/30 text-secondary font-label-md text-label-md">
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Jenis</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[0.5px] divide-outline-variant">
                    {data.transactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-secondary font-body-sm">
                          Belum ada riwayat transaksi dompet
                        </td>
                      </tr>
                    ) : data.transactions.map(trx => (
                      <tr key={trx.id} className="hover:bg-surface-container transition-colors group">
                        <td className="px-6 py-4 font-body-sm text-body-sm">{dayjs(trx.created_at).format('DD MMM YYYY, HH:mm')}</td>
                        <td className="px-6 py-4">
                          <p className="font-body-sm text-body-sm font-medium">
                            {trx.type === 'tenant_revenue' ? `Bagi Hasil Tenant (${trx.meta?.tenant_name || 'Tenant'})` : 
                             trx.type === 'withdrawal' ? `Penarikan Dana ke ${trx.meta?.bank_name || 'Bank'} ${trx.meta?.account_number || ''}` :
                             trx.type.replace('_', ' ')}
                          </p>
                          <p className="text-[11px] text-on-surface-variant">Trx #{trx.order_id}</p>
                        </td>
                        <td className="px-6 py-4">
                          {trx.type === 'tenant_revenue' ? (
                            <span className="text-caption font-label-md px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">Pendapatan</span>
                          ) : trx.type === 'withdrawal' ? (
                            <span className="text-caption font-label-md px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant">Penarikan</span>
                          ) : (
                            <span className="text-caption font-label-md px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">Lainnya</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {['success', 'settlement'].includes(trx.status) ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-label-md text-label-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> Selesai
                            </div>
                          ) : ['pending', 'pending_superadmin'].includes(trx.status) ? (
                            <div className="flex items-center gap-1.5 text-amber-700 font-label-md text-label-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></div> Diproses
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-700 font-label-md text-label-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Ditolak / Gagal
                            </div>
                          )}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${trx.type === 'withdrawal' ? 'text-on-surface' : 'text-emerald-600'}`}>
                          {trx.type === 'withdrawal' ? '-' : '+'} Rp {formatRp(trx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t-[0.5px] border-outline-variant flex items-center justify-between">
                <p className="text-caption text-on-surface-variant">Menampilkan {data.transactions.length} transaksi</p>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded border-[0.5px] border-outline-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-label-md text-label-md">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border-[0.5px] border-outline-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Withdrawal Methods & Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
              <div className="bg-surface-container-lowest p-6 rounded-[14px] border-[0.5px] border-outline-variant space-y-4">
                <h3 className="font-h3 text-h3 font-bold">Rekening Terdaftar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border-[0.5px] border-outline-variant">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">DEFAULT</div>
                      <div>
                        <p className="font-label-md text-label-md">Rekening Utama (Dummy)</p>
                        <p className="text-caption text-on-surface-variant">Admin • Input saat Withdraw</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-[14px] border-[0.5px] border-outline-variant relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-h3 text-h3 font-bold">Butuh Bantuan?</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Kami siap membantu kendala keuangan Anda setiap saat.</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button className="px-4 py-2 bg-on-surface text-surface rounded-lg text-label-md font-label-md hover:opacity-90">Hubungi Support</button>
                    <button className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-lg text-label-md font-label-md hover:bg-surface-variant">Baca FAQ</button>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute right-10 top-0 w-20 h-20 bg-tertiary/5 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
        <Link to="/admin/dashboard" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link to="/admin/events" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label-md text-label-md">Events</span>
        </Link>
        <Link to="/admin/scanner" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <div className="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined">center_focus_weak</span>
          </div>
          <span className="font-label-md text-label-md mt-1">Scan</span>
        </Link>
        <Link to="/admin/finance" className="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-md text-label-md">Finance</span>
        </Link>
      </nav>

      {/* Modal Withdraw */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-h2 text-h2 font-black text-on-surface">Tarik Dana</h3>
              <button className="text-secondary hover:text-on-surface" onClick={() => setShowWithdrawModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleWithdraw}>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Nominal (Rp)</label>
                  <input type="number" name="amount" required min="10000" max={data?.available_to_withdraw} value={wdAmount} onChange={e => setWdAmount(e.target.value)}
                         className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                         placeholder="Misal: 1500000" />
                  <p className="text-[11px] text-secondary mt-1">Maksimal: Rp {formatRp(data?.available_to_withdraw)}</p>
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Nama Bank / E-Wallet</label>
                  <input type="text" name="bank_name" required value={bankName} onChange={e => setBankName(e.target.value)}
                         className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                         placeholder="Misal: Bank BCA / GoPay" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Nomor Rekening</label>
                  <input type="text" name="account_number" required value={accNumber} onChange={e => setAccNumber(e.target.value)}
                         className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                         placeholder="0123456789" />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" className="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onClick={() => setShowWithdrawModal(false)}>
                    Batal
                  </button>
                  <button disabled={wdLoading} type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center">
                    {wdLoading ? <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> : null}
                    Konfirmasi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
