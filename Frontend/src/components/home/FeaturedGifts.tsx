// src/components/sections/FeaturedGifts.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GiftCard from '../common/GiftCard';
import { mapCategory } from '../../../public/Data/categoryMap';

interface RawGift {
  asin: string;
  title: string;
  imgUrl: string;
  productURL: string;
  stars: number;
  reviews: number;
  price: number;
  listPrice: number;
  isBestSeller: boolean;
  boughtInLastMonth: number;
  category: string;
}

const FeaturedGifts: React.FC = () => {
  const [gifts, setGifts] = useState<RawGift[]>([]);

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then(res => res.json())
      .then((data: RawGift[]) => {
        // Sort by stars and limit to 4 top-rated gifts
        const topRated = [...data]
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 4);
        setGifts(topRated);
      })
      .catch(err => console.error('Failed to load featured gifts:', err));
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Gifts</h2>
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
          {gifts.map(gift => (
            <GiftCard
              key={gift.asin}
              gift={{
                asin: gift.asin,
                title: gift.title,
                imgUrl: gift.imgUrl,
                stars: gift.stars,
                reviews: gift.reviews,
                price: gift.price,
                productURL: gift.productURL,
                category: [mapCategory(gift.category)]
              }}
              featured
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGifts;
