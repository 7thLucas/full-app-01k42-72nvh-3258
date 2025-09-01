import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { mockIngredients, getCategoryIcon, formatCurrency } from '@/utils/mockData';

interface UsageFormProps {
  selectedIngredient: string;
  onClose: () => void;
}

export default function UsageForm({ selectedIngredient, onClose }: UsageFormProps) {
  const [ingredientId, setIngredientId] = useState(selectedIngredient);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<'recipe' | 'waste' | 'sold' | 'expired'>('recipe');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedIngredientData = mockIngredients.find(i => i.id === ingredientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredientId || !quantity) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (selectedIngredientData && quantityNum > selectedIngredientData.currentStock) {
      alert(`Jumlah melebihi stok tersedia (${selectedIngredientData.currentStock} ${selectedIngredientData.unit})`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically update the mock data or call an API
    alert('Penggunaan berhasil dicatat!');
    
    setIsSubmitting(false);
    onClose();
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      recipe: 'Resep/Memasak',
      waste: 'Terbuang',
      sold: 'Terjual',
      expired: 'Kadaluarsa'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  const getEstimatedValue = () => {
    if (!selectedIngredientData || !quantity) return 0;
    return parseFloat(quantity) * selectedIngredientData.costPerUnit;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Catat Penggunaan</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Ingredient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Bahan <span className="text-red-500">*</span>
            </label>
            <select
              value={ingredientId}
              onChange={(e) => setIngredientId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Pilih Bahan --</option>
              {mockIngredients.map(ingredient => (
                <option key={ingredient.id} value={ingredient.id}>
                  {getCategoryIcon(ingredient.category)} {ingredient.name} (Stok: {ingredient.currentStock} {ingredient.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Ingredient Info */}
          {selectedIngredientData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getCategoryIcon(selectedIngredientData.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedIngredientData.name}</h3>
                  <p className="text-sm text-gray-600">
                    Stok tersedia: {selectedIngredientData.currentStock} {selectedIngredientData.unit}
                  </p>
                </div>
              </div>
              
              {selectedIngredientData.currentStock <= selectedIngredientData.minThreshold && (
                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-2 rounded">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">Stok rendah! Pertimbangkan untuk restok.</span>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Digunakan <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                step="0.1"
                min="0"
                max={selectedIngredientData?.currentStock}
                required
              />
              <div className="flex items-center px-3 bg-gray-50 border border-gray-300 rounded-lg">
                <span className="text-gray-600">
                  {selectedIngredientData?.unit || 'unit'}
                </span>
              </div>
            </div>
            {quantity && selectedIngredientData && (
              <p className="mt-1 text-sm text-gray-600">
                Estimasi nilai: {formatCurrency(getEstimatedValue())}
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Penggunaan <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="recipe">🍳 Resep/Memasak</option>
              <option value="waste">🗑️ Terbuang/Rusak</option>
              <option value="sold">💰 Terjual Langsung</option>
              <option value="expired">⏰ Kadaluarsa</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              placeholder="Contoh: Menu rendang untuk 20 porsi, meja 5-8..."
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">{notes.length}/200 karakter</p>
          </div>

          {/* Summary */}
          {quantity && selectedIngredientData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Ringkasan</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>Bahan: {selectedIngredientData.name}</p>
                <p>Jumlah: {quantity} {selectedIngredientData.unit}</p>
                <p>Alasan: {getReasonLabel(reason)}</p>
                <p>Nilai: {formatCurrency(getEstimatedValue())}</p>
                <p>Sisa stok: {(selectedIngredientData.currentStock - parseFloat(quantity || '0')).toFixed(1)} {selectedIngredientData.unit}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !ingredientId || !quantity}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
