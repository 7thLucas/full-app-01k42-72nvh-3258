import React from 'react';
import { BarChart3, TrendingDown } from 'lucide-react';
import { UsageLog, mockIngredients, getCategoryIcon } from '@/utils/mockData';

interface UsageSummaryProps {
  todayUsage: UsageLog[];
}

export default function UsageSummary({ todayUsage }: UsageSummaryProps) {
  // Calculate total usage value for today
  const totalUsageValue = todayUsage.reduce((total, log) => {
    const ingredient = mockIngredients.find(i => i.id === log.ingredientId);
    return total + (ingredient ? log.quantityUsed * ingredient.costPerUnit : 0);
  }, 0);

  // Get most used ingredients
  const usageByIngredient = todayUsage.reduce((acc, log) => {
    if (!acc[log.ingredientId]) {
      acc[log.ingredientId] = 0;
    }
    acc[log.ingredientId] += log.quantityUsed;
    return acc;
  }, {} as Record<string, number>);

  const topUsedIngredients = Object.entries(usageByIngredient)
    .map(([ingredientId, quantity]) => ({
      ingredient: mockIngredients.find(i => i.id === ingredientId),
      quantity
    }))
    .filter(item => item.ingredient)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Penggunaan Hari Ini</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Total Digunakan</span>
            </div>
            <p className="text-lg font-bold text-blue-900 mt-1">{todayUsage.length} item</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-green-600 font-medium">💰 Nilai</span>
            </div>
            <p className="text-lg font-bold text-green-900 mt-1">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(totalUsageValue)}
            </p>
          </div>
        </div>

        {/* Top Used Ingredients */}
        {topUsedIngredients.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Paling Banyak Digunakan</h4>
            <div className="space-y-2">
              {topUsedIngredients.map(({ ingredient, quantity }) => (
                <div key={ingredient!.id} className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(ingredient!.category)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{ingredient!.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((quantity / ingredient!.maxCapacity) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{quantity} {ingredient!.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Usage Today */}
        {todayUsage.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-gray-500">Belum ada penggunaan bahan hari ini</p>
            <button className="text-sm text-blue-600 font-medium mt-2">
              Catat Penggunaan
            </button>
          </div>
        )}

        {/* Quick Usage Entry */}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
            <span>📝</span>
            <span>Catat Penggunaan Bahan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
