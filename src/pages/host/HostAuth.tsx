import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function HostAuth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (user) {
        // Verify if the user is a host
        const { data: hostData, error: hostError } = await supabase
          .from('hosts')
          .select('id')
          .eq('id', user.id)
          .single();

        if (hostError || !hostData) {
          throw new Error('Unauthorized access. Please sign in with a host account.');
        }

        navigate('/host/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Store className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Restaurant Partner Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            New restaurant partner?{' '}
            <button
              onClick={() => navigate('/host/register')}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Register here
            </button>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your business email"
            disabled={isLoading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/host/forgot-password')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              Forgot your password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}