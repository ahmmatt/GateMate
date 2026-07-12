import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyEvents } from '../../data/dummyEvents'
import { dummyUsers } from '../../data/dummyUsers'
import { dummyWithdrawals, dummyPendingOrganizers } from '../../data/dummyWithdrawals'
import { formatPrice } from '../../utils/formatDate'

function ApproveModal({ organizer, onClose, onApprove }) {
  if (!organizer) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[14px] border border-surface-container-high overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Verifikasi</h4>
              <p className="text-secondary text-body-md">Tinjau detail organizer sebelum menyetujui.</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border border-surface-container-high">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={organizer.avatar}
                alt={organizer.name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="font-body-md font-bold text-on-surface truncate">{organizer.name}</p>
                <p className="text-secondary text-label-sm truncate">Organisasi: {organizer.organizerName}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-surface-container-high pt-3">
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Email</span>
                <span className="text-on-surface">{organizer.email}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">No. Telepon</span>
                <span className="text-on-surface">{organizer.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-outline text-secondary py-3 rounded-full font-medium hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => onApprove(organizer.id)}
              className="flex-1 bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-container transition-colors shadow-lg active:scale-95"
            >
              Ya, Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ organizer, onClose, onReject }) {
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
              <span className="font-body-md font-semibold text-on-surface">{organizer.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-label-sm">Organisasi</span>
              <span className="font-body-md font-semibold text-on-surface">{organizer.organizerName}</span>
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
            className="w-full bg-[#EF4444] text-white py-3 px-6 rounded-full font-headline-md hover:bg-[#DC2626] transition-all duration-200 active:scale-[0.98]"
          >
            Ya, Tolak &amp; Hapus
          </button>
          <button
            onClick={onClose}
            className="w-full bg-transparent border border-surface-container-high text-secondary py-3 px-6 rounded-full font-headline-md hover:bg-[#F9F9F9] transition-all duration-200 active:scale-[0.98]"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

function ExekusiModal({ withdrawal, onClose, onExekusi }) {
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
              <img src={withdrawal.organizerAvatar} alt={withdrawal.organizerName} className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="font-body-md font-bold text-on-surface truncate">{withdrawal.organizerName}</p>
                <p className="text-secondary text-label-sm truncate">{withdrawal.organizerOrg}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-surface-container-high pt-3">
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Event</span>
                <span className="text-on-surface max-w-[60%] text-right">{withdrawal.eventTitle}</span>
              </div>
              <div className="flex justify-between text-body-md pt-2 border-t border-surface-container-high">
                <span className="text-secondary font-semibold">Total Transfer</span>
                <span className="text-primary font-bold">{formatPrice(withdrawal.amount)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-outline text-secondary py-3 rounded-full font-medium hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => onExekusi(withdrawal.id)}
              className="flex-1 bg-orange-600 text-white py-3 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-lg active:scale-95"
            >
              Eksekusi Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const totalRevenue = dummyEvents.reduce((sum, e) => sum + (e.price * e.soldTickets), 0)
  const totalTransactions = dummyEvents.reduce((sum, e) => sum + e.soldTickets, 0)
  
  const [organizers, setOrganizers] = useState(dummyPendingOrganizers)
  const [withdrawals, setWithdrawals] = useState(dummyWithdrawals)
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [exekusiTarget, setExekusiTarget] = useState(null)
  const [rejectedIds, setRejectedIds] = useState([])

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending')
  const pendingOrgs = organizers.filter(o => !rejectedIds.includes(o.id))

  const handleApprove = (id) => {
    setOrganizers(prev => prev.filter(o => o.id !== id))
    setApproveTarget(null)
  }

  const handleReject = (id) => {
    setRejectedIds(prev => [...prev, id])
    setRejectTarget(null)
  }

  const handleExekusi = (id) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'done' } : w))
    setExekusiTarget(null)
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = user.name || 'Budi Santoso'

  return (
    <div className="animate-in fade-in">
      <ApproveModal
        organizer={approveTarget}
        onClose={() => setApproveTarget(null)}
        onApprove={handleApprove}
      />
      <RejectModal
        organizer={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onReject={handleReject}
      />
      <ExekusiModal
        withdrawal={exekusiTarget}
        onClose={() => setExekusiTarget(null)}
        onExekusi={handleExekusi}
      />

      {/* Welcome Header */}
      <div className="mb-stack-lg">
        <p className="text-secondary font-body-lg">Selamat datang, <span className="font-semibold text-on-surface">{userName}</span></p>
      </div>

      {/* Section A: Analytics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-stack-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 transition-all hover:border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary">receipt</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Transaksi</p>
          <h2 className="text-xl xl:text-2xl font-bold text-on-surface tracking-tight">{totalTransactions.toLocaleString('id-ID')}</h2>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 transition-all hover:border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg">
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Total Pendapatan</p>
          <h2 className="text-xl xl:text-2xl font-bold text-primary tracking-tight">{formatPrice(totalRevenue)}</h2>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 transition-all hover:border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary">group</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Pengguna Aktif</p>
          <h2 className="text-xl xl:text-2xl font-bold text-on-surface tracking-tight">8.502</h2>
        </div>
        {/* Card 4 */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-6 transition-all hover:border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="material-symbols-outlined text-orange-600">schedule</span>
            </div>
          </div>
          <p className="text-secondary font-label-md uppercase tracking-wider mb-1">Menunggu Eksekusi</p>
          <h2 className="text-xl xl:text-2xl font-bold text-orange-600 tracking-tight">{pendingWithdrawals.length}</h2>
        </div>
      </section>

      {/* Section B: Verifikasi Organizer */}
      <section className="mb-stack-lg">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Verifikasi Organizer</h3>
              {pendingOrgs.length > 0 && (
                <span className="bg-primary px-2.5 py-0.5 rounded-full text-white text-label-sm">
                  {pendingOrgs.length} menunggu
                </span>
              )}
            </div>
            <button 
              onClick={() => navigate('/admin/organizers')}
              className="text-primary font-medium hover:underline text-body-md"
            >
              Lihat Semua
            </button>
          </div>
          
          {pendingOrgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-[#FFF0EE] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[48px] opacity-40">how_to_reg</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-surface-container-high">
                  <span className="material-symbols-outlined text-[18px] text-green-600 font-bold">check_circle</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary font-medium mb-2 text-center">Tidak ada organizer yang menunggu verifikasi</h3>
              <p className="font-body-md text-body-md text-secondary text-center max-w-sm">Semua pengajuan baru akan muncul di sini untuk Anda tinjau.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Organizer</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Email</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Organisasi</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Telepon</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Dokumen</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {pendingOrgs.map((org, index) => (
                    <tr key={org.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary-fixed-dim overflow-hidden shrink-0">
                            <img src={org.avatar} alt={org.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-body-md font-medium">{org.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.email}</td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.organizerName}</td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{org.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary hover:underline flex items-center gap-1 font-body-md cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                          {org.document}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setApproveTarget(org)}
                            className="bg-primary text-white px-4 py-1.5 rounded-full text-label-md hover:bg-primary-container transition-colors shadow-sm"
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

      {/* Section C: Eksekusi Penarikan Dana */}
      <section>
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Penarikan Dana Tertunda</h3>
              {pendingWithdrawals.length > 0 && (
                <span className="bg-orange-600 px-2.5 py-0.5 rounded-full text-white text-label-sm">
                  {pendingWithdrawals.length} menunggu
                </span>
              )}
            </div>
            <button 
              onClick={() => navigate('/admin/withdrawals')}
              className="text-primary font-medium hover:underline text-body-md"
            >
              Laporan Keuangan
            </button>
          </div>
          
          {pendingWithdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-[#FFF0EE] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[48px] opacity-40">payments</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-surface-container-high">
                  <span className="material-symbols-outlined text-[18px] text-green-600 font-bold">check_circle</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary font-medium mb-2 text-center">Tidak ada penarikan dana tertunda</h3>
              <p className="font-body-md text-body-md text-secondary text-center max-w-sm">Semua permintaan penarikan dana yang baru akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Organizer</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Event</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Jumlah</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 font-label-md text-secondary uppercase whitespace-nowrap text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {pendingWithdrawals.map((w, index) => (
                    <tr key={w.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors`}>
                      <td className="px-6 py-4 font-body-md font-medium whitespace-nowrap">{w.organizerName}</td>
                      <td className="px-6 py-4 text-body-md whitespace-nowrap">{w.eventTitle}</td>
                      <td className="px-6 py-4 text-primary font-bold whitespace-nowrap">{formatPrice(w.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-label-sm border border-orange-200">
                          Menunggu Eksekusi
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => setExekusiTarget(w)}
                          className="bg-primary text-white px-5 py-2 rounded-full text-label-md font-medium hover:bg-primary-container transition-all active:scale-95 shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                          Eksekusi Pembayaran
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
    </div>
  )
}
