import { useState, useEffect, useCallback } from 'react'
import { superadminService } from '../../services/api'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [whitelistIps, setWhitelistIps] = useState([])
  const [lastLogin, setLastLogin] = useState('-')
  const [location, setLocation] = useState('-')
  const [sslStatus, setSslStatus] = useState('-')
  
  const [toast, setToast] = useState(null)
  
  // Add IP Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIp, setNewIp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superadminService.getSettings()
      if (res.data?.data) {
        setWhitelistIps(res.data.data.whitelist_ips || [])
        setLastLogin(res.data.data.last_login)
        setLocation(res.data.data.location)
        setSslStatus(res.data.data.ssl_status)
      }
    } catch (err) {
      console.error('Gagal memuat pengaturan:', err)
      showToast('Gagal memuat pengaturan sistem', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleAddIp = async (e) => {
    e.preventDefault()
    if (!newIp) return
    setIsSubmitting(true)
    try {
      const res = await superadminService.addWhitelistIp(newIp)
      setWhitelistIps([...whitelistIps, res.data.data])
      setNewIp('')
      setShowAddModal(false)
      showToast('IP berhasil ditambahkan ke whitelist')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal menambahkan IP', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveIp = async (id) => {
    try {
      await superadminService.removeWhitelistIp(id)
      setWhitelistIps(whitelistIps.filter(ip => ip.id !== id))
      showToast('IP berhasil dihapus')
    } catch (err) {
      showToast('Gagal menghapus IP', 'error')
    }
  }

  return (
    <div className="animate-in fade-in flex justify-center">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-3 rounded-[12px] shadow-lg font-body-md flex items-center gap-2 animate-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-[#EF4444] text-white' : 'bg-[#1a8754] text-white'
        }`}>
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Add IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest p-6 rounded-[20px] shadow-xl w-full max-w-md animate-in zoom-in-95">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">Tambah Whitelist IP</h3>
            <p className="text-secondary font-body-md mb-6">Masukkan alamat IP yang diizinkan untuk mengakses portal superadmin.</p>
            
            <form onSubmit={handleAddIp}>
              <div className="mb-6">
                <label className="block font-label-md text-label-md text-secondary mb-2">IP Address</label>
                <input 
                  type="text" 
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="Contoh: 192.168.1.1"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full font-label-md text-secondary hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan IP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">Sistem Keamanan</h3>
          <p className="font-body-md text-body-md text-secondary mt-1">Konfigurasi whitelist IP akses.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 items-start">
          {/* Card: Whitelist IP Management */}
          <section className="bg-white rounded-[14px] border border-[#EBEBEB] flex flex-col h-full">
            <div className="p-8 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[28px]">lan</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Whitelist IP Address</h4>
                  <p className="font-label-md text-label-md text-secondary">Batasi akses hanya dari IP yang dipercaya</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#F04E37] text-white font-label-md px-[22px] py-[10px] rounded-[22px] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add IP
              </button>
            </div>
            <div className="flex-1 p-0 overflow-x-auto min-h-[160px]">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface">IP ADDRESS</th>
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface">STATUS</th>
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="font-body-md">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-6 text-center text-secondary">
                        <div className="h-6 w-1/2 mx-auto bg-surface-container-high rounded animate-pulse" />
                      </td>
                    </tr>
                  ) : whitelistIps.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-6 text-center text-secondary text-body-md">
                        Belum ada IP Address yang di-whitelist.
                      </td>
                    </tr>
                  ) : whitelistIps.map(ip => (
                    <tr key={ip.id} className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                      <td className="px-8 py-4 font-mono text-[14px] font-medium">{ip.ip_address}</td>
                      <td className="px-8 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-800 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Aktif
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button 
                          onClick={() => handleRemoveIp(ip.id)}
                          className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                          title="Hapus IP"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-b-[14px]">
              <p className="text-[11px] text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Perubahan pada whitelist IP akan berlaku segera setelah disimpan.
              </p>
            </div>
          </section>
        </div>

        {/* Decorative Security Background Insight */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-[14px] border border-outline-variant flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[32px]">history</span>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Terakhir Login</p>
              {loading ? (
                <div className="h-6 w-32 mt-1 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="font-headline-md text-headline-md">{lastLogin}</p>
              )}
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[14px] border border-outline-variant flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[32px]">location_on</span>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Lokasi Login</p>
              {loading ? (
                <div className="h-6 w-32 mt-1 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="font-headline-md text-headline-md">{location}</p>
              )}
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[14px] border border-outline-variant flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[32px]">verified</span>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Sertifikat SSL</p>
              {loading ? (
                <div className="h-6 w-32 mt-1 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="font-headline-md text-headline-md">{sslStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .toggle-checkbox:checked + .toggle-label {
            background-color: #F04E37;
        }
        .toggle-checkbox:checked + .toggle-label:after {
            left: calc(100% - 2px);
            transform: translateX(-100%);
        }
        .toggle-label:after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 90px;
            transition: 0.3s;
        }
      `}</style>
    </div>
  )
}
