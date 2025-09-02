// StokCerdas Utility Functions
import { STOCK_ALERT_THRESHOLDS, CURRENCY_FORMAT, DATE_FORMAT } from '../constants';
import type { Ingredient, StockAlert } from '../types';

/**
 * Format currency in IDR format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', CURRENCY_FORMAT).format(amount);
};

/**
 * Format date in Indonesian format
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Format datetime in Indonesian format
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Get relative time (e.g., "2 hari lalu")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} hari lalu`;
  } else if (diffHours > 0) {
    return `${diffHours} jam lalu`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} menit lalu`;
  } else {
    return 'Baru saja';
  }
};

/**
 * Calculate stock status
 */
export const getStockStatus = (ingredient: Ingredient): {
  status: 'low' | 'normal' | 'high' | 'out';
  percentage: number;
  color: string;
} => {
  const { currentStock, minimumThreshold, maximumThreshold } = ingredient;
  
  if (currentStock <= 0) {
    return { status: 'out', percentage: 0, color: 'text-red-600' };
  }
  
  if (currentStock <= minimumThreshold * STOCK_ALERT_THRESHOLDS.LOW_STOCK) {
    return { 
      status: 'low', 
      percentage: (currentStock / minimumThreshold) * 100,
      color: 'text-red-600' 
    };
  }
  
  if (currentStock >= maximumThreshold * STOCK_ALERT_THRESHOLDS.OVERSTOCK) {
    return { 
      status: 'high', 
      percentage: 100,
      color: 'text-orange-600' 
    };
  }
  
  return { 
    status: 'normal', 
    percentage: (currentStock / maximumThreshold) * 100,
    color: 'text-green-600' 
  };
};

/**
 * Check if ingredient is expiring soon
 */
export const isExpiringSoon = (expiryDate?: Date): boolean => {
  if (!expiryDate) return false;
  
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays <= STOCK_ALERT_THRESHOLDS.EXPIRY_WARNING && diffDays > 0;
};

/**
 * Check if ingredient is expired
 */
export const isExpired = (expiryDate?: Date): boolean => {
  if (!expiryDate) return false;
  return expiryDate < new Date();
};

/**
 * Generate stock alerts for an ingredient
 */
export const generateStockAlerts = (ingredient: Ingredient): StockAlert[] => {
  const alerts: StockAlert[] = [];
  const stockStatus = getStockStatus(ingredient);
  
  // Low stock alert
  if (stockStatus.status === 'low') {
    alerts.push({
      ingredientId: ingredient.id,
      type: 'low_stock',
      severity: 'warning',
      message: `Stok ${ingredient.name} hampir habis (${ingredient.currentStock} ${ingredient.unit})`
    });
  }
  
  // Out of stock alert
  if (stockStatus.status === 'out') {
    alerts.push({
      ingredientId: ingredient.id,
      type: 'low_stock',
      severity: 'danger',
      message: `Stok ${ingredient.name} habis`
    });
  }
  
  // Overstock alert
  if (stockStatus.status === 'high') {
    alerts.push({
      ingredientId: ingredient.id,
      type: 'overstock',
      severity: 'warning',
      message: `Stok ${ingredient.name} berlebihan (${ingredient.currentStock} ${ingredient.unit})`
    });
  }
  
  // Expiry alerts
  if (ingredient.expiryDate) {
    if (isExpired(ingredient.expiryDate)) {
      alerts.push({
        ingredientId: ingredient.id,
        type: 'expired',
        severity: 'danger',
        message: `${ingredient.name} sudah kadaluarsa sejak ${formatDate(ingredient.expiryDate)}`
      });
    } else if (isExpiringSoon(ingredient.expiryDate)) {
      const daysUntilExpiry = Math.ceil(
        (ingredient.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      alerts.push({
        ingredientId: ingredient.id,
        type: 'expiring_soon',
        severity: 'warning',
        message: `${ingredient.name} akan kadaluarsa dalam ${daysUntilExpiry} hari`
      });
    }
  }
  
  return alerts;
};

/**
 * Calculate inventory value
 */
export const calculateInventoryValue = (ingredients: Ingredient[]): number => {
  return ingredients.reduce((total, ingredient) => {
    return total + (ingredient.currentStock * ingredient.costPerUnit);
  }, 0);
};

/**
 * Get stock level color class
 */
export const getStockLevelColor = (percentage: number): string => {
  if (percentage <= 20) return 'bg-red-500';
  if (percentage <= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Generate order suggestions based on usage patterns
 */
export const generateOrderSuggestions = (
  ingredients: Ingredient[],
  avgDailyUsage: Record<string, number>
): Array<{ ingredient: Ingredient; suggestedQuantity: number; urgency: 'low' | 'medium' | 'high' }> => {
  return ingredients
    .filter(ingredient => {
      const stockStatus = getStockStatus(ingredient);
      return stockStatus.status === 'low' || stockStatus.status === 'out';
    })
    .map(ingredient => {
      const dailyUsage = avgDailyUsage[ingredient.id] || 0;
      const daysUntilEmpty = dailyUsage > 0 ? ingredient.currentStock / dailyUsage : Infinity;
      const suggestedQuantity = Math.max(
        ingredient.maximumThreshold - ingredient.currentStock,
        dailyUsage * 7 // At least 1 week supply
      );
      
      let urgency: 'low' | 'medium' | 'high' = 'low';
      if (daysUntilEmpty <= 1) urgency = 'high';
      else if (daysUntilEmpty <= 3) urgency = 'medium';
      
      return {
        ingredient,
        suggestedQuantity: Math.ceil(suggestedQuantity),
        urgency
      };
    })
    .sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
};

/**
 * Validate barcode format
 */
export const isValidBarcode = (barcode: string): boolean => {
  // Simple validation - can be enhanced based on specific barcode standards
  const cleanBarcode = barcode.replace(/\D/g, '');
  return cleanBarcode.length >= 8 && cleanBarcode.length <= 13;
};

/**
 * Search and filter ingredients
 */
export const filterIngredients = (
  ingredients: Ingredient[],
  searchTerm: string,
  categoryFilter?: string,
  statusFilter?: 'low' | 'normal' | 'high' | 'out'
): Ingredient[] => {
  return ingredients.filter(ingredient => {
    const matchesSearch = !searchTerm || 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || ingredient.category.id === categoryFilter;
    
    const matchesStatus = !statusFilter || getStockStatus(ingredient).status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};
