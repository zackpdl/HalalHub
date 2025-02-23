import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Heart, Star as StarIcon } from 'lucide-react';
import Rating from '../../components/ui/Rating';
import Button from '../../components/ui/Button';

interface Restaurant {
  id: number;
  host_id: number;
  restaurant_name: string;
  cuisine: string; 
  address: string;
  city: string;
  opening_hours: string;
  closing_hours: string;
  halal_cert_type: string;
  phone?: string;
}

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update the fetchMenuItems function in useEffect
  useEffect(() => {
    const fetchRestaurantAndReviews = async () => {
      try {
        const restaurantRes = await fetch(`http://localhost:5001/api/restaurants/${id}`);
        if (!restaurantRes.ok) throw new Error('Failed to fetch restaurant details');
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);
  
        const reviewsRes = await fetch(`http://localhost:5001/api/host/reviews?hostId=${restaurantData.host_id}`);
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
  
        // Update the menu fetch URL to match your API endpoint
        const fetchMenuItems = async () => {
          try {
            const response = await fetch(`http://localhost:5001/api/host/menu?restaurant_id=${restaurantData.id}`);
            
            if (response.status === 404) {
              setMenuItems([]);
              return;
            }
  
            if (!response.ok) {
              throw new Error(`Failed to fetch menu items: ${response.statusText}`);
            }
  
            const { menu } = await response.json();
            const formattedMenu = Array.isArray(menu) ? menu.map(item => ({
              ...item,
              price: Number(item.price)
            })) : [];
            setMenuItems(formattedMenu);
          } catch (error) {
            console.error("Error fetching menu items:", error);
            setMenuItems([]);
          }
        };
        
        await fetchMenuItems();
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };
  
    if (id) {
      fetchRestaurantAndReviews();
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/restaurants/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      const reviewsRes = await fetch(`http://localhost:5001/api/host/reviews?hostId=${restaurant?.host_id}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData.reviews || []);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!restaurant) return <div className="min-h-screen flex items-center justify-center">Restaurant not found</div>;

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={`https://via.placeholder.com/400?text=${restaurant.restaurant_name}`}
          alt={restaurant.restaurant_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{restaurant.restaurant_name}</h1>
                <p className="text-lg">{restaurant.cuisine}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Heart
                  className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {restaurant.address}, {restaurant.city}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  {restaurant.opening_hours} - {restaurant.closing_hours}
                </div>
                {restaurant.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2" />
                    {restaurant.phone}
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Cuisine:</span>
                  <span className="ml-2">{restaurant.cuisine}</span>
                </div>
              </div>
            </div>

            {/* Menu Items Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="border-b pb-4">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="mt-2 font-medium">฿{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
              <form onSubmit={handleSubmitReview} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <Rating
                    value={newReview.rating}
                    onChange={(value) => setNewReview({ ...newReview, rating: value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <Button type="submit">Submit Review</Button>
              </form>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.customer_name}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={review.rating} readonly />
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                  {restaurant.halal_cert_type}
                </span>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="text-gray-600">Monday - Sunday</p>
                <p className="text-gray-600">{restaurant.opening_hours} - {restaurant.closing_hours}</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="p-4 border rounded-lg">
                  <iframe
                    title={`Map of ${restaurant.restaurant_name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${restaurant.address}, ${restaurant.city}`)}&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <p className="text-gray-600 mt-4">Find {restaurant.restaurant_name} on the map.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}