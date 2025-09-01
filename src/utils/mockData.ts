// Mock data for the restaurant inventory management system
export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'spice' | 'dairy' | 'grain' | 'condiment' | 'beverage';
  currentStock: number;
  unit: 'kg' | 'pcs' | 'L' | 'bottle' | 'pack';
  minThreshold: number;
  maxCapacity: number;
  costPerUnit: number;
  supplierInfo: string;
  expiryDate?: string;
  lastUpdated: string;
}

export interface UsageLog {
  id: string;
  ingredientId: string;
  quantityUsed: number;
  timestamp: string;
  userId: string;
  reason: 'recipe' | 'waste' | 'sold' | 'expired';
  notes?: string;
}

export interface RestockOrder {
  id: string;
  supplierId: string;
  items: { ingredientId: string; quantity: number; unitCost: number }[];
  orderDate: string;
  deliveryDate?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  totalCost: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  specialties: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'manager' | 'staff' | 'chef';
  permissions: string[];
  restaurantBranch: string;
}

// Mock ingredients data
export const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Daging Sapi',
    category: 'protein',
    currentStock: 5.2,
    unit: 'kg',
    minThreshold: 3.0,
    maxCapacity: 20.0,
    costPerUnit: 120000,
    supplierInfo: 'CV Sumber Protein',
    expiryDate: '2024-09-05',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '2',
    name: 'Ayam Fillet',
    category: 'protein',
    currentStock: 0.8,
    unit: 'kg',
    minThreshold: 2.0,
    maxCapacity: 15.0,
    costPerUnit: 65000,
    supplierInfo: 'UD Ayam Segar',
    expiryDate: '2024-09-03',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '3',
    name: 'Bawang Merah',
    category: 'vegetable',
    currentStock: 3.5,
    unit: 'kg',
    minThreshold: 2.0,
    maxCapacity: 10.0,
    costPerUnit: 25000,
    supplierInfo: 'Pasar Induk Sayur',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '4',
    name: 'Beras Premium',
    category: 'grain',
    currentStock: 25.0,
    unit: 'kg',
    minThreshold: 10.0,
    maxCapacity: 50.0,
    costPerUnit: 15000,
    supplierInfo: 'Toko Beras Sejahtera',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '5',
    name: 'Minyak Goreng',
    category: 'condiment',
    currentStock: 12.0,
    unit: 'L',
    minThreshold: 5.0,
    maxCapacity: 30.0,
    costPerUnit: 18000,
    supplierInfo: 'CV Minyak Berkah',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '6',
    name: 'Santan Kelapa',
    category: 'dairy',
    currentStock: 8.0,
    unit: 'L',
    minThreshold: 4.0,
    maxCapacity: 20.0,
    costPerUnit: 8000,
    supplierInfo: 'Kelapa Sari',
    expiryDate: '2024-09-10',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '7',
    name: 'Cabai Merah',
    category: 'spice',
    currentStock: 1.2,
    unit: 'kg',
    minThreshold: 2.0,
    maxCapacity: 8.0,
    costPerUnit: 45000,
    supplierInfo: 'Pasar Induk Sayur',
    lastUpdated: '2024-09-01T08:30:00Z'
  },
  {
    id: '8',
    name: 'Garam Dapur',
    category: 'spice',
    currentStock: 4.5,
    unit: 'kg',
    minThreshold: 1.0,
    maxCapacity: 10.0,
    costPerUnit: 5000,
    supplierInfo: 'Toko Bumbu',
    lastUpdated: '2024-09-01T08:30:00Z'
  }
];

// Mock usage logs
export const mockUsageLogs: UsageLog[] = [
  {
    id: '1',
    ingredientId: '1',
    quantityUsed: 2.5,
    timestamp: '2024-09-01T12:30:00Z',
    userId: 'chef1',
    reason: 'recipe',
    notes: 'Rendang untuk 20 porsi'
  },
  {
    id: '2',
    ingredientId: '2',
    quantityUsed: 1.5,
    timestamp: '2024-09-01T11:15:00Z',
    userId: 'chef1',
    reason: 'recipe',
    notes: 'Ayam geprek 15 porsi'
  },
  {
    id: '3',
    ingredientId: '3',
    quantityUsed: 0.8,
    timestamp: '2024-09-01T10:45:00Z',
    userId: 'staff1',
    reason: 'recipe',
    notes: 'Bumbu base'
  }
];

// Mock suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'CV Sumber Protein',
    contact: 'Bapak Joko',
    email: 'joko@sumberprotein.co.id',
    phone: '+62812-3456-7890',
    address: 'Jl. Raya Bogor No. 123, Jakarta',
    rating: 4.8,
    specialties: ['daging sapi', 'daging kambing', 'seafood']
  },
  {
    id: '2',
    name: 'UD Ayam Segar',
    contact: 'Ibu Sari',
    email: 'sari@ayamsegar.com',
    phone: '+62813-9876-5432',
    address: 'Jl. Pasar Unggas No. 45, Tangerang',
    rating: 4.5,
    specialties: ['ayam potong', 'ayam fillet', 'telur']
  },
  {
    id: '3',
    name: 'Pasar Induk Sayur',
    contact: 'Bapak Ahmad',
    email: 'ahmad@pasarsayur.id',
    phone: '+62814-5555-1234',
    address: 'Jl. Pasar Induk No. 1, Bekasi',
    rating: 4.2,
    specialties: ['sayuran segar', 'bumbu dapur', 'buah-buahan']
  }
];

// Mock restock orders
export const mockRestockOrders: RestockOrder[] = [
  {
    id: '1',
    supplierId: '1',
    items: [
      { ingredientId: '1', quantity: 10, unitCost: 120000 }
    ],
    orderDate: '2024-09-01T09:00:00Z',
    deliveryDate: '2024-09-03T10:00:00Z',
    status: 'confirmed',
    totalCost: 1200000
  },
  {
    id: '2',
    supplierId: '2',
    items: [
      { ingredientId: '2', quantity: 8, unitCost: 65000 }
    ],
    orderDate: '2024-09-01T14:30:00Z',
    status: 'pending',
    totalCost: 520000
  }
];

// Current user
export const mockCurrentUser: User = {
  id: 'user1',
  name: 'Made Wijaya',
  role: 'manager',
  permissions: ['view_inventory', 'manage_stock', 'create_orders', 'view_reports'],
  restaurantBranch: 'Cabang Jakarta Pusat'
};

// Utility functions
export const getStockStatus = (ingredient: Ingredient): 'critical' | 'low' | 'normal' | 'overstocked' => {
  const { currentStock, minThreshold, maxCapacity } = ingredient;
  
  if (currentStock <= minThreshold * 0.5) return 'critical';
  if (currentStock <= minThreshold) return 'low';
  if (currentStock >= maxCapacity * 0.9) return 'overstocked';
  return 'normal';
};

export const isExpiringNearby = (expiryDate?: string, days: number = 3): boolean => {
  if (!expiryDate) return false;
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  
  return diffDays <= days && diffDays >= 0;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const getCategoryIcon = (category: Ingredient['category']): string => {
  const icons = {
    protein: '🥩',
    vegetable: '🥬',
    spice: '🌶️',
    dairy: '🥛',
    grain: '🌾',
    condiment: '🧂',
    beverage: '🥤'
  };
  return icons[category] || '📦';
};
