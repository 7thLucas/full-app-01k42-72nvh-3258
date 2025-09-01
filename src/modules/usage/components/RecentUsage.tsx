import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { UsageLog, mockIngredients, getCategoryIcon } from '@/utils/mockData';

interface RecentUsageProps {
  todayUsage: UsageLog[];
}

export default function RecentUsage({ todayUsage }: RecentUsageProps) {
  const getReasonIcon = (reason: string) => {
    const icons = {
      recipe: '🍳',
      waste: '🗑️',
      sold: '💰',
      expired: '⏰'
    };
    return icons[reason as keyof typeof icons] || '📝';
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      recipe: 'Resep',
      waste: 'Terbuang',
      sold: 'Terjual',
      expired: 'Kadaluarsa'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Riwayat Hari Ini</h3>
          </div>
          <span className="text-sm text-gray-500">{todayUsage.length} item</span>
        </div>
      </div>

      <div className="p-4">
        {todayUsage.length > 0 ? (
          <div className="space-y-4">
            {todayUsage.slice(0, 5).map(log => {
              const ingredient = mockIngredients.find(i => i.id === log.ingredientId);
              return (
                <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{getCategoryIcon(ingredient?.category || 'protein')}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {ingredient?.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {log.quantityUsed} {ingredient?.unit}
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center space-x-1">
                          <span>{getReasonIcon(log.reason)}</span>
                          <span className="text-sm text-gray-600">
                            {getReasonLabel(log.reason)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {todayUsage.length > 5 && (
              <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
                <span>Lihat {todayUsage.length - 5} lainnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500 mb-1">Belum ada pencatatan hari ini</p>
            <p className="text-sm text-gray-400">
              Mulai catat penggunaan bahan dengan tombol di atas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
