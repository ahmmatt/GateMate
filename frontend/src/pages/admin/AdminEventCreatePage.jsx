import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';

export default function AdminEventCreatePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tab-info');

  const [formData, setFormData] = useState({
    title: '', category: '', description: '',
    start_date: '', start_time: '', end_date: '', end_time: '',
    location_type: 'offline', location_details: '', venue_name: '', city: '', maps_link: '',
    tier_name: 'Regular Ticket', price: '150000', quota: '500',
    capacity_type: 'limited', max_capacity: '', seat_assignment: 'bebas', require_approval: false
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
  // Seat Configuration Modal State
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [seatPrefix, setSeatPrefix] = useState('');
  const [seatStart, setSeatStart] = useState('');
  const [seatEnd, setSeatEnd] = useState('');

  const generateSeats = () => {
    if (!seatPrefix || !seatStart || !seatEnd) {
      alert('Mohon lengkapi awalan (Prefix), mulai, dan sampai.');
      return;
    }
    const start = parseInt(seatStart);
    const end = parseInt(seatEnd);
    if (start > end) {
      alert('Nilai awal tidak boleh lebih besar dari nilai akhir.');
      return;
    }
    
    const newSeats = [];
    for (let i = start; i <= end; i++) {
      newSeats.push(`${seatPrefix}${i}`);
    }
    
    setSeatNumbers(prev => {
      const combined = [...new Set([...prev, ...newSeats])];
      return combined.sort();
    });
    
    setSeatPrefix('');
    setSeatStart('');
    setSeatEnd('');
  };

  const removeSeat = (seat) => {
    setSeatNumbers(prev => prev.filter(s => s !== seat));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' || typeof formData[key] === 'boolean') {
        payload.append(key, formData[key]);
      }
    });
    if (bannerFile) payload.append('banner_image', bannerFile);
    
    if (formData.capacity_type === 'limited' && formData.seat_assignment === 'pilih') {
      payload.append('seat_numbers', JSON.stringify(seatNumbers));
    }

    try {
      const res = await api.post('/admin/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Event berhasil dibuat!');
      navigate(`/admin/events/${res.data.data.id_event}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat event. Periksa kembali input Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-lg text-on-surface min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
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
          <Link to="/admin/events" className="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer">
            <span className="material-symbols-outlined mr-3">event</span>
            <span className="font-body-sm text-body-sm">Event Saya</span>
          </Link>
          <Link to="/admin/scanner" className="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
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
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover bg-surface-container-high" src={`http://localhost:8000/Media/uploads/${user.profile_picture}`}/>
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

      {/* Bottom Navigation (Mobile) */}
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

      {/* Top App Bar */}
      <header className="flex justify-between items-center h-16 px-gutter fixed top-0 left-0 right-0 md:ml-sidebar-width bg-surface border-b border-outline-variant z-30">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-secondary">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-h3 text-h3 text-on-surface">Buat Event Baru</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:bg-surface-container-low rounded-full p-2 text-secondary transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:ml-sidebar-width min-h-screen">
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="max-w-[800px] mx-auto px-gutter mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          <div className="max-w-[800px] mx-auto px-gutter py-stack-lg">
            {/* Step Navigation */}
            <div className="mb-stack-lg flex overflow-x-auto no-scrollbar gap-stack-lg border-b border-outline-variant">
              <button type="button" onClick={() => setActiveTab('tab-info')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-info' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Informasi Dasar</button>
              <button type="button" onClick={() => setActiveTab('tab-jadwal')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-jadwal' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Jadwal & Lokasi</button>
              <button type="button" onClick={() => setActiveTab('tab-tiket')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-tiket' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Tiket</button>
              <button type="button" onClick={() => setActiveTab('tab-lanjut')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-lanjut' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Pengaturan Lanjut</button>
            </div>

            {/* Tab: Informasi Dasar */}
            {activeTab === 'tab-info' && (
              <div className="space-y-stack-lg block animate-fade-in">
                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <h3 className="font-h3 text-h3 mb-stack-md">Informasi Dasar</h3>
                  <div className="space-y-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Judul Event</label>
                      <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Contoh: Jakarta Tech Conference 2024" type="text"/>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Kategori</label>
                      <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all">
                        <option value="">Pilih Kategori</option>
                        <option value="Technology">Teknologi</option>
                        <option value="Music">Musik</option>
                        <option value="Sports">Olahraga</option>
                        <option value="Education">Pendidikan</option>
                        <option value="Business">Bisnis</option>
                        <option value="Other">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Poster Event</label>
                      <label className="relative cursor-pointer border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low h-48 flex flex-col items-center justify-center overflow-hidden">
                        <input type="file" name="banner_image" accept="image/*" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                        {bannerPreview ? (
                          <img src={bannerPreview} className="absolute inset-0 w-full h-full object-cover z-0" alt="Preview" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-4xl text-secondary mb-2 relative z-10">image</span>
                            <p className="text-secondary font-body-sm relative z-10">Klik atau seret gambar ke sini</p>
                            <p className="text-caption text-secondary mt-1 relative z-10">Rasio 16:9 direkomendasikan (Maks 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Deskripsi Event</label>
                      <div className="border border-outline-variant rounded-lg overflow-hidden">
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-none bg-surface p-4 focus:ring-0 focus:outline-none" placeholder="Jelaskan detail event anda kepada calon pembeli..." rows="6"></textarea>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Jadwal & Lokasi */}
            {activeTab === 'tab-jadwal' && (
              <div className="space-y-stack-lg block animate-fade-in">
                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <h3 className="font-h3 text-h3 mb-stack-md">Jadwal & Lokasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Mulai</label>
                      <div className="flex gap-2">
                        <input name="start_date" value={formData.start_date} onChange={handleChange} required className="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/>
                        <input name="start_time" value={formData.start_time} onChange={handleChange} required className="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Berakhir</label>
                      <div className="flex gap-2">
                        <input name="end_date" value={formData.end_date} onChange={handleChange} required className="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/>
                        <input name="end_time" value={formData.end_time} onChange={handleChange} required className="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                      </div>
                    </div>
                  </div>
                  <div className="mb-stack-md">
                    <label className="block font-label-md text-label-md text-secondary mb-2">Tipe Lokasi</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={formData.location_type === 'offline'} onChange={handleChange} className="text-primary accent-primary" name="location_type" type="radio" value="offline"/>
                        <span className="font-body-sm">Venue Fisik</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={formData.location_type === 'online'} onChange={handleChange} className="text-primary accent-primary" name="location_type" type="radio" value="online"/>
                        <span className="font-body-sm">Online / Virtual</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.location_type === 'offline' ? (
                    <div className="space-y-stack-md">
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Alamat Lengkap</label>
                        <textarea name="location_details" value={formData.location_details} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Masukkan Alamat Lengkap Venue" rows="3"></textarea>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Nama Venue / Kota</label>
                        <input name="venue_name" value={formData.venue_name} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all mb-2" placeholder="Contoh: Istora Senayan" type="text"/>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Contoh: Jakarta" type="text"/>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Kode Embed Maps (Iframe)</label>
                        <textarea name="maps_link" value={formData.maps_link} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Paste kode <iframe src='...'></iframe> di sini" rows="3"></textarea>
                        <p className="font-caption text-secondary mt-1">Buka Google Maps &gt; Klik Bagikan (Share) &gt; Pilih Sematkan Peta (Embed a map) &gt; Salin HTML.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-stack-md">
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Link Meeting</label>
                        <input name="location_details" value={formData.location_details} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Zoom, Google Meet, atau Link Streaming" type="url" />
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* Tab: Tiket */}
            {activeTab === 'tab-tiket' && (
              <div className="space-y-stack-lg block animate-fade-in">
                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <div className="flex justify-between items-center mb-stack-md">
                    <h3 className="font-h3 text-h3">Manajemen Tiket</h3>
                    <button type="button" onClick={() => alert('Anda dapat menambahkan lebih banyak tier tiket setelah event ini dibuat.')} className="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed/30 px-3 py-1.5 rounded transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                      <span className="text-sm">Tambah Tier</span>
                    </button>
                  </div>
                  <p className="font-caption text-secondary mb-4">Konfigurasi tier tiket pertama Anda. Tier tiket tambahan dapat ditambahkan nanti melalui halaman kelola event.</p>
                  <div className="space-y-6">
                    <div className="p-5 bg-surface rounded-lg border border-outline-variant">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Nama Tiket</label>
                            <input name="tier_name" value={formData.tier_name} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="text"/>
                          </div>
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Harga (IDR)</label>
                            <input name="price" value={formData.price} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="number"/>
                          </div>
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Stok</label>
                            <input name="quota" value={formData.quota} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="number"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg mb-stack-lg">
                  <h3 className="font-h3 text-h3 mb-stack-md">Kapasitas Event</h3>
                  <div className="space-y-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-2">Tipe Kapasitas</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input checked={formData.capacity_type === 'unlimited'} onChange={handleChange} className="text-primary accent-primary" name="capacity_type" type="radio" value="unlimited"/>
                          <span className="font-body-sm">Tidak Terbatas</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input checked={formData.capacity_type === 'limited'} onChange={handleChange} className="text-primary accent-primary" name="capacity_type" type="radio" value="limited"/>
                          <span className="font-body-sm">Terbatas</span>
                        </label>
                      </div>
                    </div>
                    {formData.capacity_type === 'limited' && (
                      <div className="space-y-stack-md border-t border-outline-variant pt-stack-md animate-fade-in">
                        <div>
                          <label className="block font-label-md text-label-md text-secondary mb-3">Pengaturan Tempat Duduk</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${formData.seat_assignment === 'bebas' ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary'}`}>
                              <input checked={formData.seat_assignment === 'bebas'} onChange={handleChange} className="absolute top-4 right-4 text-primary accent-primary" name="seat_assignment" type="radio" value="bebas"/>
                              <span className={`material-symbols-outlined mb-2 ${formData.seat_assignment === 'bebas' ? 'text-primary' : 'text-secondary'}`}>event_seat</span>
                              <span className="font-label-md font-bold">Pilih Kursi Mandiri</span>
                              <span className="text-caption text-secondary">User selects their own seat from a map</span>
                            </label>
                            <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${formData.seat_assignment === 'pilih' ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary'}`}>
                              <input checked={formData.seat_assignment === 'pilih'} onChange={(e) => { handleChange(e); setSeatModalOpen(true); }} className="absolute top-4 right-4 text-primary accent-primary" name="seat_assignment" type="radio" value="pilih"/>
                              <span className={`material-symbols-outlined mb-2 ${formData.seat_assignment === 'pilih' ? 'text-primary' : 'text-secondary'}`}>edit_square</span>
                              <span className="font-label-md font-bold">Input Pengaturan Seat</span>
                              <span className="text-caption text-secondary">Organizer manually inputs seat numbers</span>
                            </label>
                            {formData.seat_assignment === 'pilih' && (
                              <div className="col-span-1 md:col-span-2 mt-2">
                                <button type="button" onClick={() => setSeatModalOpen(true)} className="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed/30 px-4 py-2 rounded-lg border border-primary transition-colors w-max">
                                  <span className="material-symbols-outlined">settings</span>
                                  Atur Kursi Sekarang ({seatNumbers.length} Kursi)
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block font-label-md text-label-md text-secondary mb-1">Total Kapasitas</label>
                          <input name="max_capacity" value={formData.max_capacity} onChange={handleChange} className="w-full md:w-1/3 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Contoh: 1000" type="number"/>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Pengaturan Lanjut */}
            {activeTab === 'tab-lanjut' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg animate-fade-in">
                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                    <h3 className="font-h3 text-h3">Privasi & Izin</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                      <div className="pr-4">
                        <h4 className="font-label-md font-bold">Persetujuan Peserta</h4>
                        <p className="font-caption text-secondary">Setiap peserta harus mendapatkan persetujuan penyelenggara.</p>
                      </div>
                      <div onClick={() => setFormData(p => ({ ...p, require_approval: !p.require_approval }))} className={`toggle-container relative inline-block w-12 h-6 transition-colors rounded-full cursor-pointer mt-1 flex-shrink-0 ${formData.require_approval ? 'bg-primary' : 'bg-gray-300'}`}>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform shadow-md ${formData.require_approval ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="fixed bottom-0 right-0 left-0 md:left-[240px] bg-surface border-t border-outline-variant px-gutter py-4 flex justify-between items-center z-40">
            <div className="hidden sm:block">
              <p className="font-caption text-secondary">Akan disimpan sebagai Publik</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button disabled={loading} type="submit" className="w-full sm:w-auto px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center">
                {loading ? <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> : null}
                {loading ? 'Menyimpan...' : 'Publikasikan Event'}
              </button>
            </div>
          </footer>
        </form>
      </main>
      
      {/* Seat Config Modal */}
      {seatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-h3 text-[20px] font-black text-on-surface">Pengaturan Nomor Kursi</h3>
                <p className="font-body-sm text-secondary">Generate daftar nomor kursi yang bisa dipilih pembeli.</p>
              </div>
              <button onClick={() => setSeatModalOpen(false)} className="p-2 rounded-full hover:bg-surface-container text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-surface-container rounded-xl p-4 mb-6 border border-outline-variant">
                <h4 className="font-label-md font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">add_box</span>
                  Generate Kursi Otomatis
                </h4>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-1/3">
                    <label className="block font-caption text-secondary mb-1">Prefix (Misal: A, VIP-)</label>
                    <input type="text" value={seatPrefix} onChange={(e) => setSeatPrefix(e.target.value.toUpperCase())} placeholder="A" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block font-caption text-secondary mb-1">Mulai Angka</label>
                    <input type="number" min="1" value={seatStart} onChange={(e) => setSeatStart(e.target.value)} placeholder="1" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block font-caption text-secondary mb-1">Sampai Angka</label>
                    <input type="number" min="1" value={seatEnd} onChange={(e) => setSeatEnd(e.target.value)} placeholder="10" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-auto">
                    <button type="button" onClick={generateSeats} className="w-full bg-primary text-on-primary font-bold px-4 py-2 rounded shadow-sm active:scale-95 transition-transform whitespace-nowrap">
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-label-md font-bold">Daftar Kursi ({seatNumbers.length})</h4>
                  {seatNumbers.length > 0 && (
                    <button type="button" onClick={() => setSeatNumbers([])} className="text-error text-sm font-bold hover:underline">Hapus Semua</button>
                  )}
                </div>
                
                <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 h-64 overflow-y-auto flex flex-wrap gap-2 content-start">
                  {seatNumbers.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">event_seat</span>
                      <p className="font-body-sm text-center">Belum ada kursi yang di-generate.<br/>Gunakan form di atas untuk membuat kursi.</p>
                    </div>
                  ) : (
                    seatNumbers.map((seat, idx) => (
                      <div key={idx} className="bg-surface-container-highest border border-outline px-3 py-1.5 rounded-md flex items-center gap-2 group">
                        <span className="font-body-sm font-bold">{seat}</span>
                        <button type="button" onClick={() => removeSeat(seat)} className="text-secondary hover:text-error transition-colors flex items-center">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setSeatModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-on-surface hover:bg-surface-container-highest transition-colors">
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
