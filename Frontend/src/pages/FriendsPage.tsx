// src/pages/FriendsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useApp } from '../context/AppContext';
import { UserData } from '../types';
import { Search, UserPlus, UserMinus, ArrowLeft } from 'lucide-react';

const RELATION_OPTIONS = [
  'Family',
  'Friend',
  'Coworker',
  'Acquaintance',
  'Other'
];

const FriendsPage: React.FC = () => {
  const { userData, users, addFriend, removeFriend, refreshUserData} = useApp();
  const { currentUser} = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [relationMap, setRelationMap] = useState<Record<string,string>>({});


  // Check if user is authenticated
  if (!currentUser) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Please log in to manage your friends.
      </div>
    );
  }

  // Show loading state while user data is being fetched
  if (!userData) {
    return (
      <div className="mt-20 text-center text-gray-500">
        <div className="space-y-4">
          <p>Loading your profile...</p>
          <button 
            onClick={() => refreshUserData()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry Loading Profile
          </button>
          <p className="text-sm text-gray-400">
            If this persists, you may need to complete your profile setup.
          </p>
        </div>
      </div>
    );
  }

  const potential: UserData[] = search.trim()
    ? users.filter(
        u =>
          u.mail !== userData.mail &&
          !userData.friends.some(f => f.mail === u.mail) &&
          u.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const currentFriends = userData.friends;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Back + Title */}
        <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-sm">
            <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
            aria-label="Back"
            >
            <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Your Friends</h1>
        </div>
        </div>

      {/* Current Friends */}
      <section className="flex flex-col items-center">
        {currentFriends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {currentFriends.map(f => (
              <div
                key={f.mail}
                className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {f.name.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-900">{f.name}</p>
                  <p className="text-sm text-gray-600">Email: {f.mail}</p>
                  <p className="text-sm text-gray-600">
                    Relationship: <span className="font-medium">{f.relationShip}</span>
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await removeFriend(f.mail);
                    } catch (error) {
                      console.error('Error removing friend:', error);
                      alert('Failed to remove friend');
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                  aria-label="Remove friend"
                >
                  <UserMinus size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no friends yet.</p>
        )}
      </section>

      <hr />

      {/* Find & Add Friends */}
      <section className="space-y-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Find &amp; Add Friends
        </h2>

        {/* Search box */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          />
        </div>

        {search.trim() === '' ? (
          <div className="text-center space-y-2">
            <p className="text-gray-400">Start typing to find users…</p>
          </div>
        ) : potential.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {potential.map(u => (
              <div
                key={u.mail}
                className="flex flex-col sm:flex-row items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-600">Age: {u.age}</p>
                  <p className="text-sm text-gray-600">Hobbies: {u.hobbies.join(', ')}</p>
                  <label className="block text-gray-700 text-sm mt-2">
                    Relationship:
                    <select
                      value={relationMap[u.mail] || ''}
                      onChange={e =>
                        setRelationMap(prev => ({
                          ...prev,
                          [u.mail]: e.target.value
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select…</option>
                      {RELATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  onClick={async () => {
                    const rel = relationMap[u.mail];
                    if (!rel) return alert('Please select a relationship.');
                    
                    try {
                      await addFriend({
                        mail: u.mail,
                        name: u.name,
                        relationShip: rel
                      });
                      setRelationMap(prev => {
                        const next = { ...prev };
                        delete next[u.mail];
                        return next;
                      });
                    } catch (error) {
                      console.error('Error adding friend:', error);
                      alert('Failed to add friend');
                    }
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                  aria-label="Add friend"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users match “{search}”.</p>
        )}
      </section>
    </div>
  );
};

export default FriendsPage;
