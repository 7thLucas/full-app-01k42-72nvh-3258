import React, { useState } from 'react';
import { Package, Search, Filter, ChevronRight, Home, ShoppingCart, BarChart, Settings, AlertTriangle } from 'lucide-react';
import { getStockStatus, formatCurrency, filterIngredients } from '../utils';
import { INGREDIENT_CATEGORIES } from '../constants';
import type { Ingredient } from '../types';

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
  {
    id: '4',
    name: 'Minyak Goreng',
    category: { id: 'oils', name: 'Minyak & Lemak', color: 'bg-amber-100 text-amber-800', icon: '🫒' },
    currentStock: 20,
    unit: 'liter',
    minimumThreshold: 10,
    maximumThreshold: 40,
    costPerUnit: 18000,
  },
  {
    id: '5',
    name: 'Garam',
    category: { id: 'spices', name: 'Rempah & Bumbu', color: 'bg-purple-100 text-purple-800', icon: '🌶️' },
    currentStock: 0,
    unit: 'kg',
    minimumThreshold: 5,
    maximumThreshold: 15,
    costPerUnit: 8000,
  },
];

export default function InventoryListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredIngredients = filterIngredients(
    mockIngredients,
    searchTerm,
    selectedCategory,
    selectedStatus as any
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'out':
        return 'Habis';
      case 'low':
        return 'Menipis';
      case 'high':
        return 'Berlebih';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Inventori</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari bahan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="pb-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Semua Kategori</option>
                    {INGREDIENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="out">Habis</option>
                    <option value="low">Menipis</option>
                    <option value="normal">Normal</option>
                    <option value="high">Berlebih</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{mockIngredients.length}</p>
            <p className="text-sm text-gray-600">Total Item</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {mockIngredients.filter(item => {
                const status = getStockStatus(item);
                return status.status === 'low' || status.status === 'out';
              }).length}
            </p>
            <p className="text-sm text-gray-600">Perlu Restok</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockIngredients.filter(item => getStockStatus(item).status === 'normal').length}
            </p>
            <p className="text-sm text-gray-600">Status Normal</p>
          </div>
        </div>

        {/* Ingredient List */}
        <div className="space-y-3">
          {filteredIngredients.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Tidak ada bahan ditemukan</p>
              <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
            </div>
          ) : (
            filteredIngredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient);
              
              return (
                <div key={ingredient.id} className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Category Icon */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          {ingredient.category.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                            {stockStatus.status === 'out' && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {ingredient.currentStock} {ingredient.unit} tersedia
                          </p>
                          
                          {/* Stock Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                stockStatus.status === 'out' 
                                  ? 'bg-red-500' 
                                  : stockStatus.status === 'low'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(stockStatus.percentage, 100)}%` }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ingredient.category.color}`}>
                              {ingredient.category.name}
                            </span>
                            
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(stockStatus.status)}`}>
                              {getStatusLabel(stockStatus.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Harga per {ingredient.unit}:</span>
                          <span className="ml-1 font-medium">{formatCurrency(ingredient.costPerUnit)}</span>
                        </div>
                        {ingredient.expiryDate && (
                          <div>
                            <span className="text-gray-500">Kadaluarsa:</span>
                            <span className="ml-1 font-medium">
                              {new Date(ingredient.expiryDate).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 gap-1">
            <button className="flex flex-col items-center py-2 px-1 text-gray-400">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Beranda</span>
            </button>
            <button className="flex flex-col items-center py-2 px-1 text-primary-600">
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
