// src/pages/UserProfile.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, Users, Gift, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UserProfile: React.FC = () => {
  const { user, reminders } = useApp();

  if (!user) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  // friendly counts
  // const friendCount = user.friends.length;
  const reminderCount = reminders.length;

  return (
    <div className="max-w-3xl mx-auto my-12 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative bg-primary-600 p-8 text-white flex items-center space-x-6">
        <div
          className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold"
          title="Profile picture"
        >
          {user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold">{user.name}</h1>
          <div className="mt-1 flex items-center space-x-2 text-sm opacity-90">
            <Mail size={16} />
            <span>{user.mail}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Calendar size={24} className="text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-600">Age</span>
            <span className="mt-1 text-xl font-bold text-gray-900">{user.age}</span>
          </div>
          <div className="flex flex-col items-center">
            <Users size={24} className="text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-600">Friends</span>
            <span className="mt-1 text-xl font-bold text-gray-900">{69}</span>
          </div>
          <div className="flex flex-col items-center">
            <Gift size={24} className="text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-600">Reminders</span>
            <span className="mt-1 text-xl font-bold text-gray-900">{reminderCount}</span>
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hobbies</h2>
          {user.hobbies.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {user.hobbies.map((hobby, i) => (
                <li key={i}>{hobby}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hobbies added yet.</p>
          )}
        </div>

        {/* Friends */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Friends</h2>
              <Link
                to="/friends"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600
                            text-white font-bold rounded-full shadow-lg transform hover:-translate-y-0.5 transition">
                <Users size={18} />
                <span>Manage Friends</span>
              </Link>
          </div>
          {/* {user.friends.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {user.friends.map((f) => (
                <li
                  key={f.mail}
                  className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {f.name.charAt(0)}
                  </div>
                  <span className="text-gray-800">{f.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no friends yet.</p>
          )} */}
        </div>

        {/* Reminders CTA */}
        <div className="text-center">
          <Link
            to="/reminders"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-full transition"
          >
            View My Reminders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
