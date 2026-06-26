import { useAppTheme } from '@/components/app-theme';
import { authStyles } from '@/components/auth/auth-styles';
import { Text, TextInput, View } from 'react-native';

type PhoneFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
};

export function PhoneField({ value, onChangeText, label = 'Phone Number' }: PhoneFieldProps) {
  const { theme } = useAppTheme();

  return (
    <View style={authStyles.fieldGroup}>
      <Text style={[authStyles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={[authStyles.phoneField, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <Text style={[authStyles.countryCode, { color: theme.textSecondary }]}>+91</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="98765 43210"
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
          maxLength={10}
          style={[authStyles.input, { color: theme.text }]}
        />
      </View>
    </View>
  );
}
