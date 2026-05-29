import re

file_path = r'd:\laragon\www\JVC26\gatemate\resources\views\admin\events\show.blade.php'

# First read the existing content
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

tenant_content = r"""
        <!-- Tenant Tab Content -->
        <div id="tab-tenant" class="tab-content hidden">
            <!-- Tenant Actions -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div class="relative w-full md:w-80">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary" data-icon="search">search</span>
                    <input class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-[0.5px] border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-colors text-body-sm" placeholder="Cari nama tenant..." type="text"/>
                </div>
                <button class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-body-sm hover:opacity-90 transition-opacity">
                    <span class="material-symbols-outlined" data-icon="add">add</span>
                    Tambah Tenant
                </button>
            </div>
            <!-- Tenant List Table Container -->
            <div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-xl overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Nama Tenant</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Jenis Booth</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Total Penjualan</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Tenant Cut</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider">Status Withdrawal</th>
                                <th class="px-6 py-4 font-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-[0.5px] divide-outline-variant">
                            @if($tenants->isEmpty())
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-secondary">
                                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">storefront</span>
                                        <p>Belum ada tenant untuk event ini.</p>
                                    </td>
                                </tr>
                            @else
                                @foreach($tenants as $tenant)
                                @php
                                    $sales = \App\Models\WalletTransaction::where('type', 'tenant_revenue')->where('meta->tenant_id', $tenant->id_user)->sum('amount');
                                    // Use feePercent for cut if applicable, or typical 10%. We use config organizer_tenant_cut which is $tenantCut percentage variable.
                                    // $tenantCut in controller is the total sum.
                                    $tenantCutPct = config('services.platform.organizer_tenant_cut', 10);
                                    $cutAmount = $sales * $tenantCutPct / 100;
                                    $wd = \App\Models\WalletTransaction::where('user_id', $tenant->id_user)->where('type', 'withdrawal')->latest()->first();
                                    
                                    // Use first char for avatar
                                    $initial = strtoupper(substr($tenant->full_name ?? 'T', 0, 1));
                                @endphp
                                <tr class="hover:bg-surface-container-low transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-[0.5px] border-outline-variant text-primary font-bold">
                                                {{ $initial }}
                                            </div>
                                            <span class="font-medium">{{ $tenant->full_name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-secondary">Tenant</td>
                                    <td class="px-6 py-4 font-medium">Rp {{ number_format($sales, 0, ',', '.') }}</td>
                                    <td class="px-6 py-4 text-on-surface-variant">
                                        Rp {{ number_format($cutAmount, 0, ',', '.') }} 
                                        <span class="text-caption bg-surface-container px-1.5 py-0.5 rounded ml-1">({{ $tenantCutPct }}%)</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        @if(!$wd)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-secondary-container text-secondary">Belum Ada</span>
                                        @elseif($wd->status === 'pending_admin' || $wd->status === 'pending_superadmin' || $wd->status === 'pending')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-yellow-100 text-yellow-800">Menunggu</span>
                                        @elseif($wd->status === 'success')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-green-100 text-green-800">Selesai</span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-red-100 text-red-800">Gagal</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        @if($wd && $wd->status === 'pending_admin')
                                            <form action="{{ route('admin.events.tenant.withdraw.approve', [$event->id_event, $wd->id]) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-caption font-bold hover:opacity-90 active:scale-95 transition-all">Setujui Withdrawal</button>
                                            </form>
                                        @else
                                            <button class="text-secondary hover:text-primary transition-colors">
                                                <span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                                            </button>
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Summary Card -->
            <div class="bg-primary-fixed/30 border-[0.5px] border-primary/20 rounded-xl p-6 flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                    <div>
                        <p class="text-secondary text-caption font-medium uppercase tracking-tight">Estimasi Pendapatan Penyelenggara</p>
                        <h3 class="font-h3 text-on-primary-fixed-variant">Total Tenant Cut masuk ke pendapatan event: <span class="font-bold">Rp {{ number_format($tenantCut, 0, ',', '.') }}</span></h3>
                    </div>
                </div>
                <button class="hidden md:block text-primary font-label-md hover:underline decoration-2 underline-offset-4" onclick="document.querySelector('[data-target=\'tab-keuangan\']').click()">Lihat Laporan Keuangan</button>
            </div>
        </div>
"""

old_placeholder = r'''        <!-- Tenant Tab Content placeholder -->
        <div id="tab-tenant" class="tab-content hidden">
            <!-- Will be injected later -->
        </div>'''

content = content.replace(old_placeholder, tenant_content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("done replacing tenant tab")
