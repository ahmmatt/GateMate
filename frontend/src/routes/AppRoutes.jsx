import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '../layouts/PublicLayout'
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'

// Public Pages
import Home from '../pages/public/Home'
import Events from '../pages/public/Events'
import EventDetail from '../pages/public/EventDetail'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import AttendeeList from '../pages/events/[id]/attendees'
import MatchmakingResults from '../pages/user/MatchmakingResults'
import Chat from '../pages/user/Chat'
import FaceVerification from '../pages/user/FaceVerification'
import Profile from '../pages/user/Profile'

// User Pages
import MyTickets from '../pages/user/MyTickets'
import TicketDetail from '../pages/user/TicketDetail'
import Wallet from '../pages/user/Wallet'

// Organizer Pages (standalone — punya sidebar sendiri, tidak pakai OrganizerLayout)
import OrganizerDashboard from '../pages/organizer/AdminDashboardPage'
import ManageEvents from '../pages/organizer/AdminEventsPage'
import CreateEvent from '../pages/organizer/AdminEventCreatePage'
import CheckIn from '../pages/organizer/AdminScannerPage'
import AdminEventShowPage from '../pages/organizer/AdminEventShowPage'
import AdminFinancePage from '../pages/organizer/AdminFinancePage'
import AdminSettingsPage from '../pages/organizer/AdminSettingsPage'
import OrganizerLogin from '../pages/organizer/OrganizerLogin'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageOrganizers from '../pages/admin/ManageOrganizers'
import Reports from '../pages/admin/Reports'
import PenarikanDana from '../pages/admin/PenarikanDana'
import AdminManageEvents from '../pages/admin/AdminManageEvents'
import AdminLogin from '../pages/admin/AdminLogin'
import Settings from '../pages/admin/Settings'

// ── Guards ──────────────────────────────────────────────────────────────────

function OrganizerGuard({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'organizer') return <Navigate to={`/${user.role}/dashboard`} replace />
  return children
}

function AdminGuard({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin' && user.role !== 'superadmin') return <Navigate to="/" replace />
  return children
}

function SuperadminGuard({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/superadmin/login" replace />
  if (user.role !== 'superadmin' && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// Helper: render organizer page atau admin page berdasarkan role user
function RoleSwitch({ OrganizerPage, AdminPage }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.role === 'organizer') {
    return <OrganizerGuard><OrganizerPage /></OrganizerGuard>
  }
  return (
    <AdminGuard>
      <AdminLayout>
        <AdminPage />
      </AdminLayout>
    </AdminGuard>
  )
}

// ── Routes ───────────────────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Standalone Routes ── */}
      <Route path="/events/:id/attendees" element={<AttendeeList />} />
      <Route path="/user/matchmaking" element={<MatchmakingResults />} />
      <Route path="/user/chat" element={<Chat />} />
      <Route path="/user/face-verification" element={<FaceVerification />} />
      <Route path="/user/profile" element={<Profile />} />

      {/* ── Public Routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── Role-Specific Secure Auth Routes ── */}
      <Route path="/organizer/login" element={<OrganizerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/superadmin/login" element={<AdminLogin />} />

      {/* ── User Routes ── */}
      <Route element={<UserLayout />}>
        <Route path="/user/tickets" element={<MyTickets />} />
        <Route path="/user/tickets/:id" element={<TicketDetail />} />
        <Route path="/user/wallet" element={<Wallet />} />
      </Route>

      {/* ── Organizer Routes (/organizer/*) ── */}
      <Route path="/organizer/dashboard" element={<OrganizerGuard><OrganizerDashboard /></OrganizerGuard>} />
      <Route path="/organizer/events" element={<OrganizerGuard><ManageEvents /></OrganizerGuard>} />
      <Route path="/organizer/events/create" element={<OrganizerGuard><CreateEvent /></OrganizerGuard>} />
      <Route path="/organizer/events/:id" element={<OrganizerGuard><AdminEventShowPage /></OrganizerGuard>} />
      <Route path="/organizer/check-in" element={<OrganizerGuard><CheckIn /></OrganizerGuard>} />
      <Route path="/organizer/finance" element={<OrganizerGuard><AdminFinancePage /></OrganizerGuard>} />
      <Route path="/organizer/settings" element={<OrganizerGuard><AdminSettingsPage /></OrganizerGuard>} />

      {/* ── /admin/* — shared & admin routes ── */}
      <Route path="/admin/dashboard" element={<RoleSwitch OrganizerPage={OrganizerDashboard} AdminPage={AdminDashboard} />} />
      <Route path="/admin/events" element={<RoleSwitch OrganizerPage={ManageEvents} AdminPage={AdminManageEvents} />} />
      <Route path="/admin/events/create" element={<OrganizerGuard><CreateEvent /></OrganizerGuard>} />
      <Route path="/admin/events/:id" element={<OrganizerGuard><AdminEventShowPage /></OrganizerGuard>} />
      <Route path="/admin/scanner" element={<OrganizerGuard><CheckIn /></OrganizerGuard>} />
      <Route path="/admin/finance" element={<OrganizerGuard><AdminFinancePage /></OrganizerGuard>} />
      <Route path="/admin/settings" element={<RoleSwitch OrganizerPage={AdminSettingsPage} AdminPage={Settings} />} />

      {/* ── Admin-only Protected Routes ── */}
      <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/organizers" element={<ManageOrganizers />} />
        <Route path="/admin/withdrawals" element={<PenarikanDana />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Route>

      {/* ── Superadmin Dedicated Protected Routes (/superadmin/*) ── */}
      <Route element={<SuperadminGuard><AdminLayout /></SuperadminGuard>}>
        <Route path="/superadmin/dashboard" element={<AdminDashboard />} />
        <Route path="/superadmin/users" element={<ManageUsers />} />
        <Route path="/superadmin/organizers" element={<ManageOrganizers />} />
        <Route path="/superadmin/withdrawals" element={<PenarikanDana />} />
        <Route path="/superadmin/events" element={<AdminManageEvents />} />
        <Route path="/superadmin/reports" element={<Reports />} />
        <Route path="/superadmin/settings" element={<Settings />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
