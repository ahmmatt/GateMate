import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopUpModal from '../../components/modals/TopUpModal'

const transactions = [
  {
    id: 1,
    type: 'in',
    title: 'Top Up Wallet',
    subtitle: 'BCA Virtual Account',
    date: '15 Okt 2024, 14:20',
    amount: '+Rp 500.000',
    amountClass: 'text-[#2E7D32]',
    iconBg: 'bg-[#E8F5E9]',
    iconColor: 'text-[#2E7D32]',
    icon: 'north_east',
  },
  {
    id: 2,
    type: 'out',
    title: 'Tiket Konser Arctic Monkeys',
    subtitle: 'Berhasil',
    date: '12 Okt 2024, 09:15',
    amount: '-Rp 1.250.000',
    amountClass: 'text-[#F04E37]',
    iconBg: 'bg-[#fff0ee]',
    iconColor: 'text-[#F04E37]',
    icon: 'south_west',
  },
  {
    id: 3,
    type: 'out',
    title: 'Parkir GBK Senayan',
    subtitle: 'Berhasil',
    date: '11 Okt 2024, 18:45',
    amount: '-Rp 15.000',
    amountClass: 'text-[#F04E37]',
    iconBg: 'bg-[#fff0ee]',
    iconColor: 'text-[#F04E37]',
    icon: 'south_west',
  },
  {
    id: 4,
    type: 'in',
    title: 'Top Up Wallet',
    subtitle: 'Mandiri Transfer',
    date: '10 Okt 2024, 10:00',
    amount: '+Rp 1.000.000',
    amountClass: 'text-[#2E7D32]',
    iconBg: 'bg-[#E8F5E9]',
    iconColor: 'text-[#2E7D32]',
    icon: 'north_east',
  },
]

export default function Wallet() {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [cardStyle, setCardStyle] = useState({ '--x': '50%', '--y': '50%' })
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    setCardStyle({
      '--x': `${e.clientX - rect.left}px`,
      '--y': `${e.clientY - rect.top}px`,
    })
  }

  return (
    <div>
      {/* Material Symbols */}
      <style>{`
        .wallet-shine::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.18) 0%, transparent 55%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: inherit;
        }
        .wallet-shine:hover::before {
          opacity: 1;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Main Wallet Section ── */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* Balance Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="wallet-shine relative rounded-[22px] p-8 text-white flex flex-col gap-6 shadow-sm overflow-hidden"
            style={{
              background: '#F04E37',
              ...cardStyle,
            }}
          >
            {/* Decorative icon */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined" style={{ fontSize: 120 }}>account_balance_wallet</span>
            </div>

            <div className="z-10">
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">Total Saldo</p>
              <h1 className="text-[32px] font-bold leading-tight">Rp 2.500.000</h1>
            </div>

            <div className="flex z-10">
              <button 
                onClick={() => setIsTopUpOpen(true)}
                className="bg-white text-[#F04E37] px-[22px] py-[10px] rounded-[22px] text-xs font-bold transition-all hover:bg-[#fff0ee] active:scale-95"
              >
                Top Up
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4">
            <button 
              onClick={() => setIsTopUpOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-[#F04E37] text-[#F04E37] bg-transparent rounded-[22px] px-[22px] py-[10px] text-xs font-bold hover:bg-[#fff0ee] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span>
              Top Up
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-[#F04E37] text-[#F04E37] bg-transparent rounded-[22px] px-[22px] py-[10px] text-xs font-bold hover:bg-[#fff0ee] transition-all active:scale-95">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>qr_code_scanner</span>
              Scan QR / Bayar
            </button>
          </div>

          {/* Transaction History */}
          <div
            className="bg-white rounded-[14px] p-6 flex flex-col gap-4"
            style={{ border: '0.5px solid #EBEBEB' }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-[#271815]">Riwayat Transaksi</h3>
              <button className="text-[#b22110] text-xs font-semibold hover:underline">Lihat Semua</button>
            </div>

            <div className="flex flex-col">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between py-4 px-2 -mx-2 rounded-lg hover:bg-[#F9F9F9] transition-colors ${idx < transactions.length - 1 ? 'border-b border-[#EBEBEB]' : ''}`}
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.iconBg}`}>
                      <span className={`material-symbols-outlined ${tx.iconColor}`} style={{ fontSize: 20 }}>{tx.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#271815]">{tx.title}</p>
                      <p className="text-[11px] text-[#5f5e5e]">{tx.date}</p>
                    </div>
                  </div>
                  {/* Right */}
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amountClass}`}>{tx.amount}</p>
                    <p className="text-[11px] text-[#5f5e5e]">{tx.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar Widgets ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Promo Card */}
          <div
            className="bg-white rounded-[14px] p-4 flex flex-col gap-4"
            style={{ border: '0.5px solid #EBEBEB' }}
          >
            <h3 className="text-base font-semibold text-[#271815]">Promo Spesial</h3>
            <div className="rounded-xl overflow-hidden relative aspect-[16/9]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxaKtqJYTnd5vmyKfHJ9HiZRZSyC54NUQrmkntby3PMCzvidaNOodHa6zjxsPEevnzQb5RKGWhGI6AWDDsWzHDzns5TvNlqqM0THCmmQGTKBYmn7xD51OzW9orQdD985g1i9CdTlyZs6V9Pt_dkk3zp7uSAuclJWNm16FmfWopYjIXyODOgZxq97Wod5Lw1IE9km7VQD7eX_WVxdHeBWkZfboU_mnpA8VOZp0Y6tH20uW5eH0xDeL0uBbFXkqf7licndpEFhZnP7E"
                alt="Concert Promo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
                <p className="text-white text-xs font-medium">Cashback 20% Tiket Konser!</p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div
            className="rounded-[14px] p-4 flex gap-4"
            style={{ background: '#FFF0EE', border: '0.5px solid #F9DCD7' }}
          >
            <span className="material-symbols-outlined text-[#F04E37]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
            <div>
              <p className="text-sm font-bold text-[#271815] mb-1">Keamanan Terjamin</p>
              <p className="text-[11px] text-[#5b403c]">Transaksi dilindungi dengan enkripsi end-to-end dan otentikasi dua faktor.</p>
            </div>
          </div>

          {/* Wallet Settings */}
          <div
            className="bg-white rounded-[14px] p-6 flex flex-col gap-4"
            style={{ border: '0.5px solid #EBEBEB' }}
          >
            <h3 className="text-base font-semibold text-[#271815]">Pengaturan Wallet</h3>

            <div className="flex flex-col gap-1">
              {/* Metode Pembayaran */}
              <button className="group flex items-center justify-between w-full py-3 px-2 -mx-2 rounded-lg hover:bg-[#F9F9F9] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5f5e5e] group-hover:text-[#b22110] transition-colors">credit_card</span>
                  <span className="text-sm text-[#271815]">Metode Pembayaran</span>
                </div>
                <span className="material-symbols-outlined text-[#5f5e5e]" style={{ fontSize: 18 }}>chevron_right</span>
              </button>

              {/* Ubah PIN */}
              <button className="group flex items-center justify-between w-full py-3 px-2 -mx-2 rounded-lg hover:bg-[#F9F9F9] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5f5e5e] group-hover:text-[#b22110] transition-colors">lock</span>
                  <span className="text-sm text-[#271815]">Ubah PIN Wallet</span>
                </div>
                <span className="material-symbols-outlined text-[#5f5e5e]" style={{ fontSize: 18 }}>chevron_right</span>
              </button>

              {/* Notifikasi — toggle aktif */}
              <button className="group flex items-center justify-between w-full py-3 px-2 -mx-2 rounded-lg hover:bg-[#F9F9F9] transition-colors text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5f5e5e] group-hover:text-[#b22110] transition-colors">notifications</span>
                  <span className="text-sm text-[#271815]">Notifikasi Transaksi</span>
                </div>
                {/* Toggle On */}
                <div className="w-10 h-5 bg-[#b22110] rounded-full relative flex-shrink-0">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </div>
  )
}
