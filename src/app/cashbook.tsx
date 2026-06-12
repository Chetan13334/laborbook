import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBottomBar } from '@/components/app-bottom-bar';
import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function CashbookPage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Cashbook</Text>
          <Pressable onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.headerButtonText, { color: theme.accent }]}>{'\u2190'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Available balance</Text>
            <Text style={[styles.heroValue, { color: theme.text }]}>₹48,250</Text>
            <Text style={[styles.heroCopy, { color: theme.textSecondary }]}>
              Track advances, payments, and cash movement without leaving the app.
            </Text>
          </View>

          <View style={styles.grid}>
            <ActionCard title="Add Payment" desc="Record a labor payout" color={theme.accent} />
            <ActionCard title="Add Expense" desc="Log site expenses" color="#006a66" />
            <ActionCard title="Export Ledger" desc="Share monthly cashbook" color="#bb1712" />
            <ActionCard title="Reconcile" desc="Match balances" color="#00531e" />
          </View>
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function ActionCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontFamily,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  hero: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily,
  },
  heroValue: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    fontFamily,
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    minHeight: 120,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.84)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
  cardDesc: {
    marginTop: 6,
    color: '#5a6076',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    fontFamily,
  },
});
