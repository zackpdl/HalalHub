import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function HostAuth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true); // Show loading indicator

    try {
      const response = await fetch('http://localhost:5001/api/host/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Host login successful:', data);
      // Store host data in localStorage
      localStorage.setItem('hostData', JSON.stringify(data.host));
      navigate('/host/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      setError(error.message || 'Failed to log in'); // Show error message
    } finally {
      setLoading(false); // Hide loading indicator
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-center">{error}</div>}

          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your business email"
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
          />

          <div className="flex items-center justify-end">
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
        </div>
      </div>
    </div>
  );
}
