/*
import React, { useEffect, useState } from 'react';
import GiftCard from '../components/common/GiftCard';

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
  const [allGifts, setAllGifts] = useState<RawGift[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then((res) => res.json())
      .then((data) => setAllGifts(data))
      .catch((err) => console.error('Failed to load gift data:', err));
  }, []);

  const categories = Array.from(new Set(allGifts.map((g) => g.category)));

  const filteredGifts = allGifts.filter((gift) => {
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? gift.category === categoryFilter : true;
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
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-60 border border-gray-300 px-4 py-2 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift.asin}
              gift={{
                id: gift.asin,
                name: gift.title,
                imageUrl: gift.imgUrl,
                rating: gift.stars,
                reviews: gift.reviews,
                price: gift.price,
                categories: [gift.category],
                link: gift.productURL,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10">No gifts found for your criteria.</p>
      )}
    </div>
  );
};

export default AllGiftsPage;

*/

// src/pages/AllGiftsPage.tsx
import React, { useEffect, useState } from 'react';
import GiftCard from '../components/common/GiftCard';
import { mapCategories } from '../../public/Data/categoryMap';

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
  const [allGifts, setAllGifts] = useState<RawGift[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then(res => res.json())
      .then(data => setAllGifts(data))
      .catch(err => console.error('Failed to load gift data:', err));
  }, []);

  // Build the list of unified categories from your mapCategories helper
  const unifiedCategories = Array.from(
    new Set(
      allGifts.flatMap(g =>
        mapCategories([g.category])
      )
    )
  );

  // Filter gifts by search + unified category
  const filteredGifts = allGifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase());
    const mapped = mapCategories([gift.category]);
    const matchesCategory = categoryFilter
      ? mapped.includes(categoryFilter)
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
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full sm:w-60 border border-gray-300 px-4 py-2 rounded-md"
        >
          <option value="">All Categories</option>
          {unifiedCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGifts.map(gift => (
            <GiftCard
              key={gift.asin}
              gift={{
                id: gift.asin,
                name: gift.title,
                imageUrl: gift.imgUrl,
                rating: gift.stars,
                reviews: gift.reviews,
                price: gift.price,
                categories: mapCategories([gift.category]),
                link: gift.productURL,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10 text-center">No gifts found for your criteria.</p>
      )}
    </div>
  );
};

export default AllGiftsPage;
