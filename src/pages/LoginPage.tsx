import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert('Please fill in all required fields.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      profileImage,
      age: parseInt(age),
      hobbies: hobbies.split(',').map(h => h.trim()),
      friends: []
    };

    login(newUser);
    navigate('/user-profile');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Name*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Profile Image URL (optional)"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Age*"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
