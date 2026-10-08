import { Transaction, Customer, InventoryItem, DailyMetrics, UserProfile } from '../types/index';

const STORAGE_KEYS = {
  TRANSACTIONS: '@business_app/transactions',
  CUSTOMERS: '@business_app/customers',
  INVENTORY: '@business_app/inventory',
  DAILY_METRICS: '@business_app/daily_metrics',
  PROFILE: '@business_app/profile',
};

// In-memory storage fallback (when AsyncStorage is not available)
let memoryStorage: { [key: string]: string } = {};

class StorageService {
  private useMemory = true; // Default to memory storage

  async setUseAsyncStorage(enabled: boolean) {
    this.useMemory = !enabled;
  }

  private async getItem(key: string): Promise<string | null> {
    try {
      if (this.useMemory) {
        return memoryStorage[key] || null;
      }
      // Will use AsyncStorage when installed
      // const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      // return AsyncStorage.getItem(key);
      return memoryStorage[key] || null;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  }

  private async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.useMemory) {
        memoryStorage[key] = value;
      } else {
        // Will use AsyncStorage when installed
        // const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
        // await AsyncStorage.setItem(key, value);
        memoryStorage[key] = value;
      }
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
    }
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const data = await this.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions();
    transactions.push(transaction);
    await this.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      await this.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    await this.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const data = await this.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  async addCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    customers.push(customer);
    await this.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const customers = await this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      await this.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    const customers = await this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    await this.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(filtered));
  }

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    const data = await this.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
  }

  async addInventoryItem(item: InventoryItem): Promise<void> {
    const inventory = await this.getInventory();
    inventory.push(item);
    await this.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    const inventory = await this.getInventory();
    const index = inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      inventory[index] = { ...inventory[index], ...updates };
      await this.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const inventory = await this.getInventory();
    const filtered = inventory.filter(i => i.id !== id);
    await this.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(filtered));
  }

  // Daily Metrics
  async getDailyMetrics(): Promise<DailyMetrics[]> {
    const data = await this.getItem(STORAGE_KEYS.DAILY_METRICS);
    return data ? JSON.parse(data) : [];
  }

  async recordDailyMetrics(metrics: DailyMetrics): Promise<void> {
    const allMetrics = await this.getDailyMetrics();
    const existingIndex = allMetrics.findIndex(m => m.date === metrics.date);
    if (existingIndex !== -1) {
      allMetrics[existingIndex] = metrics;
    } else {
      allMetrics.push(metrics);
    }
    await this.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(allMetrics));
  }

  async getProfile(): Promise<UserProfile | null> {
    const data = await this.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await this.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Clear all data
  async clearAll(): Promise<void> {
    memoryStorage = {};
  }
}

export const storageService = new StorageService();
