import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User, Store } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">HalalHub</span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for restaurants, cuisine, or location..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Link 
              to="/host/auth" 
              className="flex items-center space-x-1 hover:text-emerald-200"
            >
              <Store className="h-5 w-5" />
              <span>Host Sign In</span>
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center space-x-1 hover:text-emerald-200"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}