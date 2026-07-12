import { useState } from 'react'
import { formatPrice } from '../../utils/formatDate'

export default function PenarikanDana() {
  // TODO: Ganti dengan fetch dari API → adminService.getWithdrawals()
  const [withdrawals, setWithdrawals] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = withdrawals.filter(w => {
    return filterStatus === 'all' || w.status === filterStatus
  })

  return (
    <div className="animate-in fade-in">
      {/* Page Title & Subtitle */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Penarikan Dana</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Riwayat dan eksekusi pencairan organizer</p>
        </div>
      </div>

      {/* Summary Card - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-wider">Total Sudah Dicairkan</p>
            <h3 className="font-headline-xl text-[32px] text-primary font-extrabold mt-2">Rp 2.450.000.000</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]">payments</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 relative overflow-hidden">
          <p className="font-label-md text-label-md text-secondary mb-2">Periode Berjalan</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface">Oktober 2023</p>
          <div className="absolute -bottom-4 -right-4 opacity-5">
            <span className="material-symbols-outlined text-[100px]">calendar_today</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-surface-container-low p-1 rounded-xl w-fit">
        <button 
          onClick={() => setFilterStatus('pending')}
          className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all ${filterStatus === 'pending' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}
        >
          Tertunda
        </button>
        <button 
          onClick={() => setFilterStatus('done')}
          className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all ${filterStatus === 'done' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}
        >
          Selesai
        </button>
        <button 
          onClick={() => setFilterStatus('all')}
          className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all ${filterStatus === 'all' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}
        >
          Semua
        </button>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Nama Organizer</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Nama Event</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Jumlah Penarikan</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Tanggal Pengajuan</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Tanggal Eksekusi</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase">Dieksekusi Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((w, i) => (
                <tr key={w.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container-low/50 transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-body-md font-semibold text-on-surface">{w.organizerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-body-md text-secondary">{w.eventTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-body-md font-bold text-primary">{formatPrice(w.amount)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-body-md text-secondary">{new Date(w.requestedAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                  </td>
                  <td className="px-6 py-4">
                    {w.status === 'done' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium bg-green-100 text-green-800">
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium bg-orange-100 text-orange-800">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-body-md text-secondary">
                      {w.status === 'done' ? new Date(w.requestedAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {w.status === 'done' ? (
                      <div className="flex items-center gap-2">
                        <img alt="Admin Avatar" className="w-6 h-6 rounded-full" src="https://ui-avatars.com/api/?name=Admin+Dana&background=random" />
                        <span className="font-label-md text-label-md text-on-surface">Admin Dana</span>
                      </div>
                    ) : (
                      <div className="font-label-md text-label-md text-secondary">-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <p className="font-label-md text-label-md text-secondary">Menampilkan 1-{filtered.length} dari {withdrawals.length} riwayat penarikan</p>
          <div className="flex items-center gap-2">
            <button className="p-2 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-50 text-secondary" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-label-md text-label-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest font-label-md text-label-md text-secondary">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest font-label-md text-label-md text-secondary">3</button>
            <button className="p-2 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors text-secondary">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
