import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import { User, Building, CloudUpload } from 'lucide-react';

export default function OrganizerRegister() {
  const navigate = useNavigate();
  // Safe fallback if useAuthStore doesn't exist or isn't properly exported
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
  const [error, setError] = useState(null);
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
      const res = await api.post('/auth/register/organizer', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.token) {
        setAuth(res.data.user, res.data.token);
      }
      navigate('/organizer/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-4 font-sans flex flex-col items-center justify-center">
      
      {/* Title Outside Card */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#b22110] tracking-tight mb-1">GateMate</h1>
        <p className="text-gray-400 text-sm font-medium">Daftar sebagai Penyelenggara Event</p>
      </div>

      {/* Main Card */}
      <div className="bg-white w-full max-w-4xl rounded-xl border border-gray-200 shadow-sm p-8 md:p-10">
        
        {error && (
          <div className="mb-6 p-4 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-lg text-[#93000a] text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Left Column: Akun */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#b22110]" />
                <h2 className="text-lg font-bold text-gray-800">Akun</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Contoh: John Doe" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Jenis Kelamin</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110] appearance-none"
                  >
                    <option value="" disabled>Pilih Jenis Kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">NIK</label>
                  <input 
                    type="text" 
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="16 Digit NIK KTP" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Organisasi */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Building className="w-5 h-5 text-[#b22110]" />
                <h2 className="text-lg font-bold text-gray-800">Organisasi</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Organisasi/EO</label>
                  <input 
                    type="text" 
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    placeholder="Contoh: Maju Bersama Entertainment" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nomor Telepon</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812xxxx" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Handle Instagram</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</div>
                    <input 
                      type="text" 
                      name="ig_handle"
                      value={formData.ig_handle}
                      onChange={handleChange}
                      placeholder="username" 
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-md pl-8 pr-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Handle TikTok</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</div>
                    <input 
                      type="text" 
                      name="tiktok_handle"
                      value={formData.tiktok_handle}
                      onChange={handleChange}
                      placeholder="username" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-md pl-8 pr-3 py-2.5 text-sm outline-none focus:border-[#b22110]" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Legalitas */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Legalitas Penyelenggara</label>
            <div className="border border-dashed border-[#e5b3af] bg-[#fdf5f4] rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <input 
                type="file" 
                accept=".zip" 
                onChange={handleFileChange}
                className="hidden" 
                id="file-upload" 
                ref={fileInputRef}
              />
              {!file ? (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
                  <CloudUpload className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-xs text-gray-600 font-medium">
                    Upload Foto KTP, E-tanda tangan digital, dan Surat Izin Usaha dalam bentuk file .zip
                  </p>
                </label>
              ) : (
                <div className="flex flex-col items-center">
                  <CloudUpload className="w-6 h-6 text-[#b22110] mb-3" />
                  <span className="text-sm font-semibold text-[#271815] mb-1">{file.name}</span>
                  <span className="text-xs text-[#5b403c] mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button 
                    type="button" 
                    onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-xs font-bold text-[#b22110] hover:underline"
                  >
                    Hapus File
                  </button>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#b22110] text-white py-3.5 rounded-md font-semibold text-sm hover:bg-[#911b0d] transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Daftar sebagai Penyelenggara'
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Sudah punya akun? <Link to="/organizer/login" className="text-[#b22110] font-semibold hover:underline">Masuk</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
