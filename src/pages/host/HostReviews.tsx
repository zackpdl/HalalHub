import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

interface Review {
  customer_name: string;
  comment: string;
  rating: number;
}

export default function HostReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const hostData = localStorage.getItem('hostData');
        if (!hostData) {
          navigate('/host/login');
          return;
        }

        const { id } = JSON.parse(hostData);
        const response = await fetch(`http://localhost:5001/api/host/reviews?hostId=${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          console.error('Failed to fetch reviews:', data.message);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h1>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="bg-white p-6 mb-4 rounded-xl shadow-sm">
                <p className="font-medium text-gray-900">{review.customer_name}</p>
                <p className="text-gray-700">{review.comment}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg ml-1">{review.rating} / 5</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </main>
    </div>
  );
}
