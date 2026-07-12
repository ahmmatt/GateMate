import { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';

/**
 * WalletCard — Stitch Design System
 * - Card: bg-white, border 0.5px #EBEBEB, rounded-[14px], p-3
 * - Typography: Sentence case, saldo headline-lg (32px)
 * - Button: Pil (rounded-full), bg coral-red (#F04E37), teks putih, tanpa hover translate
 */
export default function WalletCard({ balance = 0, onTopup }) {
  const [isLoading, setIsLoading] = useState(false);

  const formattedBalance = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance);

  const handleTopup = async () => {
    if (isLoading || !onTopup) return;
    setIsLoading(true);
    try {
      await onTopup();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-[14px] p-3"
      style={{ border: '0.5px solid #EBEBEB' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#fff8f6] flex items-center justify-center">
            <Wallet size={16} className="text-[#b22110]" />
          </div>
          <span className="text-sm font-medium text-[#5f5e5e]">Saldo dompet</span>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p
          className="font-bold text-[#271815] leading-tight"
          style={{ fontSize: '32px' }}
        >
          {formattedBalance}
        </p>
        <p className="text-xs text-[#5f5e5e] mt-0.5">Tersedia untuk pembelian tiket</p>
      </div>

      {/* Topup button */}
      <button
        onClick={handleTopup}
        disabled={isLoading}
        className="
          flex items-center gap-1.5
          rounded-full px-4 py-2
          bg-[#F04E37] text-white
          text-sm font-medium
          transition-opacity duration-150
          hover:opacity-90 active:opacity-80
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Plus size={15} strokeWidth={2.5} />
        {isLoading ? 'Memproses...' : 'Tambah saldo'}
      </button>
    </div>
  );
}
