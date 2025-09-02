import React, { useState } from 'react';
import { ArrowLeft, Minus, Check, Search } from 'lucide-react';
import { UNITS, USAGE_REASONS } from '../constants';
import type { Ingredient, UsageReason } from '../types';

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
];

export default function AddUsagePage() {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<UsageReason>('cooking');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showIngredientList, setShowIngredientList] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredIngredients = mockIngredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowIngredientList(false);
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient || !quantity) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setSelectedIngredient(null);
    setQuantity('');
    setNotes('');
    setLoading(false);
    
    alert('Penggunaan berhasil dicatat!');
  };

  const isFormValid = selectedIngredient && quantity && parseFloat(quantity) > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Catat Penggunaan</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredient Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Bahan</h3>
            
            {selectedIngredient ? (
              <div className="flex items-center justify-between p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    {selectedIngredient.category.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedIngredient.name}</p>
                    <p className="text-sm text-gray-600">
                      Stok: {selectedIngredient.currentStock} {selectedIngredient.unit}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIngredient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari bahan..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowIngredientList(e.target.value.length > 0);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {showIngredientList && (
                  <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {filteredIngredients.length === 0 ? (
                      <p className="p-4 text-gray-500 text-center">Tidak ada bahan ditemukan</p>
                    ) : (
                      filteredIngredients.map((ingredient) => (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => handleSelectIngredient(ingredient)}
                          className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                              {ingredient.category.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{ingredient.name}</p>
                              <p className="text-sm text-gray-600">
                                {ingredient.currentStock} {ingredient.unit} tersedia
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity Input */}
          {selectedIngredient && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Jumlah Penggunaan</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satuan
                  </label>
                  <div className="px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    {selectedIngredient.unit}
                  </div>
                </div>
              </div>

              {quantity && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Sisa stok setelah penggunaan: {' '}
                    <span className="font-semibold">
                      {Math.max(0, selectedIngredient.currentStock - parseFloat(quantity))} {selectedIngredient.unit}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reason Selection */}
          {selectedIngredient && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alasan Penggunaan</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {USAGE_REASONS.map((reasonOption) => (
                  <button
                    key={reasonOption.id}
                    type="button"
                    onClick={() => setReason(reasonOption.id as UsageReason)}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors ${
                      reason === reasonOption.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{reasonOption.icon}</span>
                    <span className="font-medium">{reasonOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedIngredient && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Catatan (Opsional)</h3>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk penggunaan ini..."
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow p-6">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                isFormValid && !loading
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Catat Penggunaan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
