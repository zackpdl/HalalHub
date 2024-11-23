import React from 'react';
import { Search, Utensils, Award, Star } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';

const featuredRestaurants = [
  {
    id: '1',
    name: 'Saffron House',
    cuisine: 'Middle Eastern',
    location: 'Downtown',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    halalCertification: 'MUIS Certified',
    description: 'Authentic Middle Eastern cuisine with a modern twist.',
    reviews: []
  },
  {
    id: '2',
    name: 'Tandoor Palace',
    cuisine: 'Indian',
    location: 'Central District',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    halalCertification: 'JAKIM Certified',
    description: 'Traditional Indian flavors in a royal setting.',
    reviews: []
  },
  {
    id: '3',
    name: 'Istanbul Delights',
    cuisine: 'Turkish',
    location: 'West End',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4',
    halalCertification: 'HMC Certified',
    description: 'Experience authentic Turkish kebabs and mezze.',
    reviews: []
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Authentic Halal Restaurants
          </h1>
          <p className="text-xl mb-8">
            Find and review the best Halal food places in your area
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine, or location..."
              className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button className="absolute right-2 top-2 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-400">
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find Halal restaurants near you instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Halal</h3>
              <p className="text-gray-600">All restaurants verified for Halal compliance</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Reviews</h3>
              <p className="text-gray-600">Real reviews from our trusted community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Restaurants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}