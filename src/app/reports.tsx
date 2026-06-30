import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { AppHeader } from '@/components/bars/app-header';
import { Fonts } from '@/constants/theme';
import { buildReportSnapshot, useCashbookRows, useLaborers } from '@/database';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Fonts.sans;

export default function ReportsPage() {
  const { theme, mode } = useAppTheme();
  const { data: laborers, loading, error } = useLaborers();
  const rows = useCashbookRows();
  const report = buildReportSnapshot(laborers, {}, rows);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppHeader />

          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reports</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 40 }} />
          ) : error ? (
            <Text style={{ color: theme.error, textAlign: 'center', marginVertical: 40 }}>Error loading reports</Text>
          ) : (
            <>
              <View style={[styles.hero, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Monthly summary</Text>
                <Text style={[styles.heroValue, { color: theme.text }]}>{report.monthlyExpenses}</Text>
                <Text style={[styles.heroCopy, { color: theme.textSecondary }]}>
                  Review labor cost, attendance patterns, and payment status in one clean snapshot.
                </Text>
              </View>

              <View style={styles.timeline}>
                <MetricRow label="Attendance rate" value={report.attendanceRate} color={theme.accent} />
                <MetricRow label="Paid this month" value={report.paidThisMonth} color="#006a66" />
                <MetricRow label="Pending due" value={report.pendingDue} color="#bb1712" />
                <MetricRow label="Site transfers" value={String(report.siteTransfers)} color="#00531e" />
              </View>
            </>
          )}
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.metric, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <View style={[styles.metricDot, { backgroundColor: color }]} />
      <View style={styles.metricCopy}>
        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily,
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
    borderWidth: 1,
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
