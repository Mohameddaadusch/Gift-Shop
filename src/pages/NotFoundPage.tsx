import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page Not Found | GiftSage";
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 rounded-full p-4">
            <Search size={48} className="text-primary-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/"
            className="w-full sm:w-auto btn btn-primary inline-flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          <Link 
            to="/?category=all"
            className="w-full sm:w-auto btn btn-outline inline-flex items-center justify-center"
          >
            Browse Gifts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;