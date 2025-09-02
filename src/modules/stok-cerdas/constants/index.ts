// StokCerdas Constants
export const INGREDIENT_CATEGORIES = [
  { id: 'protein', name: 'Protein', color: 'bg-red-100 text-red-800', icon: '🥩' },
  { id: 'vegetables', name: 'Sayuran', color: 'bg-green-100 text-green-800', icon: '🥬' },
  { id: 'fruits', name: 'Buah-buahan', color: 'bg-orange-100 text-orange-800', icon: '🍎' },
  { id: 'grains', name: 'Biji-bijian', color: 'bg-yellow-100 text-yellow-800', icon: '🌾' },
  { id: 'dairy', name: 'Susu & Olahan', color: 'bg-blue-100 text-blue-800', icon: '🥛' },
  { id: 'spices', name: 'Rempah & Bumbu', color: 'bg-purple-100 text-purple-800', icon: '🌶️' },
  { id: 'oils', name: 'Minyak & Lemak', color: 'bg-amber-100 text-amber-800', icon: '🫒' },
  { id: 'beverages', name: 'Minuman', color: 'bg-cyan-100 text-cyan-800', icon: '🥤' },
  { id: 'frozen', name: 'Beku', color: 'bg-indigo-100 text-indigo-800', icon: '🧊' },
  { id: 'others', name: 'Lainnya', color: 'bg-gray-100 text-gray-800', icon: '📦' },
];

export const UNITS = [
  'kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'bottle', 'can', 'box', 'sachet'
];

export const USAGE_REASONS = [
  { id: 'cooking', label: 'Memasak', icon: '👨‍🍳' },
  { id: 'waste', label: 'Terbuang', icon: '🗑️' },
  { id: 'expired', label: 'Kadaluarsa', icon: '⚠️' },
  { id: 'damaged', label: 'Rusak', icon: '💥' },
  { id: 'recipe', label: 'Resep', icon: '📋' },
];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'confirmed', label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800' },
  { id: 'shipped', label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  { id: 'delivered', label: 'Diterima', color: 'bg-green-100 text-green-800' },
  { id: 'cancelled', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
];

export const NOTIFICATION_TYPES = [
  { id: 'low_stock', label: 'Stok Menipis', color: 'text-warning-600', icon: '📉' },
  { id: 'expired', label: 'Kadaluarsa', color: 'text-danger-600', icon: '⚠️' },
  { id: 'expiring_soon', label: 'Akan Kadaluarsa', color: 'text-warning-600', icon: '⏰' },
  { id: 'order_delivered', label: 'Pesanan Diterima', color: 'text-success-600', icon: '📦' },
  { id: 'system', label: 'Sistem', color: 'text-info-600', icon: 'ℹ️' },
];

export const USER_ROLES = [
  { id: 'admin', label: 'Admin', permissions: ['all'] },
  { id: 'manager', label: 'Manager', permissions: ['read', 'write', 'approve'] },
  { id: 'staff', label: 'Staff', permissions: ['read', 'write'] },
];

export const STOCK_ALERT_THRESHOLDS = {
  LOW_STOCK: 0.2, // 20% of minimum threshold
  EXPIRY_WARNING: 3, // 3 days before expiry
  OVERSTOCK: 1.5, // 150% of maximum threshold
};

export const REPORT_PERIODS = [
  { id: 'today', label: 'Hari Ini', days: 1 },
  { id: 'week', label: 'Minggu Ini', days: 7 },
  { id: 'month', label: 'Bulan Ini', days: 30 },
  { id: 'quarter', label: 'Kuartal Ini', days: 90 },
  { id: 'year', label: 'Tahun Ini', days: 365 },
];

export const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: 'currency' as const,
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export const DATE_FORMAT = 'dd MMM yyyy';
export const DATETIME_FORMAT = 'dd MMM yyyy HH:mm';
