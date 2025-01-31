import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabase';

interface Restaurant {
  id: string;
  name: string;
  certification_type: string;
  certification_status: string;
  certification_expiry: string;
  created_at: string;
}

interface DashboardStats {
  totalRestaurants: number;
  pendingReviews: number;
  activeCertifications: number;
  complianceIssues: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    pendingReviews: 0,
    activeCertifications: 0,
    complianceIssues: 0,
  });
  const [recentRestaurants, setRecentRestaurants] = useState<Restaurant[]>([]);
  const [certificationUpdates, setcertificationUpdates] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Verify admin status
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!adminData) {
        navigate('/admin/login');
        return;
      }
    };

    const fetchDashboardData = async () => {
      try {
        // Fetch total restaurants
        const { data: restaurantsData } = await supabase
          .from('restaurants')
          .select('*');

        const { data: pendingData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('certification_status', 'pending');

        const { data: activeData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('certification_status', 'active');

        const { data: complianceData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('certification_status', 'investigation');

        setStats({
          totalRestaurants: restaurantsData?.length || 0,
          pendingReviews: pendingData?.length || 0,
          activeCertifications: activeData?.length || 0,
          complianceIssues: complianceData?.length || 0,
        });

        // Fetch recent restaurants
        const { data: recentData } = await supabase
          .from('restaurants')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentData) {
          setRecentRestaurants(recentData);
        }

        // Fetch certification updates
        const { data: certData } = await supabase
          .from('restaurants')
          .select('*')
          .order('certification_expiry', { ascending: true })
          .limit(3);

        if (certData) {
          setcertificationUpdates(certData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    fetchDashboardData();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="admin" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage restaurant certifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalRestaurants}</h3>
            <p className="text-gray-600">Total Restaurants</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</h3>
            <p className="text-gray-600">Pending Reviews</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeCertifications}</h3>
            <p className="text-gray-600">Active Certifications</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.complianceIssues}</h3>
            <p className="text-gray-600">Compliance Issues</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {recentRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">
                      Applied: {new Date(restaurant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(restaurant.certification_status)}`}>
                    {restaurant.certification_status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification Updates</h2>
            <div className="space-y-4">
              {certificationUpdates.map((cert) => (
                <div key={cert.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cert.name}</span>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(cert.certification_status)}`}>
                      {cert.certification_status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{cert.certification_type} Certification</span>
                    <span>Expires: {new Date(cert.certification_expiry).toLocaleDateString()}</span>
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