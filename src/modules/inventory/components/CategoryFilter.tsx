import React from 'react';
import { getCategoryIcon } from '@/utils/mockData';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { key: 'all', label: 'Semua', icon: '📦' },
  { key: 'protein', label: 'Protein', icon: '🥩' },
  { key: 'vegetable', label: 'Sayur', icon: '🥬' },
  { key: 'spice', label: 'Bumbu', icon: '🌶️' },
  { key: 'dairy', label: 'Susu', icon: '🥛' },
  { key: 'grain', label: 'Biji-bijian', icon: '🌾' },
  { key: 'condiment', label: 'Bumbu', icon: '🧂' },
  { key: 'beverage', label: 'Minuman', icon: '🥤' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map(category => (
        <button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
            ${selectedCategory === category.key 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}
