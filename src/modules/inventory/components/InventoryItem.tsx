import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Ingredient, getStockStatus, isExpiringNearby, getCategoryIcon, formatCurrency } from '@/utils/mockData';

interface InventoryItemProps {
  ingredient: Ingredient;
}

export default function InventoryItem({ ingredient }: InventoryItemProps) {
  const status = getStockStatus(ingredient);
  const isExpiring = isExpiringNearby(ingredient.expiryDate);
  
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'low':
        return 'border-yellow-200 bg-yellow-50';
      case 'overstocked':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'critical':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'low':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'overstocked':
        return <div className="w-3 h-3 bg-orange-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
    }
  };

  const getStockPercentage = () => {
    return Math.min((ingredient.currentStock / ingredient.maxCapacity) * 100, 100);
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(ingredient.category)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
            <p className="text-xs text-gray-500">{ingredient.supplierInfo}</p>
          </div>
        </div>
        <div className="text-right">
          {getStatusIndicator()}
        </div>
      </div>

      {/* Stock Info */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">Stok Saat Ini</span>
          <span className="font-medium text-gray-900">
            {ingredient.currentStock} {ingredient.unit}
          </span>
        </div>
        
        {/* Stock Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              status === 'critical' ? 'bg-red-500' :
              status === 'low' ? 'bg-yellow-500' :
              status === 'overstocked' ? 'bg-orange-500' :
              'bg-green-500'
            }`}
            style={{ width: `${getStockPercentage()}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Min: {ingredient.minThreshold} {ingredient.unit}</span>
          <span>Max: {ingredient.maxCapacity} {ingredient.unit}</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {status === 'critical' && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Stok kritis! Perlu restok segera</span>
          </div>
        )}
        
        {status === 'low' && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Stok rendah, pertimbangkan restok</span>
          </div>
        )}
        
        {isExpiring && (
          <div className="flex items-center space-x-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs">
              Akan kadaluarsa: {ingredient.expiryDate ? new Date(ingredient.expiryDate).toLocaleDateString('id-ID') : ''}
            </span>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
        <div>
          <span className="font-medium">Harga: </span>
          {formatCurrency(ingredient.costPerUnit)}/{ingredient.unit}
        </div>
        <div>
          <span className="font-medium">Nilai: </span>
          {formatCurrency(ingredient.currentStock * ingredient.costPerUnit)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex space-x-2">
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors">
          Edit
        </button>
        {(status === 'critical' || status === 'low') && (
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
            Pesan Ulang
          </button>
        )}
        <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded text-sm font-medium transition-colors">
          + Stok
        </button>
      </div>
    </div>
  );
}
