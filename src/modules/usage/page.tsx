import React, { useState } from 'react';
import { Plus, Save, ScanLine, Clock } from 'lucide-react';
import { mockIngredients, mockUsageLogs, getCategoryIcon, formatDate } from '@/utils/mockData';
import UsageForm from './components/UsageForm';
import RecentUsage from './components/RecentUsage';
import QuickUsageButtons from './components/QuickUsageButtons';
import BottomNavigation from '@/components/BottomNavigation';

export default function UsagePage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  // Get today's usage
  const today = new Date().toISOString().split('T')[0];
  const todayUsage = mockUsageLogs.filter(log => log.timestamp.startsWith(today));
  
  // Calculate today's stats
  const totalItemsUsed = todayUsage.length;
  const totalValue = todayUsage.reduce((sum, log) => {
    const ingredient = mockIngredients.find(i => i.id === log.ingredientId);
    return sum + (ingredient ? log.quantityUsed * ingredient.costPerUnit : 0);
  }, 0);

  const handleQuickUsage = (ingredientId: string) => {
    setSelectedIngredient(ingredientId);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Catat Penggunaan</h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <ScanLine className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">{totalItemsUsed}</p>
              <p className="text-xs text-blue-600">Item Digunakan</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(totalValue).replace('Rp', '').trim()}K
              </p>
              <p className="text-xs text-green-600">Nilai</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-purple-600">Terakhir</p>
              </div>
              <p className="text-xs text-purple-600 font-medium mt-1">
                {todayUsage.length > 0 
                  ? new Date(todayUsage[0].timestamp).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : 'Belum ada'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Usage Buttons */}
        <QuickUsageButtons onQuickUsage={handleQuickUsage} />

        {/* Main Add Usage Button */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all transform active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span>Catat Penggunaan Bahan</span>
          </button>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
              <ScanLine className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>
            
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
              <Save className="w-4 h-4" />
              <span>Template</span>
            </button>
          </div>
        </div>

        {/* Recent Usage */}
        <RecentUsage todayUsage={todayUsage} />

        {/* Usage Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Tips Pencatatan</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Catat penggunaan segera setelah memasak</li>
            <li>• Gunakan fitur scan barcode untuk efisiensi</li>
            <li>• Tambahkan catatan untuk referensi menu</li>
            <li>• Cek stok tersisa setelah penggunaan</li>
          </ul>
        </div>
      </div>

      {/* Usage Form Modal */}
      {showForm && (
        <UsageForm 
          selectedIngredient={selectedIngredient}
          onClose={() => {
            setShowForm(false);
            setSelectedIngredient('');
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="usage" />
    </div>
  );
}
