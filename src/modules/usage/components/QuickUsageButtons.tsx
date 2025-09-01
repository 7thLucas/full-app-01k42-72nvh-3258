import React from 'react';
import { mockIngredients, getCategoryIcon, getStockStatus } from '@/utils/mockData';

interface QuickUsageButtonsProps {
  onQuickUsage: (ingredientId: string) => void;
}

export default function QuickUsageButtons({ onQuickUsage }: QuickUsageButtonsProps) {
  // Get frequently used ingredients (for this demo, we'll use the first few)
  const frequentIngredients = mockIngredients
    .filter(ingredient => getStockStatus(ingredient) !== 'critical')
    .slice(0, 4);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Akses Cepat</h3>
      <div className="grid grid-cols-2 gap-3">
        {frequentIngredients.map(ingredient => (
          <button
            key={ingredient.id}
            onClick={() => onQuickUsage(ingredient.id)}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 p-3 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {getCategoryIcon(ingredient.category)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {ingredient.name}
                </p>
                <p className="text-xs text-gray-500">
                  Stok: {ingredient.currentStock} {ingredient.unit}
                </p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="mt-2 flex justify-end">
              <div className={`w-2 h-2 rounded-full ${
                getStockStatus(ingredient) === 'low' ? 'bg-yellow-400' :
                getStockStatus(ingredient) === 'critical' ? 'bg-red-400' :
                'bg-green-400'
              }`}></div>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Ketuk bahan untuk pencatatan cepat
      </p>
    </div>
  );
}
