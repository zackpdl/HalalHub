import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';
import Button from './ui/Button';

interface SidebarProps {
  type: 'host' | 'admin';
}

export default function Sidebar({ type }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = type === 'host' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/host/dashboard' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/host/menu' },
    { icon: FileText, label: 'Orders', path: '/host/orders' },
    { icon: Settings, label: 'Settings', path: '/host/settings' }
  ] : [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: UtensilsCrossed, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: FileText, label: 'Certifications', path: '/admin/certifications' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-emerald-600">
            {type === 'host' ? 'Restaurant Portal' : 'Admin Portal'}
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}