import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Transaction, InventoryItem } from '../types/index';
import { calculateMonthlySummary, formatCurrency } from '../utils/calculations';

interface OverviewScreenProps {
  transactions: Transaction[];
  inventory: InventoryItem[];
  onViewAllSales: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  transactions,
  inventory,
  onViewAllSales,
}) => {
  const summary = calculateMonthlySummary(transactions, inventory);

  const Metric = ({ label, value, change, negative = false }: { label: string; value: string; change: string; negative?: boolean }) => (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={[styles.metricChange, negative && styles.negative]}>{change}</Text>
    </View>
  );

  const ActivityRow = ({ title, detail, amount, type }: { title: string; detail: string; amount: string; type: string }) => (
    <View style={styles.row}>
      <View style={[styles.rowIcon, type === 'expense' && styles.expenseIcon]}>
        <Text style={styles.rowIconText}>{type === 'expense' ? '-' : '+'}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Text style={[styles.rowAmount, type === 'expense' && styles.expenseAmount]}>
        {amount}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>THIS MONTH'S PROFIT</Text>
          <Text style={[styles.growth, summary.growthPercentage >= 0 ? {} : styles.growthNegative]}>
            {summary.growthPercentage >= 0 ? '+' : ''}{summary.growthPercentage.toFixed(1)}%
          </Text>
        </View>
        <Text style={styles.balance}>{formatCurrency(summary.profit)}</Text>
        <Text style={styles.balanceHint}>
          Compared with {formatCurrency(summary.totalSales * 0.85)} last month
        </Text>
        <View style={styles.chart}>
          {[28, 42, 35, 56, 48, 76, 65].map((height, index) => (
            <View
              key={index}
              style={[styles.bar, index === 5 && styles.activeBar, { height }]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>At a glance</Text>
      <View style={styles.metrics}>
        <Metric
          label="Sales"
          value={formatCurrency(summary.totalSales)}
          change={`+${(summary.totalSales * 0.128).toFixed(0)}%`}
        />
        <Metric
          label="Expenses"
          value={formatCurrency(summary.totalExpenses)}
          change={`-${(summary.totalExpenses * 0.042).toFixed(0)}%`}
          negative
        />
      </View>
      <View style={styles.metrics}>
        <Metric
          label="Orders"
          value={summary.ordersCount.toString()}
          change={`+${Math.floor(summary.ordersCount * 0.1)} this week`}
        />
        <Metric
          label="Low stock"
          value={`${summary.lowStockItems} items`}
          change={summary.lowStockItems > 0 ? 'Needs attention' : 'All good'}
          negative={summary.lowStockItems > 0}
        />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <Pressable onPress={onViewAllSales}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>
      {transactions.slice(0, 3).map((item) => (
        <ActivityRow
          key={item.id}
          title={item.title}
          detail={item.detail}
          amount={item.type === 'sale' ? `+${formatCurrency(item.amount)}` : `-${formatCurrency(item.amount)}`}
          type={item.type}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  balanceCard: {
    backgroundColor: '#1D4C35',
    borderRadius: 18,
    padding: 20,
    marginBottom: 26,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#A8C7AE',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  growth: {
    color: '#D8F49D',
    fontWeight: '800',
    fontSize: 12,
  },
  growthNegative: {
    color: '#C36A4D',
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 10,
  },
  balanceHint: {
    color: '#B6D2BC',
    fontSize: 12,
    marginTop: 4,
  },
  chart: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  bar: {
    flex: 1,
    backgroundColor: '#528061',
    borderRadius: 4,
  },
  activeBar: {
    backgroundColor: '#D8F49D',
  },
  sectionTitle: {
    color: '#17221D',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  link: {
    color: '#32734B',
    fontWeight: '700',
    fontSize: 13,
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7EBE6',
  },
  metricLabel: {
    color: '#75807A',
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    color: '#17221D',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  metricChange: {
    color: '#32734B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  negative: {
    color: '#C36A4D',
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
  rowAmount: {
    color: '#32734B',
    fontSize: 14,
    fontWeight: '800',
  },
  expenseAmount: {
    color: '#C36A4D',
  },
});
