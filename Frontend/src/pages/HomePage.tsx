import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedGifts from '../components/home/FeaturedGifts';
import CategoryShowcase from '../components/home/CategoryShowcase';
import OccasionBanner from '../components/home/OccasionBanner';
import ReminderCTA from '../components/home/ReminderCTA';

const HomePage: React.FC = () => {
  const location = useLocation();
  
  // Parse query parameters (for search, category filtering, etc.)
  useEffect(() => {
    // Here you would normally fetch filtered data based on URL parameters
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    const occasion = params.get('occasion');
    const priceRange = params.get('priceRange');
    
    // Update document title based on filters
    if (search) {
      document.title = `Search: ${search} | GiftSage`;
    } else if (category) {
      document.title = `${category} Gifts | GiftSage`;
    } else if (occasion) {
      document.title = `Gifts for ${occasion} | GiftSage`;
    } else if (priceRange) {
      document.title = `Gifts ${priceRange.replace('-', ' ')} | GiftSage`;
    } else {
      document.title = 'GiftSage | Perfect Gift Recommendations';
    }
  }, [location]);
  
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedGifts />
      <CategoryShowcase />
      <OccasionBanner />
      <ReminderCTA />
    </div>
  );
}

export default HomePage;