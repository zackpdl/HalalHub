import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import Input from '../../components/ui/Input';
import Rating from '../../components/ui/Rating';

interface Restaurant {
  id: number;
  restaurant_name: string;
  cuisine: string;
  address: string;
  city: string;
  halal_cert_type: string;
  average_rating?: number;
  review_count?: number;
}

export default function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/restaurants')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        return response.json();
      })
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

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
                  src={`https://via.placeholder.com/400?text=${restaurant.restaurant_name}`}
                  alt={restaurant.restaurant_name}
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
                    {restaurant.restaurant_name}
                  </h2>
                  <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                    {restaurant.halal_cert_type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                
                <div className="flex items-center mb-4">
                  <Rating 
                    value={restaurant.average_rating || 0} 
                    readonly 
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {restaurant.review_count ? `(${restaurant.review_count} reviews)` : '(No reviews yet)'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  {restaurant.address}, {restaurant.city}
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