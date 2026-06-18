import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { useCashbookRows } from '@/database';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

type CashbookTab = 'cash-out' | 'cash-in';

const rowLabels: Record<string, string> = {
  '01': 'Petrol',
  '02': 'Site Lunch',
  '03': 'Material Purchase',
  '04': 'Transport',
  '05': 'Advance Payment',
  '06': 'Misc Expense',
  '07': 'Rent',
};

export default function CashbookPage() {
  const { theme, mode } = useAppTheme();
  const rows = useCashbookRows();
  const [tab, setTab] = useState<CashbookTab>('cash-out');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [month, setMonth] = useState('June');
  const [year, setYear] = useState('2026');

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const isCashOut = Boolean(row.amount);
      const tabMatch = tab === 'cash-out' ? isCashOut : !isCashOut;
      if (!tabMatch) return false;

      if (!normalized) return true;

      return [row.day, row.weekday, rowLabels[row.day] ?? '', row.amount ?? '', row.attendance.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, rows, tab]);

  const totals = useMemo(() => {
    const cashOutRows = rows.filter((row) => row.amount);
    return {
      entries: cashOutRows.length,
      amount: cashOutRows.length ? cashOutRows.length * 1000 : 0,
    };
  }, [rows]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text }]}>Cash book</Text>

            <Pressable
              onPress={() => setFilterOpen(true)}
              style={[styles.monthButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            >
              <Text style={[styles.monthButtonText, { color: theme.text }]}>{month} {year} ▾</Text>
            </Pressable>
          </View>

          <View style={styles.tabRow}>
            <Pressable onPress={() => setTab('cash-out')} style={styles.tabPressable}>
              <Text style={[styles.tabText, tab === 'cash-out' ? { color: theme.accent } : { color: theme.textSecondary }]}>
                CASH OUT
              </Text>
              {tab === 'cash-out' ? <View style={[styles.tabUnderline, { backgroundColor: theme.accent }]} /> : null}
            </Pressable>
            <Pressable onPress={() => setTab('cash-in')} style={styles.tabPressable}>
              <Text style={[styles.tabText, tab === 'cash-in' ? { color: theme.accent } : { color: theme.textSecondary }]}>
                CASH IN
              </Text>
              {tab === 'cash-in' ? <View style={[styles.tabUnderline, { backgroundColor: theme.accent }]} /> : null}
            </Pressable>
          </View>

          <View style={[styles.searchShell, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.searchIcon, { color: theme.accent }]}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={tab === 'cash-out' ? 'Search by Expense name' : 'Search by income name'}
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <View style={styles.summaryTop}>
              <View style={styles.summaryColumn}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>TOTAL ENTRIES</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>{totals.entries}</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
              <View style={styles.summaryColumn}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>TOTAL CASH OUT</Text>
                <Text style={[styles.summaryValue, { color: '#d93025' }]}>₹ {totals.amount.toFixed(1)}</Text>
              </View>
            </View>

            <View style={[styles.summaryBottom, { borderTopColor: theme.border }]}>
              <Text style={[styles.viewReports, { color: theme.accent }]}>View reports</Text>
            </View>
          </View>

          <View style={styles.listSection}>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <View
                  key={`${row.day}-${row.weekday}-${row.amount ?? 'empty'}`}
                  style={[styles.rowCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
                >
                  <View>
                    <Text style={[styles.rowDay, { color: theme.text }]}>{row.day}</Text>
                    <Text style={[styles.rowWeekday, { color: theme.textSecondary }]}>{row.weekday}</Text>
                  </View>

                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, { color: theme.text }]}>
                      {rowLabels[row.day] ?? (tab === 'cash-out' ? 'Cash Out' : 'Cash In')}
                    </Text>
                    <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>{row.attendance.join(' • ')}</Text>
                  </View>

                  <Text style={[styles.rowAmount, { color: row.amount ? '#d93025' : theme.textSecondary }]}>
                    {row.amount ?? '₹ 0'}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Add your first entry</Text>
                <Text style={[styles.emptyArrow, { color: theme.accent }]}>↓</Text>
                <Pressable style={[styles.cashOutButton, { backgroundColor: '#c83737' }]}>
                  <Text style={styles.cashOutButtonText}>⊖</Text>
                  <Text style={styles.cashOutButtonLabel}>Cash Out</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        <MonthFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          month={month}
          year={year}
          onSelectMonth={setMonth}
          onSelectYear={setYear}
        />

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function MonthFilterSheet({
  open,
  onClose,
  month,
  year,
  onSelectMonth,
  onSelectYear,
}: {
  open: boolean;
  onClose: () => void;
  month: string;
  year: string;
  onSelectMonth: (value: string) => void;
  onSelectYear: (value: string) => void;
}) {
  const { theme } = useAppTheme();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2024', '2025', '2026', '2027'];

  return (
    <Modal transparent visible={open} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: theme.surfaceElevated }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sheetTitle, { color: theme.text }]}>Select Month & Year</Text>

        <View style={styles.sheetRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {months.map((item) => {
              const selected = item === month;
              return (
                <Pressable
                  key={item}
                  onPress={() => onSelectMonth(item)}
                  style={[styles.pill, { borderColor: theme.border }, selected && { borderColor: theme.accent, backgroundColor: theme.accentSoft }]}
                >
                  <Text style={[styles.pillText, { color: selected ? theme.accent : theme.text }]}>{item}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sheetRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {years.map((item) => {
              const selected = item === year;
              return (
                <Pressable
                  key={item}
                  onPress={() => onSelectYear(item)}
                  style={[styles.pill, { borderColor: theme.border }, selected && { borderColor: theme.accent, backgroundColor: theme.accentSoft }]}
                >
                  <Text style={[styles.pillText, { color: selected ? theme.accent : theme.text }]}>{item}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable onPress={onClose} style={[styles.sheetButton, { backgroundColor: theme.accent }]}>
          <Text style={[styles.sheetButtonText, { color: theme.background }]}>Ok</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const shadow =
  Platform.OS === 'android'
    ? { elevation: 1 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.8,
    fontFamily,
  },
  monthButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...(shadow as object),
  },
  monthButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(127,127,127,0.35)',
  },
  sheetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    fontFamily,
  },
  sheetRow: {
    gap: 10,
  },
  pillRow: {
    gap: 10,
    paddingRight: 16,
  },
  pill: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
  },
  sheetButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 2,
  },
  tabPressable: {
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 0.4,
    fontFamily,
  },
  tabUnderline: {
    marginTop: 10,
    width: 120,
    height: 4,
    borderRadius: 999,
  },
  searchShell: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    ...(shadow as object),
  },
  searchIcon: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    fontFamily,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    ...(shadow as object),
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 20,
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily,
  },
  summaryValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    fontFamily,
  },
  summaryBottom: {
    borderTopWidth: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  viewReports: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontFamily,
  },
  listSection: {
    gap: 10,
  },
  rowCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(shadow as object),
  },
  rowDay: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
  rowWeekday: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily,
  },
  rowCopy: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  rowMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  rowAmount: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    fontFamily,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    fontFamily,
  },
  emptyArrow: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
    fontFamily,
  },
  cashOutButton: {
    minHeight: 64,
    paddingHorizontal: 28,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...(shadow as object),
  },
  cashOutButtonText: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '900',
    fontFamily,
  },
  cashOutButtonLabel: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontFamily,
  },
});
