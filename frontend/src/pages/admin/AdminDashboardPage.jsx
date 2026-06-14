import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const adminInitial = (user?.full_name || 'O')[0].toUpperCase();

  const NAV = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
    { key: 'events', icon: 'event', label: 'Event Saya', to: '/admin/events' },
    { key: 'scanner', icon: 'qr_code_scanner', label: 'Scanner', to: '/admin/scanner' },
    { key: 'finance', icon: 'payments', label: 'Keuangan', to: '/admin/finance' },
    { key: 'settings', icon: 'settings', label: 'Pengaturan', to: '/admin/settings' },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar (Desktop) */}
      <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant hidden md:flex flex-col py-6 z-40" style={{ borderRightWidth: '0.5px' }}>
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ key, icon, label, to }) => (
            <Link key={key} to={to}
              className={`flex items-center px-6 py-3 transition-colors cursor-pointer font-body-md text-body-md ${activeNav === key ? 'border-l-4 border-primary bg-primary-fixed text-primary font-bold' : 'text-secondary hover:bg-surface-container-low'}`}
              onClick={() => setActiveNav(key)}>
              <span className="material-symbols-outlined mr-3">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{adminInitial}</div>
              <div className="ml-2 overflow-hidden">
                <p className="font-label-md text-label-md font-bold truncate">{user?.full_name || 'Organizer'}</p>
                <p className="font-caption text-caption text-secondary">ID: SG-{user?.id_user || '1'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-primary active:opacity-70 mt-1">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="flex justify-between items-center px-6 h-16 w-full fixed top-0 bg-surface border-b border-outline-variant z-50 md:hidden" style={{ borderBottomWidth: '0.5px' }}>
        <h1 className="text-[24px] font-bold text-primary">GateMate</h1>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="md:ml-[240px] pt-16 md:pt-0 min-h-screen w-full">
        <div className="max-w-[1200px] mx-auto p-6 space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="text-[32px] font-bold text-on-surface leading-10">Dashboard</h1>
              <p className="font-body-md text-body-md text-secondary">Selamat datang kembali, <span className="font-bold text-on-surface">{user?.full_name}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center px-4 h-10 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md active:scale-95 transition-transform" style={{ borderWidth: '0.5px' }}>
                <span className="material-symbols-outlined text-[18px] mr-2">download</span>Laporan
              </button>
              <Link to="/admin/events/create" className="flex items-center px-4 h-10 bg-primary text-on-primary rounded-lg font-label-md text-label-md active:scale-95 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px] mr-2">add</span>Event Baru
              </Link>
            </div>
          </header>

          {/* Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'calendar_today', label: 'Total Event', value: data?.total_events ?? 0, sub: `Aktif: ${data?.active_events ?? 0}`, subClass: '' },
              { icon: 'confirmation_number', label: 'Tiket Terjual', value: (data?.total_tickets_sold ?? 0).toLocaleString('id-ID'), sub: null },
              { icon: 'trending_up', label: 'Pendapatan Kotor', value: formatRp(data?.ticket_revenue), iconBg: 'bg-primary-fixed', iconColor: 'text-primary', valueClass: 'text-primary' },
              { icon: 'how_to_reg', label: 'Check-in Hari Ini', value: data?.checked_in_today ?? 0, sub: 'Live' },
            ].map(({ icon, label, value, sub, iconBg, iconColor, valueClass }) => (
              <div key={label} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-[14px]" style={{ borderWidth: '0.5px' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${iconBg || 'bg-surface-container'} rounded-lg flex items-center justify-center ${iconColor || 'text-secondary'}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  {sub && <span className="text-secondary font-label-md text-label-md">{sub}</span>}
                </div>
                <p className="text-secondary font-label-md text-label-md">{label}</p>
                <p className={`text-[24px] font-bold leading-8 ${valueClass || 'text-on-surface'}`}>{value}</p>
              </div>
            ))}
          </section>

          {/* Middle Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Financial Summary */}
            <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-[14px] flex flex-col overflow-hidden" style={{ borderWidth: '0.5px' }}>
              <div className="p-6 border-b border-outline-variant bg-surface-container-low" style={{ borderBottomWidth: '0.5px' }}>
                <h3 className="text-[20px] font-bold text-on-surface flex items-center">
                  <span className="material-symbols-outlined mr-2 text-primary">account_balance_wallet</span>Ringkasan Keuangan
                </h3>
              </div>
              <div className="p-6 flex-1 space-y-4">
                {[
                  { label: 'Gross Revenue', value: formatRp(data?.ticket_revenue), cls: '' },
                  { label: `Service Fee (${data?.fee_percent ?? 10}%)`, value: `- ${formatRp(data?.platform_fee_total)}`, cls: 'text-error' },
                  { label: 'Tenant Cut', value: `+ ${formatRp(data?.tenant_cut_total)}`, cls: 'text-tertiary' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-secondary font-body-md text-body-md">{label}</span>
                    <span className={`font-body-md text-body-md font-medium ${cls}`}>{value}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-on-surface font-bold font-body-md">Net Earnings</span>
                  <span className="text-primary text-[24px] font-bold">{formatRp(data?.net_income_total)}</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button className="w-full h-12 bg-on-surface text-surface rounded-lg font-label-md text-label-md active:opacity-80 transition-opacity flex items-center justify-center">
                  Ajukan Penarikan (Tersedia: {formatRp(data?.withdrawable_amount)})
                </button>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 flex flex-col" style={{ borderWidth: '0.5px' }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-[20px] font-bold text-on-surface">Tren Pendapatan</h3>
                  <p className="font-caption text-caption text-secondary">Analitik 6 bulan terakhir</p>
                </div>
              </div>
              <div className="flex-1 relative min-h-[200px]">
                <svg className="w-full h-[200px]" viewBox="0 0 500 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#f04e37" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#f04e37" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#e3beb8" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#e3beb8" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e3beb8" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#e3beb8" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#e3beb8" strokeWidth="0.5" strokeDasharray="4 4" />
                  <path d="M 0 150 C 50 140, 100 120, 150 130 S 250 80, 350 110 S 450 60, 500 70 V 200 H 0 Z" fill="url(#areaGradient)" />
                  <path d="M 0 150 C 50 140, 100 120, 150 130 S 250 80, 350 110 S 450 60, 500 70" fill="none" stroke="#f04e37" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="500" cy="70" r="5" fill="#f04e37" />
                  <circle cx="500" cy="70" r="3" fill="#ffffff" />
                </svg>
                <div className="absolute bottom-0 w-full flex justify-around text-caption text-secondary font-caption">
                  {['Jan','Feb','Mar','Apr','Mei','Jun'].map((m, i) => (
                    <span key={m} className={i === 5 ? 'font-bold text-on-surface' : ''}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Events Table */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-[14px] overflow-hidden mb-12" style={{ borderWidth: '0.5px' }}>
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center" style={{ borderBottomWidth: '0.5px' }}>
              <h3 className="text-[20px] font-bold">Event Mendatang</h3>
              <Link to="/admin/events" className="text-primary font-label-md text-label-md hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-secondary font-label-md text-label-md">
                  <tr>
                    {['Nama Event','Tanggal','Okupansi','Status','Aksi'].map(h => <th key={h} className="px-6 py-3 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary">Memuat data...</td></tr>
                  ) : !data?.events?.length ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary">Belum ada event. <Link to="/admin/events/create" className="text-primary hover:underline">Buat event pertama Anda.</Link></td></tr>
                  ) : data.events.slice(0, 5).map(ev => {
                    const pct = ev.sold && ev.capacity ? Math.min(100, Math.round((ev.sold / ev.capacity) * 100)) : 0;
                    return (
                      <tr key={ev.id} className="border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors" style={{ borderBottomWidth: '0.5px' }}>
                        <td className="px-6 py-4 font-medium">{ev.title}</td>
                        <td className="px-6 py-4 text-secondary">{formatDate(ev.start_date)}</td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-caption text-caption mt-1 inline-block">{ev.sold || 0}/{ev.capacity || '∞'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${ev.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {ev.status === 'active' ? 'Aktif' : 'Selesai'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/events/${ev.id}`} className="text-primary active:opacity-70">
                            <span className="material-symbols-outlined">more_vert</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t border-outline-variant flex justify-around items-center h-16" style={{ borderTopWidth: '0.5px' }}>
        {NAV.map(({ key, icon, label, to }) => (
          key === 'scanner' ? (
            <Link key={key} to={to} className="flex flex-col items-center text-secondary px-4 py-1">
              <div className="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
                <span className="material-symbols-outlined">center_focus_weak</span>
              </div>
              <span className="font-label-md text-label-md mt-1">Scan</span>
            </Link>
          ) : (
            <Link key={key} to={to} className={`flex flex-col items-center px-4 py-1 transition-colors font-label-md text-label-md ${activeNav === key ? 'text-primary font-bold' : 'text-secondary'}`} onClick={() => setActiveNav(key)}>
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}
