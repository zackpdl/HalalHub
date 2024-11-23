import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import Input from '../../components/ui/Input';
import Rating from '../../components/ui/Rating';

export default function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock data - replace with actual API calls
  const restaurants = [
    {
      id: '1',
      name: 'Spice Garden',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000',
      cuisine: 'Indian',
      rating: 4.5,
      reviews: 128,
      address: '123 Main St',
      certType: 'MUIS'
    },
    {
      id: '2',
      name: 'Al-Barakah',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
      cuisine: 'Middle Eastern',
      rating: 4.8,
      reviews: 256,
      address: '456 Oak Ave',
      certType: 'JAKIM'
    },
    {
      id: '3',
      name: 'Halal Delight',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
      cuisine: 'International',
      rating: 4.2,
      reviews: 89,
      address: '789 Pine St',
      certType: 'HMC'
    }
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Halal Restaurants</h1>
            <Link to="/profile" className="text-emerald-600 hover:text-emerald-700">
              My Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Input
            label=""
            placeholder="Search restaurants or cuisines..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(restaurant.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(restaurant.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h2>
                  <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                    {restaurant.certType}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                
                <div className="flex items-center mb-4">
                  <Rating value={restaurant.rating} readonly />
                  <span className="ml-2 text-sm text-gray-600">
                    ({restaurant.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  {restaurant.address}
                </div>

                <Link
                  to={`/restaurant/${restaurant.id}`}
                  className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}