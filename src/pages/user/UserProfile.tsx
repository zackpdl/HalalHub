import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Star, Settings } from 'lucide-react';
import Rating from '../../components/ui/Rating';
import { supabase } from '../../lib/supabase';

interface UserData {
  full_name: string;
  email: string;
  created_at: string;
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error('No authenticated user');
        }

        // Fetch user data from the users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('full_name, email, created_at')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Mock data for favorites and reviews - you can implement real data fetching later
  const favoriteRestaurants = [
    {
      id: '1',
      name: 'Spice Garden',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Al-Barakah',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8
    }
  ];

  const recentReviews = [
    {
      id: '1',
      restaurant: 'Spice Garden',
      rating: 5,
      comment: 'Amazing food and great service!',
      date: '2024-03-15'
    },
    {
      id: '2',
      restaurant: 'Al-Barakah',
      rating: 4,
      comment: 'Delicious food, slightly long wait times.',
      date: '2024-03-14'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/restaurants" className="text-emerald-600 hover:text-emerald-700">
              ← Back to Restaurants
            </Link>
            <button className="text-gray-600 hover:text-gray-700">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData?.full_name}</h2>
                  <p className="text-gray-600">{userData?.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Member since {new Date(userData?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold">Favorite Restaurants</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteRestaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    to={`/restaurant/${restaurant.id}`}
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <Rating value={restaurant.rating} readonly />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold">Recent Reviews</h2>
              </div>
              
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={`/restaurant/${review.id}`}
                        className="font-medium hover:text-emerald-600"
                      >
                        {review.restaurant}
                      </Link>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                    <div className="mb-2">
                      <Rating value={review.rating} readonly />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}