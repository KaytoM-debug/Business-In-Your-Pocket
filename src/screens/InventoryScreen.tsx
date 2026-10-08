import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { InventoryItem } from '../types/index';
import { getInitials, getInventoryStatus } from '../utils/calculations';

interface InventoryScreenProps {
  inventory: InventoryItem[];
  search: string;
  onSearchChange: (text: string) => void;
  onAddPress: () => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: InventoryItem) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  inventory,
  search,
  onSearchChange,
  onAddPress,
  onDeleteItem,
  onEditItem,
}) => {
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const ListRow = ({
    id,
    name,
    detail,
    value,
    warning,
    item,
  }: {
    id: string;
    name: string;
    detail: string;
    value: string;
    warning: boolean;
    item: InventoryItem;
  }) => (
    <View style={styles.row}>
      <View style={[styles.initials, warning && styles.warningInitials]}>
        <Text style={[styles.initialsText, warning && styles.warningText]}>
          {getInitials(name)}
        </Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{name}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <View style={styles.rowActions}>
        <Text style={[styles.listValue, warning && styles.warning]}>{value}</Text>
        <Pressable onPress={() => onEditItem(item)}>
          <Text style={styles.editButton}>✎</Text>
        </Pressable>
        <Pressable onPress={() => onDeleteItem(id)}>
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
          placeholder="Search inventory..."
          placeholderTextColor="#92989B"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Stock overview</Text>
        <Pressable style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {filteredInventory.length === 0 ? (
        <View style={styles.emptyNote}>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptyText}>
            Add inventory items to track your stock levels
          </Text>
        </View>
      ) : (
        filteredInventory.map((item) => (
          <ListRow
            key={item.id}
            id={item.id}
            name={item.name}
            detail={`${item.quantity} units in stock`}
            value={getInventoryStatus(item.quantity, item.minThreshold)}
            warning={item.quantity <= item.minThreshold}
            item={item}
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
  initials: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DDECE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningInitials: {
    backgroundColor: '#FBE9DF',
  },
  initialsText: {
    color: '#32734B',
    fontSize: 12,
    fontWeight: '800',
  },
  warningText: {
    color: '#C36A4D',
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
  warning: {
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
