import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GiftDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { gifts, addToCart, addToWishlist, wishlist } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  
  const gift = gifts.find(g => g.id === id);
  const isInWishlist = wishlist.some(item => item.id === id);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    if (gift) {
      document.title = `${gift.name} | GiftSage`;
    }
  }, [gift]);
  
  if (!gift) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
        <h1 className="text-2xl font-bold mb-4">Gift Not Found</h1>
        <p className="mb-8">We couldn't find the gift you're looking for.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row -mx-4">
          {/* Product Image */}
          <div className="lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <img 
                src={gift.imageUrl} 
                alt={gift.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="lg:w-1/2 px-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {gift.categories.map((category) => (
                <span key={category} className="badge badge-primary">
                  {category}
                </span>
              ))}
              {gift.inStock ? (
                <span className="badge bg-success-100 text-success-800 flex items-center">
                  <Check size={12} className="mr-1" />
                  In Stock
                </span>
              ) : (
                <span className="badge bg-error-100 text-error-800">
                  Out of Stock
                </span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {gift.name}
            </h1>
            {/*
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star size={18} className="fill-warning-400 text-warning-400" />
                <span className="ml-1 text-lg font-medium text-gray-900">{gift.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">{gift.reviews} reviews</span>
            </div>
            */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">${gift.price.toFixed(2)}</p>
            </div>
            
            <p className="text-gray-600 mb-8">
              {gift.description}
            </p>
            
            <div className="mb-8">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 rounded-l-md p-2"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-t border-b border-gray-300 p-2"
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 rounded-r-md p-2"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => addToCart(gift, quantity)}
                className="flex-1 btn btn-primary py-3 text-base"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={() => addToWishlist(gift)}
                className={`flex-1 btn ${
                  isInWishlist ? 'bg-accent-50 text-accent-600 border border-accent-200' : 'btn-outline'
                } py-3 text-base`}
              >
                <Heart size={20} className={`mr-2 ${isInWishlist ? 'fill-accent-500' : ''}`} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({gift.reviews})
              </button>
            </nav>
          </div>
          
          <div className="pt-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">About this gift</h3>
                <div className="prose max-w-none text-gray-600">
                  <p>{gift.description}</p>
                  <p className="mt-4">
                    This gift is perfect for occasions like: {gift.occasions.join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gift Details</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Categories</dt>
                      <dd className="mt-1 text-gray-900">
                        {gift.categories.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Occasions</dt>
                      <dd className="mt-1 text-gray-900">
                        {gift.occasions.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Recommended For</dt>
                      <dd className="mt-1 text-gray-900">
                        {gift.tags.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd className="mt-1 text-gray-900">
                        ${gift.price.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">Review data will be populated from the backend.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftDetailPage;