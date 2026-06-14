import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function OrganizerRegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    organization_name: '',
    phone: '',
    ig_handle: '',
    tiktok_handle: '',
  });

  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/zip', 'application/x-zip-compressed'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.toLowerCase().endsWith('.zip')) {
        setErrorMsg('Satukan semua file dalam bentuk ekstensi .zip. Upload ini hanya menerima file ZIP!');
        e.target.value = null; // reset the input
        setFile(null);
        return;
      }
      setErrorMsg('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (file) payload.append('ktp_document', file);

      const res = await api.post('/auth/register/organizer', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show success alert or navigate
      alert(res.data.message || 'Registrasi berhasil! Menunggu verifikasi.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setErrorMsg(firstError);
      } else {
        setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat registrasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center p-page-padding selection:bg-primary-fixed py-12">
      {/* Header / Branding */}
      <header className="mb-stack-lg text-center">
        <Link to="/" className="inline-block">
          <h1 className="font-h1 text-h1 font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">GateMate</h1>
        </Link>
        <p className="font-body-sm text-body-sm text-secondary mt-1">Daftar sebagai Penyelenggara Event</p>
      </header>

      {errorMsg && (
        <div className="w-full max-w-[900px] mb-4 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-body-sm font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {errorMsg}
        </div>
      )}

      {/* Registration Card */}
      <main className="w-full max-w-[900px] bg-white border-[0.5px] border-outline-variant rounded-xl overflow-hidden card-shadow">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Akun */}
            <section className="p-stack-lg border-b md:border-b-0 md:border-r-[0.5px] border-outline-variant">
              <div className="flex items-center gap-2 mb-stack-md">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="font-h3 text-h3 font-bold text-on-surface">Akun</h2>
              </div>
              <div className="space-y-stack-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Nama Lengkap</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: John Doe" type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Email</label>
                  <input required name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="nama@email.com" type="email" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Password</label>
                  <div className="relative">
                    <input required name="password" value={formData.password} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface" type="button">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Konfirmasi Password</label>
                  <div className="relative">
                    <input required name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" type={showConfirmPassword ? 'text' : 'password'} />
                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface" type="button">
                      <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Organisasi */}
            <section className="p-stack-lg">
              <div className="flex items-center gap-2 mb-stack-md">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <h2 className="font-h3 text-h3 font-bold text-on-surface">Organisasi</h2>
              </div>
              <div className="space-y-stack-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Nama Organisasi/EO</label>
                  <input required name="organization_name" value={formData.organization_name} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: Maju Bersama Entertainment" type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Nomor Telepon</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="0812xxxx" type="tel" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Handle Instagram</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border-y-[0.5px] border-l-[0.5px] border-outline-variant bg-surface-container text-secondary font-label-md text-label-md">@</span>
                    <input required name="ig_handle" value={formData.ig_handle} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-r-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="username" type="text" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Handle TikTok</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border-y-[0.5px] border-l-[0.5px] border-outline-variant bg-surface-container text-secondary font-label-md text-label-md">@</span>
                    <input required name="tiktok_handle" value={formData.tiktok_handle} onChange={handleChange} className="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-r-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="username" type="text" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Section: Legalitas */}
          <section className="px-stack-lg pb-stack-lg pt-0">
            <div className="border-t-[0.5px] border-outline-variant pt-stack-lg">
              <label className="font-label-md text-label-md text-secondary mb-2 block">Legalitas Penyelenggara</label>
              <label className="w-full border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-primary-fixed transition-colors rounded-xl flex flex-col items-center justify-center py-8 px-stack-lg cursor-pointer group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors mb-2 text-[32px]">cloud_upload</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium text-center">
                  {file ? file.name : 'Upload Foto KTP, E-tanda tangan digital, dan Surat Izin Usaha dalam bentuk file (.zip)'}
                </span>
                <input required accept=".zip,application/zip,application/x-zip-compressed" className="hidden" type="file" onChange={handleFileChange} />
              </label>
            </div>
            <div className="mt-stack-lg flex flex-col gap-4">
              <button disabled={loading} className="coral-pill w-full bg-primary text-on-primary py-3.5 rounded-lg font-h3 text-h3 font-bold active:scale-[0.98] transition-transform shadow-sm hover:opacity-90 disabled:opacity-50" type="submit">
                {loading ? 'Memproses...' : 'Daftar sebagai Penyelenggara'}
              </button>
              <div className="text-center">
                <span className="font-body-sm text-body-sm text-secondary">Sudah punya akun? </span>
                <Link className="font-body-sm text-body-sm text-primary font-bold hover:underline" to="/login">Masuk</Link>
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* Footer Copyright */}
      <footer className="mt-stack-lg">
        <p className="font-caption text-caption text-secondary">© 2025 GateMate Indonesia. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
}
