import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockOccasions } from '../data/mockData';

const AdvancedSearchPage: React.FC = () => {
  const { user } = useApp();
  const [selectedPerson, setSelectedPerson] = useState('');
  const [occasion, setOccasion] = useState('');
  const [priceRange, setPriceRange] = useState('');
  
  // Mock saved people data (in a real app, this would come from the backend)
  const savedPeople = [
    { id: '1', name: 'Mom', interests: ['Gardening', 'Cooking'], age: 55 },
    { id: '2', name: 'Dad', interests: ['Golf', 'Technology'], age: 58 },
    { id: '3', name: 'Sister', interests: ['Art', 'Fashion'], age: 28 },
  ];

  const priceRanges = [
    { id: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { id: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
    { id: 'over-200', label: 'Over $200', min: 200, max: null },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically navigate to results page with search params
    console.log('Search params:', { selectedPerson, occasion, priceRange });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find the Perfect Gift</h1>
            <p className="text-gray-600">
              Use our advanced search to find personalized gift recommendations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Person Selection */}
              <div>
                <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-2">
                  Who are you shopping for?
                </label>
                <div className="relative">
                  <select
                    id="person"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    className="form-input appearance-none"
                    required
                  >
                    <option value="">Select a person</option>
                    {savedPeople.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.age}) - Interests: {person.interests.join(', ')}
                      </option>
                    ))}
                    <option value="new">+ Add new person</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Occasion Selection */}
              <div>
                <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-2">
                  What's the occasion?
                </label>
                <div className="relative">
                  <select
                    id="occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="form-input appearance-none"
                    required
                  >
                    <option value="">Select an occasion</option>
                    {mockOccasions.map((occ) => (
                      <option key={occ} value={occ.toLowerCase()}>
                        {occ}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your budget?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {priceRanges.map((range) => (
                    <div key={range.id}>
                      <input
                        type="radio"
                        id={range.id}
                        name="price-range"
                        value={range.id}
                        className="sr-only peer"
                        checked={priceRange === range.id}
                        onChange={(e) => setPriceRange(e.target.value)}
                        required
                      />
                      <label
                        htmlFor={range.id}
                        className="flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors peer-checked:bg-primary-50 peer-checked:border-primary-500 peer-checked:text-primary-700 hover:bg-gray-50"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn btn-primary py-3 flex items-center justify-center"
              >
                <Search size={20} className="mr-2" />
                Find Gifts
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;