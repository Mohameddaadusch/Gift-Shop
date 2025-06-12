import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Gift } from '../../types';
import { useApp } from '../../context/AppContext';

interface GiftCardProps {
  gift: Gift;
  featured?: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, featured = false }) => {
  const { addToCart, addToWishlist,removeFromWishlist, wishlist } = useApp();
  const isInWishlist = wishlist.some(item => item.id === gift.id);

  return (
    <div
      className={`card group flex flex-col overflow-hidden transition-all duration-300 ${
        featured ? 'hover:shadow-xl' : 'hover-lift'
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <a href={gift.link} target="_blank" rel="noopener noreferrer">
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isInWishlist) {
                removeFromWishlist(gift.id);
              } else {
                addToWishlist(gift);
              }
            }}
            className="bg-white text-gray-700 hover:text-accent-500 rounded-full p-2 shadow-soft transition-colors duration-200"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={`${isInWishlist ? 'fill-accent-500 text-accent-500' : ''}`}
            />
          </button>
        </div>

        {gift.categories[0] && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary">{gift.categories[0]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <a
          href={gift.link}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring"
        >
          <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors mb-1 line-clamp-3">
            {gift.name}
          </h3>
        </a>

        <div className="flex items-center mb-2">
          <Star size={16} className="fill-warning-400 text-warning-400" />
          <span className="ml-1 text-sm text-gray-700">{gift.rating}</span>
        </div>

        <p className="text-base font-medium text-gray-900 mb-4">${gift.price.toFixed(2)}</p>

        {/* Push button to bottom */}
        <button
          onClick={() => addToCart(gift)}
          className="mt-auto btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default GiftCard;
