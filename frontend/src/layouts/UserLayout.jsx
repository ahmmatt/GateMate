import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function UserLayout() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'user') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f6]">
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 pt-16 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}
