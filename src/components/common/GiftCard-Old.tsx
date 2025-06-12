import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Gift } from '../../types';
import { useApp } from '../../context/AppContext';

interface GiftCardProps {
  gift: Gift;
  featured?: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, featured = false }) => {
  const { addToCart, addToWishlist, wishlist } = useApp();
  
  const isInWishlist = wishlist.some(item => item.id === gift.id);
  
  return (
    <div 
      className={`card group relative overflow-hidden transition-all duration-300 ${
        featured ? 'hover:shadow-xl' : 'hover-lift'
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={gift.imageUrl} 
          alt={gift.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(gift);
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
      
      <div className="p-4">
        <Link to={`/gift/${gift.id}`} className="focus-ring">
          <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors mb-1">
            {gift.name}
          </h3>
        </Link>
        {/* 
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star size={16} className="fill-warning-400 text-warning-400" />
            <span className="ml-1 text-sm text-gray-700">{gift.rating}</span>
          </div>
          <span className="mx-1 text-gray-300">|</span>
          <span className="text-xs text-gray-500">{gift.reviews} reviews</span>
        </div>
        */}
        <p className="text-base font-medium text-gray-900 mb-3">${gift.price.toFixed(2)}</p>
        
        <div className="mt-2">
          <button 
            onClick={() => addToCart(gift)}
            className="btn btn-primary w-full group-hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center"
          >
            <ShoppingCart size={16} className="mr-1" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GiftCard;