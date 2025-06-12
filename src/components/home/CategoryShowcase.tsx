import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/mockData';

const CategoryShowcase: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: string) => {
    navigate(`/?category=${encodeURIComponent(category.toLowerCase())}`);
  };
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-2">Explore our curated collection of perfect gifts</p>
          </div>
          <button 
            onClick={() => navigate('/?category=all')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4 md:mt-0"
          >
            View all categories <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.slice(0, 3).map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="relative rounded-xl overflow-hidden aspect-video shadow-md cursor-pointer group"
            >
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-gray-200 text-sm mb-3">{category.description}</p>
                <span className="inline-flex items-center text-white font-medium text-sm">
                  Shop now <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;