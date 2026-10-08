import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { InventoryItem } from '../types/index';

interface EditInventoryModalProps {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (id: string, data: {
    name: string;
    quantity: number;
    minThreshold: number;
    unitPrice: number;
  }) => void;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [minThreshold, setMinThreshold] = React.useState('');
  const [unitPrice, setUnitPrice] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setMinThreshold(item.minThreshold.toString());
      setUnitPrice(item.unitPrice.toString());
      setError('');
    }
  }, [item, visible]);

  const handleSave = () => {
    setError('');
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!quantity.trim()) {
      setError('Quantity is required');
      return;
    }
    if (isNaN(parseInt(quantity, 10))) {
      setError('Please enter a valid quantity');
      return;
    }
    if (!unitPrice.trim()) {
      setError('Unit price is required');
      return;
    }
    if (isNaN(parseFloat(unitPrice))) {
      setError('Please enter a valid price');
      return;
    }
    if (item) {
      onSave(item.id, {
        name: name.trim(),
        quantity: parseInt(quantity, 10),
        minThreshold: parseInt(minThreshold, 10) || 5,
        unitPrice: parseFloat(unitPrice),
      });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Inventory Item</Text>
            <Pressable onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.field}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter product name..."
                placeholderTextColor="#92989B"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Quantity *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter quantity..."
                placeholderTextColor="#92989B"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Low Stock Threshold</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Default: 5"
                placeholderTextColor="#92989B"
                value={minThreshold}
                onChangeText={setMinThreshold}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Unit Price *</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.textInput, styles.priceInput]}
                  placeholder="0.00"
                  placeholderTextColor="#92989B"
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17221D',
  },
  closeButton: {
    fontSize: 24,
    color: '#75807A',
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#FBE9DF',
    borderLeftWidth: 4,
    borderLeftColor: '#C36A4D',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#C36A4D',
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17221D',
  },
  textInput: {
    backgroundColor: '#F7F8F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E6DF',
    color: '#17221D',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E0E6DF',
  },
  currencySymbol: {
    color: '#75807A',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: '#D8F49D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#244B31',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6DF',
    marginTop: 12,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#75807A',
    fontSize: 14,
    fontWeight: '700',
  },
});
