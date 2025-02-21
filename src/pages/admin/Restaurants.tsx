import React from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

interface Restaurant {
  id: number;
  name: string;
  status: 'Approved' | 'Pending Review' | 'Under Investigation';
  dateAdded: string;
  certification: 'MUIS' | 'JAKIM' | 'HMC';
  certificateId: string;
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([
    { id: 1, name: 'Spice Garden', status: 'Pending Review', dateAdded: '2024-03-15', certification: 'MUIS', certificateId: '11223635' },
    { id: 2, name: 'Al-Barakah', status: 'Approved', dateAdded: '2024-03-14', certification: 'JAKIM', certificateId: '22337543' },
    { id: 3, name: 'Halal Delight', status: 'Pending Review', dateAdded: '2024-03-13', certification: 'HMC', certificateId: '75521834' },
    { id: 4, name: 'Golden Crescent', status: 'Approved', dateAdded: '2024-03-10', certification: 'HMC', certificateId: '3643821' },
  ]);

  const getStatusColor = (status: Restaurant['status']): string => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'under investigation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, status: 'Approved' } : restaurant
      )
    );
  };

  const handleDeny = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, status: 'Under Investigation' } : restaurant
      )
    );
  };

  const handleDelete = (id: number) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="admin" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Restaurants</h1>
          <p className="text-gray-600">View, approve, deny, and delete restaurant certifications</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant List</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
                <th className="px-4 py-2 border border-gray-200">Date Added</th>
                <th className="px-4 py-2 border border-gray-200">Certification</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 font-medium text-gray-900">
                    {restaurant.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                        restaurant.status
                      )}`}
                    >
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-gray-600">
                    {restaurant.dateAdded}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 text-gray-600">
                    {restaurant.certification} - {restaurant.certificateId}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 flex items-center space-x-2">
                    <button
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      title="Approve"
                      onClick={() => handleApprove(restaurant.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Deny"
                      onClick={() => handleDeny(restaurant.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      title="Delete"
                      onClick={() => handleDelete(restaurant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
