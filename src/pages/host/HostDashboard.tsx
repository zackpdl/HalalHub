import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Star, 
  AlertCircle 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function HostDashboard() {
  const stats = [
    { label: 'Total Orders', value: '1,234', icon: TrendingUp, trend: '+12.5%' },
    { label: 'Customers', value: '856', icon: Users, trend: '+5.2%' },
    { label: 'Rating', value: '4.8', icon: Star, trend: '+0.3' },
    { label: 'Issues', value: '2', icon: AlertCircle, trend: '-50%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Restaurant Owner</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order}234</p>
                    <p className="text-sm text-gray-600">2 items • $24.99</p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification Status</h2>
            <div className="p-4 border rounded-lg bg-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-emerald-800">MUIS Certification</span>
                <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-sm text-emerald-700">Valid until: December 31, 2024</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}