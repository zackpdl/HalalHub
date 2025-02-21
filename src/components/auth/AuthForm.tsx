import React from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AuthFormProps {
  isSignIn: boolean;
  formData: {
    email: string;
    password: string;
    name?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;  // Add isLoading prop
}

export default function AuthForm({ isSignIn, formData, onChange, onSubmit, isLoading }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {!isSignIn && (
        <Input
          label="Full Name"
          name="name"
          icon={User}
          required={!isSignIn}
          value={formData.name || ''}
          onChange={onChange}
          placeholder="Enter your full name"
        />
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        icon={Mail}
        required
        value={formData.email}
        onChange={onChange}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        required
        value={formData.password}
        onChange={onChange}
        placeholder="Enter your password"
      />

      <Button type="submit" className="w-full" disabled={isLoading}> {/* Disable button when loading */}
        {isLoading ? 'Loading...' : isSignIn ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
}
