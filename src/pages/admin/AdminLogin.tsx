import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - replace with actual auth logic
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
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
            />
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              required
              value={credentials.password}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full">
              Sign in to Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;