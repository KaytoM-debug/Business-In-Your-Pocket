import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; amount: number; detail: string; date: string }) => void;
  type: 'sale' | 'expense';
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
  type,
}) => {
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [detail, setDetail] = React.useState('');
  const [error, setError] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const shiftDate = (days: number) => {
    setSelectedDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + days);
      return nextDate;
    });
  };

  const handleAdd = () => {
    setError('');
    if (!title.trim()) {
      setError('Please enter a title/customer name');
      return;
    }
    if (!amount.trim()) {
      setError('Please enter an amount');
      return;
    }
    if (isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount');
      return;
    }
    onAdd({
      title: title.trim(),
      amount: parseFloat(amount),
      detail: detail.trim() || new Date().toLocaleDateString(),
      date: formatDate(selectedDate),
    });
    setTitle('');
    setAmount('');
    setDetail('');
    setSelectedDate(new Date());
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setDetail('');
    setSelectedDate(new Date());
    setError('');
    onClose();
  };

  React.useEffect(() => {
    if (!visible) {
      setError('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add {type === 'sale' ? 'Sale' : 'Expense'}</Text>
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
              <Text style={styles.label}>
                {type === 'sale' ? 'Customer Name' : 'Item/Vendor'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={type === 'sale' ? 'Enter customer name...' : 'Enter vendor name...'}
                placeholderTextColor="#92989B"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.textInput, styles.amountInput]}
                  placeholder="0.00"
                  placeholderTextColor="#92989B"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.multiline]}
                placeholder={`Optional note for this ${type}...`}
                placeholderTextColor="#92989B"
                value={detail}
                onChangeText={setDetail}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Transaction Date</Text>
              <View style={styles.datePickerRow}>
                <Pressable style={styles.dateButton} onPress={() => shiftDate(-1)}>
                  <Text style={styles.dateButtonText}>-</Text>
                </Pressable>
                <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
                <Pressable style={styles.dateButton} onPress={() => shiftDate(1)}>
                  <Text style={styles.dateButtonText}>+</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={handleAdd}
            >
              <Text style={styles.addButtonText}>Add {type === 'sale' ? 'Sale' : 'Expense'}</Text>
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
    maxHeight: '80%',
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
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6DF',
    padding: 6,
  },
  dateButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#D8F49D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#244B31',
    fontSize: 22,
    fontWeight: '800',
  },
  dateValue: {
    color: '#17221D',
    fontSize: 15,
    fontWeight: '700',
  },
  currencySymbol: {
    color: '#75807A',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 12,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingTop: 12,
    height: 80,
  },
  addButton: {
    backgroundColor: '#D8F49D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
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
