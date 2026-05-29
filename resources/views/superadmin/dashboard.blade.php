@extends('layouts.app')

@section('styles')
<style>

        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
            --surface:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
            --purple:#7c3aed;--purple-dim:rgba(124,58,237,.15);--purple-border:rgba(124,58,237,.3);
            --cyan:#06b6d4;--green:#4ade80;--green-dim:rgba(74,222,128,.1);--green-border:rgba(74,222,128,.25);
            --amber:#f59e0b;--amber-dim:rgba(245,158,11,.12);--red:#f87171;--red-dim:rgba(248,113,113,.1);
            --text:#e2e8f0;--muted:rgba(226,232,240,.45);
        }
        html,
        

        .navbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
            padding:0 28px;height:60px;border-bottom:1px solid var(--border);
            backdrop-filter:blur(16px);background:rgba(6,13,26,.8)}
        .brand{font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#f59e0b,var(--red));
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        
        .page{max-width:1000px;margin:0 auto;padding:36px 24px 80px;position:relative;z-index:1}
        
        .page-header{display:flex;align-items:center;gap:12px;margin-bottom:32px}
        .page-header i{font-size:2rem;color:var(--amber)}
        .page-header h1{font-size:1.75rem;font-weight:800;color:#fff}
        .page-header p{font-size:.875rem;color:var(--muted);margin-top:4px}

        .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;
            backdrop-filter:blur(12px);box-shadow:0 8px 32px rgba(0,0,0,.2)}
        .card-title{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:20px;display:flex;align-items:center;gap:10px}
        .card-title i{color:var(--amber)}

        .wd-table{width:100%;border-collapse:collapse}
        .wd-table th{padding:12px 14px;text-align:left;font-size:.7rem;font-weight:700;
            color:var(--muted);text-transform:uppercase;letter-spacing:.06em;
            border-bottom:1px solid var(--border);background:rgba(255,255,255,.02)}
        .wd-table td{padding:16px 14px;font-size:.875rem;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:middle}
        .wd-table tr:last-child td{border-bottom:none}
        .wd-table tr:hover td{background:rgba(255,255,255,.015)}

        .badge-pending{background:var(--amber-dim);border:1px solid rgba(245,158,11,.25);color:var(--amber);
            padding:4px 10px;border-radius:100px;font-size:.7rem;font-weight:700}
        
        .btn-execute{background:var(--green-dim);border:1px solid var(--green-border);color:var(--green);
            padding:8px 16px;border-radius:10px;font-size:.8rem;font-weight:700;
            cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
        .btn-execute:hover{background:rgba(74,222,128,.18);transform:translateY(-1px)}

        .alert{padding:14px 18px;border-radius:12px;margin-bottom:24px;font-size:.875rem;display:flex;align-items:center;gap:10px}
        .alert-success{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);color:var(--green)}
        .alert-error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);color:var(--red)}

        .empty-state{text-align:center;padding:48px 20px;color:var(--muted)}
        .empty-state i{font-size:3rem;margin-bottom:16px;opacity:.2}
        .empty-state h3{font-size:1.2rem;font-weight:600;color:rgba(226,232,240,.6);margin-bottom:8px}

        .nav-right{display:flex;align-items:center;gap:14px}
        .btn-logout{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
            background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);
            border-radius:8px;color:var(--red);font-size:.8rem;font-weight:600;cursor:pointer;
            text-decoration:none;transition:background .2s}
        .btn-logout:hover{background:rgba(248,113,113,.18)}
    
</style>
@endsection

@section('content')
<div class="page">
    
    @if(session('success'))
        <div class="alert alert-success">
            <i class="fas fa-circle-check"></i> {{ session('success') }}
        </div>
    @endif
    @if($errors->has('withdraw_error'))
        <div class="alert alert-error">
            <i class="fas fa-circle-exclamation"></i> {{ $errors->first('withdraw_error') }}
        </div>
    @endif

    <div class="page-header">
        <i class="fas fa-building-columns"></i>
        <div>
            <h1>Pusat Kliring Pencairan Dana</h1>
            <p>Kelola dan eksekusi transfer dana penarikan dari penyelenggara event (Lapis 2)</p>
        </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:24px">
        {{-- Total Dana Dicairkan --}}
        <div class="card" style="margin-bottom:0;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:16px">
                <div style="background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);color:#4ade80;width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">
                    <i class="fas fa-circle-check"></i>
                </div>
                <div>
                    <div style="font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Total Dana Dicairkan</div>
                    <div style="font-size:1.3rem;font-weight:800;color:#4ade80">Rp {{ number_format($totalWithdrawnSuccess, 0, ',', '.') }}</div>
                </div>
            </div>
        </div>
        {{-- Total Pending --}}
        <div class="card" style="margin-bottom:0;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:16px">
                <div style="background:var(--amber-dim);border:1px solid rgba(245,158,11,.25);color:var(--amber);width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">
                    <i class="fas fa-hourglass-half"></i>
                </div>
                <div>
                    <div style="font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Menunggu Eksekusi</div>
                    <div style="font-size:1.3rem;font-weight:800;color:var(--amber)">Rp {{ number_format($totalPendingAmount, 0, ',', '.') }}</div>
                </div>
            </div>
        </div>
        {{-- Total Penyelenggara --}}
        <div class="card" style="margin-bottom:0;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:16px">
                <div style="background:var(--purple-dim);border:1px solid var(--purple-border);color:#a78bfa;width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">
                    <i class="fas fa-users"></i>
                </div>
                <div>
                    <div style="font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Penyelenggara Aktif</div>
                    <div style="font-size:1.3rem;font-weight:800;color:#fff">{{ $totalOrganizers }}</div>
                </div>
            </div>
        </div>
        {{-- Total Tiket Terjual --}}
        <div class="card" style="margin-bottom:0;padding:20px 24px">
            <div style="display:flex;align-items:center;gap:16px">
                <div style="background:rgba(6,182,212,.12);border:1px solid rgba(6,182,212,.25);color:var(--cyan);width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">
                    <i class="fas fa-ticket"></i>
                </div>
                <div>
                    <div style="font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Total Tiket Terjual</div>
                    <div style="font-size:1.3rem;font-weight:800;color:#fff">{{ number_format($totalTicketsSold) }}</div>
                </div>
            </div>
        </div>
    </div>

    {{-- Antrean Verifikasi Penyelenggara --}}
    <div class="card" style="margin-bottom: 24px;">
        <div class="card-title">
            <i class="fas fa-id-card-clip"></i> Antrean Verifikasi Penyelenggara (KYC)
        </div>

        @if($pendingOrganizers->isEmpty())
            <div class="empty-state">
                <i class="fas fa-check-double"></i>
                <h3>Tidak Ada Antrean</h3>
                <p>Tidak ada penyelenggara baru yang menunggu verifikasi saat ini.</p>
            </div>
        @else
            <div style="overflow-x:auto">
                <table class="wd-table">
                    <thead>
                        <tr>
                            <th>Waktu Daftar</th>
                            <th>Penyelenggara</th>
                            <th>Instansi / Organisasi</th>
                            <th>Kontak</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($pendingOrganizers as $org)
                            <tr>
                                <td>
                                    <div style="font-weight:600;color:#fff">{{ $org->created_at?->format('d M Y') }}</div>
                                    <div style="font-size:.75rem;color:var(--muted)">{{ $org->created_at?->format('H:i') }} WIB</div>
                                </td>
                                <td>
                                    <div style="font-weight:600;color:var(--cyan)">{{ $org->full_name }}</div>
                                    <div style="font-size:.75rem;color:var(--muted)">{{ $org->email }}</div>
                                </td>
                                <td>
                                    <div style="font-weight:700;color:#fff">{{ $org->organization_name }}</div>
                                </td>
                                <td>
                                    <div style="font-size:.8rem;color:var(--muted)"><i class="fas fa-phone"></i> {{ $org->phone ?? '-' }}</div>
                                </td>
                                <td>
                                    <span class="badge-pending">Menunggu Review</span>
                                </td>
                                <td>
                                    <button type="button" class="btn-execute" onclick="openKycModal('{{ $org->id_user }}', '{{ addslashes($org->full_name) }}', '{{ addslashes($org->email) }}', '{{ addslashes($org->organization_name) }}', '{{ addslashes($org->phone) }}', '{{ addslashes($org->instagram) }}', '{{ addslashes($org->tiktok_handle) }}', '{{ $org->ktp_document ? asset('storage/'.$org->ktp_document) : '' }}')">
                                        <i class="fas fa-magnifying-glass"></i> Tinjau Data
                                    </button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>

    {{-- Modal KYC --}}
    <div id="kycModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:100; align-items:center; justify-content:center; padding:20px;">
        <div class="card" style="width:100%; max-width:600px; max-height:90vh; overflow-y:auto; position:relative;">
            <button onclick="closeKycModal()" style="position:absolute; right:20px; top:20px; background:none; border:none; color:var(--muted); font-size:1.5rem; cursor:pointer;"><i class="fas fa-times"></i></button>
            <h2 style="font-size:1.5rem; margin-bottom:20px; color:#fff;">Tinjauan Data Penyelenggara</h2>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; font-size:0.9rem;">
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">Nama Lengkap</div>
                    <div id="kycName" style="color:#fff; font-weight:600;">-</div>
                </div>
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">Email</div>
                    <div id="kycEmail" style="color:#fff; font-weight:600;">-</div>
                </div>
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">Instansi</div>
                    <div id="kycOrg" style="color:#fff; font-weight:600;">-</div>
                </div>
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">Telepon</div>
                    <div id="kycPhone" style="color:#fff; font-weight:600;">-</div>
                </div>
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">Instagram</div>
                    <div id="kycIg" style="color:#fff; font-weight:600;">-</div>
                </div>
                <div>
                    <div style="color:var(--muted); font-size:0.8rem; margin-bottom:4px;">TikTok</div>
                    <div id="kycTiktok" style="color:#fff; font-weight:600;">-</div>
                </div>
            </div>

            <div style="margin-bottom:24px;">
                <div style="color:var(--muted); font-size:0.8rem; margin-bottom:8px;">Dokumen Identitas (KTP / Legalitas)</div>
                <div id="kycDocContainer" style="background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:12px; padding:10px; text-align:center;">
                    <img id="kycImg" src="" style="max-width:100%; max-height:300px; display:none; border-radius:8px;">
                    <a id="kycLink" href="#" target="_blank" style="display:none; color:var(--cyan); text-decoration:none; padding:20px; display:block;"><i class="fas fa-file-pdf fa-3x" style="margin-bottom:10px; color:#f87171;"></i><br>Buka Dokumen PDF</a>
                    <div id="kycNone" style="color:var(--muted); padding:20px;">Tidak ada dokumen dilampirkan.</div>
                </div>
            </div>

            <div style="display:flex; gap:12px; border-top:1px solid var(--border); padding-top:20px;">
                <form id="formApprove" method="POST" style="flex:1;">
                    @csrf
                    <button type="submit" class="btn-execute" style="width:100%; justify-content:center; padding:12px;">
                        <i class="fas fa-check-circle"></i> Approve & Verifikasi
                    </button>
                </form>
                <form id="formReject" method="POST" style="flex:1;" onsubmit="return confirm('Akun akan dihapus sepenuhnya. Yakin menolak penyelenggara ini?');">
                    @csrf
                    <button type="submit" style="width:100%; justify-content:center; padding:12px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.25); color:var(--red); border-radius:10px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                        <i class="fas fa-times-circle"></i> Tolak & Hapus
                    </button>
                </form>
            </div>
        </div>
    </div>

    

    <div class="card">
        <div class="card-title">
            <i class="fas fa-money-bill-transfer"></i> Daftar Antrean Pencairan (Pending Superadmin)
        </div>

        @if($pendingWithdrawals->isEmpty())
            <div class="empty-state">
                <i class="fas fa-check-double"></i>
                <h3>Semua Bersih!</h3>
                <p>Tidak ada permintaan pencairan dana yang menunggu eksekusi Anda saat ini.</p>
            </div>
        @else
            <div style="overflow-x:auto">
                <table class="wd-table">
                    <thead>
                        <tr>
                            <th>Tanggal / Waktu</th>
                            <th>Penyelenggara</th>
                            <th>Info Bank & Rekening</th>
                            <th>Jumlah Tarik</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($pendingWithdrawals as $wd)
                            @php 
                                $meta = $wd->meta ?? []; 
                                $wdAmount = number_format($wd->amount, 0, ',', '.');
                                $tenantName = $wd->user ? $wd->user->full_name : 'Unknown';
                                $eventName = $meta['event_title'] ?? $meta['event_name'] ?? 'Pencairan Event';
                            @endphp
                            <tr>
                                <td>
                                    <div style="font-weight:600;color:#fff">{{ $wd->created_at?->format('d M Y') }}</div>
                                    <div style="font-size:.75rem;color:var(--muted)">{{ $wd->created_at?->format('H:i') }} WIB</div>
                                </td>
                                <td>
                                    <div style="font-weight:600;color:var(--cyan)">{{ $tenantName }}</div>
                                    <div style="font-size:.75rem;color:var(--muted)">Event: {{ $eventName }}</div>
                                </td>
                                <td>
                                    <div style="font-weight:700;color:#fff;letter-spacing:0.02em">{{ $meta['bank_name'] ?? '-' }}</div>
                                    <div style="font-size:.8rem;color:var(--muted)">No. {{ $meta['account_number'] ?? '-' }}</div>
                                </td>
                                <td style="font-weight:800;color:var(--amber);font-size:1rem">
                                    Rp {{ $wdAmount }}
                                </td>
                                <td>
                                    <span class="badge-pending">Lapis 2 (Menunggu)</span>
                                </td>
                                <td>
                                    <form action="{{ route('superadmin.withdraw.execute', $wd->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin sudah melakukan transfer Rp {{ $wdAmount }} ke rekening {{ $meta['bank_name'] ?? '' }} {{ $meta['account_number'] ?? '' }} milik {{ $tenantName }}?');">
                                        @csrf
                                        <button type="submit" class="btn-execute">
                                            <i class="fas fa-paper-plane"></i> Eksekusi Transfer
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>

</div>



@endsection

@section('scripts')
<script>

        function openKycModal(id, name, email, org, phone, ig, tiktok, docUrl) {
            document.getElementById('kycName').textContent = name || '-';
            document.getElementById('kycEmail').textContent = email || '-';
            document.getElementById('kycOrg').textContent = org || '-';
            document.getElementById('kycPhone').textContent = phone || '-';
            document.getElementById('kycIg').textContent = ig || '-';
            document.getElementById('kycTiktok').textContent = tiktok || '-';
            
            let img = document.getElementById('kycImg');
            let link = document.getElementById('kycLink');
            let none = document.getElementById('kycNone');
            
            img.style.display = 'none';
            link.style.display = 'none';
            none.style.display = 'none';

            if(docUrl) {
                if(docUrl.toLowerCase().endsWith('.pdf')) {
                    link.href = docUrl;
                    link.style.display = 'block';
                } else {
                    img.src = docUrl;
                    img.style.display = 'block';
                }
            } else {
                none.style.display = 'block';
            }

            document.getElementById('formApprove').action = `/superadmin/organizers/${id}/approve`;
            document.getElementById('formReject').action = `/superadmin/organizers/${id}/reject`;

            document.getElementById('kycModal').style.display = 'flex';
        }
        function closeKycModal() {
            document.getElementById('kycModal').style.display = 'none';
        }
    
</script>
@endsection
