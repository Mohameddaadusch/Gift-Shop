import React from 'react';
import { useApp } from '../context/AppContext';
import GiftCard from '../components/common/GiftCard';

const WishlistPage: React.FC = () => {
  const { wishlist } = useApp();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(gift => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
