import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, CheckCircle2, Clock, CreditCard, Ticket } from 'lucide-react'

/**
 * Mock data aktivitas terbaru pengguna.
 * Ganti dengan data nyata dari API bila sudah tersedia.
 */
const mockActivities = [
  {
    id: 1,
    icon: Ticket,
    title: 'Tiket dibeli',
    description: 'Java Jazz Festival 2025 — 2 tiket',
    time: '2 jam lalu',
    type: 'purchase',
  },
  {
    id: 2,
    icon: CheckCircle2,
    title: 'Tiket digunakan',
    description: 'Soundrenaline 2025 — Gate A',
    time: 'Kemarin',
    type: 'used',
  },
  {
    id: 3,
    icon: CreditCard,
    title: 'Saldo ditambahkan',
    description: 'Top-up via transfer bank — Rp 200.000',
    time: '3 hari lalu',
    type: 'topup',
  },
  {
    id: 4,
    icon: ShoppingBag,
    title: 'Pesanan dikonfirmasi',
    description: 'Synchronize Festival 2025 — 1 tiket',
    time: '5 hari lalu',
    type: 'purchase',
  },
  {
    id: 5,
    icon: Clock,
    title: 'Menunggu pembayaran',
    description: 'We The Fest 2025 — 1 tiket VIP',
    time: '1 minggu lalu',
    type: 'pending',
  },
]

const typeColor = {
  purchase: 'text-[#b22110]',
  used: 'text-emerald-600',
  topup: 'text-sky-600',
  pending: 'text-amber-600',
}

const typeBg = {
  purchase: 'bg-[#fff8f6]',
  used: 'bg-emerald-50',
  topup: 'bg-sky-50',
  pending: 'bg-amber-50',
}

/**
 * RecentActivity — Stitch Design System
 * - bg-white, rounded-[14px], border 0.5px #EBEBEB, tanpa shadow
 * - Teks Sentence Case
 * - Hover baris: bg-[#F9F9F9]
 */
export default function RecentActivity({ activities = mockActivities, limit = 5 }) {
  const shown = activities.slice(0, limit)

  return (
    <div
      className="bg-white rounded-[14px] overflow-hidden"
      style={{ border: '0.5px solid #EBEBEB' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid #EBEBEB' }}>
        <h2 className="text-sm font-semibold text-[#271815]">Aktivitas terbaru</h2>
        <Link
          to="/user/tickets"
          className="text-xs text-[#5f5e5e] hover:text-[#271815] flex items-center gap-1 transition-colors"
        >
          Lihat semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity rows */}
      <ul>
        {shown.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-[#5f5e5e]">
            Belum ada aktivitas
          </li>
        )}
        {shown.map((item, idx) => {
          const Icon = item.icon
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F9F9F9] cursor-default"
              style={idx < shown.length - 1 ? { borderBottom: '0.5px solid #EBEBEB' } : undefined}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg[item.type] ?? 'bg-[#fff8f6]'}`}
              >
                <Icon className={`w-4 h-4 ${typeColor[item.type] ?? 'text-[#5f5e5e]'}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#271815] truncate">{item.title}</p>
                <p className="text-xs text-[#5f5e5e] truncate mt-0.5">{item.description}</p>
              </div>

              {/* Time */}
              <span className="text-xs text-[#5f5e5e] flex-shrink-0">{item.time}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
