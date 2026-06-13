import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', gender: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post('/auth/register', form);
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuth(user, token);
        navigate('/discover');
      }
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors({ general: err.response?.data?.message || 'Pendaftaran gagal.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors outline-none";

  return (
    <div className="bg-[#F9F9F9] text-on-surface min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* TopNavBar */}
      <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/50">
        <nav className="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="font-headline-md text-headline-md font-bold text-primary">GateMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" to="/login">Masuk</Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen flex items-center justify-center pt-20 pb-12 px-container-padding">
        <div className="bg-white w-full max-w-[440px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Buat Akun Baru</h1>
            <p className="font-body-md text-body-md text-secondary">Lengkapi data diri untuk mulai mengamankan tiket Anda.</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-md text-body-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary ml-1">Nama Lengkap</label>
              <input className={inputClass} name="full_name" value={form.full_name} onChange={handleChange} placeholder="Contoh: Budi Santoso" type="text" required />
              {errors.full_name && <div className="text-red-600 text-sm mt-1">{errors.full_name[0]}</div>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary ml-1">Email</label>
              <input className={inputClass} name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" type="email" required />
              {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email[0]}</div>}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary ml-1">Jenis Kelamin</label>
              <div className="relative">
                <select name="gender" value={form.gender} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} required>
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                </div>
              </div>
              {errors.gender && <div className="text-red-600 text-sm mt-1">{errors.gender[0]}</div>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary ml-1">Password</label>
              <div className="relative">
                <input className={`${inputClass} pr-10`} name="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" type={showPassword ? 'text' : 'password'} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password[0]}</div>}
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary ml-1">Konfirmasi Password</label>
              <div className="relative">
                <input className={`${inputClass} pr-10`} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Ulangi password" type={showConfirm ? 'text' : 'password'} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary flex items-center justify-center" onClick={() => setShowConfirm(!showConfirm)}>
                  <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password_confirmation && <div className="text-red-600 text-sm mt-1">{errors.password_confirmation[0]}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F04E37] text-white py-3 rounded-full font-label-md text-body-md font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-4 disabled:opacity-70"
            >
              {loading ? 'Membuat Akun...' : 'Buat Akun'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-secondary">
              Sudah punya akun?{' '}
              <Link className="text-[#F04E37] font-semibold hover:underline decoration-[#F04E37] transition-all ml-1" to="/login">Masuk</Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EBEBEB] text-center">
            <p className="font-caption text-caption text-secondary px-4">
              Dengan mendaftar, Anda menyetujui{' '}
              <a className="underline" href="#">Syarat &amp; Ketentuan</a> serta{' '}
              <a className="underline" href="#">Kebijakan Privasi</a> GateMate.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20 w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">GateMate</span>
            <p className="font-caption text-caption text-secondary">© 2024 GateMate. All rights reserved.</p>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {['Privacy Policy','Terms of Service','Help Center','Contact Us'].map(l => (
              <a key={l} className="font-caption text-caption text-secondary-fixed-dim hover:text-primary transition-colors duration-200" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
