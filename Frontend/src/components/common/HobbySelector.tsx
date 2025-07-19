import React, { useState, useEffect } from 'react';

interface HobbySelectorProps {
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const HobbySelector: React.FC<HobbySelectorProps> = ({
  selectedHobbies,
  onHobbiesChange,
  placeholder = "Type to search hobbies...",
  label = "Hobbies",
  required = false,
  className = ""
}) => {
  const [hobbyInput, setHobbyInput] = useState('');
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false);
  const [hobbiesOptions, setHobbiesOptions] = useState<string[]>([]);

  // Load hobbies from CSV on component mount
  useEffect(() => {
    const loadHobbies = async () => {
      try {
        const response = await fetch('/Data/hobbies_by_category.csv');
        const csvText = await response.text();
        
        // Parse CSV and extract hobby names (first column before the comma)
        const hobbies = csvText
          .split('\n')
          .slice(1) // Skip header row
          .map(line => line.split(',')[0]) // Get first column (hobby name)
          .filter(hobby => hobby && hobby.trim() !== '') // Remove empty entries
          .map(hobby => hobby.trim()) // Trim whitespace
          .filter((hobby, index, array) => array.indexOf(hobby) === index); // Remove duplicates
        
        setHobbiesOptions(hobbies);
      } catch (error) {
        console.error('Failed to load hobbies:', error);
        // Fallback hobbies if CSV fails to load
        setHobbiesOptions([
          'Reading', 'Gaming', 'Cooking', 'Gardening', 'Photography',
          'Music', 'Sports', 'Art', 'Travel', 'Technology'
        ]);
      }
    };

    loadHobbies();
  }, []);

  // Filter hobbies based on input
  const filteredHobbies = hobbiesOptions
    .filter(hobby => 
      hobby.toLowerCase().includes(hobbyInput.toLowerCase()) &&
      !selectedHobbies.includes(hobby)
    )
    .sort((a, b) => {
      const inputLower = hobbyInput.toLowerCase();
      const aStartsWith = a.toLowerCase().startsWith(inputLower);
      const bStartsWith = b.toLowerCase().startsWith(inputLower);
      
      // Prioritize hobbies that start with the input
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // If both start with input or both don't, sort alphabetically
      return a.localeCompare(b);
    })
    .slice(0, 20); // Limit to 20 suggestions

  const handleHobbyInputChange = (value: string) => {
    setHobbyInput(value);
    setShowHobbyDropdown(value.length > 0);
  };

  const handleHobbySelect = (hobby: string) => {
    if (!selectedHobbies.includes(hobby)) {
      onHobbiesChange([...selectedHobbies, hobby]);
    }
    setHobbyInput('');
    setShowHobbyDropdown(false);
  };

  const removeHobby = (hobbyToRemove: string) => {
    onHobbiesChange(selectedHobbies.filter(hobby => hobby !== hobbyToRemove));
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Selected hobbies display */}
      {selectedHobbies.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {selectedHobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {hobby}
                <button
                  type="button"
                  onClick={() => removeHobby(hobby)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hobby input with autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={hobbyInput}
          onChange={(e) => handleHobbyInputChange(e.target.value)}
          onFocus={() => setShowHobbyDropdown(hobbyInput.length > 0)}
          onBlur={() => setTimeout(() => setShowHobbyDropdown(false), 100)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Dropdown with filtered hobbies */}
        {showHobbyDropdown && filteredHobbies.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredHobbies.map((hobby) => (
              <button
                key={hobby}
                type="button"
                onClick={() => handleHobbySelect(hobby)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                {hobby}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HobbySelector;
