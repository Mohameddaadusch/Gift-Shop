import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { ShoppingCart, Heart, User, Gift, Bell } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';

const Header: React.FC = () => {
  const { cart, wishlist } = useApp();
  const { currentUser } = useAuth();
  const { userData } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  {/* 
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };
  */}

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Gift size={28} className="text-primary-600" />
            <span className="text-xl md:text-2xl font-bold text-gray-900">GiftShop</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/all-gifts" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Browse Gifts
            </Link>
            <Link to="/?occasions=all" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Occasions
            </Link>
            {/*
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center"
            >
              <Search size={18} className="mr-1" />
              <span>Search</span>
            </button>
            */}
            <Link to="/userprofile" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              My Profile
            </Link>

          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart size={22} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <Link to="/reminders" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <Bell size={22} />
            </Link>

            {currentUser ? (
              <Link to="/userprofile" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {(userData?.name || currentUser.displayName || currentUser.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium hidden lg:block">
                  {userData?.name || currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center"
              >
                <User size={20} className="mr-1" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      
      
    </header>
  );
}

export default Header;