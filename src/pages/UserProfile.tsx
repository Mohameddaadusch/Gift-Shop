import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const UserProfile: React.FC = () => {
  const { user } = useApp();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  const toggleFriend = (id: string) => {
    setSelectedFriendId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-primary-700">Welcome, {user.name}!</h1>

      <p className="text-gray-800 text-lg">
        <strong>Age:</strong> {user.age}
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary-600">Hobbies</h2>
        {user.hobbies && user.hobbies.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {user.hobbies.map((hobby, idx) => (
              <li key={idx}>{hobby}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hobbies added yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary-600">Friends</h2>
        {user.friends && user.friends.length > 0 ? (
          <div className="space-y-3">
            {user.friends.map(friend => (
              <div key={friend.id}>
                <button
                  onClick={() => toggleFriend(friend.id)}
                  className="w-full text-left px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 font-medium rounded-md shadow-sm transition duration-200"
                >
                  {friend.name}
                </button>

                {selectedFriendId === friend.id && (
                  <div className="mt-2 ml-4 p-4 bg-gray-50 border-l-4 border-primary-400 rounded shadow-inner">
                    <p><strong>Name:</strong> {friend.name}</p>
                    <p><strong>ID:</strong> {friend.id}</p>
                    {/* בעתיד תוכל להוסיף עוד מידע כמו תחביבים, תאריך לידה וכו' */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No friends added yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
