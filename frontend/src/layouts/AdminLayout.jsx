import { useState } from 'react'
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/organizers', icon: 'verified_user', label: 'Verifikasi Organizer' },
  { path: '/admin/withdrawals', icon: 'account_balance_wallet', label: 'Penarikan Dana' },
  { path: '/admin/reports', icon: 'history', label: 'Audit Log' },
  { path: '/admin/settings', icon: 'settings', label: 'Pengaturan' },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to={`/${user.role}/dashboard`} replace />

  const getPageTitle = () => {
    const activeItem = navItems.find(item => location.pathname.startsWith(item.path))
    return activeItem ? activeItem.label : 'Dashboard'
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-sans">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
      `}</style>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-surface-container-high flex flex-col justify-between py-stack-lg z-50 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-8">
          <div className="px-6 flex justify-between items-center">
            <div>
              <span className="font-headline-md text-headline-md font-bold text-primary">GateMate</span>
              <p className="text-secondary font-label-sm mt-1">Superadmin</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-secondary hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 group ${
                    isActive 
                      ? 'border-l-4 border-primary text-primary font-bold bg-surface-container'
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span 
                    className={`material-symbols-outlined transition-colors ${
                      isActive ? 'text-primary' : 'group-hover:text-primary'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
        
        <div className="px-6 mt-auto">
          <div className="flex items-center gap-3 p-3 mb-6 rounded-lg bg-surface-container-low">
            <img 
              alt="Superadmin Profile" 
              className="w-10 h-10 rounded-full border border-surface-container-high object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-6s-ZrbXtqyD5-0kyZ5Di_SKWhUcDsD2ObcErz3-1Zkr2Wu6R3oonR1MXjHDs2u7IgAwBodaXouPxjeWqOYRQGyz53wjhkozlUWS3eCoqV3iOu7DgefVAx7bUFAKtMIZ0wVaLpoEZJhMLcmz0UdzEWaojLYmt0EPU77ApM1JgZxoagks-96yUTvC_XaamTjgKAyqTnlf47QWfLFWzQmhroq9c9vu2710X2udj3O_kM3WC8yI6bof-UvHUx0MiOxBs3RTcAq09fps"
            />
            <div>
              <p className="font-body-md text-on-surface font-semibold truncate w-24" title={user.name}>{user.name}</p>
              <p className="text-secondary text-label-sm">Superadmin</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/admin/login')
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline text-primary font-medium rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Top App Bar */}
      <header className="fixed top-0 right-0 left-0 md:ml-[240px] flex justify-between items-center h-16 px-4 md:px-8 bg-surface-container-lowest border-b border-outline-variant z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-secondary hover:text-primary">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">{getPageTitle()}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="hidden md:block h-8 w-[1px] bg-outline-variant"></div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="font-label-md text-label-md text-on-surface font-bold leading-none">{user.name}</p>
              <p className="font-label-sm text-label-sm text-secondary">{user.email}</p>
            </div>
            <img alt="Superadmin Profile" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-6s-ZrbXtqyD5-0kyZ5Di_SKWhUcDsD2ObcErz3-1Zkr2Wu6R3oonR1MXjHDs2u7IgAwBodaXouPxjeWqOYRQGyz53wjhkozlUWS3eCoqV3iOu7DgefVAx7bUFAKtMIZ0wVaLpoEZJhMLcmz0UdzEWaojLYmt0EPU77ApM1JgZxoagks-96yUTvC_XaamTjgKAyqTnlf47QWfLFWzQmhroq9c9vu2710X2udj3O_kM3WC8yI6bof-UvHUx0MiOxBs3RTcAq09fps" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="md:ml-[240px] pt-24 px-4 md:px-8 pb-stack-lg max-w-[1200px] mx-auto min-h-screen">
        {children || <Outlet />}
      </main>
    </div>
  )
}
