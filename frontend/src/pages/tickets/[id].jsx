import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ChevronDown } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', gender: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
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
    setTimeout(() => {
      const user = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        gender: form.gender,
        role: selectedRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=b22110&color=fff`,
      }
      localStorage.setItem('token', 'dummy-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({ ...user, role: selectedRole }))
      navigate(selectedRole === 'organizer' ? '/organizer/dashboard' : '/user/tickets')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6">
      {/* Sign Up Card */}
      <div className="bg-white w-full max-w-[440px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300 shadow-sm animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-[#271815] text-xl font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-[#5f5e5e] text-sm">Lengkapi data diri untuk mulai mengamankan tiket Anda.</p>
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

          {/* Daftar Sebagai */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'role' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="role"
            >
              Daftar Sebagai
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 text-sm focus:border-[#b22110] transition-colors appearance-none cursor-pointer text-[#271815] outline-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value="user">Pengguna (Beli tiket & ikuti event)</option>
                <option value="organizer">Organizer (Buat & kelola event)</option>
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
            className="w-full bg-[#b22110] text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2"
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
              'Buat Akun'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#5f5e5e] text-sm">
            Sudah punya akun?
            <Link
              className="text-[#b22110] font-semibold hover:underline decoration-[#b22110] transition-all ml-1"
              to="/login"
            >
              Masuk
            </Link>
          </p>
        </div>

        {/* Terms check */}
        <div className="mt-8 pt-6 border-t border-[#EBEBEB] text-center">
          <p className="text-[11px] text-[#5f5e5e] px-4 leading-relaxed">
            Dengan mendaftar, Anda menyetujui <a className="underline hover:text-[#271815]" href="#">Syarat & Ketentuan</a> serta <a className="underline hover:text-[#271815]" href="#">Kebijakan Privasi</a> GateMate.
          </p>
        </div>
      </div>
    </div>
  )
}

