import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement actual authentication logic here
      console.log('Form submitted:', formData);
      
      // For now, just redirect to restaurants page
      navigate('/restaurants');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <AuthForm
          isSignIn={isSignIn}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {isSignIn && (
          <p className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={() => navigate('/forgot-password')}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Forgot your password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}