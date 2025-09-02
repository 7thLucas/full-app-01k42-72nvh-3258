// StokCerdas Types
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  currentStock: number;
  unit: string;
  minimumThreshold: number;
  maximumThreshold: number;
  expiryDate?: Date;
  costPerUnit: number;
  supplier?: Supplier;
  imageUrl?: string;
  description?: string;
  barcode?: string;
}

export interface IngredientCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface UsageRecord {
  id: string;
  ingredientId: string;
  quantity: number;
  usedDate: Date;
  reason: UsageReason;
  userId: string;
  notes?: string;
  recipeId?: string;
}

export type UsageReason = 'cooking' | 'waste' | 'expired' | 'damaged' | 'recipe';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  status: OrderStatus;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  totalAmount: number;
  items: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  rating?: number;
  paymentTerms?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  servings: number;
  prepTime: number;
  category: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantId: string;
  avatar?: string;
}

export type UserRole = 'admin' | 'manager' | 'staff';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  ingredientId?: string;
  orderId?: string;
  priority: 'low' | 'medium' | 'high';
}

export type NotificationType = 'low_stock' | 'expired' | 'expiring_soon' | 'order_delivered' | 'system';

export interface StockAlert {
  ingredientId: string;
  type: 'low_stock' | 'overstock' | 'expired' | 'expiring_soon';
  severity: 'warning' | 'danger';
  message: string;
}

export interface ReportData {
  period: {
    start: Date;
    end: Date;
  };
  totalWaste: number;
  totalCost: number;
  mostUsedIngredients: Array<{
    ingredientId: string;
    name: string;
    totalUsed: number;
    unit: string;
  }>;
  wasteByCategory: Array<{
    category: string;
    amount: number;
    cost: number;
  }>;
  inventoryTurnover: number;
  stockOutEvents: number;
}
