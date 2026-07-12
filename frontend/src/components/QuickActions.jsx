import { Link } from 'react-router-dom'
import { Search, Wallet, Ticket, HelpCircle, Plus } from 'lucide-react'

/**
 * Definisi aksi-aksi cepat yang ditampilkan.
 * type: 'primary' → bg Coral Red + teks putih
 * type: 'secondary' → border 1px Coral Red + teks Coral Red, bg transparan
 */
const quickActions = [
  {
    id: 'topup',
    label: 'Tambah saldo',
    description: 'Isi ulang dompetmu',
    icon: Plus,
    to: '/user/topup',
    type: 'primary',
  },
  {
    id: 'browse',
    label: 'Cari event',
    description: 'Temukan event seru',
    icon: Search,
    to: '/events',
    type: 'secondary',
  },
  {
    id: 'tickets',
    label: 'Tiket saya',
    description: 'Kelola semua tiket',
    icon: Ticket,
    to: '/user/tickets',
    type: 'secondary',
  },
  {
    id: 'wallet',
    label: 'Riwayat transaksi',
    description: 'Lihat mutasi saldo',
    icon: Wallet,
    to: '/user/wallet',
    type: 'secondary',
  },
  {
    id: 'help',
    label: 'Bantuan',
    description: 'Pusat bantuan GateMate',
    icon: HelpCircle,
    to: '/help',
    type: 'secondary',
  },
]

/**
 * QuickActions — Stitch Design System
 * - Tombol primer: rounded-full, bg-[#F04E37] (coral-red), text-white
 * - Tombol sekunder: rounded-full, border 1px coral-red, text-[#F04E37], bg transparan
 * - Tanpa shadow atau gradien
 */
export default function QuickActions({ actions = quickActions }) {
  return (
    <div
      className="bg-white rounded-[14px] p-4"
      style={{ border: '0.5px solid #EBEBEB' }}
    >
      <h2 className="text-sm font-semibold text-[#271815] mb-3">Aksi cepat</h2>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          const isPrimary = action.type === 'primary'

          return (
            <Link
              key={action.id}
              to={action.to}
              title={action.description}
              className={`
                flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                transition-opacity hover:opacity-85 active:opacity-70
                ${isPrimary
                  ? 'bg-[#F04E37] text-white'
                  : 'bg-transparent text-[#F04E37]'
                }
              `}
              style={!isPrimary ? { border: '1px solid #F04E37' } : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {action.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
