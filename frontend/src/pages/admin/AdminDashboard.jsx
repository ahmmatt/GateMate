import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { superadminService } from '../../services/api'

const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

// ── Modal Komponen ─────────────────────────────────────────────────────────

function ApproveModal({ organizer, onClose, onApprove, loading }) {
  if (!organizer) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[14px] border border-surface-container-high overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Verifikasi</h4>
              <p className="text-secondary text-body-md">Tinjau detail organizer sebelum menyetujui.</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-surface-container-high space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold shrink-0">
                {organizer.full_name?.substring(0, 2).toUpperCase() || 'OR'}
              </div>
              <div className="min-w-0">
                <p className="font-body-md font-bold text-on-surface truncate">{organizer.full_name}</p>
                <p className="text-secondary text-label-sm truncate">{organizer.organization_name || '-'}</p>
              </div>
            </div>
            <div className="border-t border-surface-container-high pt-3 space-y-2">
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Email</span>
                <span className="text-on-surface truncate max-w-[55%] text-right">{organizer.email}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">No. Telepon</span>
                <span className="text-on-surface">{organizer.phone || '-'}</span>
              </div>
              {organizer.ktp_document_url && (
                <div className="flex justify-between text-body-md">
                  <span className="text-secondary">Dokumen KTP</span>
                  <a href={organizer.ktp_document_url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">description</span>Lihat
                  </a>
                </div>
              )}
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
              onClick={() => onApprove(organizer.id)}
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-full font-medium hover:opacity-90 transition-colors shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              Ya, Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ organizer, onClose, onReject, loading }) {
  if (!organizer) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full max-w-[440px] rounded-[16px] overflow-hidden border border-surface-container-high animate-in fade-in zoom-in duration-300">
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-[32px]">warning</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Konfirmasi Penolakan</h3>
          <p className="text-secondary font-body-md">Apakah Anda yakin ingin menolak pengajuan verifikasi organizer ini?</p>
        </div>
        <div className="px-8 pb-6">
          <div className="bg-[#F5F5F7] rounded-[12px] p-4 flex flex-col gap-2 border-[0.5px] border-surface-container-high">
            <div className="flex justify-between items-center">
              <span className="text-secondary font-label-sm">Organizer</span>
              <span className="font-body-md font-semibold text-on-surface">{organizer.full_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-label-sm">Organisasi</span>
              <span className="font-body-md font-semibold text-on-surface">{organizer.organization_name || '-'}</span>
            </div>
          </div>
          <div className="mt-4 bg-[#FEF2F2] border-[0.5px] border-[#FEE2E2] p-4 rounded-[12px] flex gap-3">
            <span className="material-symbols-outlined text-[#EF4444] text-[20px]">info</span>
            <p className="text-[#EF4444] font-body-md leading-relaxed text-[13px]">
              Tindakan ini akan menghapus akun dan seluruh data pengajuan organizer ini secara permanen.
            </p>
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={() => onReject(organizer.id)}
            disabled={loading}
            className="w-full bg-[#EF4444] text-white py-3 px-6 rounded-full font-headline-md hover:bg-[#DC2626] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            Ya, Tolak &amp; Hapus
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-transparent border border-surface-container-high text-secondary py-3 px-6 rounded-full font-headline-md hover:bg-[#F9F9F9] transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

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
              <h4 className="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Pembayaran</h4>
              <p className="text-secondary text-body-md">Pastikan transfer ke rekening organizer.</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-surface-container-high">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold shrink-0">
                {withdrawal.admin_name?.substring(0, 2).toUpperCase() || 'OR'}
              </div>
              <div className="min-w-0">
                <p className="font-body-md font-bold text-on-surface truncate">{withdrawal.admin_name || '-'}</p>
                <p className="text-secondary text-label-sm truncate">{withdrawal.organization || '-'}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-surface-container-high pt-3">
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Event</span>
                <span className="text-on-surface max-w-[60%] text-right">{withdrawal.event_name || '-'}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Email</span>
                <span className="text-on-surface">{withdrawal.admin_email || '-'}</span>
              </div>
              <div className="flex justify-between text-body-md pt-2 border-t border-surface-container-high">
                <span className="text-secondary font-semibold">Total Transfer</span>
                <span className="text-primary font-bold">{formatRp(withdrawal.amount)}</span>
              </div>
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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [organizers, setOrganizers] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [exekusiTarget, setExekusiTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [dashRes, orgRes, wdRes] = await Promise.all([
        superadminService.getDashboard().catch(() => null),
        superadminService.getOrganizers().catch(() => null),
        superadminService.getPendingWithdrawals().catch(() => null),
      ])
      if (dashRes?.data?.data) setStats(dashRes.data.data)
      if (orgRes?.data?.data) setOrganizers(orgRes.data.data)
      if (wdRes?.data?.data) setWithdrawals(wdRes.data.data)
    } catch (err) {
      console.error('Superadmin API error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Filter pending organizers (not yet verified)
  const pendingOrgs = organizers.filter(o => !o.is_verified_organizer)

  // Filter pending withdrawals (status pending_superadmin)
  const pendingWithdrawals = withdrawals.filter(w =>
    w.status === 'pending_superadmin' || w.status === 'pending'
  )

  const handleApprove = async (id) => {
    setActionLoading(true)
    try {
      const res = await superadminService.approveOrganizer(id)
      showToast(res?.data?.message || 'Organizer berhasil disetujui!')
      setOrganizers(prev => prev.filter(o => o.id !== id))
      // Refresh stats
      superadminService.getDashboard().then(r => { if (r?.data?.data) setStats(r.data.data) })
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal approve organizer.', 'error')
    } finally {
      setActionLoading(false)
      setApproveTarget(null)
    }
  }

  const handleReject = async (id) => {
    setActionLoading(true)
    try {
      await superadminService.rejectOrganizer(id, 'Ditolak oleh superadmin')
      showToast('Organizer berhasil ditolak dan dihapus.')
      setOrganizers(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal reject organizer.', 'error')
    } finally {
      setActionLoading(false)
      setRejectTarget(null)
    }
  }

  const handleExekusi = async (id) => {
    setActionLoading(true)
    try {
      const res = await superadminService.executeWithdrawal(id)
      showToast(res?.data?.message || 'Penarikan dana berhasil dieksekusi!')
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'success' } : w))
      // Refresh stats
      superadminService.getDashboard().then(r => { if (r?.data?.data) setStats(r.data.data) })
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal eksekusi penarikan dana.', 'error')
    } finally {
      setActionLoading(false)
      setExekusiTarget(null)
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Revenue chart data from backend
  const revenueValues = stats?.revenue_values || [0, 0, 0, 0, 0, 0]
  const revenueMonths = stats?.revenue_months || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
  const maxVal = Math.max(...revenueValues, 1)
  const pts = revenueValues.map((v, i) => ({ x: i * 100, y: 180 - (v / maxVal) * 140 }))
  let svgPath = pts.length > 0 ? `M ${pts[0].x} ${pts[0].y}` : ''
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i]
    svgPath += ` C ${prev.x + 50} ${prev.y}, ${curr.x - 50} ${curr.y}, ${curr.x} ${curr.y}`
  }
  const svgArea = pts.length > 0 ? `${svgPath} L ${pts[pts.length - 1].x} 200 L 0 200 Z` : ''
  const lastPt = pts[pts.length - 1]

  return (
    <div className="animate-in fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-3 rounded-[12px] shadow-lg font-body-md flex items-center gap-2 transition-all animate-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-error text-white' : 'bg-[#1a8754] text-white'
        }`}>
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <ApproveModal organizer={approveTarget} onClose={() => setApproveTarget(null)} onApprove={handleApprove} loading={actionLoading} />
      <RejectModal organizer={rejectTarget} onClose={() => setRejectTarget(null)} onReject={handleReject} loading={actionLoading} />
      <ExekusiModal withdrawal={exekusiTarget} onClose={() => setExekusiTarget(null)} onExekusi={handleExekusi} loading={actionLoading} />

      {/* Welcome Header */}
      <div className="mb-6">
        <p className="text-secondary font-body-lg">
          Selamat datang, <span className="font-semibold text-on-surface">{user.full_name || user.name || 'Superadmin'}</span>
        </p>
      </div>

      {/* ── Section A: Stat Cards ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Transaksi */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary">receipt</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Transaksi</p>
          {loading ? (
            <div className="h-8 w-16 bg-surface-container-high rounded animate-pulse" />
          ) : (
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">
              {(stats?.total_transactions ?? stats?.total_tickets ?? 0).toLocaleString('id-ID')}
            </h2>
          )}
        </div>

        {/* Card 2: Total Pendapatan Platform */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg">
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Pendapatan</p>
          {loading ? (
            <div className="h-8 w-32 bg-surface-container-high rounded animate-pulse" />
          ) : (
            <h2 className="text-xl xl:text-2xl font-bold text-primary tracking-tight">
              {stats?.total_revenue === 0 ? 'Gratis' : formatRp(stats?.total_revenue)}
            </h2>
          )}
        </div>

        {/* Card 3: Pengguna Aktif */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary">group</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Pengguna Aktif</p>
          {loading ? (
            <div className="h-8 w-16 bg-surface-container-high rounded animate-pulse" />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">
                {(stats?.active_users ?? stats?.total_users ?? 0).toLocaleString('id-ID')}
              </h2>
              <p className="text-secondary text-label-sm mt-1">30 hari terakhir</p>
            </>
          )}
        </div>

        {/* Card 4: Menunggu Eksekusi */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="material-symbols-outlined text-orange-600">schedule</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Menunggu Eksekusi</p>
          {loading ? (
            <div className="h-8 w-10 bg-surface-container-high rounded animate-pulse" />
          ) : (
            <h2 className="text-2xl font-bold text-orange-600 tracking-tight">
              {stats?.pending_withdrawals_count ?? pendingWithdrawals.length}
            </h2>
          )}
        </div>
      </section>

      {/* ── Section B: Platform Stats & Revenue Chart ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Left: Platform Summary */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-container-high bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
              Ringkasan Platform
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Total Pengguna', value: (stats?.total_users ?? 0).toLocaleString('id-ID'), icon: 'person' },
              { label: 'Total Organizer', value: (stats?.total_organizers ?? 0).toLocaleString('id-ID'), icon: 'business' },
              { label: 'Menunggu Verifikasi', value: (stats?.pending_organizers ?? 0).toLocaleString('id-ID'), icon: 'pending_actions', highlight: true },
              { label: 'Total Event', value: (stats?.total_events ?? 0).toLocaleString('id-ID'), icon: 'calendar_today' },
              { label: 'Event Aktif', value: (stats?.active_events ?? 0).toLocaleString('id-ID'), icon: 'event_available' },
              { label: 'Total Tenant', value: (stats?.total_tenants ?? 0).toLocaleString('id-ID'), icon: 'store' },
            ].map(({ label, value, icon, highlight }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${highlight ? 'text-orange-500' : 'text-secondary'}`}>{icon}</span>
                  <span className={`font-body-md ${highlight ? 'text-orange-600 font-semibold' : 'text-secondary'}`}>{label}</span>
                </div>
                {loading ? (
                  <div className="h-5 w-10 bg-surface-container-high rounded animate-pulse" />
                ) : (
                  <span className={`font-body-md font-bold ${highlight ? 'text-orange-600' : 'text-on-surface'}`}>{value}</span>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-surface-container-high flex justify-between items-center">
              <span className="text-on-surface font-bold font-body-md">Platform Fee ({stats?.fee_percent ?? 10}%)</span>
              {loading ? (
                <div className="h-6 w-24 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <span className="text-primary text-[18px] font-bold">{formatRp(stats?.platform_fee_total)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Revenue Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Tren Pendapatan</h3>
              <p className="font-caption text-caption text-secondary">Transaksi sukses 6 bulan terakhir</p>
            </div>
            <span className="text-primary font-bold text-[18px]">{formatRp(stats?.total_revenue)}</span>
          </div>
          <div className="flex-1 relative min-h-[200px]">
            {loading ? (
              <div className="h-[200px] bg-surface-container-high rounded-xl animate-pulse" />
            ) : (
              <>
                <svg className="w-full h-[200px]" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#f04e37" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f04e37" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {svgArea && <path d={svgArea} fill="url(#areaGrad)" />}
                  {svgPath && <path d={svgPath} fill="none" stroke="#f04e37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                  {lastPt && <circle cx={lastPt.x} cy={lastPt.y} r="5" fill="#f04e37" />}
                  {lastPt && <circle cx={lastPt.x} cy={lastPt.y} r="3" fill="#ffffff" />}
                </svg>
                <div className="absolute bottom-0 w-full flex justify-around text-caption text-secondary font-caption">
                  {revenueMonths.map((m, i) => (
                    <span key={m + i} className={i === revenueMonths.length - 1 ? 'font-bold text-on-surface' : ''}>
                      {m.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Section C: Verifikasi Organizer ── */}
      <section className="mb-6">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Verifikasi Organizer</h3>
              {pendingOrgs.length > 0 && (
                <span className="bg-primary px-2.5 py-0.5 rounded-full text-white text-label-sm font-bold">
                  {pendingOrgs.length} menunggu
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/superadmin/organizers')}
              className="text-primary font-medium hover:underline text-body-md"
            >
              Lihat Semua
            </button>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-14 bg-surface-container-high rounded-xl animate-pulse" />
              ))}
            </div>
          ) : pendingOrgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div className="w-16 h-16 bg-[#F0FFF4] rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-600 text-[32px]">verified</span>
              </div>
              <h3 className="font-headline-md text-primary font-medium mb-1">Semua organizer terverifikasi</h3>
              <p className="text-secondary font-body-md text-center">Tidak ada pengajuan baru yang menunggu persetujuan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Organizer', 'Email', 'Organisasi', 'Telepon', 'Dokumen', 'Aksi'].map(h => (
                      <th key={h} className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {pendingOrgs.map((org, idx) => (
                    <tr key={org.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary-fixed-dim font-bold shrink-0">
                            {org.full_name?.substring(0, 2).toUpperCase() || 'OR'}
                          </div>
                          <span className="font-body-md font-medium">{org.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.email}</td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.organization_name || '-'}</td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {org.ktp_document_url ? (
                          <a
                            href={org.ktp_document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-body-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">description</span>
                            Lihat
                          </a>
                        ) : (
                          <span className="text-secondary text-body-md">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setApproveTarget(org)}
                            className="bg-primary text-white px-4 py-1.5 rounded-full text-label-md hover:opacity-90 transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectTarget(org)}
                            className="border border-outline text-secondary px-4 py-1.5 rounded-full text-label-md hover:bg-surface-container transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Section D: Penarikan Dana Tertunda ── */}
      <section className="mb-6">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Penarikan Dana Tertunda</h3>
              {pendingWithdrawals.length > 0 && (
                <span className="bg-orange-600 px-2.5 py-0.5 rounded-full text-white text-label-sm font-bold">
                  {pendingWithdrawals.length} menunggu
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/superadmin/withdrawals')}
              className="text-primary font-medium hover:underline text-body-md"
            >
              Laporan Keuangan
            </button>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-14 bg-surface-container-high rounded-xl animate-pulse" />
              ))}
            </div>
          ) : pendingWithdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-[#FFF0EE] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[40px] opacity-40">payments</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-surface-container-high">
                  <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                </div>
              </div>
              <h3 className="font-headline-md text-primary font-medium mb-1">Tidak ada penarikan tertunda</h3>
              <p className="text-secondary font-body-md text-center max-w-sm">Semua permintaan penarikan dana yang baru akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Organizer', 'Event', 'Jumlah', 'Tanggal', 'Status', 'Aksi'].map(h => (
                      <th key={h} className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {pendingWithdrawals.map((w, idx) => (
                    <tr key={w.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-body-md font-medium">{w.admin_name || '-'}</p>
                          <p className="text-secondary text-label-sm">{w.organization || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap max-w-[160px]">
                        <span className="truncate block">{w.event_name || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-primary font-bold whitespace-nowrap">{formatRp(w.amount)}</td>
                      <td className="px-6 py-4 text-body-md text-secondary whitespace-nowrap">{formatDate(w.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-label-sm border border-orange-200">
                          Menunggu Eksekusi
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setExekusiTarget(w)}
                          className="bg-primary text-white px-4 py-2 rounded-full text-label-md font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <span className="material-symbols-outlined text-[16px]">payments</span>
                          Eksekusi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Section E: Transaksi Terbaru (Audit Log) ── */}
      <section>
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Transaksi Terbaru</h3>
            <button
              onClick={() => navigate('/superadmin/reports')}
              className="text-primary font-medium hover:underline text-body-md"
            >
              Audit Log
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Order ID', 'Pengguna', 'Jumlah', 'Tanggal'].map(h => (
                    <th key={h} className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}>
                      <td colSpan={4} className="px-6 py-3">
                        <div className="h-8 bg-surface-container-high rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : !stats?.recent_transactions?.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-secondary font-body-md">
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : stats.recent_transactions.map((t, idx) => (
                  <tr key={t.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors`}>
                    <td className="px-6 py-4 font-body-md font-medium text-secondary whitespace-nowrap">{t.order_id}</td>
                    <td className="px-6 py-4 font-body-md whitespace-nowrap">{t.user_name}</td>
                    <td className="px-6 py-4 font-body-md font-bold text-primary whitespace-nowrap">{formatRp(t.amount)}</td>
                    <td className="px-6 py-4 font-body-md text-secondary whitespace-nowrap">{formatDateTime(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
