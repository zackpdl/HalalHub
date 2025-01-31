import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { supabase } from '../../lib/supabase';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignIn) {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

      } else {
        // Sign up
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (user) {
          // Create user record
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: formData.email,
                full_name: formData.name,
              }
            ]);

          if (insertError) {
            console.error('Error creating user record:', insertError);
            throw new Error('Failed to complete signup. Please try again.');
          }
        }
      }

      navigate('/restaurants');
    } catch (err: any) {
      if (err.message === 'User already registered') {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(err.message || 'An error occurred during authentication');
      }
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
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

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