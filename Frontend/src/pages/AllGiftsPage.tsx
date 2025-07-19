
// src/pages/AllGiftsPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GiftCard from '../components/common/GiftCard';
import { mapCategory } from '../../public/Data/categoryMap';

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

const AllGiftsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [allGifts, setAllGifts] = useState<RawGift[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then(res => res.json())
      .then((data: RawGift[]) => setAllGifts(data))
      .catch(err => console.error('Failed to load gift data:', err));
  }, []);

  const unifiedCats = Array.from(
    new Set(allGifts.map(g => mapCategory(g.category)))
  );

  const filteredGifts = allGifts.filter(gift => {
    const unifiedCat = mapCategory(gift.category);
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryParam
      ? unifiedCat.toLowerCase() === categoryParam.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Gifts</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search gifts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md"
        />
        <select
          value={categoryParam}
          onChange={e => {
            const newCat = e.target.value;
            const newUrl = newCat ? `/all-gifts?category=${encodeURIComponent(newCat)}` : '/all-gifts';
            window.history.pushState({}, '', newUrl);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="w-full sm:w-60 border border-gray-300 px-4 py-2 rounded-md"
        >
          <option value="">All Categories</option>
          {unifiedCats.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGifts.map(gift => {
            const unifiedCat = mapCategory(gift.category);
            return (
              <GiftCard
                key={gift.asin}
                gift={{
                  asin: gift.asin,
                  title: gift.title,
                  imgUrl: gift.imgUrl,
                  stars: gift.stars,
                  reviews: gift.reviews,
                  price: gift.price,
                  category: [unifiedCat],
                  productURL: gift.productURL,
                }}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 mt-10">No gifts found for your criteria.</p>
      )}
    </div>
  );
};

export default AllGiftsPage;


