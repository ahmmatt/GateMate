import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MaterialIcon from '../Common/MaterialIcon';

export default function TopNavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/50">
      <div className="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-gap-default">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity">
            GateMate
          </Link>
          <div className="hidden md:flex gap-6 ml-8">
            <Link
              to="/"
              className={`font-body-md text-body-md font-bold pb-1 transition-colors ${
                isActive('/') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Explore
            </Link>
            <a
              href="#partners"
              className="font-body-md text-body-md text-secondary hover:text-primary transition-colors"
            >
              Partners
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-body-md text-body-md transition-all ${
              isActive('/dashboard')
                ? 'bg-primary-fixed/20 text-primary'
                : 'text-secondary hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            <MaterialIcon icon="dashboard" />
            Dashboard
          </Link>
          <button className="coral-pill px-6 py-2 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary-container active:scale-95 transition-all duration-200">
            Masuk
          </button>
        </div>
      </div>
    </nav>
  );
}
