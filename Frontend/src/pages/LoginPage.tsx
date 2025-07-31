

// src/pages/LoginPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FirebaseAuthComponent from '../components/auth/FirebaseAuthComponent'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Gift Shop</h1>
      
      {/* Firebase Authentication */}
      <FirebaseAuthComponent onSuccess={() => navigate('/userprofile')} />
    </div>
  )
}

export default LoginPage
