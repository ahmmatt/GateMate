import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function AdminEventShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tiket');
  const [refundModalData, setRefundModalData] = useState(null);
  const [editTierModalData, setEditTierModalData] = useState(null);
  const [addTierModalOpen, setAddTierModalOpen] = useState(false);
  const [tierForm, setTierForm] = useState({ tier_name: '', price: '', quota: '' });
  
  const [addTenantModalOpen, setAddTenantModalOpen] = useState(false);
  const [editTenantModalData, setEditTenantModalData] = useState(null);
  const [tenantForm, setTenantForm] = useState({ full_name: '', email: '', password: '' });

  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/events/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const toggleStatus = async () => {
    if (!window.confirm('Yakin ingin mengubah status event ini?')) return;
    try {
      await api.post(`/admin/events/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const handleSaveTier = async (e) => {
    e.preventDefault();
    try {
      if (editTierModalData) {
        await api.put(`/admin/events/${event.id_event || event.id}/tiers/${editTierModalData.id_ticket_tier || editTierModalData.id_tier || editTierModalData.id}`, tierForm);
      } else {
        await api.post(`/admin/events/${event.id_event || event.id}/tiers`, tierForm);
      }
      setEditTierModalData(null);
      setAddTierModalOpen(false);
      setTierForm({ tier_name: '', price: '', quota: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan tier');
    }
  };

  const handleDeleteTier = async (tierId) => {
    if (!window.confirm('Yakin ingin menghapus tier ini?')) return;
    try {
      await api.delete(`/admin/events/${event.id_event || event.id}/tiers/${tierId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus tier');
    }
  };

  const handleSaveTenant = async (e) => {
    e.preventDefault();
    try {
      if (editTenantModalData) {
        await api.put(`/admin/events/${event.id_event || event.id}/tenants/${editTenantModalData.id || editTenantModalData.id_user}`, tenantForm);
      } else {
        await api.post(`/admin/events/${event.id_event || event.id}/tenants`, tenantForm);
      }
      setEditTenantModalData(null);
      setAddTenantModalOpen(false);
      setTenantForm({ full_name: '', email: '', password: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan tenant');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Yakin ingin menghapus tenant ini?')) return;
    try {
      await api.delete(`/admin/events/${event.id_event || event.id}/tenants/${tenantId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus tenant');
    }
  };

  const [wdAmount, setWdAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [wdLoading, setWdLoading] = useState(false);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setWdLoading(true);
    try {
      await api.post(`/admin/events/${event.id_event || event.id}/withdraw`, {
        amount: parseInt(wdAmount),
        bank_name: bankName,
        account_number: accNumber
      });
      setWithdrawalModalOpen(false);
      setWdAmount('');
      setBankName('');
      setAccNumber('');
      fetchData();
      alert('Pengajuan penarikan dana berhasil!');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses penarikan');
    } finally {
      setWdLoading(false);
    }
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const formatRpNum = (n) => Number(n || 0).toLocaleString('id-ID');
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  const adminInitial = (user?.full_name || 'O')[0].toUpperCase();

  const NAV = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
    { key: 'events', icon: 'event', label: 'Event Saya', to: '/admin/events' },
    { key: 'scanner', icon: 'qr_code_scanner', label: 'Scanner', to: '/admin/scanner' },
    { key: 'finance', icon: 'payments', label: 'Keuangan', to: '/admin/finance' },
    { key: 'settings', icon: 'settings', label: 'Pengaturan', to: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center flex-col">
        <span className="material-symbols-outlined text-[64px] text-secondary mb-4">error</span>
        <h2 className="font-h2 text-h2 font-bold text-on-surface">Event tidak ditemukan</h2>
        <Link to="/admin/events" className="mt-4 text-primary hover:underline font-label-md">Kembali ke daftar event</Link>
      </div>
    );
  }

  const { event, stats, tenants, pending_withdrawals, ticket_buyers } = data;

  return (
    <div className="bg-background text-on-surface font-body-sm min-h-screen">
      {/* Mobile Top Navigation */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-[0.5px] border-outline-variant md:hidden bg-surface sticky top-0 z-40">
        <h1 className="text-[24px] font-bold text-primary">GateMate</h1>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </header>

      {/* Desktop Side Navigation */}
      <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant hidden md:flex flex-col py-6 z-40" style={{ borderRightWidth: '0.5px' }}>
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ key, icon, label, to }) => (
            <Link key={key} to={to}
              className={`flex items-center px-6 py-3 transition-colors cursor-pointer font-body-md text-body-md ${key === 'events' ? 'border-l-4 border-primary bg-primary-fixed text-primary font-bold' : 'text-secondary hover:bg-surface-container-low'}`}
            >
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
                <p className="font-caption text-caption text-secondary">ID: GM-{user?.id_user || '1'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-primary active:opacity-70 mt-1">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-sidebar-width min-h-screen pb-24 md:pb-page-padding">
        {/* Hero Banner Section */}
        <section className="max-w-max-container mx-auto px-0 md:px-page-padding md:pt-page-padding">
          {/* Breadcrumbs / Header (Desktop only inside main content usually, or we can just keep the Hero) */}
          <div className="mb-stack-lg hidden md:block mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-secondary font-label-md mb-2">
              <Link to="/admin/events" className="hover:text-primary">Event Saya</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">Detail Event</span>
            </div>
            <h2 className="font-h1 text-h1 text-on-surface">{event.title}</h2>
          </div>

          <div className="relative w-full aspect-video md:rounded-xl overflow-hidden border-[0.5px] border-outline-variant bg-surface-container-high">
            <img 
              alt="Event Banner" 
              className="w-full h-full object-cover" 
              src={event.poster_image_url || event.banner_image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
            />
            <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full border border-outline-variant">
              <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">{event.status === 'active' ? 'Live Event' : 'Ended'}</span>
            </div>
          </div>
          
          {/* Event Basic Info */}
          <div className="px-page-padding md:px-0 mt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <span className="text-tertiary font-label-md text-label-md bg-tertiary-fixed px-3 py-1 rounded-full">{event.category}</span>
              <h2 className="font-h1 text-h1 md:hidden mt-2 text-on-surface">{event.title}</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-secondary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span className="font-body-sm text-body-sm">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span className="font-body-sm text-body-sm">{event.venue_name || event.city}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span className="font-label-md text-label-md">Share</span>
              </button>
              <button onClick={toggleStatus} className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[20px]">{event.status === 'active' ? 'edit' : 'play_circle'}</span>
                <span className="font-label-md text-label-md">{event.status === 'active' ? 'Akhiri Event' : 'Aktifkan'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="max-w-max-container mx-auto mt-10 px-page-padding">
          <div className="flex border-b-[0.5px] border-outline-variant overflow-x-auto no-scrollbar">
            {['tiket', 'peserta', 'tenant', 'keuangan'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-4 font-label-md whitespace-nowrap transition-colors ${activeTab === t ? 'text-primary border-b-2 border-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tiket Tab Content */}
          {activeTab === 'tiket' && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {event.ticket_tiers?.map(tier => {
                const sold = tier.capacity - tier.remaining_seats;
                const pct = tier.capacity > 0 ? Math.min(100, Math.round((sold / tier.capacity) * 100)) : 0;
                const isSoldOut = pct >= 100 && !tier.is_unlimited;

                return (
                  <div key={tier.id_ticket_tier || tier.tier_name} className={`bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl p-6 transition-all hover:border-primary/40 group ${isSoldOut ? 'border-dashed border-2 opacity-75' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-h3 text-h3 text-on-surface">{tier.tier_name}</h3>
                        <p className="font-caption text-caption text-secondary mt-1">{tier.is_unlimited ? 'Akses Terbuka' : 'Kapasitas Terbatas'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          className="p-2 text-secondary hover:text-primary transition-colors"
                          onClick={() => {
                            setTierForm({ tier_name: tier.tier_name, price: tier.price, quota: tier.capacity });
                            setEditTierModalData(tier);
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          className="p-2 text-secondary hover:text-error transition-colors"
                          onClick={() => handleDeleteTier(tier.id_ticket_tier || tier.id_tier || tier.id)}
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className={`font-body-sm text-body-sm font-bold ${isSoldOut ? 'text-secondary' : 'text-primary'}`}>IDR</span>
                      <span className={`font-h2 text-h2 font-black ${isSoldOut ? 'text-secondary' : 'text-primary'}`}>{formatRpNum(tier.price)}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body-sm text-body-sm text-secondary">Terjual</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold">{sold} / {tier.is_unlimited ? '∞' : tier.capacity}</span>
                      </div>
                      {!tier.is_unlimited && (
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isSoldOut ? 'bg-error-container' : 'bg-surface-container-high'}`}>
                          <div className={`h-full rounded-full ${isSoldOut ? 'bg-error w-full' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {isSoldOut ? (
                          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-caption text-caption uppercase font-bold">Sold Out</span>
                        ) : tier.is_unlimited ? (
                          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-caption text-caption">Available</span>
                        ) : (
                          <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-caption text-caption">Terbatas</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Ticket Tier Button */}
              <button 
                className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 py-8 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary-fixed/30 hover:border-primary transition-all group"
                onClick={() => setAddTierModalOpen(true)}
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-active:scale-90 transition-transform">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <span className="font-body-sm text-body-sm font-bold">+ Tambah Tier Tiket</span>
              </button>
            </div>
          )}

          {/* Peserta Tab Content */}
          {activeTab === 'peserta' && (
            <div className="mt-8 animate-fade-in">
              {/* Controls: Search & Filter */}
              <div className="flex flex-col md:flex-row gap-stack-md mb-stack-lg items-center">
                <div className="relative flex-1 w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
                  <input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-colors font-body-sm" placeholder="Cari nama atau email peserta..." type="text"/>
                </div>
                <div className="flex gap-stack-sm w-full md:w-auto">
                  <select className="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary">
                    <option>Semua Tier</option>
                  </select>
                  <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Attendee Table Card */}
              <div className="bg-white rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                      <tr>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Peserta</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Tier</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Waktu Beli</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-[0.5px] divide-outline-variant">
                      {ticket_buyers?.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-secondary">Belum ada peserta.</td></tr>
                      ) : ticket_buyers?.map((tb) => (
                        <tr key={tb.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-[0.5px] border-outline-variant text-secondary font-bold">
                                {tb.user?.full_name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-on-surface">{tb.user?.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-secondary">{tb.user?.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full text-caption bg-surface-container-high text-secondary font-bold">{tb.ticket_tier?.tier_name}</span>
                          </td>
                          <td className="px-6 py-4 text-secondary">{new Date(tb.created_at).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              {tb.is_used ? (
                                <span className="px-3 py-1 rounded-full text-caption bg-green-100 text-green-800 font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                  Hadir
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-caption bg-surface-container text-secondary font-bold">
                                  Belum
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button 
                                className={`p-2 transition-colors ${tb.is_used ? 'text-primary' : 'text-secondary hover:text-primary'}`} 
                                title="Check-in Toggle"
                                onClick={async () => {
                                  try {
                                    await api.post(`/admin/events/${event.id_event || event.id}/tickets/${tb.id}/toggle-checkin`);
                                    fetchData();
                                  } catch (err) {
                                    alert('Gagal mengubah status check-in');
                                  }
                                }}
                              >
                                <span className="material-symbols-outlined">{tb.is_used ? 'toggle_on' : 'toggle_off'}</span>
                              </button>
                              <button 
                                className="p-2 text-error hover:bg-error-container/20 rounded transition-colors"
                                onClick={() => setRefundModalData(tb)}
                              >
                                <span className="material-symbols-outlined">assignment_return</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tenant Tab */}
          {activeTab === 'tenant' && (
            <div className="mt-8 animate-fade-in">
              {/* Tenant Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
                  <input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-colors text-body-sm" placeholder="Cari nama tenant..." type="text"/>
                </div>
                <button 
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-body-sm hover:opacity-90 transition-opacity"
                  onClick={() => setAddTenantModalOpen(true)}
                >
                  <span className="material-symbols-outlined">add</span>
                  Tambah Tenant
                </button>
              </div>

              {/* Tenant List Table Container */}
              <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Nama Tenant</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Jenis Booth</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Total Penjualan</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Tenant Cut</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Status Withdrawal</th>
                        <th className="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-[0.5px] divide-outline-variant">
                      {tenants?.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-secondary">Belum ada tenant yang terdaftar.</td></tr>
                      ) : tenants?.map(t => (
                        <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-[0.5px] border-outline-variant text-secondary font-bold">
                                {t.full_name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-on-surface">{t.full_name}</span>
                                <span className="text-caption text-secondary">{t.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-secondary">-</td>
                          <td className="px-6 py-4 font-medium">-</td>
                          <td className="px-6 py-4 text-on-surface-variant">-</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-secondary-container text-secondary">Belum Ada</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button 
                                className="p-2 text-secondary hover:text-primary transition-colors"
                                onClick={() => {
                                  setTenantForm({ full_name: t.full_name, email: t.email, password: '' });
                                  setEditTenantModalData(t);
                                }}
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button 
                                className="p-2 text-secondary hover:text-error transition-colors"
                                onClick={() => handleDeleteTenant(t.id || t.id_user)}
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-primary-fixed/30 border-[0.5px] border-primary/20 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">account_balance_wallet</span>
                  <div>
                    <p className="text-secondary text-caption font-medium uppercase tracking-tight">Estimasi Pendapatan Penyelenggara</p>
                    <h3 className="font-h3 text-on-primary-fixed-variant">Total Tenant Cut masuk ke pendapatan event: <span className="font-bold">{formatRp(stats?.tenant_cut)}</span></h3>
                  </div>
                </div>
                <button className="hidden md:block text-primary font-label-md hover:underline decoration-2 underline-offset-4" onClick={() => setActiveTab('keuangan')}>Lihat Laporan Keuangan</button>
              </div>
            </div>
          )}

          {/* Keuangan Tab */}
          {activeTab === 'keuangan' && (
            <div className="mt-8 animate-fade-in space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Breakdown Card */}
                <div className="lg:col-span-2 bg-white rounded-xl border-[0.5px] border-outline-variant p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                    <h3 className="font-h3 text-h3 text-on-surface">Rincian Pendapatan</h3>
                    <span className="material-symbols-outlined text-secondary">info</span>
                    </div>
                    <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                        <span className="text-body-sm text-secondary">Pendapatan Kotor</span>
                        <span className="text-body-sm font-medium text-on-surface">{formatRp(stats?.ticket_revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                        <span className="text-body-sm text-secondary">Biaya Platform ({stats?.fee_percent || 10}%)</span>
                        <span className="text-body-sm font-medium text-error">–{formatRp(stats?.platform_fee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                        <span className="text-body-sm text-secondary">Potongan Tenant</span>
                        <span className="text-body-sm font-medium text-tertiary">+{formatRp(stats?.tenant_cut)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-body-lg font-bold text-on-surface">Total Pendapatan Bersih</span>
                        <span className="text-h2 font-black text-primary">{formatRp(stats?.net_income)}</span>
                    </div>
                    </div>
                </div>

                {/* Withdrawal Status Card */}
                <div className="bg-surface-container-low rounded-xl border-[0.5px] border-outline-variant p-6 flex flex-col justify-between">
                    <div>
                    <p className="text-caption text-secondary uppercase tracking-wider font-bold mb-1">Saldo Tersedia</p>
                    <h4 className="text-h2 font-black text-on-surface mb-2">{formatRp(stats?.available_to_withdraw)}</h4>
                    <div className="flex items-center gap-2 text-caption text-secondary">
                        <span className="material-symbols-outlined text-[14px]">account_balance</span>
                        <span>{user?.bank_name || 'Rekening Tujuan'}</span>
                    </div>
                    </div>
                    <button 
                      className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      onClick={() => setWithdrawalModalOpen(true)}
                    >
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        Ajukan Penarikan
                    </button>
                </div>

                {/* Withdrawal History Table */}
                <div className="lg:col-span-3 bg-white rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                    <div className="px-6 py-4 border-b-[0.5px] border-outline-variant bg-surface-container-lowest flex justify-between items-center">
                    <h3 className="font-h3 text-h3 text-on-surface">Riwayat Penarikan</h3>
                    <button className="text-primary text-body-sm font-bold flex items-center gap-1">
                        Lihat Semua <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-surface-container-low">
                            <th className="px-6 py-3 text-caption font-bold text-secondary uppercase">Tanggal Pengajuan</th>
                            <th className="px-6 py-3 text-caption font-bold text-secondary uppercase">ID Transaksi</th>
                            <th className="px-6 py-3 text-caption font-bold text-secondary uppercase">Jumlah</th>
                            <th className="px-6 py-3 text-caption font-bold text-secondary uppercase">Status</th>
                            <th className="px-6 py-3 text-caption font-bold text-secondary uppercase text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y-[0.5px] divide-outline-variant">
                        {data.event_withdrawals?.length > 0 ? data.event_withdrawals.map(wd => (
                            <tr key={wd.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4 text-body-sm text-on-surface">{formatDate(wd.created_at)}</td>
                            <td className="px-6 py-4 text-body-sm text-secondary">WD-{wd.id}-SG</td>
                            <td className="px-6 py-4 text-body-sm font-bold text-on-surface">{formatRp(wd.amount)}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold ${wd.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {wd.status === 'success' ? 'Berhasil' : 'Diproses'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-secondary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">description</span>
                                </button>
                            </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-secondary">Belum ada riwayat penarikan</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
               </div>

               {/* Pending Withdrawals (Approve Tenant Withdrawals) */}
               {pending_withdrawals?.length > 0 && (
                <div className="bg-orange-50 border-[0.5px] border-orange-200 rounded-xl p-6">
                  <h3 className="font-bold text-orange-800 font-h3 mb-4 flex items-center">
                    <span className="material-symbols-outlined mr-2">notifications_active</span> Permintaan Penarikan Tenant
                  </h3>
                  <div className="space-y-4">
                    {pending_withdrawals.map(pw => (
                      <div key={pw.id} className="bg-white p-4 rounded-lg border-[0.5px] border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-on-surface">{pw.user_name}</p>
                          <p className="text-secondary font-body-sm">Rekening: {pw.meta?.bank_name} - {pw.meta?.account_number}</p>
                          <p className="text-primary font-bold mt-1 text-lg">{formatRp(pw.amount)}</p>
                        </div>
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-label-md transition-colors shadow-sm">
                          Approve & Cairkan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
        <Link to="/admin/dashboard" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link to="/admin/events" className="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label-md text-label-md">Events</span>
        </Link>
        <Link to="/admin/scanner" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
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

      {/* Modal: Konfirmasi Refund */}
      {refundModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-md rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
            <div className="px-6 py-5 border-b-[0.5px] border-outline-variant flex justify-between items-center">
              <h3 className="font-h3 text-h3 text-on-surface">Konfirmasi Refund</h3>
              <button className="text-secondary hover:text-on-surface" onClick={() => setRefundModalData(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-error-container/20 p-4 rounded-lg mb-6 flex gap-3">
                <span className="material-symbols-outlined text-error">warning</span>
                <p className="text-error font-body-sm">Tindakan ini tidak dapat dibatalkan. Dana (93%) akan dikembalikan ke metode pembayaran asal pembeli.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-secondary font-label-md mb-1">Nama Peserta</p>
                  <p className="font-bold text-on-surface">{refundModalData.user?.full_name}</p>
                </div>
                <div>
                  <p className="text-secondary font-label-md mb-1">Nama Event</p>
                  <p className="font-bold text-on-surface">{event.title}</p>
                </div>
                <div>
                  <p className="text-secondary font-label-md mb-1">Jumlah Refund (Gross)</p>
                  <p className="text-h2 font-black text-primary">{formatRp(refundModalData.gross_amount)}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5 bg-surface-container-low flex flex-col md:flex-row-reverse gap-3">
              <button 
                className="flex-1 py-2.5 bg-error text-white font-bold rounded-lg hover:opacity-90 transition-all active:scale-95"
                onClick={async () => {
                  if (!window.confirm('Proses refund sekarang?')) return;
                  try {
                    await api.post(`/admin/events/${event.id_event || event.id}/tickets/${refundModalData.id}/refund`);
                    fetchData();
                    setRefundModalData(null);
                  } catch (err) {
                    alert('Gagal memproses refund');
                  }
                }}
              >
                Konfirmasi Refund
              </button>
              <button className="flex-1 py-2.5 bg-transparent border-[0.5px] border-outline text-secondary font-bold rounded-lg hover:bg-surface-container-high transition-all" onClick={() => setRefundModalData(null)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit/Add Tier */}
      {(editTierModalData || addTierModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-md rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
            <div className="px-6 py-5 border-b-[0.5px] border-outline-variant flex justify-between items-center">
              <h3 className="font-h3 text-h3 text-on-surface">{editTierModalData ? 'Edit Tier Tiket' : 'Tambah Tier Tiket'}</h3>
              <button className="text-secondary hover:text-on-surface" onClick={() => { setEditTierModalData(null); setAddTierModalOpen(false); }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveTier}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-secondary font-label-md mb-1">Nama Tier</label>
                  <input 
                    type="text" 
                    required 
                    value={tierForm.tier_name}
                    onChange={(e) => setTierForm({ ...tierForm, tier_name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder="Misal: VIP, Regular"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={tierForm.price}
                    onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md mb-1">Kuota Total</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={tierForm.quota}
                    onChange={(e) => setTierForm({ ...tierForm, quota: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder="100"
                  />
                  {editTierModalData && (
                    <p className="text-secondary text-caption mt-1">Kuota tidak boleh kurang dari tiket yang sudah terjual.</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-5 bg-surface-container-low flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all active:scale-95">
                  Simpan Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Edit/Add Tenant */}
      {(editTenantModalData || addTenantModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-md rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
            <div className="px-6 py-5 border-b-[0.5px] border-outline-variant flex justify-between items-center">
              <h3 className="font-h3 text-h3 text-on-surface">{editTenantModalData ? 'Edit Tenant' : 'Tambah Tenant'}</h3>
              <button className="text-secondary hover:text-on-surface" onClick={() => { setEditTenantModalData(null); setAddTenantModalOpen(false); }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveTenant}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-secondary font-label-md mb-1">Nama Tenant (F&B / Booth)</label>
                  <input 
                    type="text" 
                    required 
                    value={tenantForm.full_name}
                    onChange={(e) => setTenantForm({ ...tenantForm, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder="Misal: Kopi Kenangan"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md mb-1">Email Tenant</label>
                  <input 
                    type="email" 
                    required 
                    value={tenantForm.email}
                    onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder="tenant@email.com"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md mb-1">Password</label>
                  <input 
                    type="password" 
                    required={!editTenantModalData} 
                    value={tenantForm.password}
                    onChange={(e) => setTenantForm({ ...tenantForm, password: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg font-body-sm focus:outline-none focus:border-primary"
                    placeholder={editTenantModalData ? "Kosongkan jika tidak ingin mengubah password" : "Minimal 8 karakter"}
                    minLength="8"
                  />
                </div>
              </div>
              <div className="px-6 py-5 bg-surface-container-low flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all active:scale-95">
                  Simpan Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Withdraw */}
      {withdrawalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-h2 text-h2 font-black text-on-surface">Tarik Dana</h3>
              <button className="text-secondary hover:text-on-surface" onClick={() => setWithdrawalModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleWithdrawal}>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Nominal (Rp)</label>
                  <input type="number" name="amount" required min="10000" max={stats?.available_to_withdraw || 0} value={wdAmount} onChange={e => setWdAmount(e.target.value)}
                         className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                         placeholder="Misal: 1500000" />
                  <p className="text-[11px] text-secondary mt-1">Maksimal: Rp {formatRp(stats?.available_to_withdraw)}</p>
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
                  <button type="button" className="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onClick={() => setWithdrawalModalOpen(false)}>
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
