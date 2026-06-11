import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Pages & Layouts
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';

// A simple temporary Dashboard component for the layout
function DashboardHome() {
  const { user } = useAuthStore();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-secondary mb-2">Welcome, {user?.full_name || 'User'}!</h1>
      <p className="text-secondary/70 mb-8">Here is what's happening with your GateMate account today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-coral-600">Rp 0</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-lg font-semibold mb-2">Active Tickets</h3>
          <p className="text-3xl font-bold text-coral-600">0</p>
        </div>
        <div className="glass p-6 rounded-3xl bg-gradient-to-br from-coral-500 to-coral-600 text-white border-none shadow-lg shadow-coral-500/30">
          <h3 className="text-lg font-semibold mb-2 text-white/90">Top Up Wallet</h3>
          <p className="text-sm text-white/80 mb-4">Add funds to purchase tickets instantly.</p>
          <button className="w-full py-2 bg-white text-coral-600 rounded-xl font-medium hover:bg-white/90 transition-colors">Top Up Now</button>
        </div>
      </div>
    </div>
  );
}

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-coral-500 font-medium">Loading Application...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Placeholder for Register */}
        <Route path="/register" element={<Navigate to="/login" replace />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Dynamic routing based on role will happen here, for now mapping all to dashboard */}
          <Route path="my-tickets" element={<DashboardHome />} />
          <Route path="admin/dashboard" element={<DashboardHome />} />
          <Route path="tenant/dashboard" element={<DashboardHome />} />
          <Route path="superadmin/dashboard" element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
