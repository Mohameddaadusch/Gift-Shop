import React, { useState } from 'react';
import { useAuth } from '../../context/AppContext';
import { auth } from '../../config/firebase';
import { saveUserData, UserData } from '../../services/userService';

interface FirebaseAuthComponentProps {
  onSuccess?: () => void;
}

const FirebaseAuthComponent: React.FC<FirebaseAuthComponentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common hobbies list
  const hobbiesOptions = [
    'Reading', 'Photography', 'Cooking', 'Gaming', 'Music', 'Sports', 'Travel',
    'Art & Crafts', 'Gardening', 'Fitness', 'Movies', 'Dancing', 'Writing',
    'Technology', 'Fashion', 'Outdoor Activities', 'Board Games', 'Collecting',
    'Learning Languages', 'Volunteering'
  ];

  const { login, signup } = useAuth();

  const handleHobbyInputChange = (value: string) => {
    setHobbyInput(value);
    setShowHobbyDropdown(value.length > 0);
  };

  const handleHobbySelect = (hobby: string) => {
    if (!selectedHobbies.includes(hobby)) {
      setSelectedHobbies(prev => [...prev, hobby]);
    }
    setHobbyInput('');
    setShowHobbyDropdown(false);
  };

  const removeHobby = (hobbyToRemove: string) => {
    setSelectedHobbies(prev => prev.filter(h => h !== hobbyToRemove));
  };

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
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) return;
    
    // Additional validation for signup
    if (!isLogin) {
      if (!name || !age || !gender || selectedHobbies.length === 0) {
        setError('Please fill in all required fields for signup');
        return;
      }
      
      if (parseInt(age) < 13 || parseInt(age) > 120) {
        setError('Please enter a valid age between 13 and 120');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
        
        // Save additional user data to Firestore after successful signup
        if (auth.currentUser) {
          const userData: UserData = {
            // uid: auth.currentUser.uid,
            mail: email,
            name: name,
            age: parseInt(age),
            gender: gender,
            hobbies: selectedHobbies,
            // friends: [],
            // profileImage: '',
            // createdAt: new Date().toISOString()
          };

          try {
            await saveUserData(userData, auth.currentUser.uid);
            console.log('User data saved to Firestore successfully');
          } catch (firestoreError) {
            console.error('Failed to save user data to Firestore:', firestoreError);
            // Don't throw error here as authentication was successful
          }
        }
      }
      
      // Get ID token from the authenticated user
      if (auth.currentUser) {
        try {
          const idToken = await auth.currentUser.getIdToken();
          const response = await fetch('http://localhost:3001/api/firebase-signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
          });

          if (response.ok) {
            console.log('Firebase authentication successful with backend');
          } else {
            console.warn('Backend authentication failed, but Firebase auth succeeded');
          }
        } catch (fetchError) {
          // Backend server might not be running, but Firebase auth succeeded
          console.warn('Backend server not available, but Firebase auth succeeded:', fetchError);
        }
        
        // Always call onSuccess if Firebase authentication succeeded
        console.log('Firebase authentication successful');
        onSuccess?.();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto bg-white p-6 rounded-lg shadow-md ${!isLogin ? 'max-w-lg' : ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Sign In' : 'Sign Up'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobbies (Add at least one)
              </label>
              
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
                  placeholder="Type to search hobbies..."
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
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            // Clear additional fields when switching modes
            if (!isLogin) {
              setName('');
              setAge('');
              setGender('');
              setSelectedHobbies([]);
              setHobbyInput('');
              setShowHobbyDropdown(false);
            }
            setError('');
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default FirebaseAuthComponent;
