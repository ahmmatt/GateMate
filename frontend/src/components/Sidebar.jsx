import { NavLink, useNavigate } from 'react-router-dom'
import { Ticket, LogOut, X } from 'lucide-react'

export default function Sidebar({ navItems, title, onClose }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div
      className="flex flex-col h-full bg-white w-64"
      style={{ borderRight: '0.5px solid #EBEBEB' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-5"
        style={{ borderBottom: '0.5px solid #EBEBEB' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#b22110] rounded-xl flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-[#b22110]">SecureGate</span>
            <p className="text-[#5f5e5e] text-xs">{title}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-[#5f5e5e] hover:text-[#271815]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div
        className="mx-4 mt-4 mb-2 rounded-[14px] p-3 bg-[#fff8f6] cursor-pointer hover:bg-[#ffe9e5] transition-colors"
        style={{ border: '0.5px solid #EBEBEB' }}
        onClick={() => {
          navigate('/user/profile');
          if (onClose) onClose();
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? 'U')}&background=b22110&color=fff`}
            alt={user.name}
            className="w-9 h-9 rounded-full flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[#271815] font-semibold text-sm truncate">{user.name}</p>
            <p className="text-[#5f5e5e] text-xs capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150
              ${isActive
                ? 'bg-[#fff8f6] text-[#b22110]'
                : 'text-[#5f5e5e] hover:bg-[#f9f9f9] hover:text-[#271815]'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '0.5px solid #EBEBEB' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#5f5e5e] hover:text-[#b22110] hover:bg-[#fff8f6] transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}
