import '@/constants/theme';
import { Stack } from 'expo-router';
import { AppThemeProvider } from '@/components/app-theme';

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppThemeProvider>
  );
}
