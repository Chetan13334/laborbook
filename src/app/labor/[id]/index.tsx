import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { useLaborProfile } from '@/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LedgerRow = {
  day: string;
  weekday: string;
  attendance: Array<'A' | 'P' | 'OT'>;
  amount?: string;
  highlighted?: boolean;
};

const rows: LedgerRow[] = [
  { day: '01', weekday: 'Fri', attendance: ['A', 'P', 'OT'] },
  { day: '02', weekday: 'Sat', attendance: ['A', 'P', 'OT'] },
  { day: '05', weekday: 'Tue', attendance: ['P', 'OT'], amount: 'Rs 100', highlighted: true },
  { day: '06', weekday: 'Wed', attendance: ['A', 'P', 'OT'] },
  { day: '07', weekday: 'Thu', attendance: ['A', 'P', 'OT'] },
];

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function LaborDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { theme, mode } = useAppTheme();
  const profile = useLaborProfile(typeof id === 'string' ? id : undefined);
  const detailPath = `/labor/${id ?? profile.id}/profile` as const;
  const [ledgerRows, setLedgerRows] = useState(rows);

  const toggleAttendance = (day: string, token: 'A' | 'P' | 'OT') => {
    setLedgerRows((current) =>
      current.map((row) => {
        if (row.day !== day) {
          return row;
        }

        const hasToken = row.attendance.includes(token);
        return {
          ...row,
          attendance: hasToken ? row.attendance.filter((item) => item !== token) : [...row.attendance, token],
        };
      })
    );
  };

  const toggleAmount = (day: string) => {
    setLedgerRows((current) =>
      current.map((row) => {
        if (row.day !== day) {
          return row;
        }

        return {
          ...row,
          amount: row.amount ? undefined : 'Rs 100',
          highlighted: !row.highlighted,
        };
      })
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={10}>
              <Text style={[styles.icon, { color: theme.text }]}>{'<'}</Text>
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{profile.name}</Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable onPress={() => router.push(detailPath)} style={[styles.editButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}> 
              <Text style={[styles.editButtonText, { color: theme.accent }]}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push(detailPath)}
              style={[styles.profileButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
              hitSlop={10}
            >
              <Text style={[styles.profileIcon, { color: theme.accent }]}>P</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Overview</Text>
              <Pressable style={[styles.monthButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.monthButtonText, { color: theme.text }]}>May 2026 v</Text>
              </Pressable>
            </View>

            <View style={styles.summaryGrid}>
              <SummaryStat value="1.0" label="Total Present" valueColor={theme.success} />
              <SummaryStat value="0.0" label="Total Absent" valueColor={theme.warning} />
              <SummaryStat value="0h" label="Over Time" valueColor={theme.text} />
              <SummaryStat value="Rs 100.0" label="Total Advance" valueColor={theme.text} />
            </View>
          </View>

          <View style={[styles.actionBar, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
            <Text style={[styles.actionText, { color: theme.accent }]}>Open Report</Text>
          </View>

          <View style={[styles.tableCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.th, styles.colDate, { color: theme.textSecondary }]}>Date</Text>
              <Text style={[styles.th, styles.colAttendance, { color: theme.textSecondary }]}>Attendance</Text>
              <Text style={[styles.th, styles.colAmount, { color: theme.textSecondary }]}>Rs / Notes</Text>
            </View>

            {ledgerRows.map((row, index) => (
              <LedgerRowView
                key={`${row.day}-${row.weekday}`}
                row={row}
                isLast={index === ledgerRows.length - 1}
                onToggleAttendance={toggleAttendance}
                onToggleAmount={toggleAmount}
              />
            ))}
          </View>
        </ScrollView>

        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>Share to {profile.name}</Text>
        </Pressable>

      </SafeAreaView>
    </View>
  );
}

function SummaryStat({ value, label, valueColor }: { value: string; label: string; valueColor: string }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

function LedgerRowView({
  row,
  isLast,
  onToggleAttendance,
  onToggleAmount,
}: {
  row: LedgerRow;
  isLast: boolean;
  onToggleAttendance: (day: string, token: 'A' | 'P' | 'OT') => void;
  onToggleAmount: (day: string) => void;
}) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.ledgerRow,
        { backgroundColor: row.highlighted ? theme.backgroundSelected : theme.surfaceElevated },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.dateCell}>
        <Text style={[styles.dateNumber, { color: theme.text }]}>{row.day}</Text>
        <Text style={[styles.dateWeekday, { color: theme.textSecondary }]}>{row.weekday}</Text>
      </View>

      <View style={styles.attendanceCell}>
        <Pressable onPress={() => onToggleAttendance(row.day, 'A')}>
          <StatusPill label="A" tone="absent" active={row.attendance.includes('A')} />
        </Pressable>
        <Pressable onPress={() => onToggleAttendance(row.day, 'P')}>
          <StatusPill label="P" tone="present" active={row.attendance.includes('P') || row.highlighted} />
        </Pressable>
        <Pressable onPress={() => onToggleAttendance(row.day, 'OT')}>
          <StatusPill label="OT" tone="overtime" active={row.attendance.includes('OT')} />
        </Pressable>
        <Text style={[styles.moreIcon, { color: theme.textSecondary }]}>...</Text>
      </View>

      <Pressable onPress={() => onToggleAmount(row.day)} style={styles.amountCell}>
        <Text style={[styles.amountText, { color: row.amount ? theme.warning : theme.textSecondary }]}>
          {row.amount ?? 'Rs'}
        </Text>
        <Text style={[styles.chevron, { color: theme.textSecondary }]}>{'>'}</Text>
      </Pressable>
    </View>
  );
}

function StatusPill({
  label,
  tone,
  active = false,
}: {
  label: 'A' | 'P' | 'OT';
  tone: 'absent' | 'present' | 'overtime';
  active?: boolean;
}) {
  const { theme } = useAppTheme();
  const color = tone === 'absent' ? theme.warning : tone === 'present' ? theme.success : theme.accent;

  return (
    <View
      style={[
        styles.statusBase,
        { borderColor: color, backgroundColor: active ? color : theme.surfaceElevated },
      ]}
    >
      <Text style={[styles.statusText, { color: active ? '#ffffff' : color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20, fontWeight: '800', fontFamily },
  headerTitle: { flexShrink: 1, fontSize: 20, lineHeight: 24, fontWeight: '800', fontFamily },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontFamily },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: { fontSize: 13, lineHeight: 16, fontWeight: '900', fontFamily },
  content: { paddingBottom: 124 },
  overviewSection: { padding: 16, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 14, lineHeight: 18, fontWeight: '600', fontFamily },
  monthButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  monthButtonText: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontFamily },
  summaryGrid: { flexDirection: 'row', gap: 8 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 18, lineHeight: 22, fontWeight: '800', fontFamily },
  summaryLabel: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily,
  },
  actionBar: {
    marginHorizontal: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontSize: 14, lineHeight: 18, fontWeight: '800', fontFamily },
  tableCard: { marginTop: 8, borderTopWidth: 1, borderBottomWidth: 1 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center' },
  th: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontFamily,
  },
  colDate: { width: 80 },
  colAttendance: { flex: 1 },
  colAmount: { width: 100, textAlign: 'right' },
  ledgerRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center' },
  dateCell: { width: 80, paddingHorizontal: 16, paddingVertical: 10 },
  dateNumber: { fontSize: 15, lineHeight: 20, fontWeight: '800', fontFamily },
  dateWeekday: { fontSize: 10, lineHeight: 12, textTransform: 'uppercase', fontWeight: '600', fontFamily },
  attendanceCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  statusBase: {
    minWidth: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 12, lineHeight: 16, fontWeight: '700', fontFamily },
  moreIcon: { marginLeft: 'auto', fontSize: 13, lineHeight: 16, fontWeight: '700', fontFamily },
  amountCell: {
    width: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  amountText: { fontSize: 12, lineHeight: 16, fontWeight: '800', fontFamily },
  chevron: { fontSize: 15, lineHeight: 18, fontWeight: '700', fontFamily },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 96,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#111111',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  fabText: { color: '#ffffff', fontSize: 13, lineHeight: 18, fontWeight: '800', fontFamily },
});
