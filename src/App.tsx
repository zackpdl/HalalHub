import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/auth/Auth';
import HostAuth from './pages/host/HostAuth';
import HostRegistration from './pages/host/HostRegistration';
import HostDashboard from './pages/host/HostDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantList from './pages/user/RestaurantList';
import RestaurantDetails from './pages/user/RestaurantDetails';
import UserProfile from './pages/user/UserProfile';
import Menu from './pages/host/Menu.tsx'; // Import the new Menu component

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* User Routes */}
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* Host Routes */}
        <Route path="/host/login" element={<HostAuth />} />
        <Route path="/host/register" element={<HostRegistration />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/menu" element={<Menu />} /> {/* Add the route for Menu */}
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
