import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ChevronDown } from 'lucide-react'
import api, { authService } from '../../services/api'

export default function UserRegister() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', gender: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [tempUser, setTempUser] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.gender) {
      setError('Silakan pilih jenis kelamin Anda.')
      return
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter!')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok!')
      return
    }

    setLoading(true)
    
    try {
      const response = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        gender: form.gender,
        role: 'user' // default user
      });
      
      const payload = response.data?.data || response.data || {};
      const { user, token, access_token } = payload;
      const authToken = token || access_token;

      if (!user || !authToken) {
        throw new Error(response.data?.message || 'Respons registrasi tidak valid dari server.');
      }

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));

      // After register, it will be unverified
      setTempUser(user);
      setShowOtpModal(true);
      
      try {
        await api.post('/auth/otp/send');
      } catch (e) {
        console.error("Gagal mengirim OTP otomatis:", e);
      }
      
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
      setLoading(false);
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      await api.post('/auth/otp/verify', { otp: otpCode });
      const updatedUser = { ...tempUser, phone_verified_at: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowOtpModal(false);
      navigate('/');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Kode OTP tidak valid.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError('');
    try {
      await api.post('/auth/otp/send');
      alert('OTP baru telah dikirim ke WhatsApp Anda.');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Gagal mengirim ulang OTP.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6 bg-[#fff8f6]">
      {/* Sign Up Card */}
      <div className="bg-white w-full max-w-[460px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300 shadow-sm animate-slide-up">
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1 bg-[#b22110]/10 text-[#b22110] text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider border border-[#b22110]/20">
            Portal Pengguna
          </span>
          <h1 className="text-[#271815] text-xl font-bold mb-2">Buat Akun Pengguna</h1>
          <p className="text-[#5f5e5e] text-sm">Lengkapi data diri untuk mulai membeli tiket & mengikuti event SecureGate.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'name' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="name"
            >
              Nama Lengkap
            </label>
            <input
              className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
              id="name"
              name="name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'gender' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="gender"
            >
              Jenis Kelamin
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors appearance-none cursor-pointer text-[#271815] outline-none"
                value={form.gender}
                onChange={handleChange}
                onFocus={() => setFocusedField('gender')}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value="" disabled>Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5f5e5e]">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'password' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors pr-10 text-[#271815] outline-none"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f5e5e] flex items-center justify-center hover:text-[#271815] transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'confirmPassword' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="confirm_password"
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors pr-10 text-[#271815] outline-none"
                id="confirm_password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f5e5e] flex items-center justify-center hover:text-[#271815] transition-colors"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-[10px] p-3 text-[#ba1a1a] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            className="w-full bg-[#b22110] text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2 shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              'Buat Akun Pengguna'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EBEBEB] text-center space-y-3">
          <p className="text-[#5f5e5e] text-sm">
            Sudah punya akun?
            <Link
              className="text-[#b22110] font-semibold hover:underline decoration-[#b22110] transition-all ml-1"
              to="/login"
            >
              Masuk
            </Link>
          </p>
          <p className="text-[#5f5e5e] text-sm">
            Ingin menjadi mitra EO?
            <Link
              className="text-[#b22110] font-semibold hover:underline inline-flex items-center gap-1 ml-1 px-3 py-1 bg-[#b22110]/10 border border-[#b22110]/20 rounded-full transition-all hover:bg-[#b22110]/15"
              to="/organizer/register"
            >
              Daftar sebagai Penyelenggara &rarr;
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#EBEBEB]/60 text-center">
          <p className="text-[11px] text-[#5f5e5e] px-4 leading-relaxed">
            Dengan mendaftar, Anda menyetujui <a className="underline hover:text-[#271815]" href="#">Syarat & Ketentuan</a> serta <a className="underline hover:text-[#271815]" href="#">Kebijakan Privasi</a> SecureGate.
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#b22110]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px] text-[#b22110]">chat</span>
              </div>
              <h2 className="text-2xl font-bold text-[#271815]">Verifikasi WhatsApp</h2>
              <p className="text-[#5b403c] text-sm mt-2">
                Kami telah mengirimkan 6 digit kode OTP ke nomor WhatsApp Anda. Silakan masukkan kode di bawah ini.
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-[#93000a] text-xs font-medium text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[1em] font-bold text-2xl input-base px-4 py-4 text-[#271815]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full bg-[#b22110] text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {otpLoading ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#5b403c]">
                Belum menerima kode?{' '}
                <button onClick={handleResendOtp} className="text-[#b22110] font-bold hover:underline">
                  Kirim Ulang
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
