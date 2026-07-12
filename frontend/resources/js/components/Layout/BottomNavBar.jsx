import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MaterialIcon from '../Common/MaterialIcon';

export default function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'explore', label: 'Discover', path: '/explore' },
    { icon: 'confirmation_number', label: 'My Tickets', path: '/tickets' },
    { icon: 'account_balance_wallet', label: 'Wallet', path: '/wallet' },
    { icon: 'person', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface/80 dark:bg-surface-container-highest/80 backdrop-blur-md border-t border-outline-variant/30 rounded-t-xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors ${
              isActive
                ? 'text-primary dark:text-primary-fixed-dim bg-primary-fixed/20'
                : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary'
            }`}
          >
            <MaterialIcon
              icon={item.icon}
              fill={isActive}
              className="text-[24px]"
            />
            <span className="font-label-md text-label-md text-[11px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
