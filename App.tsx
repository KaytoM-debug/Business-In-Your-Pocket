import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  OverviewScreen,
  TransactionsScreen,
  CustomersScreen,
  InventoryScreen,
} from './src/screens/index';
import {
  AddTransactionModal,
  AddCustomerModal,
  AddInventoryModal,
  EditTransactionModal,
  EditCustomerModal,
  EditInventoryModal,
  ProfileModal,
} from './src/components/index';
import { storageService } from './src/services/storage';
import { Transaction, Customer, InventoryItem, UserProfile } from './src/types/index';
import { detectCurrency, generateId, getInitials, setActiveCurrency } from './src/utils/calculations';

type Tab = 'Overview' | 'Sales' | 'Expenses' | 'Customers' | 'Inventory';
const tabs: Tab[] = ['Overview', 'Sales', 'Expenses', 'Customers', 'Inventory'];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Add Modal states
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  // Edit Modal states
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditInventoryModal, setShowEditInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  const isOverview = activeTab === 'Overview';

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedTransactions, loadedCustomers, loadedInventory, loadedProfile] = await Promise.all([
          storageService.getTransactions(),
          storageService.getCustomers(),
          storageService.getInventory(),
          storageService.getProfile(),
        ]);
        setTransactions(loadedTransactions);
        setCustomers(loadedCustomers);
        setInventory(loadedInventory);
        setProfile(loadedProfile);
        if (!loadedProfile) {
          setShowProfileModal(true);
        }
        setActiveCurrency(detectCurrency());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle add transaction
  const handleAddTransaction = async (data: { title: string; amount: number; detail: string; date: string }, type: 'sale' | 'expense') => {
    const newTransaction: Transaction = {
      id: generateId(),
      title: data.title,
      detail: data.detail,
      amount: data.amount,
      type,
      date: data.date,
      timestamp: Date.now(),
    };
    await storageService.addTransaction(newTransaction);
    setTransactions([newTransaction, ...transactions]);
  };

  // Handle add customer
  const handleAddCustomer = async (data: { name: string; email?: string; phone?: string }) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      orders: [],
    };
    await storageService.addCustomer(newCustomer);
    setCustomers([newCustomer, ...customers]);
  };

  // Handle add inventory
  const handleAddInventory = async (data: {
    name: string;
    quantity: number;
    minThreshold: number;
    unitPrice: number;
  }) => {
    const newItem: InventoryItem = {
      id: generateId(),
      name: data.name,
      quantity: data.quantity,
      minThreshold: data.minThreshold,
      unitPrice: data.unitPrice,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    await storageService.addInventoryItem(newItem);
    setInventory([newItem, ...inventory]);
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id: string) => {
    await storageService.deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Handle delete customer
  const handleDeleteCustomer = async (id: string) => {
    await storageService.deleteCustomer(id);
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Handle delete inventory
  const handleDeleteInventory = async (id: string) => {
    await storageService.deleteInventoryItem(id);
    setInventory(inventory.filter(i => i.id !== id));
  };

  // Handle edit transaction
  const handleEditTransaction = async (id: string, data: { title: string; amount: number; detail: string; date: string }) => {
    await storageService.updateTransaction(id, {
      title: data.title,
      amount: data.amount,
      detail: data.detail,
    });
    setTransactions(
      transactions.map(t =>
        t.id === id ? { ...t, ...data } : t
      )
    );
  };

  // Handle edit customer
  const handleEditCustomer = async (id: string, data: { name: string; email?: string; phone?: string }) => {
    await storageService.updateCustomer(id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    setCustomers(
      customers.map(c =>
        c.id === id ? { ...c, ...data } : c
      )
    );
  };

  // Handle edit inventory
  const handleEditInventory = async (id: string, data: {
    name: string;
    quantity: number;
    minThreshold: number;
    unitPrice: number;
  }) => {
    await storageService.updateInventoryItem(id, data);
    setInventory(
      inventory.map(i =>
        i.id === id ? { ...i, ...data } : i
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewScreen
            transactions={transactions}
            inventory={inventory}
            onViewAllSales={() => {
              setActiveTab('Sales');
              setSearch('');
            }}
          />
        );
      case 'Sales':
        return (
          <TransactionsScreen
            transactions={transactions}
            type="sale"
            search={search}
            onSearchChange={setSearch}
            onAddPress={() => setShowSaleModal(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={(transaction) => {
              setSelectedTransaction(transaction);
              setShowEditTransactionModal(true);
            }}
          />
        );
      case 'Expenses':
        return (
          <TransactionsScreen
            transactions={transactions}
            type="expense"
            search={search}
            onSearchChange={setSearch}
            onAddPress={() => setShowExpenseModal(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={(transaction) => {
              setSelectedTransaction(transaction);
              setShowEditTransactionModal(true);
            }}
          />
        );
      case 'Customers':
        return (
          <CustomersScreen
            customers={customers}
            transactions={transactions}
            search={search}
            onSearchChange={setSearch}
            onAddPress={() => setShowCustomerModal(true)}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={(customer) => {
              setSelectedCustomer(customer);
              setShowEditCustomerModal(true);
            }}
          />
        );
      case 'Inventory':
        return (
          <InventoryScreen
            inventory={inventory}
            search={search}
            onSearchChange={setSearch}
            onAddPress={() => setShowInventoryModal(true)}
            onDeleteItem={handleDeleteInventory}
            onEditItem={(item) => {
              setSelectedInventoryItem(item);
              setShowEditInventoryModal(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MONDAY, SEPTEMBER 7</Text>
          <Text style={styles.title}>{activeTab === 'Overview' ? `Good morning, ${profile?.name || 'there'}` : activeTab}</Text>
        </View>
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
          onPress={() => setShowProfileModal(true)}
        >
          <Text style={styles.avatarText}>{getInitials(profile?.name || 'User')}</Text>
        </Pressable>
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              setSearch('');
            }}
            style={styles.tab}
          >
            <View style={[styles.tabDot, activeTab === tab && styles.activeDot]} />
            <Text style={[styles.tabLabel, activeTab === tab && styles.activeLabel]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <AddTransactionModal
        visible={showSaleModal}
        onClose={() => setShowSaleModal(false)}
        onAdd={(data) => handleAddTransaction(data, 'sale')}
        type="sale"
      />
      <AddTransactionModal
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onAdd={(data) => handleAddTransaction(data, 'expense')}
        type="expense"
      />
      <AddCustomerModal
        visible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onAdd={handleAddCustomer}
      />
      <AddInventoryModal
        visible={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        onAdd={handleAddInventory}
      />

      <EditTransactionModal
        visible={showEditTransactionModal}
        transaction={selectedTransaction}
        onClose={() => {
          setShowEditTransactionModal(false);
          setSelectedTransaction(null);
        }}
        onSave={handleEditTransaction}
      />
      <EditCustomerModal
        visible={showEditCustomerModal}
        customer={selectedCustomer}
        onClose={() => {
          setShowEditCustomerModal(false);
          setSelectedCustomer(null);
        }}
        onSave={handleEditCustomer}
      />
      <EditInventoryModal
        visible={showEditInventoryModal}
        item={selectedInventoryItem}
        onClose={() => {
          setShowEditInventoryModal(false);
          setSelectedInventoryItem(null);
        }}
        onSave={handleEditInventory}
      />
      <ProfileModal
        visible={showProfileModal}
        profile={profile || { name: '' }}
        required={!profile}
        onClose={() => setShowProfileModal(false)}
        onSave={async (updatedProfile) => {
          await storageService.saveProfile(updatedProfile);
          setProfile(updatedProfile);
        }}
      />
    </SafeAreaView>
  );
}

function Metric({ label, value, change, negative = false }: { label: string; value: string; change: string; negative?: boolean }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={[styles.metricChange, negative && styles.negative]}>{change}</Text></View>; }
function ActivityRow({ title, detail, amount, type }: { title: string; detail: string; amount: string; type: string }) { return <View style={styles.row}><View style={[styles.rowIcon, type === 'expense' && styles.expenseIcon]}><Text style={styles.rowIconText}>{type === 'expense' ? '-' : '+'}</Text></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View><Text style={[styles.rowAmount, type === 'expense' && styles.expenseAmount]}>{amount}</Text></View>; }
function ListRow({ name, detail, value, warning = false }: { name: string; detail: string; value: string; warning?: boolean }) { return <View style={styles.row}><View style={styles.initials}><Text style={styles.initialsText}>{name.slice(0, 2).toUpperCase()}</Text></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{name}</Text><Text style={styles.rowDetail}>{detail}</Text></View><Text style={[styles.listValue, warning && styles.warning]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  eyebrow: {
    color: '#75807A',
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    marginBottom: 7,
  },
  title: {
    color: '#17221D',
    fontSize: 27,
    fontWeight: '800',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DDECE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#2F6742',
    fontWeight: '800',
    fontSize: 13,
  },
  avatarPressed: {
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
  },
  tabBar: {
    height: 82,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E9E4',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
  },
  tab: {
    alignItems: 'center',
    width: '20%',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BEC8C0',
    marginBottom: 7,
  },
  activeDot: {
    backgroundColor: '#32734B',
    width: 18,
  },
  tabLabel: {
    color: '#8A938D',
    fontSize: 10,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#32734B',
  },
  // Unused but kept for compatibility
  metric: {},
  metricLabel: {},
  metricValue: {},
  metricChange: {},
  negative: {},
  row: {},
  rowIcon: {},
  expenseIcon: {},
  rowIconText: {},
  rowCopy: {},
  rowTitle: {},
  rowDetail: {},
  rowAmount: {},
  expenseAmount: {},
  initials: {},
  initialsText: {},
  listValue: {},
  warning: {},
});
