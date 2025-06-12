/*

// src/pages/AllGiftsPage.tsx
import React, { useEffect, useState } from 'react'
import GiftCard from '../components/common/GiftCard'

interface RawGift {
  asin: string
  title: string
  imgUrl: string
  productURL: string
  stars: number
  reviews: number
  price: number
  listPrice: number
  isBestSeller: boolean
  boughtInLastMonth: number
  category: string
}

const AllGiftsPage: React.FC = () => {
  const [allGifts, setAllGifts] = useState<RawGift[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then(res => res.json())
      .then(data => setAllGifts(data))
      .catch(err => console.error('Failed to load gift data:', err))
  }, [])

  // get every distinct raw category string
  const categories = Array.from(new Set(allGifts.map(g => g.category)))

  // filter logic unchanged
  const filteredGifts = allGifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter ? gift.category === categoryFilter : true
    return matchesSearch && matchesCategory
  })

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
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

<div className="mb-8">
  <h2 className="text-xl font-semibold mb-2">
    Raw Categories ({categories.length})
  </h2>
  <div className="max-h-64 overflow-y-auto border border-gray-200 p-4 rounded bg-gray-50">
    <p className="text-sm text-gray-700 break-words">
      {categories.join(', ')}
    </p>
  </div>
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
  )
}

export default AllGiftsPage


*/




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
  console.log('Raw unique categories:', categories.length);


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


/*



laaaaaaaaaaaaaaaaast oneeeeeeeeeeeeeeeeeeeeeeeee


// src/pages/AllGiftsPage.tsx
import React, { useEffect, useState } from 'react';
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
  const [allGifts, setAllGifts] = useState<RawGift[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then((res) => res.json())
      .then((data) => setAllGifts(data))
      .catch((err) => console.error('Failed to load gift data:', err));
  }, []);

  // build list of *unified* categories for the dropdown
  const unifiedCategories = Array.from(
    new Set(allGifts.map(g => mapCategory(g.category)))
  );

  // filter by search + selected unified category
  const filteredGifts = allGifts.filter(gift => {
    const unifiedCat = mapCategory(gift.category);
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? unifiedCat === categoryFilter
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
                  id: gift.asin,
                  name: gift.title,
                  imageUrl: gift.imgUrl,
                  rating: gift.stars,
                  reviews: gift.reviews,
                  price: gift.price,
                  categories: [unifiedCat],       // <-- wrap the mapped category in an array
                  link: gift.productURL,
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

*/


// src/pages/AllGiftsPage.tsx
import React, { useEffect, useState } from 'react';
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
  const [allGifts, setAllGifts] = useState<RawGift[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load the JSON file once on mount
  useEffect(() => {
    fetch('/Data/amazon_products_random_10k_with_categories.json')
      .then(res => res.json())
      .then((data: RawGift[]) => setAllGifts(data))
      .catch(err => console.error('Failed to load gift data:', err));
  }, []);

  // 1️⃣ Build the unified (mapped) categories list
  const unifiedCats = Array.from(
    new Set(allGifts.map(g => mapCategory(g.category)))
  );

  // 2️⃣ Filter by search + selected unified category
  const filteredGifts = allGifts.filter(gift => {
    const unifiedCat = mapCategory(gift.category);
    const matchesSearch = gift.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? unifiedCat === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Gifts</h1>

      {/* 3️⃣ Show all unified categories for copy/paste */}
      <div className="mb-8">
        <h2 className="font-medium mb-2">
          Unified categories ({unifiedCats.length})
        </h2>
        <textarea
          readOnly
          rows={5}
          className="w-full border border-gray-300 p-2 rounded-md font-mono text-sm"
          value={unifiedCats.join(', ')}
        />
      </div>

      {/* 4️⃣ Search + filter dropdown */}
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
          {unifiedCats.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 5️⃣ Render the grid of filtered gifts */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGifts.map(gift => {
            const unifiedCat = mapCategory(gift.category);
            return (
              <GiftCard
                key={gift.asin}
                gift={{
                  id: gift.asin,
                  name: gift.title,
                  imageUrl: gift.imgUrl,
                  rating: gift.stars,
                  reviews: gift.reviews,
                  price: gift.price,
                  categories: [unifiedCat],  // pass in the single unified category
                  link: gift.productURL,
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
