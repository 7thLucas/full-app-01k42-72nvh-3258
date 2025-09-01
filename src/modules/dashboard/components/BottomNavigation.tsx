import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, BarChart3, ShoppingCart, Settings, Plus } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventori',
      icon: Package,
      path: '/inventory'
    },
    {
      id: 'usage',
      label: 'Catat',
      icon: Plus,
      path: '/usage',
      isAction: true
    },
    {
      id: 'restock',
      label: 'Restock',
      icon: ShoppingCart,
      path: '/restock'
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: BarChart3,
      path: '/reports'
    }
  ];

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isAction = item.isAction;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex-1 py-2 px-1 flex flex-col items-center justify-center relative
                  ${isAction 
                    ? 'bg-blue-500 text-white rounded-full mx-2 my-2 shadow-lg hover:bg-blue-600' 
                    : isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }
                  transition-colors duration-200
                `}
              >
                {isAction && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
                
                <Icon className={`w-6 h-6 ${isAction ? 'w-7 h-7' : ''}`} />
                <span className={`text-xs mt-1 ${isAction ? 'hidden' : ''}`}>
                  {item.label}
                </span>
                
                {isActive && !isAction && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
