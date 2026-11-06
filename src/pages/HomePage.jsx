import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { CommissionCalculator } from '../components/home/CommissionCalculator';
import { WellnessJourneyBanner } from '../components/home/WellnessJourneyBanner';

export const HomePage = () => {
  return (
    <div className="space-y-0 bg-white">
      {/* 1. Hero Section + 3 Feature Cards */}
      <HeroSection />

      {/* 2. Explore Our Products Carousel (5 Categories) */}
      <CategoryCarousel />

      {/* 3. Interactive 8-Level Income Calculator & Matrix */}
      <CommissionCalculator />

      {/* 4. Start Your Wellness Earning Journey Today CTA Banner */}
      <WellnessJourneyBanner />
    </div>
  );
};
