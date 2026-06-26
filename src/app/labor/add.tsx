import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createLabor } from '@/backend/api/laborers';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function AddLaborPage() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [entryMode, setEntryMode] = useState<'contacts' | 'manual'>('manual');
  const [salaryMode, setSalaryMode] = useState<'daily' | 'monthly'>('daily');
  const [laborName, setLaborName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wageAmount, setWageAmount] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.surfaceElevated,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: theme.accentSoft },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.icon, { color: theme.accent }]}>{'\u2190'}</Text>
            </Pressable>
            <Text style={[styles.title, { color: theme.text }]}>Add Labor</Text>
          </View>
          <Pressable style={[styles.avatarButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.avatarIcon, { color: theme.accent }]}>{'\u25c9'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.optionGrid}>
            <Pressable
              onPress={() => setEntryMode('contacts')}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: entryMode === 'contacts' ? theme.accentSoft : theme.surfaceElevated,
                  borderColor: entryMode === 'contacts' ? theme.accent : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.optionIconShell,
                  {
                    backgroundColor: entryMode === 'contacts' ? theme.accent : theme.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionIcon,
                    {
                      color: entryMode === 'contacts' ? theme.background : theme.textSecondary,
                    },
                  ]}
                >
                  {'\u2318'}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: entryMode === 'contacts' ? theme.accent : theme.textSecondary,
                  },
                ]}
              >
                Add from contacts
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEntryMode('manual')}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: entryMode === 'manual' ? theme.accentSoft : theme.surfaceElevated,
                  borderColor: entryMode === 'manual' ? theme.accent : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.optionIconShell,
                  {
                    backgroundColor: entryMode === 'manual' ? theme.accent : theme.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionIconActive,
                    {
                      color: entryMode === 'manual' ? theme.background : theme.textSecondary,
                    },
                  ]}
                >
                  {'\u270E'}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionLabelActive,
                  {
                    color: entryMode === 'manual' ? theme.accent : theme.textSecondary,
                  },
                ]}
              >
                Add manually
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Labor name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter full name"
                placeholderTextColor={theme.textSecondary}
                value={laborName}
                onChangeText={setLaborName}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Mobile number</Text>
              <View style={styles.phoneRow}>
                <View
                  style={[
                    styles.countryCode,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.countryCodeText, { color: theme.textSecondary }]}>+91</Text>
                </View>
                <TextInput
                  style={[
                    styles.phoneInput,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="10-digit number"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Salary structure</Text>
              <View style={styles.chipsRow}>
                <Pressable
                  onPress={() => setSalaryMode('daily')}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: salaryMode === 'daily' ? theme.accentSoft : theme.surfaceElevated,
                      borderColor: salaryMode === 'daily' ? theme.accent : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipIconActive, { color: salaryMode === 'daily' ? theme.accent : theme.textSecondary }]}>
                    {'\u25cf'}
                  </Text>
                  <Text style={[styles.chipTextActive, { color: salaryMode === 'daily' ? theme.accent : theme.textSecondary }]}>
                    Daily
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSalaryMode('monthly')}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: salaryMode === 'monthly' ? theme.accentSoft : theme.surfaceElevated,
                      borderColor: salaryMode === 'monthly' ? theme.accent : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipIcon, { color: salaryMode === 'monthly' ? theme.accent : theme.textSecondary }]}>
                    {'\u25cb'}
                  </Text>
                  <Text style={[styles.chipText, { color: salaryMode === 'monthly' ? theme.accent : theme.textSecondary }]}>
                    Monthly
                  </Text>
                </Pressable>
              </View>

              <View
                style={[
                  styles.wageField,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.rupee, { color: theme.textSecondary }]}>{'\u20b9'}</Text>
                <TextInput
                  style={[styles.wageInput, { color: theme.text }]}
                  placeholder={salaryMode === 'daily' ? 'Enter daily wage amount' : 'Enter monthly salary amount'}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                    value={wageAmount}
                    onChangeText={setWageAmount}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Notes (Optional)</Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Work details, emergency contact, etc."
                placeholderTextColor={theme.textSecondary}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <Pressable
              onPress={() => {
                if (!laborName.trim()) {
                  Alert.alert('Missing labor name', 'Enter a name to save this labor record.');
                  return;
                }

                createLabor({
                  name: laborName,
                  phone: phoneNumber,
                  role: salaryMode === 'daily' ? 'Daily Worker' : 'Monthly Worker',
                  amount: wageAmount,
                  notes,
                }).then(({ error }) => {
                  if (error) {
                    Alert.alert('Save failed', error.message);
                    return;
                  }

                  Alert.alert('Saved', 'Labor has been added to Supabase.');
                  router.push('/labor');
                });
              }}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.saveButtonText, { color: theme.background }]}>Save Labor</Text>
            </Pressable>
          </View>

          <View style={styles.trustRow}>
            <Text style={[styles.trustIcon, { color: theme.textSecondary }]}>{'\u2713'}</Text>
            <Text style={[styles.trustText, { color: theme.textSecondary }]}>100% Secure & Data Backed Up</Text>
          </View>
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    fontFamily,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 116,
    gap: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 10,
  },
  optionIconShell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    color: '#004493',
    fontSize: 18,
    fontWeight: '800',
    fontFamily,
  },
  optionIconActive: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    fontFamily,
  },
  optionLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily,
  },
  optionLabelActive: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily,
  },
  formCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    minHeight: 48,
    minWidth: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  countryCodeText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  phoneInput: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipIcon: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily,
  },
  chipIconActive: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily,
  },
  chipText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  chipTextActive: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  wageField: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  rupee: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily,
  },
  wageInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    paddingVertical: 0,
    fontFamily,
  },
  notesInput: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlignVertical: 'top',
    fontFamily,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trustIcon: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily,
  },
  trustText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
