import { useState } from 'react'

export default function Settings() {
  const [is2faEnabled, setIs2faEnabled] = useState(true)

  return (
    <div className="animate-in fade-in flex justify-center">
      <div className="max-w-[1200px] w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">Sistem Keamanan</h3>
          <p className="font-body-md text-body-md text-secondary mt-1">Konfigurasi 2FA dan whitelist IP akses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card 1: 2FA Toggle */}
          <section className="bg-white rounded-[14px] border border-[#EBEBEB] p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[28px]">security</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Two-Factor Authentication</h4>
                  <p className="font-label-md text-label-md text-secondary">Lapisan keamanan tambahan untuk akun Anda</p>
                </div>
              </div>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle2fa" 
                  checked={is2faEnabled}
                  onChange={(e) => setIs2faEnabled(e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10" 
                />
                <label 
                  htmlFor="toggle2fa" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${is2faEnabled ? 'bg-[#F04E37]' : 'bg-secondary-fixed'}`}
                ></label>
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-outline-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-bold">Autentikasi Aplikasi</p>
                  <p className="font-body-md text-body-md text-secondary">Gunakan aplikasi seperti Google Authenticator atau Authy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary opacity-40">sms</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface opacity-50">SMS Recovery (Nonaktif)</p>
                  <p className="font-body-md text-body-md text-secondary">Verifikasi via nomor telepon terdaftar.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button className="bg-[#F04E37] text-white font-label-md px-[22px] py-[10px] rounded-[22px] hover:opacity-90 active:scale-95 transition-all">
                Konfigurasi 2FA
              </button>
            </div>
          </section>

          {/* Card 2: Whitelist IP Management */}
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
              <button className="bg-[#F04E37] text-white font-label-md px-[22px] py-[10px] rounded-[22px] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span>
                Add IP
              </button>
            </div>
            <div className="flex-1 p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface">IP ADDRESS</th>
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface">STATUS</th>
                    <th className="px-8 py-3 font-label-md text-label-md text-on-surface text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="font-body-md">
                  <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-8 py-4 font-bold text-on-surface">192.168.1.102</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-primary-fixed text-primary text-[11px] font-bold rounded-full">Primary</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-error font-label-md hover:underline px-2 transition-all">Remove</button>
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant bg-[#F9F9F9] hover:bg-surface-container-lowest transition-colors">
                    <td className="px-8 py-4 font-bold text-on-surface">104.22.1.45</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-surface-container-high text-secondary text-[11px] font-bold rounded-full">Office VPN</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-error font-label-md hover:underline px-2 transition-all">Remove</button>
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-8 py-4 font-bold text-on-surface">202.155.12.9</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-surface-container-high text-secondary text-[11px] font-bold rounded-full">Personal</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-error font-label-md hover:underline px-2 transition-all">Remove</button>
                    </td>
                  </tr>
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
              <p className="font-headline-md text-headline-md">12:45 PM, Hari ini</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[14px] border border-outline-variant flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[32px]">location_on</span>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Lokasi Login</p>
              <p className="font-headline-md text-headline-md">Jakarta, ID</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[14px] border border-outline-variant flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-[32px]">verified</span>
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Sertifikat SSL</p>
              <p className="font-headline-md text-headline-md">Aktif &amp; Terenkripsi</p>
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
