import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function SuperadminDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalTransactions: 0,
    totalWithdrawnSuccess: 0,
    totalActiveUsers: 0,
    pendingWithdrawals: [],
    pendingOrganizers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch
    setTimeout(() => {
      setData({
        totalTransactions: 1250,
        totalWithdrawnSuccess: 145000000,
        totalActiveUsers: 340,
        pendingWithdrawals: [{ id: 1, amount: 2500000, user: { full_name: 'Tenant A' }, meta: { event_title: 'Tech Fest', bank_name: 'BCA', account_number: '12345678' }, created_at: new Date().toISOString() }],
        pendingOrganizers: [{ id: 1, full_name: 'Budi Santoso', email: 'budi@event.com', organization_name: 'Budi Events', phone: '0812345678', profile_image: 'https://ui-avatars.com/api/?name=Budi', ktp_document: 'ktp.pdf' }]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-outline-variant bg-surface-container-lowest flex flex-col justify-between py-8 z-50">
        <div className="flex flex-col">
          <div className="px-6 mb-10">
            <span className="font-headline-md font-bold text-primary">GateMate</span>
            <p className="font-label-md text-secondary mt-1">Superadmin</p>
          </div>
          <nav className="flex flex-col space-y-1">
            <Link to="/superadmin/dashboard" className="flex items-center gap-3 px-6 py-3 border-l-4 border-primary bg-surface-container text-primary font-medium transition-colors">
              <span className="material-symbols-outlined">dashboard</span> <span className="font-body-md">Dashboard</span>
            </Link>
            <Link to="/superadmin/dashboard" className="flex items-center gap-3 px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">verified_user</span> <span className="font-body-md">Verifikasi Organizer</span>
            </Link>
            <Link to="/superadmin/dashboard" className="flex items-center gap-3 px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">account_balance_wallet</span> <span className="font-body-md">Penarikan Dana</span>
            </Link>
          </nav>
        </div>
        <div className="px-6">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 text-primary w-full py-3 px-4 border border-primary hover:bg-primary-fixed transition-colors rounded-full font-medium">
            <span className="material-symbols-outlined">logout</span> <span className="font-body-md">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[240px] flex-1 flex flex-col">
        <header className="sticky top-0 h-16 px-6 bg-surface/90 backdrop-blur-md border-b border-outline-variant z-40 flex justify-between items-center">
          <h1 className="font-headline-md font-bold text-on-surface">Dashboard Superadmin</h1>
          <div className="flex items-center gap-4 text-secondary">
            <span className="text-label-md font-medium"><span className="material-symbols-outlined text-[16px] mr-1 align-text-bottom">update</span>Terakhir diperbarui: Just now</span>
          </div>
        </header>

        <main className="p-6 max-w-[1200px] w-full mx-auto space-y-8">
          <div>
            <p className="text-secondary font-body-lg">Selamat datang kembali, <span className="font-semibold text-on-surface">{user?.full_name || 'Admin Master'}</span></p>
          </div>

          {/* Metric Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center mb-3"><span className="material-symbols-outlined text-secondary">receipt</span></div>
              <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Transaksi</p>
              <h2 className="text-[28px] font-bold text-on-surface leading-tight">{data.totalTransactions.toLocaleString('id-ID')}</h2>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center mb-3"><span className="material-symbols-outlined text-primary">trending_up</span></div>
              <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Pendapatan</p>
              <h2 className="text-[28px] font-bold text-primary leading-tight">{formatRp(data.totalWithdrawnSuccess)}</h2>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center mb-3"><span className="material-symbols-outlined text-secondary">group</span></div>
              <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Pengguna Aktif</p>
              <h2 className="text-[28px] font-bold text-on-surface leading-tight">{data.totalActiveUsers}</h2>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-3"><span className="material-symbols-outlined text-orange-600">schedule</span></div>
              <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Withdraw Pending</p>
              <h2 className="text-[28px] font-bold text-orange-600 leading-tight">{data.pendingWithdrawals.length}</h2>
            </div>
          </section>

          {/* Verifikasi Organizer */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-on-surface text-[18px]">Verifikasi Organizer</h3>
                <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{data.pendingOrganizers.length} menunggu</span>
              </div>
              <button className="text-primary font-bold text-label-md hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface text-secondary font-label-md text-[12px] uppercase tracking-wider border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-3">Organizer</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Organisasi</th>
                    <th className="px-6 py-3">Dokumen</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.pendingOrganizers.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-secondary">Tidak ada antrean verifikasi.</td></tr>
                  ) : (
                    data.pendingOrganizers.map(org => (
                      <tr key={org.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={org.profile_image} alt={org.full_name} className="w-8 h-8 rounded-full border border-outline-variant" />
                            <span className="font-bold text-body-md text-on-surface">{org.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-body-md text-secondary">{org.email}</td>
                        <td className="px-6 py-4 text-body-md text-secondary">{org.organization_name}</td>
                        <td className="px-6 py-4">
                          <a href="#" className="flex items-center gap-1 text-primary hover:underline text-body-md">
                            <span className="material-symbols-outlined text-[18px]">description</span> KTP.pdf
                          </a>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="bg-primary text-white px-4 py-1.5 rounded-full font-bold text-[12px] hover:brightness-110 shadow-sm active:scale-95 transition-all">Approve</button>
                            <button className="border border-outline-variant text-secondary px-4 py-1.5 rounded-full font-bold text-[12px] hover:bg-surface-container transition-colors">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Eksekusi Penarikan Dana */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-on-surface text-[18px]">Penarikan Dana Tertunda</h3>
                <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{data.pendingWithdrawals.length} menunggu</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface text-secondary font-label-md text-[12px] uppercase tracking-wider border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-3">Waktu</th>
                    <th className="px-6 py-3">Tenant / Event</th>
                    <th className="px-6 py-3">Tujuan Bank</th>
                    <th className="px-6 py-3">Jumlah</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.pendingWithdrawals.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-secondary">Tidak ada penarikan tertunda.</td></tr>
                  ) : (
                    data.pendingWithdrawals.map(wd => (
                      <tr key={wd.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-body-md text-on-surface">{formatDate(wd.created_at)}</div>
                          <div className="text-caption text-secondary">{formatTime(wd.created_at)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-body-md text-on-surface">{wd.user.full_name}</div>
                          <div className="text-caption text-secondary">{wd.meta.event_title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-body-md text-on-surface">{wd.meta.bank_name}</div>
                          <div className="text-caption text-secondary">{wd.meta.account_number}</div>
                        </td>
                        <td className="px-6 py-4 text-primary font-bold text-[16px]">{formatRp(wd.amount)}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => confirm(`Eksekusi transfer ${formatRp(wd.amount)} ke ${wd.meta.bank_name} ${wd.meta.account_number}?`)} className="bg-primary text-white px-4 py-2 rounded-full font-bold text-label-md flex items-center justify-center gap-1.5 ml-auto hover:brightness-110 shadow-sm active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-[16px]">payments</span> Eksekusi
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
