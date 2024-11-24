import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Heart, Star as StarIcon } from 'lucide-react';
import Rating from '../../components/ui/Rating';
import Button from '../../components/ui/Button';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - replace with API call
  const restaurant = {
    id,
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2000',
    cuisine: 'Indian',
    rating: 4.5,
    address: '123 Main St',
    phone: '+1 234-567-8900',
    hours: '10:00 AM - 10:00 PM',
    certType: 'MUIS',
    description: 'Authentic Indian cuisine with a modern twist. All our dishes are prepared with certified halal ingredients.',
    reviews: [
      { id: 1, user: 'Ahmed', rating: 5, comment: 'Amazing food and great service!', date: '2024-03-15' },
      { id: 2, user: 'Sarah', rating: 4, comment: 'Delicious food, slightly long wait times.', date: '2024-03-14' }
    ]
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Add review logic here
    setNewReview({ rating: 0, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-lg">{restaurant.cuisine}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? 'text-red-500 fill-current' : 'text-white'
                  }`}
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
              <p className="text-gray-600 mb-6">{restaurant.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {restaurant.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  {restaurant.hours}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  {restaurant.phone}
                </div>
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
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.user}</span>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Rating value={review.rating} readonly />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 font-semibold">{restaurant.rating}</span>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                  {restaurant.certType}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="text-gray-600">Monday - Sunday</p>
                <p className="text-gray-600">{restaurant.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}