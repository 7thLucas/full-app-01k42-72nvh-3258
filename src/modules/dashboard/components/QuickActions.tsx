import React from 'react';
import { ShoppingCart, Plus, BarChart3, Package } from 'lucide-react';

interface QuickActionsProps {
  criticalCount: number;
  lowStockCount: number;
  expiringCount: number;
}

export default function QuickActions({ criticalCount, lowStockCount, expiringCount }: QuickActionsProps) {
  const actions = [
    {
      id: 'emergency-restock',
      title: 'Stok Darurat',
      subtitle: `${criticalCount} item kritis`,
      icon: <ShoppingCart className="w-5 h-5" />,
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      urgent: criticalCount > 0
    },
    {
      id: 'add-usage',
      title: 'Catat Pemakaian',
      subtitle: 'Input penggunaan bahan',
      icon: <Plus className="w-5 h-5" />,
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      urgent: false
    },
    {
      id: 'check-inventory',
      title: 'Cek Inventori',
      subtitle: 'Lihat semua stok',
      icon: <Package className="w-5 h-5" />,
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      urgent: false
    },
    {
      id: 'view-reports',
      title: 'Laporan',
      subtitle: 'Analisis & trends',
      icon: <BarChart3 className="w-5 h-5" />,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      urgent: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => (
          <button
            key={action.id}
            className={`${action.bgColor} ${action.textColor} p-4 rounded-lg text-left relative overflow-hidden transition-transform active:scale-95`}
          >
            {/* Urgent indicator */}
            {action.urgent && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                {action.icon}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
              <p className="text-xs opacity-90">{action.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Additional Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <div className="text-lg mb-1">📱</div>
            <p className="text-xs text-gray-600">Scan Barcode</p>
          </button>
          
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <div className="text-lg mb-1">📋</div>
            <p className="text-xs text-gray-600">Buat PO</p>
          </button>
          
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <div className="text-lg mb-1">⚙️</div>
            <p className="text-xs text-gray-600">Pengaturan</p>
          </button>
        </div>
      </div>
    </div>
  );
}
