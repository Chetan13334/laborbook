import { AppThemeProvider } from '@/components/app-theme';
import '@/constants/theme';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cashbook" options={{ headerShown: false }} />
        <Stack.Screen name="labor" options={{ headerShown: false }} />
        <Stack.Screen name="reports" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </AppThemeProvider>
  );
}
