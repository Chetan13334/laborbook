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

export default function ReportsPage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Reports</Text>
          <Pressable onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.headerButtonText, { color: theme.accent }]}>{'\u2190'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Monthly summary</Text>
            <Text style={[styles.heroValue, { color: theme.text }]}>₹96,450</Text>
            <Text style={[styles.heroCopy, { color: theme.textSecondary }]}>
              Review labor cost, attendance patterns, and payment status in one clean snapshot.
            </Text>
          </View>

          <View style={styles.timeline}>
            <MetricRow label="Attendance rate" value="92%" color={theme.accent} />
            <MetricRow label="Paid this month" value="₹62,400" color="#006a66" />
            <MetricRow label="Pending due" value="₹12,400" color="#bb1712" />
            <MetricRow label="Site transfers" value="4" color="#00531e" />
          </View>
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.metric}>
      <View style={[styles.metricDot, { backgroundColor: color }]} />
      <View style={styles.metricCopy}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
      </View>
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
  timeline: {
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.84)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  metricDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricCopy: {
    flex: 1,
  },
  metricLabel: {
    color: '#5a6076',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  metricValue: {
    marginTop: 3,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
});
