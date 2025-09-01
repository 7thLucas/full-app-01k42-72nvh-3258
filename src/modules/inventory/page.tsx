import React, { useState } from 'react';
import { Search, Filter, Plus, ScanLine } from 'lucide-react';
import { mockIngredients, getStockStatus, getCategoryIcon, formatCurrency } from '@/utils/mockData';
import InventoryItem from './components/InventoryItem';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import BottomNavigation from '@/components/BottomNavigation';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter ingredients based on search and filters
  const filteredIngredients = mockIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    const matchesStatus = filterStatus === 'all' || getStockStatus(ingredient) === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats for filtered results
  const criticalCount = filteredIngredients.filter(item => getStockStatus(item) === 'critical').length;
  const lowStockCount = filteredIngredients.filter(item => getStockStatus(item) === 'low').length;
  const normalCount = filteredIngredients.filter(item => getStockStatus(item) === 'normal').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Inventori</h1>
              <p className="text-sm text-gray-600">{filteredIngredients.length} dari {mockIngredients.length} bahan</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <ScanLine className="w-5 h-5" />
              </button>
              <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-red-50 p-2 rounded-lg text-center">
              <p className="text-lg font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-red-600">Kritis</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg text-center">
              <p className="text-lg font-bold text-yellow-600">{lowStockCount}</p>
              <p className="text-xs text-yellow-600">Rendah</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <p className="text-lg font-bold text-green-600">{normalCount}</p>
              <p className="text-xs text-green-600">Normal</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Status Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Semua', color: 'gray' },
            { key: 'critical', label: 'Kritis', color: 'red' },
            { key: 'low', label: 'Rendah', color: 'yellow' },
            { key: 'normal', label: 'Normal', color: 'green' },
          ].map(status => (
            <button
              key={status.key}
              onClick={() => setFilterStatus(status.key)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                ${filterStatus === status.key 
                  ? `bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Inventory List */}
        <div className="space-y-3">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map(ingredient => (
              <InventoryItem 
                key={ingredient.id}
                ingredient={ingredient}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 mb-2">Tidak ada bahan ditemukan</p>
              <p className="text-sm text-gray-400">
                Coba ubah kata kunci pencarian atau filter
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterStatus('all');
                }}
                className="mt-4 text-sm text-blue-600 font-medium"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        {/* Add New Ingredient Button */}
        <div className="pt-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Tambah Bahan Baru</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="inventory" />
    </div>
  );
}
