import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Transaction } from '../types/index';
import { formatCurrency, formatDateTime } from '../utils/calculations';

interface TransactionsScreenProps {
  transactions: Transaction[];
  type: 'sale' | 'expense';
  search: string;
  onSearchChange: (text: string) => void;
  onAddPress: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  type,
  search,
  onSearchChange,
  onAddPress,
  onDeleteTransaction,
  onEditTransaction,
}) => {
  const filteredTransactions = transactions.filter(
    (item) =>
      item.type === type && item.title.toLowerCase().includes(search.toLowerCase())
  );

  const ActivityRow = ({
    id,
    title,
    detail,
    amount,
    type,
    transaction,
  }: {
    id: string;
    title: string;
    detail: string;
    amount: string;
    type: string;
    transaction: Transaction;
  }) => (
    <View style={styles.row}>
      <View style={[styles.rowIcon, type === 'expense' && styles.expenseIcon]}>
        <Text style={styles.rowIconText}>{type === 'expense' ? '-' : '+'}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <View style={styles.rowActions}>
        <Text style={[styles.rowAmount, type === 'expense' && styles.expenseAmount]}>
          {amount}
        </Text>
        <Pressable onPress={() => onEditTransaction(transaction)}>
          <Text style={styles.editButton}>✎</Text>
        </Pressable>
        <Pressable onPress={() => onDeleteTransaction(id)}>
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
          placeholder={`Search ${type}s...`}
          placeholderTextColor="#92989B"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          This month's {type === 'sale' ? 'sales' : 'expenses'}
        </Text>
        <Pressable style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyNote}>
          <Text style={styles.emptyTitle}>No {type}s yet</Text>
          <Text style={styles.emptyText}>
            {type === 'sale'
              ? 'Add sales to track your revenue'
              : 'Add expenses to track your costs'}
          </Text>
        </View>
      ) : (
        filteredTransactions.map((item) => (
          <ActivityRow
            key={item.id}
            id={item.id}
            title={item.title}
            detail={formatDateTime(item.date)}
            amount={
              item.type === 'sale'
                ? `+${formatCurrency(item.amount)}`
                : `-${formatCurrency(item.amount)}`
            }
            type={item.type}
            transaction={item}
          />
        ))
      )}
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
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F0E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseIcon: {
    backgroundColor: '#FBE9DF',
  },
  rowIconText: {
    color: '#32734B',
    fontWeight: '800',
    fontSize: 18,
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
  rowAmount: {
    color: '#32734B',
    fontSize: 14,
    fontWeight: '800',
  },
  expenseAmount: {
    color: '#C36A4D',
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
});
