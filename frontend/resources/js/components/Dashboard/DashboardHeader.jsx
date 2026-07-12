import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function DashboardHeader({ user }) {
  return (
    <section className="bg-surface-container-low/30 py-16 border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-container-padding">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Avatar & User Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed bg-primary-container">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                Halo, {user?.name}! 👋
              </h1>
              <p className="font-body-md text-body-md text-secondary mb-2">
                {user?.email}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-secondary">
                  <MaterialIcon icon="confirmation_number" />
                  <span className="font-body-md text-body-md">{user?.total_events} Event</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <MaterialIcon icon="calendar_today" />
                  <span className="font-body-md text-body-md">{user?.upcoming_events} Mendatang</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="ml-auto flex gap-4 flex-col md:flex-row">
            <button className="coral-pill px-8 py-3 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary-container active:scale-95 transition-all">
              Edit Profil
            </button>
            <button className="coral-pill px-8 py-3 border-2 border-primary text-primary font-body-md text-body-md hover:bg-surface-container-low active:scale-95 transition-all">
              Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gap-default">
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-body-md text-secondary mb-2">Saldo Dompet</p>
                <h3 className="font-headline-md text-headline-md text-primary">
                  Rp {user?.wallet_balance?.toLocaleString('id-ID') || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-primary">
                <MaterialIcon icon="account_balance_wallet" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-body-md text-secondary mb-2">Total Event</p>
                <h3 className="font-headline-md text-headline-md text-secondary">
                  {user?.total_events || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary">
                <MaterialIcon icon="event" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-body-md text-secondary mb-2">Event Mendatang</p>
                <h3 className="font-headline-md text-headline-md text-tertiary">
                  {user?.upcoming_events || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                <MaterialIcon icon="upcoming" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
