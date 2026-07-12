import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000]

function formatRupiah(num) {
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

export default function TopUpModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState(100000)
  const [rawInput, setRawInput] = useState('100.000')
  const [activeChip, setActiveChip] = useState(100000)
  const [isClosing, setIsClosing] = useState(false)
  const overlayRef = useRef(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(100000)
      setRawInput('100.000')
      setActiveChip(100000)
      setIsClosing(false)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  const handleChipClick = (val) => {
    setAmount(val)
    setRawInput(formatRupiah(val))
    setActiveChip(val)
  }

  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw.length > 0) {
      const num = parseInt(raw, 10)
      setAmount(num)
      setRawInput(num.toLocaleString('id-ID'))
      // Check if it matches a chip
      setActiveChip(QUICK_AMOUNTS.includes(num) ? num : null)
    } else {
      setAmount(0)
      setRawInput('')
      setActiveChip(null)
    }
  }

  const handleSubmit = () => {
    if (amount < 10000) return
    // In a real app, this would trigger a payment flow
    alert(`Top up Rp ${formatRupiah(amount)} sedang diproses!`)
    handleClose()
  }

  if (!isOpen) return null

  const animClass = isClosing
    ? 'animate-[fadeOut_0.2s_ease-in-out]'
    : 'animate-[fadeIn_0.25s_ease-out]'
  const panelAnimClass = isClosing
    ? 'animate-[slideDown_0.2s_ease-in-out]'
    : 'animate-[slideUp_0.25s_ease-out]'

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(24px) scale(0.97); }
        }
        .coral-shadow {
          box-shadow: 0 10px 30px -10px rgba(178, 33, 16, 0.3);
        }
        .topup-material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
      `}</style>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ${animClass}`}
      >
        {/* Modal Panel */}
        <div className={`relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto bg-surface-container-lowest border border-[#EBEBEB] rounded-[14px] shadow-2xl ${panelAnimClass} hide-scrollbar`}>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#EBEBEB] text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all active:scale-90"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">Top Up Balance</h1>
              <p className="text-on-surface-variant font-body-md">Add funds securely to your digital gate pass</p>
            </div>

            {/* Amount Input */}
            <div className="relative mb-8">
              <div className="text-center mb-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Enter Amount</div>
              <div className="flex items-center justify-center gap-2 border-b-2 border-outline-variant focus-within:border-primary transition-all pb-2">
                <span className="text-headline-md font-bold text-on-surface-variant">Rp</span>
                <input
                  type="text"
                  value={rawInput}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-[40px] font-bold text-on-surface w-full max-w-[280px] text-center p-0 placeholder:text-surface-variant"
                />
              </div>
              {amount > 0 && amount < 10000 && (
                <p className="text-center text-xs text-red-500 mt-2">Minimal top up Rp 10.000</p>
              )}
            </div>

            {/* Quick Selection Chips */}
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-3">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleChipClick(val)}
                    className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                      activeChip === val
                        ? 'bg-primary text-on-primary border border-primary shadow-sm'
                        : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    Rp {formatRupiah(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <div className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Payment Method</div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low border border-[#EBEBEB] rounded-[10px] cursor-pointer hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-outline-variant p-1">
                    <img alt="Midtrans logo" className="w-full h-auto grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxfl0nev0MEY4sIgyo7Jzpmn5RhSGLv-X-aIBNLcq4xnVjbdMeiJ9ZygrGspkJAg7NsBilpUjE-U8P1YY6MAeDZeOup2fvBUFWBUtGXkb9_9vhSIsmzzhecvHN8N0bU2-2d9bpYaBegB9VrUUhzPuEZcFowwdLAB8wZpZ9Qap5-jaHA67fhsPimtOnmzO0o0lCQY8NcPyN-YJIR3svwPCm0qLSTXfbgkda5TaHlGxOqOtKYioJbwcvP-nXb5Dgtfnb9Vw0FHxuCIw" />
                  </div>
                  <div>
                    <div className="font-headline-sm text-headline-sm">Midtrans</div>
                    <div className="font-caption text-caption text-on-surface-variant">Virtual Account, CC, E-wallet</div>
                  </div>
                </div>
                <span className="topup-material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={amount < 10000}
              className="w-full bg-[#F04E37] text-white py-4 rounded-full font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all coral-shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Lanjutkan Pembayaran
            </button>

            {/* Informational Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gap-default mt-8">
              <div className="bg-surface-container-low border border-[#EBEBEB] rounded-[14px] p-4 flex gap-4">
                <div className="w-10 h-10 bg-[#FFF0EE] text-[#B83020] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="topup-material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm mb-1">Secure Transaction</h3>
                  <p className="font-caption text-caption text-on-surface-variant leading-normal">Your payment is encrypted and processed through industry-standard gateways.</p>
                </div>
              </div>
              <div className="bg-surface-container-low border border-[#EBEBEB] rounded-[14px] p-4 flex gap-4">
                <div className="w-10 h-10 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="topup-material-symbols-outlined">bolt</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm mb-1">Instant Balance</h3>
                  <p className="font-caption text-caption text-on-surface-variant leading-normal">Funds are usually available in your account within seconds of payment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
