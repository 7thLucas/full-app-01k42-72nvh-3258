import React from 'react';
import { AlertTriangle, TrendingUp, Package, ShoppingCart, Clock } from 'lucide-react';
import { mockIngredients, mockUsageLogs, getStockStatus, isExpiringNearby, formatCurrency, getCategoryIcon } from '@/utils/mockData';
import StockAlert from './components/StockAlert';
import UsageSummary from './components/UsageSummary';
import QuickActions from './components/QuickActions';
import BottomNavigation from '@/components/BottomNavigation';

export default function DashboardPage() {
  // Calculate dashboard metrics
  const criticalItems = mockIngredients.filter(item => getStockStatus(item) === 'critical').length;
  const lowStockItems = mockIngredients.filter(item => getStockStatus(item) === 'low').length;
  const expiringItems = mockIngredients.filter(item => isExpiringNearby(item.expiryDate)).length;
  const totalInventoryValue = mockIngredients.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0);
  
  // Today's usage summary
  const today = new Date().toISOString().split('T')[0];
  const todayUsage = mockUsageLogs.filter(log => log.timestamp.startsWith(today));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Restoran Nusantara</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Hari ini</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{criticalItems + lowStockItems}</p>
                <p className="text-xs text-gray-600">Stok Rendah</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringItems}</p>
                <p className="text-xs text-gray-600">Segera Kadaluarsa</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockIngredients.length}</p>
                <p className="text-xs text-gray-600">Total Bahan</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInventoryValue).replace('Rp', '').replace(',00', '').trim()}K</p>
                <p className="text-xs text-gray-600">Nilai Inventori</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <StockAlert />

        {/* Usage Summary */}
        <UsageSummary todayUsage={todayUsage} />

        {/* Quick Actions */}
        <QuickActions 
          criticalCount={criticalItems}
          lowStockCount={lowStockItems}
          expiringCount={expiringItems}
        />

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Aktivitas Terbaru</h3>
          </div>
          <div className="p-4 space-y-3">
            {mockUsageLogs.slice(0, 3).map((log, index) => {
              const ingredient = mockIngredients.find(i => i.id === log.ingredientId);
              return (
                <div key={log.id} className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(ingredient?.category || 'protein')}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ingredient?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Digunakan {log.quantityUsed} {ingredient?.unit} • {log.notes}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              );
            })}
            <button className="w-full text-center text-sm text-blue-600 font-medium py-2 hover:bg-gray-50 rounded">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="dashboard" />
    </div>
  );
}
