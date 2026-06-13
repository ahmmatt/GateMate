import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function TenantDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState({ menus: [], transactions: [], totalEarned: 0, pendingWd: 0, availableBalance: 0, isEventEnded: true });
  const [loading, setLoading] = useState(true);
  
  // Menu Form
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  
  // Cart
  const [cart, setCart] = useState({});
  const [qrPayload, setQrPayload] = useState(null);

  useEffect(() => {
    // Mock fetch since we don't have the exact API yet
    setTimeout(() => {
      setData({
        menus: [{ id: 1, item_name: 'Nasi Goreng', price: 25000 }, { id: 2, item_name: 'Es Teh Manis', price: 8000 }],
        transactions: [{ id: 1, type: 'tenant_revenue', amount: 50000, status: 'success', created_at: new Date().toISOString() }],
        totalEarned: 50000,
        pendingWd: 0,
        availableBalance: 50000,
        isEventEnded: true
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const handleAddMenu = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const newMenu = { id: Date.now(), item_name: newItemName, price: parseInt(newItemPrice) };
    setData(prev => ({ ...prev, menus: [...prev.menus, newMenu] }));
    setNewItemName(''); setNewItemPrice('');
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

  // Cart Functions
  const addToCart = (menu) => {
    setCart(prev => {
      const existing = prev[menu.id];
      if (existing) return { ...prev, [menu.id]: { ...existing, qty: existing.qty + 1 } };
      return { ...prev, [menu.id]: { ...menu, qty: 1 } };
    });
    setQrPayload(null);
  };
  const changeQty = (id, delta) => {
    setCart(prev => {
      const existing = prev[id];
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) { const newCart = { ...prev }; delete newCart[id]; return newCart; }
      return { ...prev, [id]: { ...existing, qty: newQty } };
    });
    setQrPayload(null);
  };
  const clearCart = () => { setCart({}); setQrPayload(null); };
  const grandTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
  const generateQr = () => {
    if (grandTotal <= 0) return;
    setQrPayload({ id: user?.id_user || 1, amount: grandTotal });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Nav */}
      <nav className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50">
        <div className="font-headline-md font-bold text-on-surface">Gate<span className="text-primary">Mate</span> Tenant</div>
        <div className="flex items-center gap-4">
          <div className="bg-primary-fixed text-primary px-4 py-1.5 rounded-full font-bold text-label-md">
            {formatRp(data.availableBalance)}
          </div>
          <button onClick={handleLogout} className="text-secondary hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Menu, History, Withdraw) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Add Menu */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 shadow-sm">
              <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-primary">
                <span className="material-symbols-outlined">add_circle</span> Tambah Menu
              </h3>
              <form onSubmit={handleAddMenu} className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Nama item..." required maxLength="100" className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-0 transition-colors" />
                <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="Harga (Rp)" required min="100" className="w-full sm:w-40 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-0 transition-colors" />
                <button type="submit" className="bg-primary text-white font-bold rounded-xl px-6 py-3 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">save</span> Simpan
                </button>
              </form>
            </div>

            {/* Menu Grid */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 shadow-sm">
              <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-[#006579]">
                <span className="material-symbols-outlined">restaurant_menu</span> Daftar Menu ({data.menus.length})
              </h3>
              {data.menus.length === 0 ? (
                <div className="text-center py-8 text-secondary"><span className="material-symbols-outlined text-4xl opacity-50 mb-2">fastfood</span><p>Belum ada menu.</p></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {data.menus.map(menu => (
                    <div key={menu.id} onClick={() => addToCart(menu)} className="bg-surface border border-outline-variant rounded-2xl p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-95 text-center flex flex-col justify-between h-full group">
                      <div>
                        <div className="font-bold text-on-surface mb-1 line-clamp-2">{menu.item_name}</div>
                        <div className="text-primary font-bold text-label-md">{formatRp(menu.price)}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(menu); }} className="mt-3 bg-primary-fixed/50 text-primary w-full py-1.5 rounded-lg font-bold text-label-md group-hover:bg-primary-fixed transition-colors">
                        + Tambah
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats & Withdraw */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-bold text-green-600">{formatRp(data.totalEarned)}</div>
                <div className="text-label-md text-secondary mt-1">Total Pendapatan</div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-bold text-orange-600">{formatRp(data.pendingWd)}</div>
                <div className="text-label-md text-secondary mt-1">Diproses</div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-bold text-[#006579]">{formatRp(data.availableBalance)}</div>
                <div className="text-label-md text-secondary mt-1">Tersedia</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 shadow-sm">
              <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-error">
                <span className="material-symbols-outlined">payments</span> Tarik Dana
              </h3>
              {!data.isEventEnded && <div className="bg-red-50 text-error p-3 rounded-xl mb-4 text-body-md flex items-center gap-2"><span className="material-symbols-outlined">lock</span> Penarikan dikunci karena event berlangsung.</div>}
              <form className="flex flex-col gap-3">
                <input type="number" placeholder={`Jumlah (Maks ${formatRp(data.availableBalance)})`} max={data.availableBalance} min="10000" disabled={!data.isEventEnded} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md disabled:opacity-50" />
                <div className="flex gap-3">
                  <input type="text" placeholder="Nama Bank" disabled={!data.isEventEnded} className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md disabled:opacity-50" />
                  <input type="text" placeholder="No Rekening" disabled={!data.isEventEnded} className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md disabled:opacity-50" />
                </div>
                <button type="button" disabled={!data.isEventEnded} className="mt-2 bg-error text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">send</span> Ajukan Penarikan
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (Cart & POS) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 shadow-sm sticky top-24">
              <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-orange-600">
                <span className="material-symbols-outlined">shopping_cart</span> Keranjang
              </h3>
              
              <div className="min-h-[150px] max-h-[300px] overflow-y-auto mb-4 pr-2 flex flex-col gap-2">
                {Object.values(cart).length === 0 ? (
                  <div className="text-center py-8 text-secondary"><span className="material-symbols-outlined text-4xl opacity-50 mb-2">shopping_bag</span><p>Keranjang kosong.</p></div>
                ) : (
                  Object.values(cart).map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-surface border border-outline-variant p-3 rounded-xl">
                      <div>
                        <div className="font-bold text-body-md">{item.item_name}</div>
                        <div className="text-primary font-bold text-label-md">{formatRp(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-surface-container-low rounded-lg p-1">
                          <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-on-surface shadow-sm font-bold">-</button>
                          <span className="w-6 text-center font-bold text-label-md">{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-on-surface shadow-sm font-bold">+</button>
                        </div>
                        <button onClick={() => changeQty(item.id, -item.qty)} className="text-error bg-red-50 p-1.5 rounded-lg hover:bg-red-100 transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl flex justify-between items-center mb-4">
                <span className="font-bold text-secondary">Grand Total</span>
                <span className="font-headline-md font-bold text-on-surface">{formatRp(grandTotal)}</span>
              </div>

              <button onClick={generateQr} disabled={grandTotal <= 0} className="w-full bg-[#006579] text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all mb-3 shadow-md">
                <span className="material-symbols-outlined">qr_code_2</span> Generate QR Tagihan
              </button>
              <button onClick={clearCart} className="w-full border border-error text-error font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">delete</span> Kosongkan Keranjang
              </button>

              {qrPayload && (
                <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-label-md text-secondary font-bold uppercase tracking-wider">Tunjukkan ke Pembeli</p>
                  <div className="bg-white p-3 rounded-2xl border-4 border-[#006579] shadow-lg">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrPayload))}`} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <div className="text-[24px] font-bold text-[#006579]">{formatRp(qrPayload.amount)}</div>
                  <p className="text-caption text-secondary mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">info</span> Pembeli scan via Wallet GateMate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
