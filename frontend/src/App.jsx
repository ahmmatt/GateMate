import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Standalone Pages (own layout)
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/auth/LoginPage';
import RegisterPage   from './pages/auth/RegisterPage';

// AppLayout (shared nav/footer)
import AppLayout      from './layouts/AppLayout';
import DiscoverPage   from './pages/DiscoverPage';
import MyTicketsPage  from './pages/MyTicketsPage';
import WalletPage     from './pages/WalletPage';
import ProfilePage    from './pages/ProfilePage';
import ETicketPage    from './pages/ETicketPage';
import EventDetailPage from './pages/EventDetailPage';

// Admin / Tenant / Superadmin (Stand-alone Layouts built into the pages)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminScannerPage from './pages/admin/AdminScannerPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventCreatePage from './pages/admin/AdminEventCreatePage';
import AdminEventShowPage from './pages/admin/AdminEventShowPage';
import AdminFinancePage from './pages/admin/AdminFinancePage';

import TenantDashboardPage from './pages/tenant/TenantDashboardPage';
import SuperadminDashboardPage from './pages/superadmin/SuperadminDashboardPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center text-primary font-body-md" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Memuat...
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone (no AppLayout) */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        {/* Public pages using AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/discover" element={<DiscoverPage />} />
        </Route>

        {/* Protected pages using AppLayout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/wallet"    element={<WalletPage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/tickets/:id" element={<ETicketPage />} />
          <Route path="/events/:id"  element={<EventDetailPage />} />
        </Route>

        {/* Protected Pages with their OWN built-in layouts (Sidebar) */}
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/scanner"   element={<AdminScannerPage />} />
          <Route path="/admin/events"    element={<AdminEventsPage />} />
          <Route path="/admin/events/create" element={<AdminEventCreatePage />} />
          <Route path="/admin/events/:id" element={<AdminEventShowPage />} />
          <Route path="/admin/finance"   element={<AdminFinancePage />} />
          
          {/* Tenant */}
          <Route path="/tenant/dashboard" element={<TenantDashboardPage />} />
          {/* Superadmin */}
          <Route path="/superadmin/dashboard" element={<SuperadminDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
