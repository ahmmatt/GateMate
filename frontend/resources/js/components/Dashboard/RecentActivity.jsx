import React, { useState, useEffect } from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/activities');
        // const data = await response.json();
        // setActivities(data);

        // Mock data
        setActivities([
          {
            id: 1,
            type: 'ticket_purchased',
            title: 'Pembelian Tiket',
            description: 'Anda membeli 2 tiket untuk Electronic Dream Festival 2024',
            amount: 900000,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            icon: 'shopping_cart',
            color: 'bg-tertiary-fixed/30 text-tertiary',
            status: 'completed',
          },
          {
            id: 2,
            type: 'wallet_topup',
            title: 'Topup Saldo',
            description: 'Topup ke dompet digital',
            amount: 1000000,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            icon: 'add_circle',
            color: 'bg-primary-fixed/30 text-primary',
            status: 'completed',
          },
          {
            id: 3,
            type: 'ticket_used',
            title: 'Tiket Digunakan',
            description: 'Tiket untuk National Basketball Cup sudah digunakan',
            amount: null,
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            icon: 'verified',
            color: 'bg-secondary-fixed/30 text-secondary',
            status: 'completed',
          },
          {
            id: 4,
            type: 'referral_bonus',
            title: 'Bonus Referral',
            description: 'Bonus dari teman yang mendaftar menggunakan kode Anda',
            amount: 50000,
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            icon: 'card_giftcard',
            color: 'bg-error-container/30 text-error',
            status: 'completed',
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
  };

  if (loading) {
    return (
      <section className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="font-body-md text-body-md text-secondary">Memuat aktivitas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl overflow-hidden card-shadow">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">Aktivitas Terbaru</h2>
          <a href="#" className="font-label-md text-label-md text-primary hover:underline">
            Lihat Semua
          </a>
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-outline-variant/20">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <MaterialIcon icon="history" />
            <p className="font-body-md text-body-md text-secondary mt-2">Tidak ada aktivitas</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-surface-container-low/30 transition-colors group">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color} group-hover:scale-110 transition-transform`}>
                  <MaterialIcon icon={activity.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      {activity.title}
                    </h3>
                    {activity.amount && (
                      <span className="font-headline-sm text-headline-sm text-primary flex-shrink-0">
                        +Rp {activity.amount.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <p className="font-body-md text-body-md text-secondary mb-2 truncate">
                    {activity.description}
                  </p>

                  <span className="font-caption text-caption text-secondary">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>

                {/* Status Badge */}
                {activity.status === 'completed' && (
                  <div className="flex-shrink-0">
                    <MaterialIcon icon="check_circle" className="text-tertiary" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
