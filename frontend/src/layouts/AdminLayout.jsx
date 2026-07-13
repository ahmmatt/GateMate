import { useState, useEffect, useRef } from 'react'
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { superadminService } from '../services/api'

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/organizers', icon: 'verified_user', label: 'Verifikasi Organizer' },
  { path: '/withdrawals', icon: 'account_balance_wallet', label: 'Penarikan Dana' },
  { path: '/reports', icon: 'history', label: 'Audit Log' },
  { path: '/settings', icon: 'settings', label: 'Pengaturan' },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotif, setLoadingNotif] = useState(false)
  
  const notifRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const isSuperadmin = user?.role === 'superadmin' || location.pathname.startsWith('/superadmin')
  const basePath = isSuperadmin ? '/superadmin' : '/admin'

  // Tutup notif kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch notifikasi (contoh: pending organizer & pending withdrawal)
  useEffect(() => {
    if (!isSuperadmin) return // Saat ini notifikasi hanya untuk superadmin

    const fetchNotifications = async () => {
      setLoadingNotif(true)
      try {
        const notifData = []
        
        // Cek pending organizers
        try {
          const orgRes = await superadminService.getOrganizers(true)
          const pendingOrgs = orgRes.data?.data?.filter(o => o.is_verified_organizer === 0 || o.is_verified_organizer === false) || []
          if (pendingOrgs.length > 0) {
            notifData.push({
              type: 'warning',
              icon: 'verified_user',
              message: `Ada ${pendingOrgs.length} calon organizer baru yang menunggu verifikasi.`,
              time: 'Baru saja',
              link: '/superadmin/organizers'
            })
          }
        } catch (e) {
          console.error("Gagal memuat notif organizer", e)
        }

        // Cek pending withdrawals
        try {
          const wdRes = await superadminService.getPendingWithdrawals()
          const pendingWds = wdRes.data?.data?.filter(w => w.status === 'pending_superadmin' || w.status === 'pending') || []
          if (pendingWds.length > 0) {
            notifData.push({
              type: 'info',
              icon: 'account_balance_wallet',
              message: `Ada ${pendingWds.length} pengajuan penarikan dana yang perlu diproses.`,
              time: 'Baru saja',
              link: '/superadmin/withdrawals'
            })
          }
        } catch (e) {
          console.error("Gagal memuat notif penarikan", e)
        }

        setNotifications(notifData)
      } finally {
        setLoadingNotif(false)
      }
    }

    fetchNotifications()
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [isSuperadmin])

  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin' && user.role !== 'superadmin') return <Navigate to="/" replace />

  const getPageTitle = () => {
    const activeItem = navItems.find(item => location.pathname.startsWith(`${basePath}${item.path}`) || location.pathname.startsWith(`/admin${item.path}`))
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
              <p className="text-secondary font-label-sm mt-1">{isSuperadmin ? 'Superadmin Portal' : 'Admin Portal'}</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-secondary hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const fullPath = `${basePath}${item.path}`
              const isActive = location.pathname.startsWith(fullPath) || location.pathname.startsWith(`/admin${item.path}`)
              return (
                <NavLink
                  key={item.path}
                  to={fullPath}
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
            {user.profile_picture_url || user.profile_picture ? (
              <img
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-surface-container-high object-cover shrink-0"
                src={user.profile_picture_url || user.profile_picture}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(user.full_name || user.name || 'SA').substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-body-md text-on-surface font-semibold truncate w-24" title={user.full_name || user.name}>{user.full_name || user.name}</p>
              <p className="text-secondary text-label-sm capitalize">{isSuperadmin ? 'Superadmin' : 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate(isSuperadmin ? '/superadmin/login' : '/admin/login')
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
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className={`transition-colors relative ${showNotif ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-label-md font-bold text-on-surface">Notifikasi</h3>
                  {notifications.length > 0 && (
                    <span className="bg-primary-fixed text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Baru
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotif ? (
                    <div className="p-4 text-center text-secondary text-body-sm">Memuat notifikasi...</div>
                  ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notif, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-3 border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                          onClick={() => {
                            setShowNotif(false)
                            navigate(notif.link)
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              <span className={`material-symbols-outlined text-[20px] ${notif.type === 'warning' ? 'text-orange-500' : 'text-blue-500'}`}>
                                {notif.icon}
                              </span>
                            </div>
                            <div>
                              <p className="text-body-sm text-on-surface line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-secondary mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-secondary flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                      <p className="text-body-sm">Tidak ada notifikasi baru.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block h-8 w-[1px] bg-outline-variant"></div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="font-label-md text-label-md text-on-surface font-bold leading-none">{user.full_name || user.name}</p>
              <p className="font-label-sm text-label-sm text-secondary">{user.email}</p>
            </div>
            {user.profile_picture_url || user.profile_picture ? (
              <img
                alt="Superadmin Profile"
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                src={user.profile_picture_url || user.profile_picture}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                {(user.full_name || user.name || 'SA').substring(0, 2).toUpperCase()}
              </div>
            )}
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
