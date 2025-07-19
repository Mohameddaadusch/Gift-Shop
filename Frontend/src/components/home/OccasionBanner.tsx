import React from 'react';
import { useNavigate } from 'react-router-dom';

const OccasionBanner: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400"></div>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5723208/pexels-photo-5723208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          
          <div className="relative z-10 py-12 px-6 sm:px-12 md:py-16 md:px-16 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Special Occasions Deserve Thoughtful Gifts
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl">
                From birthdays to anniversaries, find the perfect gift for every important moment in life. Let our AI help you select a memorable present.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {['Birthday', 'Anniversary', 'Wedding', 'Graduation'].map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => navigate(`/?occasion=${occasion.toLowerCase()}`)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white rounded-full px-4 py-2 text-sm font-medium"
                  >
                    {occasion}
                  </button>
                ))}
                <button
                  onClick={() => navigate('/?occasions=all')}
                  className="bg-white text-primary-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  View All Occasions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OccasionBanner;