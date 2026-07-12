import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function QuickActions() {
  const actions = [
    {
      id: 1,
      label: 'Cari Event',
      icon: 'search',
      color: 'bg-primary-fixed/30 text-primary-fixed-variant',
      link: '/explore',
    },
    {
      id: 2,
      label: 'Undang Teman',
      icon: 'group_add',
      color: 'bg-secondary-fixed/30 text-secondary-fixed-variant',
      link: '/referral',
    },
    {
      id: 3,
      label: 'Bantuan',
      icon: 'help',
      color: 'bg-tertiary-fixed/30 text-tertiary-fixed-variant',
      link: '/help',
    },
    {
      id: 4,
      label: 'Pengaturan',
      icon: 'settings',
      color: 'bg-error-container/30 text-error',
      link: '/settings',
    },
  ];

  return (
    <section className="bg-white rounded-xl p-6 card-shadow">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Aksi Cepat</h3>

      <div className="space-y-3">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.link}
            className="flex items-center justify-between p-4 rounded-lg border border-outline-variant/20 hover:border-primary hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                <MaterialIcon icon={action.icon} />
              </div>
              <span className="font-body-md text-body-md text-on-surface">{action.label}</span>
            </div>
            <MaterialIcon icon="chevron_right" />
          </a>
        ))}
      </div>
    </section>
  );
}
