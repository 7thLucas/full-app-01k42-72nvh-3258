import React from 'react';
import { ArrowLeft, Edit, Trash2, Plus, AlertTriangle, Calendar, DollarSign, Package } from 'lucide-react';
import { getStockStatus, formatCurrency, formatDate, isExpired, isExpiringSoon } from '../utils';
import type { Ingredient, UsageRecord } from '../types';

// Mock data for demo
const mockIngredient: Ingredient = {
  id: '1',
  name: 'Daging Sapi',
  category: { id: 'protein', name: 'Protein', color: 'bg-red-100 text-red-800', icon: '🥩' },
  currentStock: 5,
  unit: 'kg',
  minimumThreshold: 10,
  maximumThreshold: 50,
  costPerUnit: 120000,
  expiryDate: new Date('2025-09-05'),
  description: 'Daging sapi segar berkualitas premium untuk masakan restoran',
  barcode: '1234567890123',
  supplier: {
    id: '1',
    name: 'Supplier ABC',
    contactPerson: 'John Doe',
    phone: '+6281234567890',
    email: 'supplier@abc.com',
  }
};

const mockUsageHistory: UsageRecord[] = [
  {
    id: '1',
    ingredientId: '1',
    quantity: 2,
    usedDate: new Date('2025-09-01'),
    reason: 'cooking',
    userId: 'user1',
    notes: 'Untuk masakan soto betawi',
  },
  {
    id: '2',
    ingredientId: '1',
    quantity: 1.5,
    usedDate: new Date('2025-08-31'),
    reason: 'cooking',
    userId: 'user1',
    notes: 'Untuk masakan rendang',
  },
];

export default function IngredientDetailPage() {
  const stockStatus = getStockStatus(mockIngredient);
  const totalValue = mockIngredient.currentStock * mockIngredient.costPerUnit;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Detail Bahan</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 text-red-600 hover:text-red-800">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* Category Icon */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                {mockIngredient.category.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{mockIngredient.name}</h2>
                  {stockStatus.status === 'out' && (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{mockIngredient.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kategori:</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mockIngredient.category.color}`}>
                      {mockIngredient.category.name}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Barcode:</span>
                    <span className="ml-2 text-sm text-gray-900 font-mono">{mockIngredient.barcode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stok Saat Ini</h3>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {mockIngredient.currentStock} {mockIngredient.unit}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  stockStatus.status === 'out' 
                    ? 'bg-red-500' 
                    : stockStatus.status === 'low'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(stockStatus.percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Min: {mockIngredient.minimumThreshold} {mockIngredient.unit} | 
              Max: {mockIngredient.maximumThreshold} {mockIngredient.unit}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nilai Inventori</h3>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(totalValue)}
            </p>
            <p className="text-sm text-gray-600">
              Harga per {mockIngredient.unit}: {formatCurrency(mockIngredient.costPerUnit)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Kadaluarsa</h3>
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            {mockIngredient.expiryDate ? (
              <>
                <p className={`text-3xl font-bold mb-2 ${
                  isExpired(mockIngredient.expiryDate) 
                    ? 'text-red-600' 
                    : isExpiringSoon(mockIngredient.expiryDate)
                    ? 'text-yellow-600'
                    : 'text-gray-900'
                }`}>
                  {formatDate(mockIngredient.expiryDate)}
                </p>
                {isExpired(mockIngredient.expiryDate) && (
                  <p className="text-sm text-red-600 font-medium">Sudah kadaluarsa</p>
                )}
                {isExpiringSoon(mockIngredient.expiryDate) && !isExpired(mockIngredient.expiryDate) && (
                  <p className="text-sm text-yellow-600 font-medium">Akan kadaluarsa</p>
                )}
              </>
            ) : (
              <p className="text-lg text-gray-500">Tidak ada tanggal kadaluarsa</p>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        {mockIngredient.supplier && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Supplier</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nama:</span>
                  <p className="text-sm text-gray-900">{mockIngredient.supplier.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Kontak:</span>
                  <p className="text-sm text-gray-900">{mockIngredient.supplier.contactPerson}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Telepon:</span>
                  <p className="text-sm text-gray-900">{mockIngredient.supplier.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{mockIngredient.supplier.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Riwayat Penggunaan</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" />
              <span>Catat Penggunaan</span>
            </button>
          </div>
          <div className="p-6">
            {mockUsageHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada riwayat penggunaan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockUsageHistory.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {usage.quantity} {mockIngredient.unit} digunakan
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(usage.usedDate)} • {usage.notes}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Memasak
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
