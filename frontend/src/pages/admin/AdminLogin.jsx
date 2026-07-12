import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react'
import { dummyCredentials, dummyUsers } from '../../data/dummyUsers'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  // Auto-fill demo credentials for admin
  const demoCredential = dummyCredentials.find(c => c.role === 'admin')

  const handleDemoLogin = () => {
    if (demoCredential) {
      setEmail(demoCredential.email)
      setPassword(demoCredential.password)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const match = dummyCredentials.find(c => c.email === email && c.password === password && c.role === 'admin')
      if (match) {
        const user = dummyUsers.find(u => u.email === email)
        localStorage.setItem('token', 'dummy-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify(user))

        navigate('/admin/dashboard')
      } else {
        setError('Email atau password salah untuk akun Admin. Gunakan kredensial demo.')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12 min-h-screen bg-surface">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid #EBEBEB;
        }
        .coral-pill-primary {
            background-color: #F04E37;
            border-radius: 22px;
            padding: 10px 22px;
            color: white;
            transition: opacity 0.2s;
        }
        .coral-pill-primary:active { opacity: 0.8; }
        .input-base {
            background-color: #F5F5F7;
            border: 1px solid #EBEBEB;
            border-radius: 10px;
            transition: border-color 0.2s;
        }
        .input-base:focus {
            outline: none;
            border-color: #F04E37;
            box-shadow: none;
        }
      `}</style>

      {/* Atmospheric Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-[440px] relative z-10">
        {/* Right Side: Login Card */}
        <div className="flex justify-center">
          <div className="glass-card w-full p-8 md:p-10 rounded-[28px] shadow-sm">
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2 font-bold">Portal Superadmin</h2>
              <p className="font-body-md text-body-md text-secondary">Masuk ke akun Anda untuk mengelola platform GateMate.</p>
            </div>

            {/* Demo credentials banner */}
            <div className="bg-surface-bright border border-surface-dim p-3.5 mb-6 rounded-[12px] flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs font-medium">Demo Admin:</p>
                <p className="text-primary text-xs font-mono font-semibold mt-0.5">{demoCredential?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-[8px] transition-all"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className={`font-label-md text-label-md ml-1 ${focusedField === 'email' ? 'text-primary' : 'text-on-surface-variant'}`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
                  <input 
                    className="w-full h-12 pl-10 pr-4 input-base text-body-md" 
                    placeholder="admin@gatemate.com" 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className={`font-label-md text-label-md ${focusedField === 'password' ? 'text-primary' : 'text-on-surface-variant'}`}>Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
                  <input 
                    className="w-full h-12 pl-10 pr-10 input-base text-body-md" 
                    placeholder="••••••••" 
                    required 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center justify-center hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-error/10 border border-error/20 rounded-[10px] p-3 text-error text-xs font-medium">
                  {error}
                </div>
              )}

              <button className="w-full coral-pill-primary font-body-md font-bold mt-4 shadow-sm hover:opacity-90 flex justify-center items-center gap-2" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  'Masuk sebagai Admin'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
