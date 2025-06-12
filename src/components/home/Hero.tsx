import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Search } from 'lucide-react';

const occasions = [
  'Birthday', 'Anniversary', 'Graduation', 'Wedding', 'Housewarming'
];

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Occasions');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleOccasionClick = (occasion: string) => {
    navigate(`/?occasion=${encodeURIComponent(occasion.toLowerCase())}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1303092/pexels-photo-1303092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-[0.03]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Perfect Gifts, Effortlessly Found
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            At GiftShop, we make it easy to find the perfect gift for any person and occasion.
            Whether you're shopping for a birthday, anniversary, holiday, or just want to surprise someone special,
            our platform offers personalized recommendations, smart search tools, and curated collections to match your budget and their interests. Say goodbye to endless scrolling — and hello to thoughtful, meaningful gifts.
          </p>
          
  <div className="mt-10">
  <button
    onClick={() => navigate('/advanced-search')}
    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md text-lg font-medium hover:bg-primary-700 transition"
  >
    <Search size={20} className="mr-2" />
    Find a Gift
  </button>
</div>

        </div>
      </div>
    </section>
  );
}

export default Hero;