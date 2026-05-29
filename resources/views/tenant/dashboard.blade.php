@extends('layouts.app')

@section('styles')
<style>

        :root {
             --glass:rgba(13,20,38,0.8); --border:rgba(255,255,255,0.08);
            --text:#f1f5f9; --muted:#64748b; --primary:#6366f1; --prim-dark:#4f46e5;
            --teal:#2dd4bf; --danger:#ef4444; --success:#10b981; --warn:#f59e0b;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        
        

        /* ── Navbar ── */
        .top-nav{position:fixed;top:0;left:0;right:0;height:64px;z-index:100;
            display:flex;align-items:center;justify-content:space-between;padding:0 24px;
            background:rgba(6,9,15,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
        .nav-brand{font-size:1rem;font-weight:800;}
        .nav-brand span{color:var(--teal);}
        .nav-info{display:flex;align-items:center;gap:12px;}
        .saldo-pill{background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.2);
            color:var(--teal);padding:6px 14px;border-radius:100px;font-size:.78rem;font-weight:700;}

        /* ── 2-Column Layout ── */
        .pos-layout{display:grid;grid-template-columns:1fr 400px;gap:20px;max-width:1200px;margin:0 auto;}

        /* ── PANEL BASE ── */
        .panel{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);
            border-radius:20px;padding:22px;}
        .panel-title{font-size:1rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;}

        /* ── Flash ── */
        .flash{padding:12px 16px;border-radius:12px;font-size:.85rem;font-weight:600;
            display:flex;align-items:center;gap:8px;margin-bottom:16px;}
        .flash.success{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);color:#34d399;}
        .flash.error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;}

        /* ── Add Menu Form ── */
        .add-form{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;}
        .add-form input{flex:1;min-width:120px;background:rgba(0,0,0,.3);border:1px solid var(--border);
            color:#fff;padding:12px 14px;border-radius:12px;font-family:'Inter',sans-serif;
            font-size:.9rem;font-weight:600;outline:none;transition:border-color .2s;}
        .add-form input:focus{border-color:rgba(99,102,241,.5);}
        .add-form input::placeholder{color:rgba(255,255,255,.25);}
        .btn-add{background:var(--primary);color:#fff;border:none;padding:12px 18px;
            border-radius:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;
            display:flex;align-items:center;gap:6px;}
        .btn-add:hover{background:var(--prim-dark);transform:translateY(-1px);}

        /* ── Menu Grid ── */
        .menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;}
        .menu-card{background:rgba(0,0,0,.25);border:1px solid var(--border);border-radius:14px;
            padding:16px;cursor:pointer;transition:all .2s;text-align:center;position:relative;overflow:hidden;}
        .menu-card::before{content:'';position:absolute;inset:0;background:rgba(99,102,241,0);transition:background .2s;}
        .menu-card:hover::before{background:rgba(99,102,241,.06);}
        .menu-card:hover{border-color:rgba(99,102,241,.3);transform:translateY(-2px);}
        .menu-card:active{transform:scale(.97);}
        .mc-name{font-size:.9rem;font-weight:700;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .mc-price{font-size:.8rem;color:var(--teal);font-weight:700;}
        .mc-add{margin-top:10px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.25);
            color:#c7d2fe;padding:6px 12px;border-radius:8px;font-size:.75rem;font-weight:700;cursor:pointer;
            transition:all .2s;width:100%;}
        .mc-add:hover{background:rgba(99,102,241,.3);}
        .empty-menu{color:var(--muted);font-size:.85rem;padding:20px;text-align:center;}

        /* ── RIGHT: Cart ── */
        .right-col{display:flex;flex-direction:column;gap:16px;}

        /* Cart Items */
        .cart-items{min-height:120px;max-height:280px;overflow-y:auto;
            display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}
        .cart-item{display:flex;justify-content:space-between;align-items:center;
            padding:10px 14px;background:rgba(0,0,0,.2);border:1px solid var(--border);border-radius:12px;}
        .ci-name{font-size:.88rem;font-weight:600;}
        .ci-right{display:flex;align-items:center;gap:10px;}
        .ci-price{font-size:.88rem;font-weight:700;color:var(--teal);}
        .ci-qty{display:flex;align-items:center;gap:6px;}
        .btn-qty{background:rgba(255,255,255,.06);border:1px solid var(--border);color:#fff;
            width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:.9rem;
            display:flex;align-items:center;justify-content:center;transition:background .2s;}
        .btn-qty:hover{background:rgba(255,255,255,.12);}
        .qty-val{font-size:.85rem;font-weight:700;min-width:18px;text-align:center;}
        .btn-remove{color:var(--danger);background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.15);
            width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:.8rem;
            display:flex;align-items:center;justify-content:center;transition:all .2s;}
        .btn-remove:hover{background:rgba(239,68,68,.2);}
        .cart-empty{color:var(--muted);font-size:.85rem;text-align:center;padding:24px;}

        /* Total */
        .total-bar{display:flex;justify-content:space-between;align-items:center;
            padding:14px 16px;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:14px;}
        .total-label{font-size:.85rem;color:var(--muted);font-weight:600;}
        .total-val{font-size:1.4rem;font-weight:900;color:#fff;}

        /* QR Area */
        .qr-area{text-align:center;}
        .btn-gen{width:100%;background:var(--teal);color:#0f172a;border:none;padding:15px;
            border-radius:14px;font-weight:900;font-size:.95rem;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:8px;
            box-shadow:0 4px 20px rgba(45,212,191,.3);transition:all .2s;margin-bottom:16px;}
        .btn-gen:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(45,212,191,.4);}
        .btn-gen:disabled{opacity:.4;cursor:not-allowed;}
        .btn-clear{width:100%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);
            color:#f87171;padding:10px;border-radius:12px;font-weight:700;font-size:.85rem;
            cursor:pointer;transition:all .2s;margin-top:8px;}
        .btn-clear:hover{background:rgba(239,68,68,.2);}
        
        .qr-box{display:none;flex-direction:column;align-items:center;gap:12px;
            padding:20px;background:rgba(0,0,0,.2);border:1px solid var(--border);border-radius:16px;}
        .qr-box img{width:250px;height:250px;border-radius:12px;background:#fff;padding:8px;}
        .qr-hint{font-size:.78rem;color:var(--muted);text-align:center;}
        .qr-amount{font-size:1.1rem;font-weight:800;color:var(--teal);}

        /* History */
        .tx-list{display:flex;flex-direction:column;gap:8px;}
        .tx-item{display:flex;justify-content:space-between;align-items:center;
            padding:12px 14px;background:rgba(0,0,0,.2);border:1px solid var(--border);border-radius:12px;}
        .tx-left{display:flex;align-items:center;gap:10px;}
        .tx-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.9rem;}
        .icon-in{background:rgba(16,185,129,.1);color:var(--success);border:1px solid rgba(16,185,129,.2);}
        .icon-topup{background:rgba(45,212,191,.1);color:var(--teal);border:1px solid rgba(45,212,191,.2);}
        .tx-name{font-size:.85rem;font-weight:600;}
        .tx-time{font-size:.7rem;color:var(--muted);}
        .tx-amt{font-size:.95rem;font-weight:800;color:var(--success);}
        .tx-badge{font-size:.65rem;padding:2px 7px;border-radius:100px;background:rgba(16,185,129,.1);
            color:var(--success);border:1px solid rgba(16,185,129,.2);font-weight:700;display:block;text-align:right;margin-top:2px;}
        .empty-tx{color:var(--muted);font-size:.82rem;text-align:center;padding:20px;}

        /* ── Withdrawal Form ── */
        .wd-form{display:flex;flex-direction:column;gap:10px;}
        .wd-input{background:rgba(0,0,0,.3);border:1px solid var(--border);color:#fff;
            padding:12px 14px;border-radius:12px;font-family:'Inter',sans-serif;
            font-size:.875rem;outline:none;transition:border-color .2s;width:100%;}
        .wd-input:focus{border-color:rgba(239,68,68,.4);}
        .wd-input::placeholder{color:rgba(255,255,255,.2);}
        .btn-withdraw{width:100%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);
            color:#f87171;padding:13px;border-radius:12px;font-weight:700;font-size:.875rem;
            cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .btn-withdraw:hover{background:rgba(239,68,68,.2);}
        .stat-mini{display:flex;gap:10px;margin-bottom:4px;}
        .sm-pill{flex:1;text-align:center;padding:10px 8px;background:rgba(0,0,0,.25);
            border:1px solid var(--border);border-radius:12px;}
        .sm-val{font-size:.95rem;font-weight:800;}
        .sm-lbl{font-size:.68rem;color:var(--muted);font-weight:600;margin-top:2px;}

        @media(max-width:880px){.pos-layout{grid-template-columns:1fr;} .right-col{order:-1;}}
    
</style>
@endsection

@section('content')
<div class="pos-layout">

    {{-- ════════ KIRI: Menu ════════ --}}
    <div style="display:flex;flex-direction:column;gap:16px;">

        {{-- Flash --}}
        @if(session('menu_success'))
            <div class="flash success"><i class="fa-solid fa-circle-check"></i> {{ session('menu_success') }}</div>
        @endif
        @if(session('wd_success'))
            <div class="flash success"><i class="fa-solid fa-circle-check"></i> {{ session('wd_success') }}</div>
        @endif
        @if($errors->any())
            <div class="flash error"><i class="fa-solid fa-triangle-exclamation"></i> {{ $errors->first() }}</div>
        @endif

        {{-- Tambah Menu --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-plus-circle" style="color:var(--primary)"></i> Tambah Menu</div>
            <form action="{{ route('tenant.menu.store') }}" method="POST">
                @csrf
                <div class="add-form">
                    <input type="text" name="item_name" placeholder="Nama item..." required maxlength="100" value="{{ old('item_name') }}">
                    <input type="number" name="price" placeholder="Harga (Rp)" required min="100" value="{{ old('price') }}">
                    <button type="submit" class="btn-add"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>
                </div>
            </form>
        </div>

        {{-- Daftar Menu --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-utensils" style="color:var(--teal)"></i> Daftar Menu ({{ $menus->count() }} item)</div>
            @if($menus->isEmpty())
                <div class="empty-menu"><i class="fa-solid fa-bowl-food" style="font-size:2rem;opacity:.3;margin-bottom:8px;"></i><br>Belum ada menu. Tambahkan di atas!</div>
            @else
                <div class="menu-grid">
                    @foreach($menus as $menu)
                        <div class="menu-card" onclick="addToCart({{ $menu->id }}, '{{ addslashes($menu->item_name) }}', {{ $menu->price }})">
                            <div class="mc-name">{{ $menu->item_name }}</div>
                            <div class="mc-price">Rp {{ number_format($menu->price, 0, ',', '.') }}</div>
                            <button class="mc-add" onclick="event.stopPropagation(); addToCart({{ $menu->id }}, '{{ addslashes($menu->item_name) }}', {{ $menu->price }})">
                                <i class="fa-solid fa-plus"></i> Tambahkan
                            </button>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Histori --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-clock-rotate-left" style="color:var(--warn)"></i> Transaksi Terakhir</div>
            <div class="tx-list">
                @forelse($transactions as $tx)
                    <div class="tx-item">
                        <div class="tx-left">
                            <div class="tx-icon {{ $tx->type === 'tenant_revenue' ? 'icon-in' : 'icon-topup' }}">
                                <i class="fa-solid {{ $tx->type === 'tenant_revenue' ? 'fa-arrow-down' : 'fa-arrow-up' }}"></i>
                            </div>
                            <div>
                                <div class="tx-name">{{ $tx->type === 'tenant_revenue' ? 'Pembelian Pembeli' : 'Penarikan Dana' }}</div>
                                <div class="tx-time">{{ $tx->created_at->format('d M, H:i') }}</div>
                            </div>
                        </div>
                        <div>
                            <div class="tx-amt" style="color: {{ $tx->type === 'tenant_revenue' ? 'var(--success)' : 'var(--warn)' }}">
                                {{ $tx->type === 'tenant_revenue' ? '+' : '-' }}Rp {{ number_format($tx->amount, 0, ',', '.') }}
                            </div>
                            <div class="tx-badge" style="color: {{ $tx->status === 'success' ? 'var(--success)' : 'var(--warn)' }}; border-color: {{ $tx->status === 'success' ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.2)' }}">
                                {{ $tx->status === 'pending_admin' ? 'Menunggu Admin' : ucfirst($tx->status) }}
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="empty-tx">Belum ada transaksi.</div>
                @endforelse
            </div>
        </div>

        {{-- ── Statistik Mini ── --}}
        <div class="stat-mini">
            <div class="sm-pill">
                <div class="sm-val" style="color:var(--success);">Rp {{ number_format($totalEarned, 0, ',', '.') }}</div>
                <div class="sm-lbl">Total Pendapatan</div>
            </div>
            <div class="sm-pill">
                <div class="sm-val" style="color:var(--warn);">Rp {{ number_format($pendingWd, 0, ',', '.') }}</div>
                <div class="sm-lbl">Ditahan / Diproses</div>
            </div>
            <div class="sm-pill">
                <div class="sm-val" style="color:var(--teal);">Rp {{ number_format($availableBalance, 0, ',', '.') }}</div>
                <div class="sm-lbl">Tersedia</div>
            </div>
        </div>

        {{-- ── Form Tarik Dana ── --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-money-bill-wave" style="color:var(--danger);"></i> Tarik Dana</div>
            
            @if(!$isEventEnded)
                <div class="flash error" style="margin-bottom:10px">
                    <i class="fa-solid fa-lock"></i> Penarikan dana dikunci karena Event masih berlangsung.
                </div>
            @endif
            
            <form action="{{ route('tenant.withdraw') }}" method="POST">
                @csrf
                <div class="wd-form">
                    <input type="number" name="amount" class="wd-input" placeholder="Jumlah (Maks Rp {{ number_format($availableBalance, 0, ',', '.') }})" max="{{ $availableBalance }}" min="10000" required {{ (!$isEventEnded) ? 'disabled' : '' }}>
                    <input type="text" name="bank_name" class="wd-input" placeholder="Nama Bank (contoh: BCA, Mandiri, BNI)" required value="{{ old('bank_name') }}" {{ (!$isEventEnded) ? 'disabled' : '' }}>
                    <input type="text" name="account_number" class="wd-input" placeholder="Nomor Rekening" required value="{{ old('account_number') }}" {{ (!$isEventEnded) ? 'disabled' : '' }}>
                    
                    @if(!$isEventEnded)
                        <button type="button" class="btn-withdraw" style="opacity: 0.5; cursor: not-allowed;" disabled>
                            <i class="fa-solid fa-lock"></i> Tarik Dana (Dikunci)
                        </button>
                    @else
                        <button type="submit" class="btn-withdraw" onclick="return confirm('Ajukan penarikan? Dana akan diproses oleh Admin Penyelenggara.')">
                            <i class="fa-solid fa-paper-plane"></i> Ajukan Penarikan
                        </button>
                    @endif
                </div>
            </form>
        </div>
    </div>

    {{-- ════════ KANAN: Keranjang & QR ════════ --}}
    <div class="right-col">

        {{-- Keranjang --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-cart-shopping" style="color:var(--warn)"></i> Keranjang</div>
            <div class="cart-items" id="cartItems">
                <div class="cart-empty" id="cartEmpty"><i class="fa-solid fa-cart-shopping" style="font-size:2rem;opacity:.25;margin-bottom:8px;"></i><br>Belum ada item dipilih.</div>
            </div>
            <div class="total-bar">
                <span class="total-label">Grand Total</span>
                <span class="total-val" id="grandTotalDisplay">Rp 0</span>
            </div>
        </div>

        {{-- QR Generator --}}
        <div class="panel">
            <div class="panel-title"><i class="fa-solid fa-qrcode" style="color:var(--teal)"></i> Generate QR Tagihan</div>

            <button class="btn-gen" id="btnGenQr" onclick="generateQr()" disabled>
                <i class="fa-solid fa-qrcode"></i> Generate QR Tagihan
            </button>
            <button class="btn-clear" onclick="clearCart()">
                <i class="fa-solid fa-trash"></i> Kosongkan Keranjang
            </button>

            <div class="qr-box" id="qrBox" style="margin-top:16px;">
                <div class="qr-hint">QR Tagihan — tunjukkan ke pembeli</div>
                <img id="qrImg" src="" alt="QR Tagihan">
                <div class="qr-amount" id="qrAmountLabel"></div>
                <div class="qr-hint"><i class="fa-solid fa-circle-info"></i> Pembeli scan via Wallet → Scan & Pay</div>
            </div>
        </div>
    </div>
</div>





@endsection

@section('scripts')
<script>

    const TENANT_ID = {{ $tenant->id_user }};
    let cart = {}; // { menuId: { name, price, qty } }

    function fmt(n) {
        return 'Rp ' + Number(n).toLocaleString('id-ID');
    }

    function grandTotal() {
        return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
    }

    function addToCart(id, name, price) {
        if (cart[id]) {
            cart[id].qty++;
        } else {
            cart[id] = { name, price, qty: 1 };
        }
        renderCart();
    }

    function changeQty(id, delta) {
        if (!cart[id]) return;
        cart[id].qty += delta;
        if (cart[id].qty <= 0) delete cart[id];
        renderCart();
    }

    function removeItem(id) {
        delete cart[id];
        renderCart();
    }

    function clearCart() {
        cart = {};
        renderCart();
        document.getElementById('qrBox').style.display = 'none';
    }

    function renderCart() {
        const container = document.getElementById('cartItems');
        const empty     = document.getElementById('cartEmpty');
        const genBtn    = document.getElementById('btnGenQr');
        const totalDisp = document.getElementById('grandTotalDisplay');
        const keys      = Object.keys(cart);

        totalDisp.textContent = fmt(grandTotal());
        genBtn.disabled = keys.length === 0;

        if (keys.length === 0) {
            container.innerHTML = '<div class="cart-empty" id="cartEmpty"><i class="fa-solid fa-cart-shopping" style="font-size:2rem;opacity:.25;margin-bottom:8px;"></i><br>Belum ada item dipilih.</div>';
            return;
        }

        container.innerHTML = keys.map(id => {
            const item = cart[id];
            return `
            <div class="cart-item">
                <div>
                    <div class="ci-name">${item.name}</div>
                    <div class="ci-price">${fmt(item.price)}</div>
                </div>
                <div class="ci-right">
                    <div class="ci-qty">
                        <button class="btn-qty" onclick="changeQty(${id}, -1)">−</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="btn-qty" onclick="changeQty(${id}, 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeItem(${id})"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>`;
        }).join('');
    }

    function generateQr() {
        const total = grandTotal();
        if (total <= 0) return;

        const payload = JSON.stringify({ id: TENANT_ID, amount: total });
        const qrUrl   = 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=' + encodeURIComponent(payload);

        document.getElementById('qrImg').src = qrUrl;
        document.getElementById('qrAmountLabel').textContent = fmt(total);

        const box = document.getElementById('qrBox');
        box.style.display = 'flex';
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

</script>
@endsection
