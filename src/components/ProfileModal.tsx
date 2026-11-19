import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { UserProfile, EastAfricanCurrency } from '../types/index';
import { currencySymbols, detectCurrency } from '../utils/calculations';

interface ProfileModalProps {
  visible: boolean;
  profile: UserProfile;
  required?: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}
const CURRENCIES = Object.keys(currencySymbols) as EastAfricanCurrency[];
export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, profile, required = false, onClose, onSave }) => {
  const [name, setName] = React.useState(profile.name);
  const [email, setEmail] = React.useState(profile.email || '');
  const [phone, setPhone] = React.useState(profile.phone || '');
  const [error, setError] = React.useState('');
  const [currency, setCurrency] = React.useState<EastAfricanCurrency>(profile.currency || detectCurrency());

  React.useEffect(() => {
    if (visible) {
      setName(profile.name);
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCurrency(profile.currency || detectCurrency());
      setError('');
    }
  }, [visible, profile]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Your name is required');
      return;
    }
    if (required && !email.trim()) {
      setError('Email is required to create your account');
      return;
    }
    onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      currency,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={required ? () => undefined : onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{required ? 'Create your account' : 'Your profile'}</Text>
              <Text style={styles.subtitle}>{required ? 'Set up your BIYP account to get started' : 'Keep your account details up to date'}</Text>
            </View>
            {!required ? (
              <Pressable onPress={onClose} accessibilityLabel="Close profile">
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Full name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#92989B" />
          <Text style={styles.label}>Email {required ? '*' : ''}</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#92989B" keyboardType="email-address" />
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor="#92989B" keyboardType="phone-pad" />
<Text style={styles.label}>Currency</Text>
<View style={styles.currencyRow}>
  {CURRENCIES.map((c) => (
    <Pressable key={c} onPress={() => setCurrency(c)} style={[styles.chip, currency === c && styles.chipActive]}>
      <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
    </Pressable>
  ))}
</View>
          <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]} onPress={handleSave}>
            <Text style={styles.saveText}>{required ? 'Create account' : 'Save profile'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 },
  title: { color: '#17221D', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#75807A', fontSize: 12, marginTop: 5 },
  closeButton: { color: '#75807A', fontSize: 22, fontWeight: '700' },
  error: { color: '#C36A4D', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  label: { color: '#526058', fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { borderWidth: 1, borderColor: '#E0E6DF', borderRadius: 10, color: '#17221D', paddingHorizontal: 13, height: 46, marginBottom: 15 },
  saveButton: { backgroundColor: '#1D4C35', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.75 },
    currencyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: '#E0E6DF', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginTop: 8 },
  chipActive: { backgroundColor: '#1D4C35', borderColor: '#1D4C35' },
  chipText: { color: '#526058', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
});

