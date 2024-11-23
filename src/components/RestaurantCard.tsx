import React from 'react';
import { Star, MapPin, Award } from 'lucide-react';
import { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={restaurant.imageUrl}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-gray-600">{restaurant.rating}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{restaurant.location}</span>
        </div>
        <div className="flex items-center space-x-2 mt-2 text-gray-600">
          <Award className="h-4 w-4 text-emerald-600" />
          <span className="text-sm">{restaurant.halalCertification}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{restaurant.description}</p>
      </div>
    </div>
  );
}