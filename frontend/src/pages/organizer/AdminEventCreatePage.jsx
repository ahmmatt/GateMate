import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import OrganizerSidebar from '../../components/OrganizerSidebar';

export default function AdminEventCreatePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState({ show: false, type: '', message: '' });
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
  
  const [space3dFile, setSpace3dFile] = useState(null);
  
  // Seat Configuration Modal State
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [seatPrefix, setSeatPrefix] = useState('');
  const [seatStart, setSeatStart] = useState('');
  const [seatEnd, setSeatEnd] = useState('');

  // Custom Questions State
  const [customQuestions, setCustomQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions(prev => [...prev, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (idx) => {
    setCustomQuestions(prev => prev.filter((_, i) => i !== idx));
  };


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

  const handleSpace3dFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSpace3dFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation across tabs
    if (!formData.title.trim() || !formData.category.trim() || !bannerFile) {
      setActiveTab('tab-info');
      setStatusModal({
        show: true,
        type: 'error',
        message: !bannerFile
          ? 'Poster/Banner event wajib diunggah pada tab Informasi Dasar.'
          : 'Judul dan Kategori event wajib diisi pada tab Informasi Dasar.'
      });
      return;
    }
    if (!formData.start_date || !formData.start_time || !formData.end_date || !formData.end_time) {
      setActiveTab('tab-jadwal');
      setStatusModal({
        show: true,
        type: 'error',
        message: 'Jadwal (Tanggal dan Waktu mulai & selesai) wajib diisi lengkap.'
      });
      return;
    }
    if (formData.location_type === 'offline' && !formData.location_details.trim() && !formData.venue_name.trim()) {
      setActiveTab('tab-jadwal');
      setStatusModal({
        show: true,
        type: 'error',
        message: 'Alamat lengkap atau nama venue wajib diisi untuk event offline.'
      });
      return;
    }
    if (!formData.tier_name.trim() || !formData.price) {
      setActiveTab('tab-tiket');
      setStatusModal({
        show: true,
        type: 'error',
        message: 'Nama dan harga tiket wajib diisi pada tab Manajemen Tiket.'
      });
      return;
    }

    setLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        payload.append(key, formData[key] ? 1 : 0);
      } else if (formData[key] !== '') {
        payload.append(key, formData[key]);
      }
    });

    if (formData.capacity_type === 'unlimited') {
      payload.append('is_unlimited', '1');
    } else {
      payload.append('is_unlimited', '0');
    }

    if (formData.location_type === 'offline' && !formData.location_details.trim() && formData.venue_name.trim()) {
      payload.append('location_details', `${formData.venue_name}${formData.city ? ', ' + formData.city : ''}`);
    }

    if (bannerFile) payload.append('banner_image', bannerFile);
    if (space3dFile) payload.append('space_3d_file', space3dFile);
    
    if (formData.capacity_type === 'limited' && formData.seat_assignment === 'pilih') {
      payload.append('seat_numbers', JSON.stringify(seatNumbers));
    }

    if (customQuestions.length > 0) {
      customQuestions.forEach(q => {
        payload.append('custom_questions[]', q);
      });
    }

    try {
      const res = await api.post('/admin/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatusModal({ show: true, type: 'success', message: 'Event berhasil dipublikasikan!' });
      setTimeout(() => {
        navigate(`/organizer/events/${res.data.data.id || res.data.data.id_event}`);
      }, 1500);
    } catch (err) {
      let errMsg = 'Gagal membuat event. Periksa kembali input Anda.';
      if (err.response?.data?.errors) {
        // Extract the first validation error message
        errMsg = Object.values(err.response.data.errors)[0][0];
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      setStatusModal({ show: true, type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-lg text-on-surface min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}> <OrganizerSidebar activeNav="events" />

      {/* Main Content Workspace */}
      <main className="md:ml-[240px] pt-[64px] md:pt-[64px] min-h-screen flex-1 relative"> <form onSubmit={handleSubmit} className="w-full">
          <div className="max-w-[800px] mx-auto px-6 py-6">
            {/* Step Navigation */}
            <div className="mb-stack-lg flex overflow-x-auto no-scrollbar gap-stack-lg border-b border-outline-variant"> <button type="button" onClick={() => setActiveTab('tab-info')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-info' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Informasi Dasar</button>
              <button type="button" onClick={() => setActiveTab('tab-jadwal')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-jadwal' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Jadwal & Lokasi</button>
              <button type="button" onClick={() => setActiveTab('tab-tiket')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-tiket' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Tiket</button>
              <button type="button" onClick={() => setActiveTab('tab-lanjut')} className={`pb-3 whitespace-nowrap px-2 ${activeTab === 'tab-lanjut' ? 'border-b-2 border-primary text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}>Pengaturan Lanjut</button>
            </div>

            {/* Tab: Informasi Dasar */}
            {activeTab === 'tab-info' && (
              <div className="space-y-6 block animate-fade-in"> <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <h3 className="font-h3 text-h3 mb-stack-md">Informasi Dasar</h3> <div className="space-y-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Judul Event</label> <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Contoh: Jakarta Tech Conference 2024" type="text"/>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Kategori</label> <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all"> <option value="">Pilih Kategori</option>
                        <option value="Technology">Teknologi</option>
                        <option value="Music">Musik</option>
                        <option value="Sports">Olahraga</option>
                        <option value="Education">Pendidikan</option>
                        <option value="Business">Bisnis</option>
                        <option value="Other">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Poster Event</label> <label className="relative cursor-pointer border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low h-48 flex flex-col items-center justify-center overflow-hidden">
                        <input type="file" name="banner_image" accept="image/*" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                        {bannerPreview ? (
                          <img src={bannerPreview} className="absolute inset-0 w-full h-full object-cover z-0" alt="Preview" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-4xl text-secondary mb-2 relative z-10">image</span> <p className="text-secondary font-body-sm relative z-10">Klik atau seret gambar ke sini</p>
                            <p className="text-caption text-secondary mt-1 relative z-10">Rasio 16:9 direkomendasikan (Maks 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Deskripsi Event</label> <div className="border border-outline-variant rounded-lg overflow-hidden">
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-none bg-surface p-4 focus:ring-0 focus:outline-none" placeholder="Jelaskan detail event anda kepada calon pembeli..." rows="6"></textarea>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Jadwal & Lokasi */}
            {activeTab === 'tab-jadwal' && (
              <div className="space-y-6 block animate-fade-in"> <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <h3 className="font-h3 text-h3 mb-stack-md">Jadwal & Lokasi</h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Mulai</label> <div className="flex gap-2">
                        <input name="start_date" value={formData.start_date} onChange={handleChange} required className="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/> <input name="start_time" value={formData.start_time} onChange={handleChange} required className="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-1">Berakhir</label> <div className="flex gap-2">
                        <input name="end_date" value={formData.end_date} onChange={handleChange} required className="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/> <input name="end_time" value={formData.end_time} onChange={handleChange} required className="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                      </div>
                    </div>
                  </div>
                  <div className="mb-stack-md"> <label className="block font-label-md text-label-md text-secondary mb-2">Tipe Lokasi</label>
                    <div className="flex gap-4"> <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={formData.location_type === 'offline'} onChange={handleChange} className="text-primary accent-primary" name="location_type" type="radio" value="offline"/> <span className="font-body-sm">Venue Fisik</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer"> <input checked={formData.location_type === 'online'} onChange={handleChange} className="text-primary accent-primary" name="location_type" type="radio" value="online"/>
                        <span className="font-body-sm">Online / Virtual</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.location_type === 'offline' ? (
                    <div className="space-y-stack-md">
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Alamat Lengkap</label> <textarea name="location_details" value={formData.location_details} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Masukkan Alamat Lengkap Venue" rows="3"></textarea>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Nama Venue / Kota</label> <input name="venue_name" value={formData.venue_name} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all mb-2" placeholder="Contoh: Istora Senayan" type="text"/> <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Contoh: Jakarta" type="text"/>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Kode Embed Maps (Iframe)</label> <textarea name="maps_link" value={formData.maps_link} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Paste kode <iframe src='...'></iframe> di sini" rows="3"></textarea> <p className="font-caption text-secondary mt-1">Buka Google Maps &gt; Klik Bagikan (Share) &gt; Pilih Sematkan Peta (Embed a map) &gt; Salin HTML.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-stack-md">
                      <div>
                        <label className="block font-label-md text-label-md text-secondary mb-1">Link Meeting</label> <input name="location_details" value={formData.location_details} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Zoom, Google Meet, atau Link Streaming" type="url" />
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* Tab: Tiket */}
            {activeTab === 'tab-tiket' && (
              <div className="space-y-6 block animate-fade-in"> <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <div className="flex justify-between items-center mb-stack-md"> <h3 className="font-h3 text-h3">Manajemen Tiket</h3>
                    <button type="button" onClick={() => alert('Anda dapat menambahkan lebih banyak tier tiket setelah event ini dibuat.')} className="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed/30 px-3 py-1.5 rounded transition-colors"> <span className="material-symbols-outlined text-[20px]">add</span>
                      <span className="text-sm">Tambah Tier</span>
                    </button>
                  </div>
                  <p className="font-caption text-secondary mb-4">Konfigurasi tier tiket pertama Anda. Tier tiket tambahan dapat ditambahkan nanti melalui halaman kelola event.</p> <div className="space-y-6">
                    <div className="p-5 bg-surface rounded-lg border border-outline-variant"> <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Nama Tiket</label> <input name="tier_name" value={formData.tier_name} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="text"/>
                          </div>
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Harga (IDR)</label> <input name="price" value={formData.price} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="number"/>
                          </div>
                          <div>
                            <label className="block font-label-md text-label-md text-secondary mb-1">Stok</label> <input name="quota" value={formData.quota} onChange={handleChange} required className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" type="number"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg mb-stack-lg"> <h3 className="font-h3 text-h3 mb-stack-md">Kapasitas Event</h3>
                  <div className="space-y-stack-md">
                    <div>
                      <label className="block font-label-md text-label-md text-secondary mb-2">Tipe Kapasitas</label> <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"> <input checked={formData.capacity_type === 'unlimited'} onChange={handleChange} className="text-primary accent-primary" name="capacity_type" type="radio" value="unlimited"/>
                          <span className="font-body-sm">Tidak Terbatas</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer"> <input checked={formData.capacity_type === 'limited'} onChange={handleChange} className="text-primary accent-primary" name="capacity_type" type="radio" value="limited"/>
                          <span className="font-body-sm">Terbatas</span>
                        </label>
                      </div>
                    </div>
                    {formData.capacity_type === 'limited' && (
                      <div className="space-y-stack-md border-t border-outline-variant pt-stack-md animate-fade-in">
                        <div>
                          <label className="block font-label-md text-label-md text-secondary mb-3">Pengaturan Tempat Duduk</label> <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${formData.seat_assignment === 'bebas' ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary'}`}>
                              <input checked={formData.seat_assignment === 'bebas'} onChange={handleChange} className="absolute top-4 right-4 text-primary accent-primary" name="seat_assignment" type="radio" value="bebas"/>
                              <span className={`material-symbols-outlined mb-2 ${formData.seat_assignment === 'bebas' ? 'text-primary' : 'text-secondary'}`}>event_seat</span>
                              <span className="font-label-md font-bold">Pilih Kursi Mandiri</span> <span className="text-caption text-secondary">User selects their own seat from a map</span>
                            </label>
                            <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${formData.seat_assignment === 'pilih' ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary'}`}>
                              <input checked={formData.seat_assignment === 'pilih'} onChange={(e) => { handleChange(e); setSeatModalOpen(true); }} className="absolute top-4 right-4 text-primary accent-primary" name="seat_assignment" type="radio" value="pilih"/>
                              <span className={`material-symbols-outlined mb-2 ${formData.seat_assignment === 'pilih' ? 'text-primary' : 'text-secondary'}`}>edit_square</span>
                              <span className="font-label-md font-bold">Input Pengaturan Seat</span> <span className="text-caption text-secondary">Organizer manually inputs seat numbers</span>
                            </label>
                            {formData.seat_assignment === 'pilih' && (
                              <div className="col-span-1 md:col-span-2 mt-2"> <button type="button" onClick={() => setSeatModalOpen(true)} className="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed/30 px-4 py-2 rounded-lg border border-primary transition-colors w-max"> <span className="material-symbols-outlined">settings</span>
                                  Atur Kursi Sekarang ({seatNumbers.length} Kursi)
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block font-label-md text-label-md text-secondary mb-1">Total Kapasitas</label> <input name="max_capacity" value={formData.max_capacity} onChange={handleChange} className="w-full md:w-1/3 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition-all" placeholder="Contoh: 1000" type="number"/>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Pengaturan Lanjut */}
            {activeTab === 'tab-lanjut' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg animate-fade-in"> <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                  <div className="flex items-center gap-2 mb-4"> <span className="material-symbols-outlined text-primary">quiz</span>
                    <h3 className="font-h3 text-h3">Pertanyaan Tambahan</h3>
                  </div>
                  <p className="font-caption text-secondary mb-4">Buat pertanyaan kustom yang wajib diisi oleh peserta sebelum mereka dapat membeli tiket. Anda dapat memanfaatkannya untuk kebutuhan survei, profil data, atau riset internal.</p> <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newQuestion} 
                        onChange={(e) => setNewQuestion(e.target.value)} 
                        placeholder="Contoh: Darimana Anda mengetahui acara ini?" 
                        className="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuestion(); } }}
                      />
                      <button type="button" onClick={handleAddQuestion} className="bg-primary text-on-primary px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity">
                        Tambah
                      </button>
                    </div>

                    {customQuestions.length > 0 && (
                      <div className="mt-4 border border-outline-variant rounded-lg divide-y divide-outline-variant bg-surface-container-lowest">
                        {customQuestions.map((q, idx) => (
                          <div key={idx} className="p-3 flex justify-between items-center group"> <span className="font-body-sm text-on-surface">{q}</span>
                            <button type="button" onClick={() => handleRemoveQuestion(idx)} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"> <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg"> <div className="flex items-center gap-2 mb-4">
                     <span className="material-symbols-outlined text-primary">view_in_ar</span> <h3 className="font-h3 text-h3">Video 3D Space (Peta Event)</h3>
                  </div>
                  <p className="font-caption text-secondary mb-4">Unggah video navigasi 3D atau tur virtual untuk memberikan panduan visual area event kepada peserta.</p> <div className="mt-4">
                    <label className="relative cursor-pointer border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low h-32 flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-colors"> <input type="file" name="space_3d_file" accept="video/*" onChange={handleSpace3dFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                      {space3dFile ? (
                        <div className="flex flex-col items-center gap-2 z-0"> <span className="material-symbols-outlined text-primary text-[32px]">movie</span>
                          <span className="font-label-md text-on-surface text-center px-4 truncate w-full">{space3dFile.name}</span> <span className="text-caption text-secondary">Klik untuk mengganti file</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 z-0"> <span className="material-symbols-outlined text-secondary text-[32px]">upload_file</span>
                          <span className="font-label-md text-on-surface">Pilih File Video MP4/WebM</span> <span className="text-caption text-secondary">Maks. 50MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg"> <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span> <h3 className="font-h3 text-h3">Privasi & Izin</h3>
                  </div>
                  <div className="space-y-4"> <div className="flex items-start justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                      <div className="pr-4"> <h4 className="font-label-md font-bold">Persetujuan Peserta</h4>
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
          <footer className="fixed bottom-0 right-0 left-0 md:left-[240px] bg-surface border-t border-outline-variant px-6 py-4 flex justify-between items-center z-40"> <div className="hidden sm:block">
              <p className="font-caption text-secondary">Akan disimpan sebagai Publik</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto"> <button disabled={loading} type="submit" className="w-full sm:w-auto px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center"> {loading ? <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> : null}
                {loading ? 'Menyimpan...' : 'Publikasikan Event'}
              </button>
            </div>
          </footer>
        </form>
      </main>
      
      {/* Status Modal (Success / Error) */}
      {statusModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden flex flex-col items-center text-center p-8 transition-transform duration-300 transform scale-100"
            style={{ animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <style>{`
              @keyframes popIn {
                0% { opacity: 0; transform: scale(0.9); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
            
            {statusModal.type === 'success' ? (
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner"> <span className="material-symbols-outlined text-[40px]">check_circle</span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-[#FFF0EE] text-[#F04E37] rounded-full flex items-center justify-center mb-6 shadow-inner"> <span className="material-symbols-outlined text-[40px]">error</span>
              </div>
            )}
            
            <h2 className="font-headline-sm font-bold text-on-surface mb-2 text-xl">
              {statusModal.type === 'success' ? 'Berhasil!' : 'Oops, Gagal'}
            </h2>
            <p className="text-on-surface-variant font-body-md mb-8">
              {statusModal.message}
            </p>
            
            {statusModal.type === 'error' && (
              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => setStatusModal({ show: false, type: '', message: '' })} 
                  className="w-full py-3 bg-[#F5F5F7] text-on-surface rounded-[22px] font-bold hover:bg-[#EBEBEB] active:scale-95 transition-all"
                >
                  Tutup & Perbaiki
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seat Config Modal */}
      {seatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4"> <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-h3 text-[20px] font-black text-on-surface">Pengaturan Nomor Kursi</h3> <p className="font-body-sm text-secondary">Generate daftar nomor kursi yang bisa dipilih pembeli.</p>
              </div>
              <button onClick={() => setSeatModalOpen(false)} className="p-2 rounded-full hover:bg-surface-container text-on-surface"> <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6"> <div className="bg-surface-container rounded-xl p-4 mb-6 border border-outline-variant">
                <h4 className="font-label-md font-bold mb-3 flex items-center gap-2"> <span className="material-symbols-outlined text-primary text-[20px]">add_box</span>
                  Generate Kursi Otomatis
                </h4>
                <div className="flex flex-col md:flex-row gap-4 items-end"> <div className="w-full md:w-1/3">
                    <label className="block font-caption text-secondary mb-1">Prefix (Misal: A, VIP-)</label> <input type="text" value={seatPrefix} onChange={(e) => setSeatPrefix(e.target.value.toUpperCase())} placeholder="A" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-1/4"> <label className="block font-caption text-secondary mb-1">Mulai Angka</label>
                    <input type="number" min="1" value={seatStart} onChange={(e) => setSeatStart(e.target.value)} placeholder="1" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-1/4"> <label className="block font-caption text-secondary mb-1">Sampai Angka</label>
                    <input type="number" min="1" value={seatEnd} onChange={(e) => setSeatEnd(e.target.value)} placeholder="10" className="w-full bg-surface-container-lowest border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="w-full md:w-auto"> <button type="button" onClick={generateSeats} className="w-full bg-primary text-on-primary font-bold px-4 py-2 rounded shadow-sm active:scale-95 transition-transform whitespace-nowrap">
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3"> <h4 className="font-label-md font-bold">Daftar Kursi ({seatNumbers.length})</h4>
                  {seatNumbers.length > 0 && (
                    <button type="button" onClick={() => setSeatNumbers([])} className="text-error text-sm font-bold hover:underline">Hapus Semua</button>
                  )}
                </div>
                
                <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 h-64 overflow-y-auto flex flex-wrap gap-2 content-start">
                  {seatNumbers.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-secondary"> <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">event_seat</span>
                      <p className="font-body-sm text-center">Belum ada kursi yang di-generate.<br/>Gunakan form di atas untuk membuat kursi.</p>
                    </div>
                  ) : (
                    seatNumbers.map((seat, idx) => (
                      <div key={idx} className="bg-surface-container-highest border border-outline px-3 py-1.5 rounded-md flex items-center gap-2 group"> <span className="font-body-sm font-bold">{seat}</span>
                        <button type="button" onClick={() => removeSeat(seat)} className="text-secondary hover:text-error transition-colors flex items-center"> <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3 rounded-b-2xl"> <button onClick={() => setSeatModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-on-surface hover:bg-surface-container-highest transition-colors">
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
