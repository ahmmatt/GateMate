import { Link } from 'react-router-dom'
import { ArrowRight, Bell } from 'lucide-react'

/**
 * DashboardHeader — Stitch Design System
 * - Sentence case pada semua teks
 * - Warna text-[#271815] (on-surface) dan text-[#5f5e5e] (secondary)
 * - Tanpa gradien atau efek neon/ungu
 */
export default function DashboardHeader({ user = {}, notifCount = 0 }) {
  const firstName = user.name?.split(' ')[0] ?? 'Pengguna'

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 17) return 'Selamat siang'
    return 'Selamat malam'
  }

  return (
    <div className="flex items-center justify-between">
      {/* Greeting text */}
      <div>
        <h1 className="text-2xl font-bold text-[#271815]">
          {greeting()}, {firstName}! 👋
        </h1>
        <p className="text-[#5f5e5e] text-sm mt-1">
          Selamat datang kembali di GateMate
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center transition-colors hover:bg-[#f0d4cf]"
          style={{ border: '0.5px solid #EBEBEB' }}
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4 text-[#271815]" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#F04E37] text-white text-[9px] font-bold flex items-center justify-center">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {/* CTA */}
        <Link
          to="/events"
          className="flex items-center gap-2 text-sm font-medium rounded-full px-4 py-2 bg-[#b22110] text-white hover:opacity-90 transition-opacity"
        >
          Cari event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
