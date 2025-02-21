import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/restaurants');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    const endpoint = isSignIn ? '/api/auth/signin' : '/api/auth/signup';
    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Log the response for debugging
      console.log('Response:', response);
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      console.log('Success:', data);
      localStorage.setItem('token', data.token); // Store JWT token
      navigate('/restaurants'); // Redirect to restaurants page
    } catch (error: any) {
      setError(error.message || 'Authentication error');
      console.error('Authentication error:', error.message);
    } finally {
      setIsLoading(false);
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

        {error && (
          <div className="mb-4 text-center text-sm text-red-600">
            <p>{error}</p>
          </div>
        )}

        <AuthForm
          isSignIn={isSignIn}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading} // Ensure this line is correctly formatted
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
