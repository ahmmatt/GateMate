import React, { useEffect, useState } from 'react';
import TopNavBar from '../components/Layout/TopNavBar';
import Footer from '../components/Layout/Footer';
import BottomNavBar from '../components/Layout/BottomNavBar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import WalletCard from '../components/Dashboard/WalletCard';
import MyTickets from '../components/Dashboard/MyTickets';
import RecentActivity from '../components/Dashboard/RecentActivity';
import QuickActions from '../components/Dashboard/QuickActions';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Intersection Observer untuk smooth scroll reveal
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach((section) => {
      section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
      observer.observe(section);
    });

    // Fetch user data
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/user/profile');
        // const data = await response.json();
        // setUser(data);
        
        // Mock data for demonstration
        setUser({
          id: 1,
          name: 'Budi Santoso',
          email: 'budi@example.com',
          phone: '0812-3456-7890',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
          wallet_balance: 5250000,
          total_events: 12,
          upcoming_events: 3,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Gagal memuat data pengguna');
        setLoading(false);
      }
    };

    fetchUserData();

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <TopNavBar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-container-padding">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="font-body-md text-body-md text-secondary">Memuat data...</p>
            </div>
          </div>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <TopNavBar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-container-padding">
          <div className="bg-error-container/20 border border-error/30 rounded-lg p-6 text-center">
            <p className="font-body-md text-body-md text-error">{error}</p>
          </div>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-fixed">
      <TopNavBar />

      <main className="pt-16 pb-20">
        {/* Dashboard Header */}
        <DashboardHeader user={user} />

        {/* Main Content */}
        <div className="max-w-[1280px] mx-auto px-container-padding py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gap-default mb-8">
            {/* Left Column - Wallet & Quick Actions */}
            <div className="lg:col-span-1 space-y-gap-default">
              <WalletCard user={user} />
              <QuickActions />
            </div>

            {/* Right Column - Tickets & Activity */}
            <div className="lg:col-span-2 space-y-gap-default">
              <MyTickets />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
