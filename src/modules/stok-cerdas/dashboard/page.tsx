import React from 'react';
import { Home, Package, Minus, Scan, ShoppingCart, BarChart, Settings, User, Bell } from 'lucide-react';
import { formatCurrency, getStockStatus, generateStockAlerts, calculateInventoryValue } from '../utils';
import { INGREDIENT_CATEGORIES } from '../constants';
import type { Ingredient, NotificationData } from '../types';

// Mock data for demo
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Daging Sapi',
    category: { id: 'protein', name: 'Protein', color: 'bg-red-100 text-red-800', icon: '🥩' },
    currentStock: 5,
    unit: 'kg',
    minimumThreshold: 10,
    maximumThreshold: 50,
    costPerUnit: 120000,
    expiryDate: new Date('2025-09-05'),
  },
  {
    id: '2',
    name: 'Cabai Merah',
    category: { id: 'vegetables', name: 'Sayuran', color: 'bg-green-100 text-green-800', icon: '🥬' },
    currentStock: 15,
    unit: 'kg',
    minimumThreshold: 5,
    maximumThreshold: 25,
    costPerUnit: 25000,
    expiryDate: new Date('2025-09-10'),
  },
  {
    id: '3',
    name: 'Beras',
    category: { id: 'grains', name: 'Biji-bijian', color: 'bg-yellow-100 text-yellow-800', icon: '🌾' },
    currentStock: 100,
    unit: 'kg',
    minimumThreshold: 50,
    maximumThreshold: 200,
    costPerUnit: 15000,
  },
];

const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'low_stock',
    title: 'Stok Menipis',
    message: 'Daging Sapi hampir habis (5 kg tersisa)',
    timestamp: new Date(),
    read: false,
    ingredientId: '1',
    priority: 'high',
  },
  {
    id: '2',
    type: 'expiring_soon',
    title: 'Akan Kadaluarsa',
    message: 'Cabai Merah akan kadaluarsa dalam 8 hari',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    ingredientId: '2',
    priority: 'medium',
  },
];

export default function DashboardPage() {
  const totalValue = calculateInventoryValue(mockIngredients);
  const lowStockItems = mockIngredients.filter(item => {
    const status = getStockStatus(item);
    return status.status === 'low' || status.status === 'out';
  });
  const unreadNotifications = mockNotifications.filter(n => !n.read);

  const quickStats = [
    {
      title: 'Total Inventori',
      value: formatCurrency(totalValue),
      icon: Package,
      color: 'bg-primary-500',
      textColor: 'text-white',
    },
    {
      title: 'Stok Menipis',
      value: lowStockItems.length.toString(),
      icon: Bell,
      color: 'bg-red-500',
      textColor: 'text-white',
    },
    {
      title: 'Item Aktif',
      value: mockIngredients.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-white',
    },
  ];

  const quickActions = [
    { name: 'Catat Penggunaan', icon: Minus, path: '/stok-cerdas/add-usage', color: 'bg-orange-500' },
    { name: 'Scan Barcode', icon: Scan, path: '/stok-cerdas/barcode-scanner', color: 'bg-purple-500' },
    { name: 'Buat Pesanan', icon: ShoppingCart, path: '/stok-cerdas/create-order', color: 'bg-green-500' },
    { name: 'Lihat Laporan', icon: BarChart, path: '/stok-cerdas/reports', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Miku Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-center">
            <img 
              src="https://static.wikia.nocookie.net/vocaloid/images/e/e4/MIKU_SP.png/revision/latest/smart/width/250/height/250?cb=20241025033142"
              alt="Miku"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Selamat Datang di StokCerdas!</h2>
            <p className="text-gray-600">Kelola inventori restoran Anda dengan mudah dan efisien</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className={`${action.color} p-3 rounded-full mb-2`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {action.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stock Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Alert Stok</h3>
            </div>
            <div className="p-6">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada alert stok saat ini</p>
                  <p className="text-sm">Semua item dalam kondisi aman</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockItems.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.currentStock} {item.unit} tersisa
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded-full">
                          {status.status === 'out' ? 'Habis' : 'Menipis'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Restok Beras berhasil</p>
                    <p className="text-xs text-gray-600">50 kg ditambahkan • 2 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Penggunaan Cabai Merah</p>
                    <p className="text-xs text-gray-600">3 kg untuk memasak • 4 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Pesanan baru dibuat</p>
                    <p className="text-xs text-gray-600">Order #001 ke Supplier ABC • 6 jam lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 gap-1">
            <button className="flex flex-col items-center py-2 px-1 text-primary-600">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Beranda</span>
            </button>
            <button className="flex flex-col items-center py-2 px-1 text-gray-400">
              <Package className="w-5 h-5" />
              <span className="text-xs mt-1">Inventori</span>
            </button>
            <button className="flex flex-col items-center py-2 px-1 text-gray-400">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs mt-1">Pesanan</span>
            </button>
            <button className="flex flex-col items-center py-2 px-1 text-gray-400">
              <BarChart className="w-5 h-5" />
              <span className="text-xs mt-1">Laporan</span>
            </button>
            <button className="flex flex-col items-center py-2 px-1 text-gray-400">
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
