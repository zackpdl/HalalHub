import React from 'react';
import { 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Restaurants', value: '156', icon: Store, trend: '+12.5%' },
    { label: 'Pending Reviews', value: '23', icon: Clock, trend: '+5' },
    { label: 'Active Certifications', value: '142', icon: CheckCircle2, trend: '+3' },
    { label: 'Compliance Issues', value: '4', icon: AlertCircle, trend: '-2' }
  ];

  const recentRestaurants = [
    { name: 'Spice Garden', status: 'Pending Review', date: '2024-03-15' },
    { name: 'Al-Barakah', status: 'Approved', date: '2024-03-14' },
    { name: 'Halal Delight', status: 'Under Investigation', date: '2024-03-13' }
  ];

  const certificationUpdates = [
    { restaurant: 'Spice Garden', type: 'MUIS', status: 'Pending', expiryDate: '2024-12-31' },
    { restaurant: 'Al-Barakah', type: 'JAKIM', status: 'Active', expiryDate: '2025-06-30' },
    { restaurant: 'Halal Delight', type: 'HMC', status: 'Expiring Soon', expiryDate: '2024-04-15' }
  ];

  const getStatusColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="admin" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage restaurant certifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-6 w-6 text-emerald-600" />
                <span className={`text-sm font-medium ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {recentRestaurants.map((restaurant) => (
                <div key={restaurant.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">Applied: {restaurant.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(restaurant.status)}`}>
                    {restaurant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification Updates</h2>
            <div className="space-y-4">
              {certificationUpdates.map((cert) => (
                <div key={cert.restaurant} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cert.restaurant}</span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      cert.status === 'Active' ? 'bg-green-100 text-green-800' :
                      cert.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{cert.type} Certification</span>
                    <span>Expires: {cert.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}