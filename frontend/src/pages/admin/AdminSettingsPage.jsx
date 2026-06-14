import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function AdminSettingsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile & Org state
  const [formProfile, setFormProfile] = useState({
    full_name: '',
    phone: '',
    organization_name: '',
    organization_type: '',
    organization_description: '',
    organization_address: '',
    organization_website: '',
    organization_instagram: '',
    organization_tiktok: '',
    organization_twitter: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
  });

  // Notification prefs state
  const [notifPrefs, setNotifPrefs] = useState({
    email_notifications: true,
    system_alerts: true,
    ticket_sales: true,
    daily_report: false,
  });

  // Security state
  const [formSecurity, setFormSecurity] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA state
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  // Active sessions
  const [activeSessions, setActiveSessions] = useState([]);

  const [profilePicture, setProfilePicture] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const NAV = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
    { key: 'events', icon: 'event', label: 'Event Saya', to: '/admin/events' },
    { key: 'scanner', icon: 'qr_code_scanner', label: 'Scanner', to: '/admin/scanner' },
    { key: 'finance', icon: 'payments', label: 'Keuangan', to: '/admin/finance' },
    { key: 'settings', icon: 'settings', label: 'Pengaturan', to: '/admin/settings' },
  ];

  const TABS = [
    { key: 'profile', label: 'Profil Akun', icon: 'person' },
    { key: 'organization', label: 'Detail Organisasi', icon: 'business' },
    { key: 'security', label: 'Keamanan', icon: 'lock' },
    { key: 'notifications', label: 'Notifikasi', icon: 'notifications' },
  ];

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 5000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/settings');
        const d = res.data.data;
        setFormProfile({
          full_name: d.full_name || '',
          phone: d.phone || '',
          organization_name: d.organization_name || '',
          organization_type: d.organization_type || '',
          organization_description: d.organization_description || '',
          organization_address: d.organization_address || '',
          organization_website: d.organization_website || '',
          organization_instagram: d.organization_instagram || '',
          organization_tiktok: d.organization_tiktok || '',
          organization_twitter: d.organization_twitter || '',
          bank_name: d.bank_name || '',
          bank_account_number: d.bank_account_number || '',
          bank_account_name: d.bank_account_name || '',
        });
        if (d.notification_prefs) setNotifPrefs(d.notification_prefs);
        setProfilePicture(d.profile_picture || null);
        if (d.created_at) {
          setLastUpdated(new Date(d.created_at).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/admin/settings/sessions');
      setActiveSessions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSessions();
    }
  }, [activeTab]);

  const handleProfileChange = (e) => {
    setFormProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.post('/admin/settings/profile', {
        ...formProfile,
        notification_prefs: notifPrefs,
      });
      showSuccess('Pengaturan berhasil disimpan!');
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await api.post('/admin/settings/profile', { notification_prefs: notifPrefs });
      showSuccess('Preferensi notifikasi berhasil disimpan!');
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menyimpan preferensi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (!formSecurity.current_password || !formSecurity.new_password) {
      showError('Harap isi semua field password.');
      return;
    }
    if (formSecurity.new_password !== formSecurity.new_password_confirmation) {
      showError('Konfirmasi password baru tidak cocok.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/settings/security', formSecurity);
      showSuccess('Password berhasil diperbarui!');
      setFormSecurity({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal memperbarui password.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(URL.createObjectURL(file));
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const res = await api.post('/admin/settings/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfilePicture(res.data.data.profile_picture_url);
      showSuccess('Foto profil berhasil diperbarui!');
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengunggah foto.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await api.delete(`/admin/settings/sessions/${id}`);
      fetchSessions();
      showSuccess('Sesi berhasil dikeluarkan.');
    } catch (err) {
      showError('Gagal mengeluarkan sesi.');
    }
  };

  const handleDeleteAllSessions = async () => {
    try {
      await api.delete('/admin/settings/sessions/all');
      fetchSessions();
      showSuccess('Semua sesi lain berhasil dikeluarkan.');
    } catch (err) {
      showError('Gagal mengeluarkan sesi.');
    }
  };

  const handleSaveForTab = () => {
    if (activeTab === 'security') return handleSaveSecurity();
    if (activeTab === 'notifications') return handleSaveNotifications();
    return handleSaveProfile();
  };

  const adminInitial = (user?.full_name || 'O')[0].toUpperCase();

  // ── Reusable Toggle ──
  const Toggle = ({ checked, onToggle, size = 'normal' }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        size === 'large' ? 'w-14 h-7' : 'w-11 h-6'
      } ${checked ? 'bg-primary' : 'bg-secondary-fixed-dim'}`}
    >
      <span className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        size === 'large' ? 'w-6 h-6' : 'w-5 h-5'
      } ${checked ? (size === 'large' ? 'translate-x-7' : 'translate-x-5') : 'translate-x-0'}`} />
    </button>
  );

  // ── Input Field ──
  const Field = ({ label, children, note }) => (
    <div className="space-y-1.5">
      <label className="block font-label-md text-label-md text-secondary">{label}</label>
      {children}
      {note && <p className="text-[11px] text-secondary">{note}</p>}
    </div>
  );

  const inputCls = "w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:border-primary focus:ring-0 outline-none transition-colors";

  // ── Password Field with Toggle ──
  const PasswordField = ({ label, value, onChange, placeholder, show, onToggleShow }) => (
    <Field label={label}>
      <div className="relative">
        <input 
          type={show ? "text" : "password"} 
          value={value} 
          onChange={onChange} 
          className={`${inputCls} pr-10`} 
          placeholder={placeholder} 
        />
        <button 
          type="button" 
          onClick={onToggleShow} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">
            {show ? 'visibility' : 'visibility_off'}
          </span>
        </button>
      </div>
    </Field>
  );

  return (
    <div className="bg-background text-on-surface min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar (Desktop) ── */}
      <aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
        <div className="px-6 mb-10">
          <h2 className="font-h2 text-h2 font-black text-primary">GateMate</h2>
          <p className="font-caption text-caption text-secondary">Organizer</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ key, icon, label, to }) => (
            <Link key={key} to={to}
              className={`flex items-center px-6 py-3 transition-colors cursor-pointer font-body-sm text-body-sm ${key === 'settings' ? 'border-l-4 border-primary bg-primary-fixed text-primary font-bold' : 'text-secondary hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined mr-3">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center">
              {profilePicture ? (
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={profilePicture} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{adminInitial}</div>
              )}
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

      {/* ── Top Nav (sticky) ── */}
      <header className="flex justify-between items-center w-full h-[64px] px-page-padding lg:pl-[264px] bg-surface border-b-[0.5px] border-outline-variant sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="font-h3 text-h3 font-black text-on-surface">Pengaturan</h2>
        </div>
        <div className="flex items-center gap-3">
          {profilePicture ? (
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover md:hidden" src={profilePicture} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm md:hidden">{adminInitial}</div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="lg:pl-[240px] min-h-screen pb-24 md:pb-10">
        <div className="max-w-[1200px] mx-auto p-page-padding space-y-stack-lg">

          {/* Page Header */}
          <div className="pt-2">
            <nav className="flex items-center space-x-2 text-secondary font-label-md text-label-md mb-2">
              <Link to="/admin/dashboard" className="cursor-pointer hover:text-primary transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface-variant">Pengaturan</span>
            </nav>
            <h1 className="text-[32px] font-bold text-on-surface leading-10">Pengaturan Akun</h1>
            <p className="font-body-sm text-body-sm text-secondary mt-1">Kelola profil, keamanan, dan preferensi akun Anda.</p>
          </div>

          {/* Global Messages */}
          {successMsg && (
            <div className="bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg flex items-center gap-2 font-body-sm text-body-sm shadow-sm">
              <span className="material-symbols-outlined">check_circle</span>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg flex items-center gap-2 font-body-sm text-body-sm shadow-sm">
              <span className="material-symbols-outlined">error</span>
              {errorMsg}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b-[0.5px] border-outline-variant flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-5 py-3.5 border-b-2 whitespace-nowrap font-body-sm text-body-sm transition-colors ${activeTab === tab.key ? 'border-primary text-primary font-bold' : 'border-transparent text-secondary hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-secondary">
              <span className="material-symbols-outlined animate-spin mr-3 text-primary">progress_activity</span>
              Memuat pengaturan...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">

              {/* ─── Left / Main Area ─── */}
              <div className={`space-y-stack-lg ${activeTab === 'security' ? 'lg:col-span-12' : 'lg:col-span-8'}`}>

                {/* ═══ TAB: PROFIL AKUN ═══ */}
                {activeTab === 'profile' && (
                  <div className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-primary">person</span>
                      <h3 className="font-h3 text-h3 text-on-surface">Profil Pengguna</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                        <div className="relative w-28 h-28 rounded-full border-[0.5px] border-outline-variant overflow-hidden group bg-surface-container-low cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}>
                          {profilePicture ? (
                            <img alt="Profile" className="w-full h-full object-cover" src={profilePicture} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">{adminInitial}</div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            {photoUploading
                              ? <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
                              : <span className="material-symbols-outlined text-white">photo_camera</span>}
                          </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        <button onClick={() => fileInputRef.current?.click()} className="text-primary font-bold text-[12px] hover:underline">Ganti Foto</button>
                        <p className="text-[11px] text-secondary text-center">JPG, PNG, WebP. Maks 2MB.</p>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 space-y-stack-md">
                        <Field label="Nama Lengkap">
                          <input type="text" name="full_name" value={formProfile.full_name} onChange={handleProfileChange} className={inputCls} placeholder="Nama lengkap Anda" />
                        </Field>
                        <Field label="Email" note="Email tidak dapat diubah.">
                          <input type="email" value={user?.email || ''} disabled className="w-full bg-surface-container border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-secondary cursor-not-allowed" />
                        </Field>
                        <Field label="Nomor Telepon">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-body-sm text-body-sm">+62</span>
                            <input type="tel" name="phone" value={formProfile.phone} onChange={handleProfileChange} className={`${inputCls} pl-12`} placeholder="81234567890" />
                          </div>
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ TAB: DETAIL ORGANISASI ═══ */}
                {activeTab === 'organization' && (
                  <div className="space-y-stack-lg">

                    {/* Informasi Organisasi */}
                    <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-primary">corporate_fare</span>
                        <h3 className="font-h3 text-h3 text-on-surface font-bold">Informasi Organisasi</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                        <Field label="Nama Organisasi / EO">
                          <input type="text" name="organization_name" value={formProfile.organization_name} onChange={handleProfileChange} className={inputCls} placeholder="PT. Kreasi Mandiri Event" />
                        </Field>
                        <Field label="Nomor Telepon Organisasi">
                          <input type="tel" name="phone" value={formProfile.phone} onChange={handleProfileChange} className={inputCls} placeholder="+62 21 555 0123" />
                        </Field>
                        <Field label="Jenis Organisasi">
                          <select name="organization_type" value={formProfile.organization_type} onChange={handleProfileChange} className={inputCls}>
                            <option value="">Pilih jenis organisasi...</option>
                            <option value="perusahaan">Perusahaan</option>
                            <option value="komunitas">Komunitas</option>
                            <option value="organisasi_nirlaba">Organisasi Nirlaba</option>
                            <option value="kampus">Kampus / Pendidikan</option>
                            <option value="pemerintahan">Pemerintahan</option>
                            <option value="perorangan">Perorangan / Freelance</option>
                          </select>
                        </Field>
                        <Field label="Website (Opsional)">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[12px]">https://</span>
                            <input type="text" name="organization_website" value={formProfile.organization_website.replace(/^https?:\/\//, '')} onChange={e => setFormProfile(p => ({ ...p, organization_website: 'https://' + e.target.value }))} className={`${inputCls} pl-16`} placeholder="www.organisasianda.com" />
                          </div>
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="Alamat Kantor">
                            <textarea name="organization_address" value={formProfile.organization_address} onChange={handleProfileChange} rows={3} className={`${inputCls} resize-none`} placeholder="Gedung / Jalan / Kota..." />
                          </Field>
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Deskripsi Singkat">
                            <textarea name="organization_description" value={formProfile.organization_description} onChange={handleProfileChange} rows={3} className={`${inputCls} resize-none`} placeholder="Ceritakan tentang organisasi Anda..." />
                          </Field>
                        </div>
                      </div>
                    </section>

                    {/* Media Sosial */}
                    <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-primary">share</span>
                        <h3 className="font-h3 text-h3 text-on-surface font-bold">Media Sosial</h3>
                      </div>
                      <div className="space-y-stack-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                          <Field label="Instagram Handle">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">@</span>
                              <input type="text" name="organization_instagram" value={formProfile.organization_instagram} onChange={handleProfileChange} className={`${inputCls} pl-9`} placeholder="nama_akun" />
                            </div>
                          </Field>
                          <Field label="TikTok Handle">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">@</span>
                              <input type="text" name="organization_tiktok" value={formProfile.organization_tiktok} onChange={handleProfileChange} className={`${inputCls} pl-9`} placeholder="username_tiktok" />
                            </div>
                          </Field>
                        </div>
                        <Field label="X / Twitter Handle (Opsional)">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">@</span>
                            <input type="text" name="organization_twitter" value={formProfile.organization_twitter} onChange={handleProfileChange} className={`${inputCls} pl-9`} placeholder="username_twitter" />
                          </div>
                        </Field>
                      </div>
                    </section>

                    {/* Informasi Rekening */}
                    <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-primary">account_balance</span>
                        <h3 className="font-h3 text-h3 text-on-surface font-bold">Rekening Penarikan Dana</h3>
                      </div>
                      <div className="space-y-stack-md">
                        <Field label="Nama Bank / E-Wallet">
                          <input type="text" name="bank_name" value={formProfile.bank_name} onChange={handleProfileChange} className={inputCls} placeholder="Misal: BCA, GoPay, OVO" />
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                          <Field label="Nomor Rekening">
                            <input type="text" name="bank_account_number" value={formProfile.bank_account_number} onChange={handleProfileChange} className={inputCls} placeholder="0123456789" />
                          </Field>
                          <Field label="Nama Pemilik Rekening">
                            <input type="text" name="bank_account_name" value={formProfile.bank_account_name} onChange={handleProfileChange} className={inputCls} placeholder="Sesuai nama di rekening" />
                          </Field>
                        </div>
                      </div>
                    </section>

                    {/* Dokumen Legalitas */}
                    <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">verified_user</span>
                          <h3 className="font-h3 text-h3 text-on-surface font-bold">Dokumen Legalitas</h3>
                        </div>
                        <button className="text-primary font-bold text-[13px] hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                          Update Dokumen
                        </button>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 p-4 rounded-xl border-[0.5px] border-outline-variant bg-surface-container-low flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined">badge</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-body-sm text-body-sm font-bold text-on-surface">KTP Penanggung Jawab</p>
                            <p className="font-caption text-caption text-secondary">
                              {user?.ktp_document ? 'Terverifikasi ✓' : 'Belum diunggah'}
                            </p>
                          </div>
                          {user?.ktp_document && (
                            <button className="text-secondary hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                          )}
                        </div>
                        <div className="flex-1 p-4 rounded-xl border-[0.5px] border-outline-variant bg-surface-container-low flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined">description</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-body-sm text-body-sm font-bold text-on-surface">SIUP / Izin Usaha</p>
                            <p className="font-caption text-caption text-secondary">Belum diunggah</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-surface-container-low rounded-xl border border-dashed border-outline-variant flex items-start gap-3">
                        <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">info</span>
                        <p className="font-caption text-caption text-secondary">Perubahan pada nama organisasi akan memerlukan proses verifikasi ulang oleh tim GateMate selama maksimal 2×24 jam.</p>
                      </div>
                    </section>
                  </div>
                )}

                {/* ═══ TAB: KEAMANAN ═══ */}
                {activeTab === 'security' && (
                  <div className="space-y-stack-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">

                      {/* Ubah Password */}
                      <section className="lg:col-span-7 bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined">lock_reset</span>
                          </div>
                          <h3 className="font-h3 text-h3 text-on-surface">Ubah Password</h3>
                        </div>
                        <div className="space-y-stack-md">
                          <div className="p-4 bg-surface-container-low rounded-xl border-[0.5px] border-outline-variant flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">info</span>
                            <p className="font-body-sm text-body-sm text-secondary">Password baru minimal 8 karakter. Gunakan kombinasi huruf, angka, dan simbol.</p>
                          </div>
                          <PasswordField 
                            label="Kata Sandi Saat Ini" 
                            value={formSecurity.current_password}
                            onChange={e => setFormSecurity(p => ({ ...p, current_password: e.target.value }))}
                            placeholder="Masukkan kata sandi lama Anda"
                            show={showCurrentPassword}
                            onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                            <PasswordField 
                              label="Kata Sandi Baru" 
                              value={formSecurity.new_password}
                              onChange={e => setFormSecurity(p => ({ ...p, new_password: e.target.value }))}
                              placeholder="Min. 8 karakter"
                              show={showNewPassword}
                              onToggleShow={() => setShowNewPassword(!showNewPassword)}
                            />
                            <PasswordField 
                              label="Konfirmasi Kata Sandi Baru" 
                              value={formSecurity.new_password_confirmation}
                              onChange={e => setFormSecurity(p => ({ ...p, new_password_confirmation: e.target.value }))}
                              placeholder="Ulangi kata sandi baru"
                              show={showConfirmPassword}
                              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                          </div>
                          <div className="pt-2">
                            <button onClick={handleSaveSecurity} disabled={saving}
                              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-body-sm text-body-sm font-bold hover:brightness-95 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                              {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                              {saving ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                            </button>
                          </div>
                        </div>
                      </section>

                      {/* 2FA Card */}
                      <section className="lg:col-span-5 bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity select-none pointer-events-none">
                          <span className="material-symbols-outlined text-[80px]">verified_user</span>
                        </div>
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#b2ebff] flex items-center justify-center text-tertiary flex-shrink-0">
                              <span className="material-symbols-outlined">shield_lock</span>
                            </div>
                            <h3 className="font-h3 text-h3 text-on-surface">Autentikasi 2FA</h3>
                          </div>
                          <p className="text-secondary font-body-sm text-body-sm mb-6 leading-relaxed">Tambahkan lapisan keamanan ekstra. Kami akan meminta kode keamanan setiap login dari perangkat tidak dikenal.</p>
                          <div className="mt-auto flex items-center justify-between p-4 bg-surface-container rounded-lg border-[0.5px] border-outline-variant">
                            <div>
                              <p className="font-body-sm text-body-sm font-bold text-on-surface">Aktifkan 2FA</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold mt-1 ${twoFaEnabled ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-error-container text-error'}`}>
                                {twoFaEnabled ? '✓ Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                            <Toggle checked={twoFaEnabled} onToggle={() => setTwoFaEnabled(!twoFaEnabled)} size="large" />
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Sesi Aktif */}
                    <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden">
                      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-surface flex-shrink-0">
                            <span className="material-symbols-outlined">devices</span>
                          </div>
                          <h3 className="font-h3 text-h3 text-on-surface">Sesi Aktif</h3>
                        </div>
                        <button onClick={handleDeleteAllSessions} className="text-primary font-body-sm text-body-sm font-bold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          Keluar dari semua sesi
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-surface-container-low text-secondary">
                            <tr>
                              {['Perangkat', 'Lokasi', 'Waktu Login', ''].map(h => (
                                <th key={h} className="px-6 py-4 font-label-md text-label-md uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant">
                            {activeSessions.map(session => (
                              <tr key={session.id} className="hover:bg-surface-container transition-colors">
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary">{session.icon}</span>
                                    <div>
                                      <p className="font-body-sm text-body-sm font-bold text-on-surface">{session.device}</p>
                                      <p className="font-caption text-caption text-secondary">{session.ip}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                                    <span className="font-body-sm text-body-sm text-on-surface">{session.location}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  {session.current ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-[#DCFCE7] text-[#15803D] font-bold">
                                      ● Aktif sekarang
                                    </span>
                                  ) : (
                                    <span className="font-body-sm text-body-sm text-secondary">{session.time}</span>
                                  )}
                                </td>
                                <td className="px-6 py-5 text-right">
                                  {!session.current && (
                                    <button onClick={() => handleDeleteSession(session.id)} className="text-error font-body-sm text-body-sm font-bold px-3 py-1.5 hover:bg-error-container rounded-lg transition-colors active:scale-95">
                                      Keluar
                                    </button>
                                  )}
                                  {session.current && (
                                    <span className="text-secondary font-body-sm text-body-sm font-bold px-3 py-1.5 inline-block">Sesi ini</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                )}

                {/* ═══ TAB: NOTIFIKASI ═══ */}
                {activeTab === 'notifications' && (
                  <div className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-primary">notifications_active</span>
                      <h3 className="font-h3 text-h3 text-on-surface">Preferensi Notifikasi</h3>
                    </div>
                    <div className="space-y-0 divide-y divide-outline-variant">
                      {[
                        { key: 'email_notifications', label: 'Notifikasi Email', desc: 'Dapatkan pembaruan penjualan tiket langsung di email Anda.', icon: 'email' },
                        { key: 'system_alerts', label: 'Peringatan Sistem', desc: 'Notifikasi browser untuk laporan harian dan pemindaian.', icon: 'warning' },
                        { key: 'ticket_sales', label: 'Penjualan Tiket', desc: 'Notifikasi real-time setiap ada tiket yang terjual.', icon: 'confirmation_number' },
                        { key: 'daily_report', label: 'Laporan Harian', desc: 'Ringkasan penjualan dan statistik event setiap hari pukul 08:00.', icon: 'bar_chart' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                          <div className="flex items-start gap-3 flex-1 pr-6">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${notifPrefs[item.key] ? 'bg-primary-fixed text-primary' : 'bg-surface-container text-secondary'}`}>
                              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                            </div>
                            <div>
                              <p className="font-body-sm text-body-sm font-bold text-on-surface">{item.label}</p>
                              <p className="text-secondary font-caption text-caption">{item.desc}</p>
                            </div>
                          </div>
                          <Toggle checked={notifPrefs[item.key]} onToggle={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Right Sidebar ─── (hidden on security tab since it uses full-width layout) */}
              {activeTab !== 'security' && (
                <aside className="lg:col-span-4 space-y-stack-lg lg:sticky lg:top-24">

                  {/* Save Card */}
                  <div className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined">verified_user</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md font-bold text-on-surface">Status Akun</p>
                        {user?.is_verified_organizer ? (
                          <p className="text-[#2E7D32] font-caption text-caption font-bold">✓ Terverifikasi</p>
                        ) : (
                          <p className="text-orange-600 font-caption text-caption font-bold">Menunggu Verifikasi</p>
                        )}
                      </div>
                    </div>
                    {lastUpdated && (
                      <p className="text-secondary font-body-sm text-body-sm mb-4 text-[12px]">
                        Bergabung: {lastUpdated}
                      </p>
                    )}
                    <div className="border-t border-outline-variant pt-4 space-y-2 mb-4">
                      <p className="font-body-sm text-body-sm text-secondary">Pastikan semua data yang Anda masukkan sudah benar sebelum menyimpan.</p>
                    </div>
                    <div className="space-y-3">
                      <button onClick={handleSaveForTab} disabled={saving}
                        className="w-full py-3 bg-primary text-on-primary rounded-[22px] font-body-sm text-body-sm font-bold active:opacity-80 hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all shadow-sm">
                        {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                      <button onClick={() => window.location.reload()}
                        className="w-full py-3 bg-transparent text-secondary border-[0.5px] border-outline-variant rounded-[22px] font-body-sm text-body-sm hover:bg-surface-container-low transition-colors font-bold">
                        Batal
                      </button>
                    </div>
                  </div>

                  {/* Tab Navigation Card */}
                  <div className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant p-stack-lg">
                    <h4 className="font-label-md text-label-md font-bold text-on-surface mb-3">Navigasi Cepat</h4>
                    <nav className="space-y-1">
                      {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 font-body-sm text-body-sm transition-colors ${activeTab === tab.key ? 'bg-primary-fixed text-primary font-bold' : 'text-secondary hover:bg-surface-container-low'}`}>
                          <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Help Card */}
                  <div className="bg-surface-container-low rounded-[14px] border border-dashed border-outline-variant p-stack-lg">
                    <h4 className="font-label-md text-label-md font-bold text-secondary uppercase tracking-wider mb-2">Butuh Bantuan?</h4>
                    <p className="font-body-sm text-body-sm text-on-surface mb-4">Hubungi account manager Anda untuk bantuan perubahan data yang mendesak.</p>
                    <a href="mailto:support@gatemate.id" className="inline-flex items-center text-primary font-bold font-body-sm text-body-sm group hover:underline">
                      Hubungi Support
                      <span className="material-symbols-outlined ml-1 text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
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
        <Link to="/admin/finance" className="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-md text-label-md">Finance</span>
        </Link>
        <Link to="/admin/settings" className="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </Link>
      </nav>

    </div>
  );
}
