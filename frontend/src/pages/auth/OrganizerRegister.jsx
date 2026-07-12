import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import { Upload, FileBox, Building, Mail, Phone, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function OrganizerRegister() {
  const navigate = useNavigate();
  // We'll safely use auth store if needed, or simply let the form handle logic
  const setAuth = useAuthStore(state => state.setAuth) || (() => {});

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    gender: '',
    nik: '',
    organization_name: '',
    phone: '',
    ig_handle: '',
    tiktok_handle: '',
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.endsWith('.zip')) {
      setError('Hanya file ZIP yang diizinkan untuk dokumen verifikasi.');
      setFile(null);
      e.target.value = null; // reset
    } else {
      setError(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Mohon upload file dokumen persyaratan (.zip).');
      return;
    }
    
    setError(null);
    setLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    payload.append('ktp_document', file);

    try {
      // Endpoint to register organizer based on the user's snippet
      const res = await api.post('/auth/register/organizer', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.token) {
        setAuth(res.data.user, res.data.token);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/organizer/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-6 bg-[#fff8f6]">
        <div className="bg-white w-full max-w-[500px] rounded-[24px] border border-[#EBEBEB] p-10 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#271815] mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-[#5b403c] mb-6">
            Terima kasih telah mendaftar sebagai mitra Organizer GateMate. Tim kami akan segera meninjau dokumen Anda.
          </p>
          <div className="text-sm font-medium text-[#b22110] animate-pulse">
            Mengalihkan ke halaman login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6] py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#b22110]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#007f99]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-[700px] mx-auto relative z-10">
        <div className="bg-white rounded-[24px] shadow-sm border border-[#EBEBEB] overflow-hidden">
          
          <div className="px-8 py-10 md:px-12 border-b border-[#EBEBEB]/60 text-center">
            <span className="inline-block px-3 py-1 bg-[#ffdad4] text-[#910900] text-[11px] font-bold rounded-full mb-4 uppercase tracking-wider">
              Mitra Penyelenggara
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#271815] mb-3">Daftar sebagai Organizer</h1>
            <p className="text-[#5b403c] text-[15px] max-w-[480px] mx-auto">
              Kelola event, jual tiket, dan nikmati fitur scanner QR dengan mudah bersama GateMate.
            </p>
          </div>

          <div className="p-8 md:p-12">
            {error && (
              <div className="mb-8 p-4 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-[#93000a] text-sm font-medium flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'full_name' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Nama Lengkap PIC
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('full_name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Nama Penanggung Jawab"
                    className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'email' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="email.eo@example.com"
                    className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'gender' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Jenis Kelamin
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('gender')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors appearance-none cursor-pointer text-[#271815]"
                    >
                      <option value="" disabled>Pilih gender</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b403c] pointer-events-none" />
                  </div>
                </div>

                {/* NIK */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'nik' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('nik')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="16 Digit NIK KTP"
                    className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                  />
                </div>
              </div>

              <hr className="border-[#EBEBEB]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'organization_name' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Nama Organisasi / Event Organizer
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b403c]" />
                    <input
                      type="text"
                      name="organization_name"
                      value={formData.organization_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('organization_name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="Contoh: Budi Entertainment Group"
                      className="w-full h-12 pl-11 pr-4 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'phone' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Nomor WhatsApp / Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b403c]" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="08123456789"
                      className="w-full h-12 pl-11 pr-4 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                    />
                  </div>
                </div>

                {/* IG Handle */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'ig_handle' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Akun Instagram Organizer
                  </label>
                  <input
                    type="text"
                    name="ig_handle"
                    value={formData.ig_handle}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('ig_handle')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="@organizer_ig"
                    className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                  />
                </div>

                {/* TikTok Handle */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ml-1 transition-colors ${focusedField === 'tiktok_handle' ? 'text-[#b22110]' : 'text-[#5b403c]'}`}>
                    Akun TikTok Organizer (Opsional)
                  </label>
                  <input
                    type="text"
                    name="tiktok_handle"
                    value={formData.tiktok_handle}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('tiktok_handle')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="@organizer_tiktok"
                    className="w-full h-12 bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 text-sm focus:border-[#b22110] outline-none transition-colors text-[#271815]"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-semibold text-[#271815] mb-2 block">Upload Dokumen Persyaratan</label>
                <p className="text-xs text-[#5b403c] mb-4">
                  Satukan semua file penting (KTP PIC, NIB/Legalitas, Proposal) dalam bentuk ekstensi <strong>.zip</strong>.
                </p>
                <div 
                  className={`border-2 border-dashed rounded-[16px] p-8 text-center transition-all ${
                    file ? 'border-[#007f99] bg-[#007f99]/5' : 'border-[#e3beb8] bg-[#fff0ee]/50 hover:bg-[#fff0ee]'
                  }`}
                >
                  <input 
                    type="file" 
                    accept=".zip" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="file-upload" 
                    ref={fileInputRef}
                  />
                  {!file ? (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#EBEBEB] flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-[#b22110]" />
                      </div>
                      <span className="text-sm font-semibold text-[#b22110]">Pilih File ZIP</span>
                      <span className="text-xs text-[#5b403c] mt-1">Maksimal ukuran file 10MB</span>
                    </label>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileBox className="w-10 h-10 text-[#007f99] mb-3" />
                      <span className="text-sm font-semibold text-[#271815] mb-1">{file.name}</span>
                      <span className="text-xs text-[#5b403c] mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button 
                        type="button" 
                        onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="text-xs font-bold text-[#b22110] hover:underline"
                      >
                        Hapus / Ganti File
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b22110] text-white h-14 rounded-full text-[15px] font-bold shadow-sm hover:bg-[#911b0d] transition-all active:scale-[0.98] mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Dokumen...</span>
                  </>
                ) : (
                  <span>Kirim Pengajuan Organizer</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#EBEBEB] text-center">
              <p className="text-sm text-[#5b403c]">
                Sudah memiliki akun Organizer?{' '}
                <Link to="/organizer/login" className="text-[#b22110] font-bold hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-4 text-center">
              <p className="text-[11px] text-[#5b403c] leading-relaxed">
                Dengan mendaftar, Anda menyetujui <a className="underline hover:text-[#271815]" href="#">Syarat & Ketentuan Mitra</a> serta <a className="underline hover:text-[#271815]" href="#">Kebijakan Privasi</a> GateMate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
