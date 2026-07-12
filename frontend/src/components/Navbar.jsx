import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  Ticket, Menu, X, LogOut, LayoutDashboard,
  Globe, Share2
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'organizer') return '/organizer/dashboard'
    return '/user/tickets'
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/50">
      <div className="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
            GateMate
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/events" className={`font-body-md text-body-md pb-1 ${location.pathname.startsWith('/events') ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>
              Jelajahi
            </Link>
            <Link to={user ? "/user/tickets" : "/login"} className={`font-body-md text-body-md pb-1 ${location.pathname.startsWith('/user/ticket') ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>
              My Tickets
            </Link>
            <Link to={user ? "/user/wallet" : "/login"} className={`font-body-md text-body-md pb-1 ${location.pathname.startsWith('/user/wallet') ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>
              Wallet
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button className="relative w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              
              <button 
                onClick={() => navigate('/user/profile')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#6366f1] text-white font-bold text-sm cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                title="Edit Profil"
              >
                {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BS'}
              </button>

              <button onClick={handleLogout} className="text-secondary hover:text-primary transition-colors flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Masuk</Link>
              <Link to="/register" className="rounded-full px-5 py-2 bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-all">Daftar</Link>
            </div>
          )}

          <div className="md:hidden flex items-center gap-2">
            <button className="text-primary p-2">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              className="p-2 text-secondary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden py-3 px-6 space-y-1 bg-surface border-t border-outline-variant/50">
          <Link to="/events" className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/events') ? 'text-primary bg-surface-container-low' : 'text-secondary hover:bg-surface-container-low'}`} onClick={() => setIsOpen(false)}>Jelajahi</Link>
          <Link to={user ? "/user/tickets" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/ticket') ? 'text-primary bg-surface-container-low' : 'text-secondary hover:bg-surface-container-low'}`} onClick={() => setIsOpen(false)}>My Tickets</Link>
          <Link to={user ? "/user/wallet" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/wallet') ? 'text-primary bg-surface-container-low' : 'text-secondary hover:bg-surface-container-low'}`} onClick={() => setIsOpen(false)}>Wallet</Link>
          
          {!user ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="block px-3 py-2.5 text-sm text-center text-secondary border border-outline-variant rounded-full" onClick={() => setIsOpen(false)}>Masuk</Link>
              <Link to="/register" className="block px-3 py-2.5 text-sm text-center font-medium rounded-full bg-primary text-on-primary" onClick={() => setIsOpen(false)}>Daftar</Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-outline-variant/50 mt-2">
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-primary hover:bg-surface-container-low rounded-xl">Keluar</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
