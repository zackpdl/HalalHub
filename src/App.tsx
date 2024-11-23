import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';

// User Pages
import Home from './pages/Home'; // Adjust if it exists in `src/pages/`
import RestaurantList from './pages/user/RestaurantList';
import RestaurantDetails from './pages/user/RestaurantDetails';
import UserProfile from './pages/user/UserProfile';

// Host Pages
import HostAuth from './pages/host/HostAuth';
import HostRegistration from './pages/host/HostRegistration';
import HostDashboard from './pages/host/HostDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// General Pages
import Auth from './pages/Auth';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          {/* General Routes */}
          <Route path="/auth" element={<Auth />} />

          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Host Routes */}
          <Route path="/host/auth" element={<HostAuth />} />
          <Route path="/host/register" element={<HostRegistration />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
