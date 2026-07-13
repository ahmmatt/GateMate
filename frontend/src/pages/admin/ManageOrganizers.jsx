import { useState, useEffect, useCallback } from 'react'
import { superadminService } from '../../services/api'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Modal Konfirmasi Verifikasi ─────────────────────────────────────────────

function ApproveModal({ organizer, onClose, onApprove, loading }) {
  if (!organizer) return null
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#5d5e60] hover:text-[#1c1b1b]">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">verified</span>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#1c1b1b]">Konfirmasi Verifikasi</h3>
            <p className="text-[13px] text-[#5d5e60]">Tinjau detail sebelum menyetujui organizer.</p>
          </div>
        </div>
        <div className="bg-[#f8f6f5] rounded-xl p-4 mb-6 space-y-2 border border-[#e5e2e1]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center font-bold text-[#b22110] shrink-0">
              {organizer.full_name?.substring(0, 2).toUpperCase() || 'OR'}
            </div>
            <div>
              <p className="font-semibold text-[#1c1b1b]">{organizer.full_name}</p>
              <p className="text-[12px] text-[#5d5e60]">{organizer.organization_name || '-'}</p>
            </div>
          </div>
          {[
            { label: 'Email', value: organizer.email },
            { label: 'Telepon', value: organizer.phone || '-' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-[14px]">
              <span className="text-[#5d5e60]">{label}</span>
              <span className="text-[#1c1b1b]">{value}</span>
            </div>
          ))}
          {organizer.ktp_document_url && (
            <div className="flex justify-between text-[14px]">
              <span className="text-[#5d5e60]">Dokumen KTP</span>
              <a
                href={organizer.ktp_document_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#b22110] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Lihat
              </a>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-[#e5e2e1] py-2.5 rounded-full text-[14px] text-[#5d5e60] hover:bg-[#f0edec] disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onApprove(organizer.id)}
            disabled={loading}
            className="flex-1 bg-[#b22110] text-white py-2.5 rounded-full text-[14px] font-medium hover:bg-[#8b1a0d] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            Ya, Setujui
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal Konfirmasi Penolakan ──────────────────────────────────────────────

function RejectModal({ organizer, onClose, onReject, loading }) {
  if (!organizer) return null
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl max-w-[440px] w-full overflow-hidden">
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[#EF4444] text-[32px]">warning</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#1c1b1b] mb-2">Konfirmasi Penolakan</h3>
          <p className="text-[#5d5e60] text-[14px]">Apakah Anda yakin ingin menolak pengajuan organizer ini?</p>
        </div>
        <div className="px-8 pb-6 space-y-4">
          <div className="bg-[#F5F5F7] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#5d5e60]">Organizer</span>
              <span className="font-semibold text-[#1c1b1b]">{organizer.full_name}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#5d5e60]">Organisasi</span>
              <span className="font-semibold text-[#1c1b1b]">{organizer.organization_name || '-'}</span>
            </div>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
            <span className="material-symbols-outlined text-[#EF4444] text-[20px] shrink-0">info</span>
            <p className="text-[#EF4444] text-[13px] leading-relaxed">
              Tindakan ini akan menghapus akun dan data pengajuan organizer secara permanen.
            </p>
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={() => onReject(organizer.id)}
            disabled={loading}
            className="w-full bg-[#EF4444] text-white py-3 rounded-full font-medium hover:bg-[#DC2626] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            Ya, Tolak &amp; Hapus
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full border border-[#e5e2e1] text-[#5d5e60] py-3 rounded-full font-medium hover:bg-[#F9F9F9] disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ManageOrganizers() {
  const [search, setSearch] = useState('')
  const [allOrganizers, setAllOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const [tab, setTab] = useState('pending') // 'pending' | 'verified' | 'rejected'
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [localRejected, setLocalRejected] = useState([]) // ids that were rejected in this session

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchOrganizers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superadminService.getOrganizers()
      if (res.data?.data) {
        setAllOrganizers(res.data.data)
      }
    } catch (err) {
      console.error('Gagal memuat organizer:', err)
      showToast('Gagal memuat data organizer.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrganizers() }, [fetchOrganizers])

  // Categorize organizers
  const pendingOrgs    = allOrganizers.filter(o => !o.is_verified_organizer && !localRejected.includes(o.id))
  const verifiedOrgs   = allOrganizers.filter(o => o.is_verified_organizer)
  const rejectedOrgs   = allOrganizers.filter(o => localRejected.includes(o.id))

  const getActiveList = () => {
    const base = tab === 'pending' ? pendingOrgs : tab === 'verified' ? verifiedOrgs : rejectedOrgs
    const q = search.toLowerCase()
    if (!q) return base
    return base.filter(o =>
      (o.full_name || '').toLowerCase().includes(q) ||
      (o.organization_name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q)
    )
  }

  const filteredList = getActiveList()

  const handleApprove = async (id) => {
    setActionLoading(true)
    try {
      const res = await superadminService.approveOrganizer(id)
      showToast(res?.data?.message || 'Organizer berhasil disetujui!')
      // Update locally — mark as verified
      setAllOrganizers(prev => prev.map(o => o.id === id ? { ...o, is_verified_organizer: true } : o))
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
      showToast('Organizer berhasil ditolak.')
      setLocalRejected(prev => [...prev, id])
      setAllOrganizers(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal reject organizer.', 'error')
    } finally {
      setActionLoading(false)
      setRejectTarget(null)
    }
  }

  const handleDownloadDocs = async (org) => {
    setDownloadingId(org.id)
    try {
      const res = await superadminService.downloadOrganizerDocs(org.id)
      // Create a blob link and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dokumen_${org.full_name?.replace(/\s+/g, '_') || org.id}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      showToast('Dokumen berhasil diunduh!')
    } catch (err) {
      const message = err?.response?.data?.message || 'Tidak ada dokumen untuk organizer ini.'
      showToast(message, 'error')
    } finally {
      setDownloadingId(null)
    }
  }

  const tabs = [
    { key: 'pending',   label: 'Menunggu Verifikasi', count: pendingOrgs.length },
    { key: 'verified',  label: 'Terverifikasi',        count: verifiedOrgs.length },
    { key: 'rejected',  label: 'Ditolak',              count: rejectedOrgs.length },
  ]

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in bg-[#fcf9f8] min-h-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-3 rounded-[12px] shadow-lg font-body-md flex items-center gap-2 animate-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-[#EF4444] text-white' : 'bg-[#1a8754] text-white'
        }`}>
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <ApproveModal
        organizer={approveTarget}
        onClose={() => setApproveTarget(null)}
        onApprove={handleApprove}
        loading={actionLoading}
      />
      <RejectModal
        organizer={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onReject={handleReject}
        loading={actionLoading}
      />

      {/* Controls: Tabs + Search */}
      <div className="bg-white border border-[#e5e2e1] rounded-xl mb-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-1 gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 py-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key
                    ? 'text-[#b22110] border-[#F04E37]'
                    : 'text-[#5d5e60] border-transparent hover:text-[#1c1b1b]'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    tab === t.key ? 'bg-[#ffdad4] text-[#b22110]' : 'bg-[#F5F5F7] text-[#5d5e60]'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full md:w-72 shrink-0 pb-2 md:pb-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e60] text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau organisasi..."
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-none rounded-[10px] focus:ring-1 focus:ring-[#b22110] text-[14px] placeholder:text-[#5d5e60] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#e5e2e1] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#e5e2e1]">
                {['Nama & Organizer', 'Kontak', 'Media Sosial', 'Dokumen', 'Tgl Daftar', 'Status', 'Aksi'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[12px] font-medium text-[#5d5e60] uppercase tracking-wider whitespace-nowrap ${i === 6 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-10 bg-[#f5f5f7] rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-[48px] text-[#c5c6c9]">
                        {tab === 'pending' ? 'pending_actions' : tab === 'verified' ? 'verified' : 'block'}
                      </span>
                      <p className="text-[#5d5e60] font-medium">Tidak ada data organizer ditemukan.</p>
                      {search && (
                        <button onClick={() => setSearch('')} className="text-[#b22110] text-[13px] hover:underline">
                          Hapus filter pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filteredList.map((org, idx) => (
                <tr
                  key={org.id}
                  className={`${idx % 2 === 0 ? 'hover:bg-[#F9F9F9]' : 'bg-[#F9F9F9] hover:bg-[#f0edec]'} transition-colors`}
                >
                  {/* Nama & Organizer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center font-bold text-[#b22110] shrink-0">
                        {org.full_name?.substring(0, 2).toUpperCase() || 'OR'}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1c1b1b]">{org.full_name}</p>
                        <p className="text-[12px] text-[#5d5e60]">{org.organization_name || '-'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Kontak */}
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#1c1b1b]">{org.email}</p>
                    <p className="text-[12px] text-[#5d5e60]">{org.phone || '-'}</p>
                  </td>

                  {/* Media Sosial */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {org.instagram ? (
                        <a
                          href={`https://instagram.com/${org.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[12px] text-[#5d5e60] hover:text-[#b22110] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                          {org.instagram}
                        </a>
                      ) : (
                        <span className="text-[12px] text-[#c5c6c9]">-</span>
                      )}
                      {org.tiktok_handle && (
                        <span className="flex items-center gap-1.5 text-[12px] text-[#5d5e60]">
                          <span className="material-symbols-outlined text-[16px]">movie</span>
                          {org.tiktok_handle}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Dokumen — klik unduh ZIP */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDownloadDocs(org)}
                      disabled={downloadingId === org.id}
                      className="flex items-center gap-1.5 text-[#b22110] hover:text-[#8b1a0d] hover:underline text-[13px] font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      title="Unduh dokumen KTP dalam format .zip"
                    >
                      {downloadingId === org.id ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Unduh Dokumen
                        </>
                      )}
                    </button>
                  </td>

                  {/* Tgl Daftar */}
                  <td className="px-6 py-4 text-[14px] text-[#1c1b1b] whitespace-nowrap">
                    {formatDate(org.created_at)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tab === 'pending' && (
                      <span className="px-3 py-1 rounded-[10px] bg-[#ffdad4] text-[#910900] text-[11px] font-medium inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b22110] animate-pulse" />
                        Menunggu
                      </span>
                    )}
                    {tab === 'verified' && (
                      <span className="px-3 py-1 rounded-[10px] bg-green-100 text-green-800 text-[11px] font-medium inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Terverifikasi
                      </span>
                    )}
                    {tab === 'rejected' && (
                      <span className="px-3 py-1 rounded-[10px] bg-red-100 text-red-800 text-[11px] font-medium">
                        Ditolak
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {tab === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setApproveTarget(org)}
                          className="bg-[#b22110] text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:opacity-90 transition-opacity"
                        >
                          Verifikasi
                        </button>
                        <button
                          onClick={() => setRejectTarget(org)}
                          className="text-[#ba1a1a] border border-[#ba1a1a] px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ba1a1a]/5 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                    {tab === 'verified' && (
                      <span className="px-3 py-1 text-[12px] text-[#5d5e60] flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                        Aktif
                      </span>
                    )}
                    {tab === 'rejected' && (
                      <span className="text-[12px] text-[#5d5e60]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination / Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e2e1] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-[12px] text-[#5d5e60]">
            Menampilkan <span className="font-semibold text-[#1c1b1b]">{filteredList.length}</span> dari{' '}
            <span className="font-semibold text-[#1c1b1b]">
              {tab === 'pending' ? pendingOrgs.length : tab === 'verified' ? verifiedOrgs.length : rejectedOrgs.length}
            </span>{' '}
            organizer
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-[#e5e2e1] rounded-lg text-[#5d5e60] hover:bg-[#f6f3f2] disabled:opacity-40"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#b22110] text-white text-[12px] font-medium">1</button>
            <button
              className="p-2 border border-[#e5e2e1] rounded-lg text-[#5d5e60] hover:bg-[#f6f3f2] disabled:opacity-40"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
