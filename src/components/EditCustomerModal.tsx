import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Customer } from '../types/index';

interface EditCustomerModalProps {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSave: (id: string, data: { name: string; email?: string; phone?: string }) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  visible,
  customer,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setError('');
    }
  }, [customer, visible]);

  const handleSave = () => {
    setError('');
    if (!name.trim()) {
      setError('Customer name is required');
      return;
    }
    if (customer) {
      onSave(customer.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
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
            <Text style={styles.title}>Edit Customer</Text>
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
              <Text style={styles.label}>Customer Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter customer name..."
                placeholderTextColor="#92989B"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address..."
                placeholderTextColor="#92989B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number..."
                placeholderTextColor="#92989B"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
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
