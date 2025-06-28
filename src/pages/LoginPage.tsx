// src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { User } from '../types'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const { login } = useApp(); // Use the login function from your context

  // toggle between login and signup
  const [isLogin, setIsLogin] = useState(true)

  // form fields
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [profileImage, setProfileImage] = useState('')

  // handle login (just email & name for now)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mail.trim() || !password.trim()) {
      alert('Please enter both email and password.')
      return
    }

    try {
      // Call the login function from AppContext
      await login({ mail: mail.trim(), password: password.trim() });
      navigate('/userprofile'); // Navigate on success
    } catch (err: any) {
      // setError(err.message || 'An unknown error occurred.');
      console.error(err);
    }
  };

  // handle signup (all fields)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !mail.trim() ||
      !password.trim() ||
      !name.trim() ||
      !age.trim() ||
      !gender.trim()
    ) {
      alert('Please fill in all required fields.')
      return
    }
    console.log("handling singup");

    try {
          const user : User = {
            mail: mail.trim(),
            password: password.trim(), //hash
            name: name.trim(),
            age: parseInt(age, 10),
            gender: gender,
            hobbies: hobbies
              .split(',')
              .map(h => h.trim())
              .filter(h => h), 
            friends: [],
            profileImage: profileImage.trim()
          }
          const response = await fetch('http://localhost:3001/api/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(user)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to sign up.');
          }
  
        } catch (err) {
          console.log("error");
        }
        navigate('/userprofile')
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setIsLogin(true)}
          className={
            isLogin
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600'
          }
        >
          Log In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={
            !isLogin
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600'
          }
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      {isLogin ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email*"
            value={mail}
            onChange={e => setMail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
          >
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email*"
            value={mail}
            onChange={e => setMail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Name*"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Age*"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Gender*</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Hobbies (comma-separated)"
            value={hobbies}
            onChange={e => setHobbies(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Profile Image URL"
            value={profileImage}
            onChange={e => setProfileImage(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  )
}

export default LoginPage
