import { AppThemeProvider } from '@/components/app-theme';
import '@/constants/theme';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <AppThemeProvider>
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>SiteBook could not open</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
