import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { mockIngredients, getStockStatus, isExpiringNearby, getCategoryIcon } from '@/utils/mockData';

export default function StockAlert() {
  const criticalItems = mockIngredients.filter(item => getStockStatus(item) === 'critical');
  const lowStockItems = mockIngredients.filter(item => getStockStatus(item) === 'low');
  const expiringItems = mockIngredients.filter(item => isExpiringNearby(item.expiryDate));

  if (criticalItems.length === 0 && lowStockItems.length === 0 && expiringItems.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="text-green-600">✅</div>
          <p className="text-sm text-green-800">Semua stok dalam kondisi baik!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Critical Stock Alerts */}
      {criticalItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-900">Stok Kritis</h4>
          </div>
          <div className="space-y-2">
            {criticalItems.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">Sisa: {item.currentStock} {item.unit}</p>
                  </div>
                </div>
                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">
                  Pesan Sekarang
                </button>
              </div>
            ))}
            {criticalItems.length > 3 && (
              <p className="text-xs text-red-600 text-center">
                +{criticalItems.length - 3} bahan lainnya butuh stok ulang segera
              </p>
            )}
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-900">Stok Rendah</h4>
          </div>
          <div className="space-y-2">
            {lowStockItems.slice(0, 2).map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">Sisa: {item.currentStock} {item.unit}</p>
                  </div>
                </div>
                <button className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-full">
                  Rencanakan
                </button>
              </div>
            ))}
            {lowStockItems.length > 2 && (
              <p className="text-xs text-yellow-600 text-center">
                +{lowStockItems.length - 2} bahan lainnya perlu diperhatikan
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expiring Items Alerts */}
      {expiringItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">Segera Kadaluarsa</h4>
          </div>
          <div className="space-y-2">
            {expiringItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      Kadaluarsa: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('id-ID') : 'N/A'}
                    </p>
                  </div>
                </div>
                <button className="text-xs bg-orange-600 text-white px-3 py-1 rounded-full">
                  Prioritaskan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
