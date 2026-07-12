import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Ticket, User, Building2, ShieldCheck } from 'lucide-react'

const roles = [
  { value: 'user', label: 'Pengguna', icon: User, desc: 'Beli tiket & ikuti event' },
  { value: 'organizer', label: 'Organizer', icon: Building2, desc: 'Buat & kelola event' },
]

export default function Login() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulasi loading UI, lalu langsung arahkan (tanpa validasi backend)
    setTimeout(() => {
      // Setup mock user untuk keperluan UI
      const mockUser = { name: 'User Demo', email, role: selectedRole }
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      const redirectMap = { user: '/events', organizer: '/organizer/dashboard', admin: '/admin/dashboard' }
      navigate(redirectMap[selectedRole] || '/events')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6">
      <div className="bg-white w-full max-w-[440px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300 shadow-sm animate-slide-up">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#b22110] to-[#F04E37] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#b22110]/20">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[#271815] text-xl font-bold mb-2">Selamat Datang Kembali</h1>
          <p className="text-[#5f5e5e] text-sm">Masuk ke akun GateMate Anda untuk melanjutkan.</p>
        </div>

        {/* Role Selector */}
        <div className="bg-[#F5F5F7] border border-[#EBEBEB] p-1.5 flex gap-1.5 mb-6 rounded-[12px]">
          {roles.map(role => (
            <button
              key={role.value}
              type="button"
              onClick={() => { setSelectedRole(role.value); setError('') }}
              className={`flex-1 flex flex-col items-center py-2 px-1.5 rounded-[10px] transition-all duration-200 text-xs font-semibold ${
                selectedRole === role.value
                  ? 'bg-[#b22110] text-white shadow-sm'
                  : 'text-[#5f5e5e] hover:text-[#271815] hover:bg-white/60'
              }`}
            >
              <role.icon className="w-4 h-4 mb-1" />
              {role.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] pl-10 pr-4 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
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
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] pl-10 pr-10 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f5e5e] flex items-center justify-center hover:text-[#271815] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-[10px] p-3 text-[#ba1a1a] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
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
              'Masuk'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#5f5e5e] text-sm">
            Belum punya akun?
            <Link
              className="text-[#b22110] font-semibold hover:underline decoration-[#b22110] transition-all ml-1"
              to="/register"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
