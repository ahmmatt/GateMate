import React, { useState } from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function WalletCard({ user }) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');

  const handleTopup = () => {
    if (topupAmount > 0) {
      // API call would go here
      console.log('Topup amount:', topupAmount);
      setShowTopupModal(false);
      setTopupAmount('');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white card-shadow overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="font-body-md text-body-md text-white/80 mb-2">Saldo Dompet</p>
              <h3 className="font-headline-lg text-headline-lg text-white">
                Rp {user?.wallet_balance?.toLocaleString('id-ID') || 0}
              </h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="font-label-md text-label-md text-white">Aktif</span>
            </div>
          </div>

          {/* Card Details */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="font-label-md text-label-md text-white/80 mb-1">Card Holder</p>
              <p className="font-body-md text-body-md text-white">{user?.name}</p>
            </div>
            <div className="text-right">
              <p className="font-label-md text-label-md text-white/80 mb-1">Valid Thru</p>
              <p className="font-body-md text-body-md text-white">12/26</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/20">
            <button
              onClick={() => setShowTopupModal(true)}
              className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg font-body-md text-body-md text-white transition-all flex items-center justify-center gap-2"
            >
              <MaterialIcon icon="add" />
              Topup
            </button>
            <button className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg font-body-md text-body-md text-white transition-all flex items-center justify-center gap-2">
              <MaterialIcon icon="send" />
              Transfer
            </button>
            <button className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg font-body-md text-body-md text-white transition-all flex items-center justify-center gap-2">
              <MaterialIcon icon="history" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 card-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Topup Saldo</h3>
              <button
                onClick={() => setShowTopupModal(false)}
                className="text-secondary hover:text-on-surface transition-colors"
              >
                <MaterialIcon icon="close" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-body-md text-body-md text-secondary mb-2">
                  Jumlah Topup
                </label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Masukkan jumlah..."
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary"
                />
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-3">
                {[100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount)}
                    className="px-3 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    Rp {(amount / 1000).toFixed(0)}K
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTopupModal(false)}
                className="flex-1 px-4 py-3 border border-primary text-primary font-body-md text-body-md rounded-lg hover:bg-surface-container-low transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleTopup}
                className="flex-1 px-4 py-3 bg-primary text-on-primary font-body-md text-body-md rounded-lg hover:bg-primary-container transition-all"
              >
                Topup Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
