import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GiftCard from '../common/GiftCard';
import { useApp } from '../../context/AppContext';

const FeaturedGifts: React.FC = () => {
  const { gifts } = useApp();
  
  // Get top rated gifts (limited to 4)
  const featuredGifts = [...gifts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
         
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Gifts</h2>
            {/*  <p className="text-gray-600 mt-2">Selections our customers love</p>*/}
          </div>
          <Link 
            to="/all-gifts"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View all
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedGifts;