import React from 'react';
import { Search, Utensils, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const featuredRestaurants = [
  {
    id: '1',
    name: 'Saffron House',
    cuisine: 'Middle Eastern',
    location: 'Downtown',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    halalCertification: 'MUIS Certified'
  },
  {
    id: '2',
    name: 'Tandoor Palace',
    cuisine: 'Indian',
    location: 'Central District',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    halalCertification: 'JAKIM Certified'
  },
  {
    id: '3',
    name: 'Istanbul Delights',
    cuisine: 'Turkish',
    location: 'West End',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4',
    halalCertification: 'HMC Certified'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-emerald-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Authentic Halal Restaurants
          </h1>
          <p className="text-xl mb-8">
            Find and review the best Halal food places in your area
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Input
              label=""
              type="text"
              placeholder="Search by restaurant name, cuisine, or location..."
              icon={Search}
              className="bg-white text-gray-900"
            />
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/auth">
              <Button variant="secondary">Find Restaurants</Button>
            </Link>
            <Link to="/host/login">
              <Button>Restaurant Partner Login</Button>
            </Link>
          </div>
        </div>
      </section>

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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Restaurants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                      {restaurant.halalCertification}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1">{restaurant.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}