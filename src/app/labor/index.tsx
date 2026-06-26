import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { AppHeader } from '@/components/bars/app-header';
import { useLaborers } from '@/database';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function LaborPage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();
  const { data: laborers, loading, error } = useLaborers();
  const [query, setQuery] = useState('');

  console.log('[LaborIndex] hook output:', {
    dataLength: laborers.length,
    loading,
    error,
    laborers,
  });

  const filteredLaborers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return laborers;

    return laborers.filter((laborer) =>
      [laborer.name, laborer.role, laborer.status, laborer.amount, laborer.phone ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [laborers, query]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppHeader />

          <View style={styles.topRow}>
            <View>
              <Text style={[styles.brand, { color: theme.text }]}>SiteBook</Text>
              <Text style={[styles.brandMeta, { color: theme.textSecondary }]}>My labors</Text>
            </View>

            <Pressable
              onPress={() => router.push('/labor/add')}
              style={({ pressed }) => [styles.addButton, { backgroundColor: theme.accent }, pressed && styles.pressed]}
            >
              <Text style={[styles.addButtonText, { color: theme.background }]}>Add Labor</Text>
            </Pressable>
          </View>

          <View style={[styles.searchShell, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.searchIcon, { color: theme.accent }]}>⌕</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search by name, role or amount..."
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <Text style={[styles.sectionLabel, { color: theme.text }]}>MY LABORS</Text>

          <View style={styles.list}>
            {loading && <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 40 }} />}
            {error && <Text style={{ color: theme.error, textAlign: 'center' }}>Error loading laborers</Text>}
            {!loading && !error && filteredLaborers.length === 0 && (
              <Text style={{ color: theme.textSecondary, textAlign: 'center', marginVertical: 40 }}>No laborers found.</Text>
            )}
            {!loading && !error && filteredLaborers.map((laborer) => (
              <Pressable
                key={laborer.id}
                onPress={() => router.push(`/labor/${laborer.id}/mainCashbook`)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                  laborer.muted && styles.cardMuted,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.initialsBubble,
                    { backgroundColor: mode === 'dark' ? theme.background : theme.accentSoft, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.initialsText, { color: theme.accent }]}>{laborer.initials}</Text>
                </View>

                <View style={styles.copy}>
                  <Text style={[styles.name, { color: theme.text }]}>{laborer.name}</Text>
                  <Text style={[styles.meta, { color: theme.textSecondary }]}>{laborer.phone ?? laborer.role}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

const shadow =
  Platform.OS === 'android'
    ? { elevation: 1 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontFamily,
  },
  brandMeta: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  addButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005bbf',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  searchShell: {
    minHeight: 54,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 10,
    ...(shadow as object),
  },
  searchIcon: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
  },
  list: {
    gap: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(shadow as object),
  },
  cardMuted: {
    opacity: 0.55,
  },
  initialsBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  initialsText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    fontFamily,
  },
  meta: {
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
