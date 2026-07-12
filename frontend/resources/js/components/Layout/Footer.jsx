import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant/20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            SecureGate
          </span>
          <p className="font-caption text-caption text-secondary">
            © 2024 SecureGate. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/privacy"
            className="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="/help"
            className="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200"
          >
            Help Center
          </a>
          <a
            href="/contact"
            className="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
        
        <div className="flex gap-4">
          <MaterialIcon icon="language" className="text-secondary hover:text-primary cursor-pointer transition-colors" />
          <MaterialIcon icon="share" className="text-secondary hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
