import { Link } from 'react-router-dom'
import { Globe, Share2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="w-full bg-white"
      style={{ borderTop: '0.5px solid #e3beb8' }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-8 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span className="text-base font-bold text-[#b22110]">GateMate</span>
          <p className="text-[11px] text-[#5f5e5e]">© 2025 GateMate. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Help Center', href: '#' },
            { label: 'Contact Us', href: '#' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] text-[#5f5e5e] hover:text-[#b22110] hover:underline decoration-[#b22110] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex gap-4">
          <Globe className="w-5 h-5 text-[#5f5e5e] hover:text-[#b22110] cursor-pointer transition-colors" />
          <Share2 className="w-5 h-5 text-[#5f5e5e] hover:text-[#b22110] cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  )
}
