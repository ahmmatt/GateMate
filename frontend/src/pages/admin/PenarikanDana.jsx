import { useState, useEffect, useCallback } from 'react'
import { superadminService } from '../../services/api'
import { formatPrice } from '../../utils/formatDate'

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

const currentPeriod = () =>
  new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

// ── Eksekusi Modal ─────────────────────────────────────────────────────────

function ExekusiModal({ withdrawal, onClose, onExekusi, loading }) {
  if (!withdrawal) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[14px] border border-surface-container-high overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Eksekusi</h4>
              <p className="text-secondary text-body-md">Pastikan transfer ke rekening organizer sudah dilakukan.</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-surface-container-high space-y-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold shrink-0">
                {(withdrawal.admin_name || 'OR').substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-body-md font-bold text-on-surface truncate">{withdrawal.admin_name || '-'}</p>
                <p className="text-secondary text-label-sm truncate">{withdrawal.organization || '-'}</p>
              </div>
            </div>
            {[
              { label: 'Event', value: withdrawal.event_name || '-' },
              { label: 'Email', value: withdrawal.admin_email || '-' },
              { label: 'Tanggal Pengajuan', value: formatDate(withdrawal.created_at) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-body-md">
                <span className="text-secondary">{label}</span>
                <span className="text-on-surface max-w-[55%] text-right truncate">{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-body-md pt-2 border-t border-surface-container-high">
              <span className="text-secondary font-semibold">Total Transfer</span>
              <span className="text-primary font-bold">{formatPrice(withdrawal.amount)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-outline text-secondary py-3 rounded-full font-medium hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={() => onExekusi(withdrawal.id)}
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-3 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              Eksekusi Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function PenarikanDana() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [exekusiTarget, setExekusiTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superadminService.getPendingWithdrawals()
      if (res.data?.data) {
        setWithdrawals(res.data.data)
      }
    } catch (err) {
      console.error('Gagal memuat penarikan dana:', err)
      showToast('Gagal memuat data penarikan dana.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWithdrawals() }, [fetchWithdrawals])

  // Filter berdasarkan status backend yang benar
  const filtered = withdrawals.filter(w => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return w.status === 'pending_superadmin' || w.status === 'pending'
    if (filterStatus === 'success') return w.status === 'success' || w.status === 'done' || w.status === 'approved'
    return true
  })

  // Total yang sudah dicairkan (status === 'success' atau 'done' atau 'approved')
  const totalCair = withdrawals
    .filter(w => w.status === 'success' || w.status === 'done' || w.status === 'approved')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0)

  // Total pending
  const totalPending = withdrawals
    .filter(w => w.status === 'pending_superadmin' || w.status === 'pending')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0)

  const handleExekusi = async (id) => {
    setActionLoading(true)
    try {
      const res = await superadminService.executeWithdrawal(id)
      showToast(res?.data?.message || 'Penarikan dana berhasil dieksekusi!')
      // Update status lokal
      setWithdrawals(prev =>
        prev.map(w => w.id === id ? { ...w, status: 'success', executed_at: new Date().toISOString() } : w)
      )
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal mengeksekusi penarikan dana.', 'error')
    } finally {
      setActionLoading(false)
      setExekusiTarget(null)
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'success' || status === 'done' || status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-medium bg-green-100 text-green-800">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Selesai
        </span>
      )
    }
    if (status === 'pending_superadmin' || status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-medium bg-orange-100 text-orange-800">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
          Menunggu Eksekusi
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-medium bg-surface-container text-secondary">
        {status || '-'}
      </span>
    )
  }

  const tabs = [
    { key: 'pending',  label: 'Tertunda',  count: withdrawals.filter(w => w.status === 'pending_superadmin' || w.status === 'pending').length },
    { key: 'success',  label: 'Selesai',   count: withdrawals.filter(w => w.status === 'success' || w.status === 'done' || w.status === 'approved').length },
    { key: 'all',      label: 'Semua',     count: withdrawals.length },
  ]

  return (
    <div className="animate-in fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-3 rounded-[12px] shadow-lg font-body-md flex items-center gap-2 animate-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-[#EF4444] text-white' : 'bg-[#1a8754] text-white'
        }`}>
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Eksekusi Modal */}
      <ExekusiModal
        withdrawal={exekusiTarget}
        onClose={() => setExekusiTarget(null)}
        onExekusi={handleExekusi}
        loading={actionLoading}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Dicairkan */}
        <div className="col-span-2 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-2">Total Sudah Dicairkan</p>
            {loading ? (
              <div className="h-9 w-52 bg-surface-container-high rounded animate-pulse" />
            ) : (
              <h3 className="text-[32px] font-extrabold text-primary leading-none">
                {totalCair === 0 ? 'Rp 0' : formatPrice(totalCair)}
              </h3>
            )}
            {!loading && totalPending > 0 && (
              <p className="text-secondary font-label-sm mt-2">
                <span className="text-orange-600 font-bold">{formatPrice(totalPending)}</span> menunggu eksekusi
              </p>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[32px]">payments</span>
          </div>
        </div>

        {/* Periode Berjalan */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-6 relative overflow-hidden">
          <p className="font-label-md text-label-md text-secondary mb-2">Periode Berjalan</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface capitalize">{currentPeriod()}</p>
          {!loading && (
            <p className="text-secondary font-label-sm mt-2">
              {withdrawals.filter(w => {
                const d = new Date(w.created_at)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              }).length} pengajuan bulan ini
            </p>
          )}
          <div className="absolute -bottom-4 -right-4 opacity-5">
            <span className="material-symbols-outlined text-[100px]">calendar_today</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-surface-container-low p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilterStatus(t.key)}
            className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 ${
              filterStatus === t.key
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                filterStatus === t.key ? 'bg-primary text-white' : 'bg-surface-container text-secondary'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Nama Organizer', 'Nama Event', 'Jumlah Penarikan', 'Tanggal Pengajuan', 'Status', 'Tanggal Eksekusi', 'Aksi'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider whitespace-nowrap ${i === 6 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-8 bg-surface-container-high rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-[40px] opacity-40">payments</span>
                      </div>
                      <p className="text-secondary font-body-md">
                        {filterStatus === 'pending'
                          ? 'Tidak ada penarikan yang menunggu eksekusi.'
                          : filterStatus === 'success'
                          ? 'Belum ada penarikan yang selesai dieksekusi.'
                          : 'Belum ada data penarikan dana.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((w, i) => (
                <tr
                  key={w.id}
                  className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container-low/50 transition-colors`}
                >
                  {/* Nama Organizer */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-body-md font-semibold text-on-surface">{w.admin_name || '-'}</p>
                      {w.organization && (
                        <p className="text-label-sm text-secondary">{w.organization}</p>
                      )}
                    </div>
                  </td>

                  {/* Nama Event */}
                  <td className="px-6 py-4">
                    <div className="font-body-md text-secondary max-w-[180px]">
                      <span className="line-clamp-2">{w.event_name || '-'}</span>
                    </div>
                  </td>

                  {/* Jumlah Penarikan */}
                  <td className="px-6 py-4">
                    <div className="font-body-md font-bold text-primary">{formatPrice(w.amount)}</div>
                  </td>

                  {/* Tanggal Pengajuan */}
                  <td className="px-6 py-4">
                    <div className="font-body-md text-secondary whitespace-nowrap">{formatDate(w.created_at)}</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(w.status)}
                  </td>

                  {/* Tanggal Eksekusi */}
                  <td className="px-6 py-4">
                    <div className="font-body-md text-secondary whitespace-nowrap">
                      {(w.status === 'success' || w.status === 'done' || w.status === 'approved')
                        ? formatDate(w.executed_at || w.updated_at || w.created_at)
                        : '-'}
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {(w.status === 'pending_superadmin' || w.status === 'pending') ? (
                      <button
                        onClick={() => setExekusiTarget(w)}
                        className="bg-primary text-white px-4 py-2 rounded-full text-label-md font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center gap-2 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                        Eksekusi
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-secondary">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                          {(currentUser.full_name || currentUser.name || 'SA').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-label-md text-label-md">{currentUser.full_name || currentUser.name || 'Superadmin'}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-label-md text-label-md text-secondary">
            Menampilkan <span className="font-bold text-on-surface">{filtered.length}</span> dari{' '}
            <span className="font-bold text-on-surface">{withdrawals.length}</span> riwayat penarikan
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40 text-secondary"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-label-md text-label-md">1</button>
            <button
              className="p-2 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40 text-secondary"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
