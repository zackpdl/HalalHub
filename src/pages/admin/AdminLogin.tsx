import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) throw signInError;

      if (user) {
        // Verify if the user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .single();

        if (adminError || !adminData) {
          throw new Error('Unauthorized access');
        }

        // Update last login
        await supabase
          .from('admins')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or unauthorized access');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <Shield className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access for restaurant management
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            required
            value={credentials.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            required
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}