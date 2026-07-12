import React, { useEffect } from 'react';
import TopNavBar from '../components/Layout/TopNavBar';
import Footer from '../components/Layout/Footer';
import BottomNavBar from '../components/Layout/BottomNavBar';
import HeroSection from '../components/Sections/HeroSection';
import FeaturesSection from '../components/Sections/FeaturesSection';
import CategorySection from '../components/Sections/CategorySection';
import TrendingSection from '../components/Sections/TrendingSection';
import CTASection from '../components/Sections/CTASection';

export default function Home() {
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

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-fixed">
      <TopNavBar />
      
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <CategorySection />
        <TrendingSection />
        <CTASection />
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
