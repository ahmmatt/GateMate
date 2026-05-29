import re

file_path = r'd:\laragon\www\JVC26\gatemate\resources\views\admin\events\show.blade.php'

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

keuangan_content = r"""
        <!-- Keuangan Tab Content -->
        <div id="tab-keuangan" class="tab-content hidden">
            <!-- Bento Grid Financial Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Financial Breakdown Card -->
                <div class="lg:col-span-2 bg-white rounded-xl border-[0.5px] border-outline-variant p-6 h-fit">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-h3 text-h3 text-on-surface">Rincian Pendapatan</h3>
                        <span class="material-symbols-outlined text-secondary" data-icon="info">info</span>
                    </div>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Pendapatan Kotor (Tiket + Tenant)</span>
                            <span class="text-body-sm font-medium text-on-surface">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Biaya Platform ({{ $feePercent ?? 10 }}%)</span>
                            <span class="text-body-sm font-medium text-error">–Rp {{ number_format($platformFee, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b-[0.5px] border-outline-variant border-dashed">
                            <span class="text-body-sm text-secondary">Potongan Tenant</span>
                            <span class="text-body-sm font-medium text-tertiary">+Rp {{ number_format($tenantCut, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between items-center pt-4">
                            <span class="text-body-lg font-bold text-on-surface">Total Pendapatan Bersih</span>
                            <span class="text-h2 font-black text-primary">Rp {{ number_format($netIncome, 0, ',', '.') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Withdrawal Status Card -->
                <div class="bg-surface-container-low rounded-xl border-[0.5px] border-outline-variant p-6 flex flex-col justify-between">
                    <div>
                        <p class="text-caption text-secondary uppercase tracking-wider font-bold mb-1">Saldo Tersedia</p>
                        <h4 class="text-h2 font-black text-on-surface mb-2">Rp {{ number_format($sisaBisaDitarik, 0, ',', '.') }}</h4>
                        <div class="flex items-center gap-2 text-caption text-secondary">
                            <span class="material-symbols-outlined text-sm" data-icon="account_balance">account_balance</span>
                            <span>Bank Central Asia • **** 8829</span>
                        </div>
                    </div>
                    @if($sisaBisaDitarik > 0)
                    <button class="w-full mt-8 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onclick="openWithdrawalModal()">
                        <span class="material-symbols-outlined text-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                        Ajukan Penarikan
                    </button>
                    @else
                    <button class="w-full mt-8 bg-surface-container text-secondary py-3 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <span class="material-symbols-outlined text-lg" data-icon="account_balance_wallet">account_balance_wallet</span>
                        Tidak Ada Saldo
                    </button>
                    @endif
                </div>

                <!-- Withdrawal History Table -->
                <div class="lg:col-span-3 bg-white rounded-xl border-[0.5px] border-outline-variant overflow-hidden">
                    <div class="px-6 py-4 border-b-[0.5px] border-outline-variant bg-surface-container-lowest flex justify-between items-center">
                        <h3 class="font-h3 text-h3 text-on-surface">Riwayat Penarikan</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-surface-container-low">
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Tanggal Pengajuan</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">ID Transaksi</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Jumlah</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase">Status</th>
                                    <th class="px-6 py-3 text-caption font-bold text-secondary uppercase text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-[0.5px] divide-outline-variant">
                                @forelse($eventWithdrawals as $wd)
                                <tr class="hover:bg-surface-container-lowest transition-colors">
                                    <td class="px-6 py-4 text-body-sm text-on-surface">{{ $wd->created_at->format('d M Y, H:i') }}</td>
                                    <td class="px-6 py-4 text-body-sm text-secondary">{{ $wd->order_id }}</td>
                                    <td class="px-6 py-4 text-body-sm font-bold text-on-surface">Rp {{ number_format($wd->amount, 0, ',', '.') }}</td>
                                    <td class="px-6 py-4">
                                        @if($wd->status === 'success')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-green-100 text-green-800">Berhasil</span>
                                        @elseif($wd->status === 'pending_superadmin' || $wd->status === 'pending_admin' || $wd->status === 'pending')
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-yellow-100 text-yellow-800">Diproses</span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-bold bg-red-100 text-red-800">Gagal</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button class="text-secondary hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined" data-icon="description">description</span>
                                        </button>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-8 text-center text-secondary text-body-sm">Belum ada riwayat penarikan.</td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
"""

modal_content = r"""
<!-- Withdrawal Modal Overlay -->
<div class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-on-background/40 backdrop-blur-[2px] p-4" id="withdrawalModal">
    <div class="bg-white w-full max-w-md rounded-xl border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-h3 text-h3 text-on-surface">Ajukan Penarikan</h3>
                <button class="text-secondary hover:text-on-surface" onclick="closeWithdrawalModal()">
                    <span class="material-symbols-outlined" data-icon="close">close</span>
                </button>
            </div>
            <form action="{{ route('admin.events.withdraw', $event->id_event) }}" method="POST">
                @csrf
                <input type="hidden" name="bank_name" value="BCA">
                <input type="hidden" name="account_number" value="8829000000">
                <input type="hidden" name="amount" value="{{ $sisaBisaDitarik }}">

                <div class="mb-6">
                    <label class="block text-caption font-bold text-secondary uppercase mb-2">Jumlah Penarikan</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface font-bold">Rp</span>
                        <input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg py-3 pl-12 pr-4 text-h3 font-bold focus:outline-none focus:border-primary transition-colors" readonly="" type="text" value="{{ number_format($sisaBisaDitarik, 0, ',', '.') }}"/>
                    </div>
                </div>
                <div class="bg-blue-50 border-[0.5px] border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <span class="material-symbols-outlined text-blue-600 mt-0.5" data-icon="info">info</span>
                    <p class="text-body-sm text-blue-800">
                        Dana akan ditransfer ke rekening terdaftar: <br/>
                        <strong class="font-bold">BCA - 8829 **** **** (A.N. SECURE ENT)</strong>
                    </p>
                </div>
                <div class="flex flex-col gap-3">
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                        Konfirmasi Pengajuan
                    </button>
                    <button type="button" class="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-high transition-colors" onclick="closeWithdrawalModal()">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
"""

script_addition = r"""
    function openWithdrawalModal() {
        const modal = document.getElementById('withdrawalModal');
        if(modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeWithdrawalModal() {
        const modal = document.getElementById('withdrawalModal');
        if(modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // Close modal on background click for withdrawal modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('withdrawalModal');
        if (event.target == modal) {
            closeWithdrawalModal();
        }
    });
"""

old_placeholder = r'''        <!-- Keuangan Tab Content placeholder -->
        <div id="tab-keuangan" class="tab-content hidden">
            <!-- Will be injected later -->
        </div>'''

# Replace Keuangan Tab Placeholder
content = content.replace(old_placeholder, keuangan_content)

# Inject Modal Before </body>
content = content.replace('</body>', modal_content + '\n</body>')

# Inject Script Before </script></body>
content = content.replace('</script>\n</body>', script_addition + '\n</script>\n</body>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("done replacing keuangan tab and modals")
