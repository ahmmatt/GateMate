import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import SuperadminSidebar from '../../layouts/SuperadminSidebar';

export default function SuperadminWithdrawalPage() {
  const { user } = useAuthStore();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_superadmin'); // 'pending_superadmin', 'pending_admin', 'success'
  const [search, setSearch] = useState('');
  
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [executing, setExecuting] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/superadmin/withdrawals');
      if (res.data.success) {
        setWithdrawals(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleExecute = async () => {
    if (!selectedWithdrawal) return;
    try {
      setExecuting(true);
      const res = await api.post(`/superadmin/withdrawals/${selectedWithdrawal.id}/execute`);
      if (res.data.success) {
        // Refresh local state
        fetchWithdrawals();
        setExecuteModalOpen(false);
      }
    } catch (error) {
      console.error('Error executing withdrawal:', error);
      alert('Gagal mengeksekusi penarikan.');
    } finally {
      setExecuting(false);
    }
  };

  const openExecuteModal = (wd) => {
    setSelectedWithdrawal(wd);
    setExecuteModalOpen(true);
  };

  // Derived state
  const filteredWithdrawals = withdrawals.filter(wd => {
    if (wd.status !== activeTab) return false;
    const match = (wd.organization || wd.admin_name || '').toLowerCase().includes(search.toLowerCase());
    return match;
  });

  const totalSuccess = withdrawals
    .filter(wd => wd.status === 'success')
    .reduce((sum, wd) => sum + wd.amount, 0);

  const pendingSuperadminCount = withdrawals.filter(wd => wd.status === 'pending_superadmin').length;
  const pendingAdminCount = withdrawals.filter(wd => wd.status === 'pending_admin').length;

  const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  // Format currency
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-on-surface flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Navigation Shell */}
      <SuperadminSidebar />

      {/* Main Content Area */}
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 h-16 bg-surface border-b border-surface-container-high flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">Riwayat Penarikan Dana</h2>
          </div>
          <div className="flex items-center gap-4 text-secondary">
            <span className="text-label-md font-medium"><span className="material-symbols-outlined text-[16px] mr-1 align-text-bottom">update</span>Terakhir diperbarui: Just now</span>
          </div>
        </header>

        {/* Canvas Content */}
        <main className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Page Title & Subtitle */}
            <section>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Riwayat dan eksekusi pencairan organizer</h3>
              <p className="text-secondary font-body-md text-body-md mt-1">Kelola seluruh permintaan penarikan saldo dari mitra organizer event.</p>
            </section>

            {/* Summary Card - Bento Style */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-secondary font-label-md text-label-md uppercase tracking-wider mb-2">Total Sudah Dicairkan</p>
                  <h4 className="text-[36px] font-bold text-primary">{formatRupiah(totalSuccess)}</h4>
                  <div className="mt-4 flex items-center gap-2 text-[#008542]">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                    <span className="font-label-md text-label-md">Periode {currentMonthName}</span>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                  <span className="material-symbols-outlined text-[240px]">payments</span>
                </div>
              </div>

              <div className="bg-primary text-on-primary rounded-[14px] p-8 flex flex-col justify-between">
                <div>
                  <p className="font-label-md text-label-md opacity-80 uppercase tracking-wider mb-2">Menunggu Eksekusi</p>
                  <h4 className="text-[28px] font-bold">{pendingSuperadminCount} Permintaan</h4>
                  {pendingAdminCount > 0 && (
                    <p className="text-sm mt-2 opacity-80">+ {pendingAdminCount} menunggu ACC Organizer</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('pending_superadmin')}
                  className="w-full mt-4 bg-white text-primary font-label-md text-label-md py-3 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Proses Sekarang
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </section>

            {/* Filters & Tabs */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-container-high">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setActiveTab('pending_superadmin')}
                    className={`pb-3 font-body-md text-body-md transition-colors relative ${activeTab === 'pending_superadmin' ? 'text-primary font-medium' : 'text-secondary hover:text-on-surface'}`}
                  >
                    {activeTab === 'pending_superadmin' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-md"></div>}
                    Tertunda (Superadmin)
                  </button>
                  <button 
                    onClick={() => setActiveTab('pending_admin')}
                    className={`pb-3 font-body-md text-body-md transition-colors relative ${activeTab === 'pending_admin' ? 'text-primary font-medium' : 'text-secondary hover:text-on-surface'}`}
                  >
                    {activeTab === 'pending_admin' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-md"></div>}
                    Tertunda (Organizer)
                  </button>
                  <button 
                    onClick={() => setActiveTab('success')}
                    className={`pb-3 font-body-md text-body-md transition-colors relative ${activeTab === 'success' ? 'text-primary font-medium' : 'text-secondary hover:text-on-surface'}`}
                  >
                    {activeTab === 'success' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-md"></div>}
                    Selesai
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex-1 min-w-[300px] relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
                  <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-[10px] border border-surface-container-high focus:ring-1 focus:ring-primary text-body-md outline-none transition-all" 
                    placeholder="Cari Nama Pengguna..." 
                  />
                </div>
              </div>
            </section>

            {/* Table Section */}
            <section className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
                </div>
              ) : filteredWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-[#FFF0EE] rounded-3xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[48px]">inbox</span>
                    </div>
                  </div>
                  <h4 className="text-primary font-medium text-headline-md mb-2">Tidak ada data penarikan</h4>
                  <p className="text-secondary font-body-md max-w-sm mx-auto">
                    {activeTab === 'success' ? 'Belum ada riwayat penarikan yang selesai.' : 'Tidak ada permintaan penarikan dana di kategori ini.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F7] border-b border-surface-container-high">
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">PENGGUNA</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">EVENT</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">INFO / REF</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">TANGGAL</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">NOMINAL</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">STATUS</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                      {filteredWithdrawals.map((wd) => (
                        <tr key={wd.id} className="hover:bg-[#F9F9F9] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-body-md text-on-surface font-semibold">{wd.admin_name || wd.organization}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${wd.user_role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {wd.user_role === 'admin' ? 'ORGANIZER' : 'TENANT'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body-md text-secondary">{wd.event_name}</td>
                          <td className="px-6 py-4 font-body-md text-secondary">{wd.order_id || 'Penarikan Dana'}</td>
                          <td className="px-6 py-4 font-body-md text-secondary">{formatDate(wd.created_at)}</td>
                          <td className="px-6 py-4 font-body-md font-bold text-primary">{formatRupiah(wd.amount)}</td>
                          <td className="px-6 py-4">
                            {wd.status === 'pending_superadmin' ? (
                              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-[10px] text-[11px] font-medium uppercase tracking-wider">Menunggu Superadmin</span>
                            ) : wd.status === 'pending_admin' ? (
                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-[10px] text-[11px] font-medium uppercase tracking-wider">Menunggu Organizer</span>
                            ) : (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-[10px] text-[11px] font-medium uppercase tracking-wider">Selesai</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {wd.status === 'pending_superadmin' ? (
                              <button 
                                onClick={() => openExecuteModal(wd)}
                                className="text-primary hover:bg-primary-fixed px-3 py-1.5 rounded-lg transition-colors font-body-md font-medium"
                              >
                                Eksekusi
                              </button>
                            ) : wd.status === 'pending_admin' ? (
                              <span className="text-secondary font-body-md italic text-sm">Menunggu ACC</span>
                            ) : (
                              <span className="text-secondary font-body-md">Selesai</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Modal Eksekusi */}
      {executeModalOpen && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-6">
          <div className="bg-white w-full max-w-[520px] rounded-[16px] border border-surface-container-high p-8 shadow-xl relative">
            <button className="absolute top-6 right-6 text-secondary hover:text-on-surface transition-colors" onClick={() => setExecuteModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">Konfirmasi Eksekusi Penarikan</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-label-md text-label-md text-secondary mb-1 uppercase tracking-tight">Pengguna</p>
                  <p className="font-body-lg text-body-lg font-semibold text-on-surface">{selectedWithdrawal.organization || selectedWithdrawal.admin_name}</p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-secondary mb-1 uppercase tracking-tight">Ref</p>
                  <p className="font-body-lg text-body-lg font-semibold text-on-surface">{selectedWithdrawal.order_id || 'Penarikan'}</p>
                </div>
              </div>
              
              <div className="py-4 border-y border-surface-container-high">
                <p className="font-label-md text-label-md text-secondary mb-2 uppercase tracking-tight">Nominal Penarikan</p>
                <p className="font-headline-xl text-[32px] font-bold text-[#F04E37]">{formatRupiah(selectedWithdrawal.amount)}</p>
              </div>
              
              <div className="flex gap-3 bg-primary-fixed/30 p-4 rounded-xl items-start">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <p className="font-body-md text-secondary">
                  Pastikan Anda telah mentransfer nominal di atas ke rekening pengguna yang terdaftar sebelum menekan tombol konfirmasi. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                className="flex-1 py-3 bg-surface-container-high text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-container-highest transition-colors font-medium"
                onClick={() => setExecuteModalOpen(false)}
                disabled={executing}
              >
                Batal
              </button>
              <button 
                className="flex-1 py-3 bg-primary text-white font-label-md text-label-md rounded-full hover:bg-opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleExecute}
                disabled={executing}
              >
                {executing ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                )}
                Konfirmasi Eksekusi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
