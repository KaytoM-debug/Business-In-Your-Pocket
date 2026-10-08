import { Transaction, Customer, InventoryItem, MonthlySummary, DailyMetrics, EastAfricanCurrency } from '../types/index';

export const currencySymbols: Record<EastAfricanCurrency, string> = {
  UGX: 'UGX',
  KES: 'KES',
  TZS: 'TZS',
  RWF: 'RWF',
  BIF: 'BIF',
  SSP: 'SSP',
  ETB: 'ETB',
};

const currencyByRegion: Record<string, EastAfricanCurrency> = {
  UG: 'UGX', KE: 'KES', TZ: 'TZS', RW: 'RWF', BI: 'BIF', SS: 'SSP', ET: 'ETB',
};

let activeCurrency: EastAfricanCurrency = 'UGX';

export const detectCurrency = (): EastAfricanCurrency => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const region = locale.match(/[-_]([A-Z]{2})$/)?.[1];
  return region ? currencyByRegion[region] || 'UGX' : 'UGX';
};

export const setActiveCurrency = (currency: EastAfricanCurrency): void => {
  activeCurrency = currency;
};

export const calculateMonthlySummary = (
  transactions: Transaction[],
  inventoryItems: InventoryItem[]
): MonthlySummary => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalSales = monthTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalSales - totalExpenses;
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

  // Compare with last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const lastMonthSales = lastMonthTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const growthPercentage = lastMonthSales > 0
    ? ((totalSales - lastMonthSales) / lastMonthSales) * 100
    : 0;

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minThreshold).length;

  return {
    totalSales,
    totalExpenses,
    profit,
    profitMargin,
    growthPercentage,
    ordersCount: monthTransactions.filter(t => t.type === 'sale').length,
    lowStockItems,
  };
};

export const formatCurrency = (amount: number): string => {
  return `${currencySymbols[activeCurrency]} ${amount.toFixed(2)}`;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
};

export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays < 2) {
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return formatDate(date);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export const calculateDailyMetrics = (transactions: Transaction[], date: string): DailyMetrics => {
  const dayTransactions = transactions.filter(t => t.date === date);

  const sales = dayTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    date,
    sales,
    expenses,
    profit: sales - expenses,
  };
};

export const getInventoryStatus = (quantity: number, minThreshold: number): string => {
  if (quantity <= minThreshold) {
    return 'Low stock';
  }
  return 'Healthy';
};
