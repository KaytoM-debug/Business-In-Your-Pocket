import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Customer, Transaction } from '../types/index';
import { formatCurrency, getInitials } from '../utils/calculations';

interface CustomersScreenProps {
  customers: Customer[];
  transactions: Transaction[];
  search: string;
  onSearchChange: (text: string) => void;
  onAddPress: () => void;
  onDeleteCustomer: (id: string) => void;
  onEditCustomer: (customer: Customer) => void;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  transactions,
  search,
  onSearchChange,
  onAddPress,
  onDeleteCustomer,
  onEditCustomer,
}) => {
  const filteredCustomers = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCustomerTransactions = (customer: Customer) => {
    const orderIds = new Set(customer.orders);
    return transactions.filter((transaction) =>
      transaction.type === 'sale' &&
      (orderIds.has(transaction.id) ||
        transaction.title.trim().toLowerCase() === customer.name.trim().toLowerCase())
    );
  };

  const customerOrderCounts = customers.map((customer) => ({
    customer,
    transactions: getCustomerTransactions(customer),
  }));
  const analyticsRevenue = customerOrderCounts.reduce(
    (total, entry) => total + (entry.transactions.length > 0
      ? entry.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
      : entry.customer.totalSpent),
    0
  );
  const analyticsOrders = customerOrderCounts.reduce(
    (total, entry) => total + (entry.transactions.length > 0 ? entry.transactions.length : entry.customer.orders.length),
    0
  );
  const activeCustomers = customerOrderCounts.filter(
    (entry) => entry.transactions.length > 0 || entry.customer.orders.length > 0 || entry.customer.totalSpent > 0
  ).length;

  const ListRow = ({
    id,
    name,
    detail,
    value,
    customer,
  }: {
    id: string;
    name: string;
    detail: string;
    value: string;
    customer: Customer;
  }) => (
    <View style={styles.row}>
      <View style={styles.initials}>
        <Text style={styles.initialsText}>{getInitials(name)}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{name}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <View style={styles.rowActions}>
        <Text style={styles.listValue}>{value}</Text>
        <Pressable onPress={() => onEditCustomer(customer)}>
          <Text style={styles.editButton}>✎</Text>
        </Pressable>
        <Pressable onPress={() => onDeleteCustomer(id)}>
          <Text style={styles.deleteButton}>✕</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search customers..."
          placeholderTextColor="#92989B"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>All customers</Text>
        <Pressable style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {filteredCustomers.length === 0 ? (
        <View style={styles.emptyNote}>
          <Text style={styles.emptyTitle}>No customers yet</Text>
          <Text style={styles.emptyText}>
            Add customers to track their orders and history
          </Text>
        </View>
      ) : (
        filteredCustomers.map((item) => (
          <ListRow
            key={item.id}
            id={item.id}
            name={item.name}
            detail={`${getCustomerTransactions(item).length || item.orders.length} orders · Last order ${item.lastOrderDate}`}
            value={formatCurrency(item.totalSpent)}
            customer={item}
          />
        ))
      )}

      <View style={styles.analyticsSection}>
        <Text style={styles.analyticsTitle}>Customer analytics</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Customers</Text>
            <Text style={styles.analyticsValue}>{customers.length}</Text>
            <Text style={styles.analyticsHint}>{activeCustomers} active</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Revenue</Text>
            <Text style={styles.analyticsValue}>{formatCurrency(analyticsRevenue)}</Text>
            <Text style={styles.analyticsHint}>from customer orders</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Orders</Text>
            <Text style={styles.analyticsValue}>{analyticsOrders}</Text>
            <Text style={styles.analyticsHint}>tracked sales</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Average order</Text>
            <Text style={styles.analyticsValue}>
              {formatCurrency(analyticsOrders > 0 ? analyticsRevenue / analyticsOrders : 0)}
            </Text>
            <Text style={styles.analyticsHint}>per customer order</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6DF',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#17221D',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#17221D',
    fontSize: 17,
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#D8F49D',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#244B31',
    fontSize: 13,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9E4',
  },
  initials: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DDECE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#32734B',
    fontSize: 12,
    fontWeight: '800',
  },
  rowCopy: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    color: '#26342C',
    fontSize: 14,
    fontWeight: '700',
  },
  rowDetail: {
    color: '#87918B',
    fontSize: 12,
    marginTop: 4,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listValue: {
    color: '#32734B',
    fontSize: 12,
    fontWeight: '800',
  },
  editButton: {
    color: '#32734B',
    fontSize: 16,
    fontWeight: '700',
    padding: 4,
  },
  deleteButton: {
    color: '#C36A4D',
    fontSize: 18,
    fontWeight: '700',
    padding: 4,
  },
  emptyNote: {
    marginTop: 26,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#EEF3EC',
  },
  emptyTitle: {
    color: '#244B31',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyText: {
    color: '#647168',
    lineHeight: 20,
    marginTop: 6,
  },
  analyticsSection: {
    marginTop: 28,
    paddingBottom: 24,
  },
  analyticsTitle: {
    color: '#17221D',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  analyticsCard: {
    width: '48%',
    minHeight: 92,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6DF',
  },
  analyticsLabel: {
    color: '#647168',
    fontSize: 12,
    fontWeight: '700',
  },
  analyticsValue: {
    color: '#244B31',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 6,
  },
  analyticsHint: {
    color: '#87918B',
    fontSize: 11,
    marginTop: 3,
  },
});
