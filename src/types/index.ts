// Transaction Types
export type TransactionType = 'sale' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  detail: string;
  amount: number;
  type: TransactionType;
  date: string;
  timestamp: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  lastOrderDate: string;
  orders: string[]; // Array of transaction IDs
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minThreshold: number;
  unitPrice: number;
  lastRestocked: string;
}

// Summary Types
export interface MonthlySummary {
  totalSales: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  growthPercentage: number;
  ordersCount: number;
  lowStockItems: number;
}

export interface DailyMetrics {
  date: string;
  sales: number;
  expenses: number;
  profit: number;
}

export type EastAfricanCurrency = 'UGX' | 'KES' | 'TZS' | 'RWF' | 'BIF' | 'SSP' | 'ETB';

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
}
