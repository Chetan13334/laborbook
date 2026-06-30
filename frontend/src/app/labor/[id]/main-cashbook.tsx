import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { Fonts } from '@/constants/theme';
import { useLaborProfile } from '@/hooks/use-backend-data';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AttendanceToken = 'A' | 'P' | 'OT';

type LedgerRow = {
  day: string;
  weekday: string;
  label?: string;
  notes?: string;
  attendance: AttendanceToken[];
  amount?: string;
  highlighted?: boolean;
};

const rows: LedgerRow[] = [
  { day: '01', weekday: 'Mon', attendance: ['A', 'P', 'OT'] },
  { day: '02', weekday: 'Tue', attendance: ['A', 'P', 'OT'] },
  { day: '03', weekday: 'Wed', attendance: ['A', 'P', 'OT'] },
  { day: '04', weekday: 'Thu', attendance: ['A', 'P', 'OT'] },
  { day: '05', weekday: 'Fri', attendance: ['A', 'P', 'OT'] },
  { day: '06', weekday: 'Sat', attendance: ['A', 'P', 'OT'] },
  { day: '07', weekday: 'Sun', attendance: ['A', 'P', 'OT'] },
  { day: '08', weekday: 'Mon', attendance: ['A', 'P', 'OT'] },
  { day: '09', weekday: 'Tue', attendance: ['A', 'P', 'OT'] },
  { day: '10', weekday: 'Wed', attendance: ['A', 'P', 'OT'] },
];


// const { data, loading, error } = useLaborCashbook(id);

// console.log("MainCashbook:", data);

const fontFamily = Fonts.sans;

const pageColors = {
  light: {
    bg: '#ffffff',
    surface: '#ffffff',
    surfaceSoft: '#f7f8fb',
    surfaceMuted: '#f3f4f6',
    border: '#e5e7eb',
    divider: '#eceef2',
    text: '#111827',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    green: '#2bb673',
    red: '#ef4444',
    purple: '#9b59b6',
    blue: '#2563eb',
    blueSoft: '#eef4ff',
    blueBorder: '#dbe7ff',
    blackFab: '#111111',
    white: '#ffffff',
    amountMuted: '#9aa1ad',
    chevron: '#6b7280',
    shadow: '#000000',
    delete: '#ef4444',
    sheetBg: '#ffffff',
    inputBg: '#ffffff',
    inputBorder: '#d9dde5',
    inputText: '#111827',
    overlay: 'rgba(0,0,0,0.45)',
    pillInactiveBg: '#ffffff',
    headerButtonBg: '#ffffff',
  },

  dark: {
    // main app dark look like your home page
    bg: '#000000',
    surface: '#1b1b1b',
    surfaceSoft: '#202020',
    surfaceMuted: '#242424',

    border: '#2f2f2f',
    divider: '#2a2a2a',

    text: '#ffffff',
    textMuted: '#a1a1aa',
    textLight: '#6b7280',

    green: '#22c55e',
    red: '#ef4444',
    purple: '#101010ff',

    // keep report section blue but softer
    blue: '#3b82f6',
    blueSoft: '#111827',
    blueBorder: '#1f2937',

    blackFab: '#111111',
    white: '#ffffff',
    amountMuted: '#a1a1aa',
    chevron: '#d4d4d8',
    shadow: '#000000',
    delete: '#ef4444',

    // sheets / modal
    sheetBg: '#171717',
    inputBg: '#0f0f0f',
    inputBorder: '#2f2f2f',
    inputText: '#ffffff',
    overlay: 'rgba(0,0,0,0.6)',

    // extra helpers
    pillInactiveBg: '#1b1b1b',
    headerButtonBg: '#ffffff',
  },
};

export default function LaborDetailPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { mode } = useAppTheme();

  const colors = useMemo(
    () => (mode === 'dark' ? pageColors.dark : pageColors.light),
    [mode]
  );

  const { data: profile, loading, error } = useLaborProfile(typeof id === 'string' ? id : undefined);
  const detailPath = `/labor/${id ?? profile?.id}/profile` as const;

  const [ledgerRows, setLedgerRows] = useState(rows);
  const [filterOpen, setFilterOpen] = useState(false);
  const [month, setMonth] = useState('Jun');
  const [year, setYear] = useState('2026');

  const [editRow, setEditRow] = useState<LedgerRow | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const amountInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editRow) {
      requestAnimationFrame(() => amountInputRef.current?.focus());
    }
  }, [editRow]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    router.replace('/labor');
  };

  const openEditSheet = (row: LedgerRow) => {
    setEditRow(row);
    setEditAmount(row.amount?.replace(/[^\d.]/g, '') ?? '');
    setEditNotes(row.notes ?? '');
  };

  const toggleAttendance = (day: string, token: AttendanceToken) => {
    setLedgerRows((current) =>
      current.map((row) => {
        if (row.day !== day) return row;

        const exists = row.attendance.includes(token);

        return {
          ...row,
          attendance: exists
            ? row.attendance.filter((item) => item !== token)
            : [...row.attendance, token],
        };
      })
    );
  };

  const totalPresent = useMemo(() => {
    return ledgerRows.filter((row) => row.attendance.includes('P')).length;
  }, [ledgerRows]);

  const totalAbsent = useMemo(() => {
    return ledgerRows.filter((row) => row.attendance.includes('A')).length;
  }, [ledgerRows]);

  const totalAdvance = useMemo(() => {
    const total = ledgerRows.reduce((sum, row) => {
      if (!row.amount) return sum;
      const numeric = Number(String(row.amount).replace(/[^\d.]/g, ''));
      return sum + (Number.isNaN(numeric) ? 0 : numeric);
    }, 0);

    return total.toFixed(1);
  }, [ledgerRows]);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.red }}>Profile not found or error loading.</Text>
        <Pressable onPress={handleBack} style={{ marginTop: 20, padding: 10, backgroundColor: colors.surface, borderRadius: 8 }}>
          <Text style={{ color: colors.text }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
      <AppBackdrop />

      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} style={styles.backButton} hitSlop={10}>
              <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
            </Pressable>

            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {profile.name}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              onPress={() => router.push(detailPath)}
              style={[
                styles.editButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                // add your delete logic here if needed
              }}
              hitSlop={10}
            >
              <Text style={[styles.deleteIcon, { color: colors.delete }]}>🗑</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Overview */}
          <View style={styles.overviewWrap}>
            <View style={styles.overviewTop}>
              <Text style={[styles.overviewTitle, { color: colors.textMuted }]}>
                Overview
              </Text>

              <Pressable
                onPress={() => setFilterOpen(true)}
                style={[
                  styles.monthPicker,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.monthPickerText, { color: colors.text }]}>
                  {month} {year}
                </Text>
                <Text style={[styles.monthPickerChevron, { color: colors.text }]}>
                  ▾
                </Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <SummaryStat
                value={`${totalPresent.toFixed(1)}`}
                label="Total Present"
                valueColor={colors.green}
                colors={colors}
              />
              <SummaryStat
                value={`${totalAbsent.toFixed(1)}`}
                label="Total Absent"
                valueColor={colors.red}
                colors={colors}
              />
              <SummaryStat
                value="0h"
                label="Over time"
                valueColor={colors.text}
                colors={colors}
              />
              <SummaryStat
                value={`₹${totalAdvance}`}
                label="Total Advance"
                valueColor={colors.text}
                colors={colors}
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.reportBar,
              {
                backgroundColor: colors.blue,
                borderTopColor: colors.blueBorder,
                borderBottomColor: colors.blueBorder,
              },
            ]}
          >
            <Text style={[styles.reportText, { color: '#ffffff' }]}>
               Open Report
            </Text>
          </Pressable>

          <View
            style={[
              styles.tableWrap,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.tableHeader,
                {
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.th, styles.colDate, { color: colors.text }]}>
                Date
              </Text>
              <Text style={[styles.th, styles.colAttendance, { color: colors.text }]}>
                Attendance
              </Text>
              <Text style={[styles.th, styles.colAmount, { color: colors.text }]}>
                ₹ / Notes
              </Text>
            </View>

            {ledgerRows.map((row, index) => (
              <LedgerRowView
                key={`${row.day}-${row.weekday}`}
                row={row}
                isLast={index === ledgerRows.length - 1}
                colors={colors}
                onToggleAttendance={toggleAttendance}
                onEditRow={openEditSheet}
              />
            ))}
          </View>
        </ScrollView>

        {/* Share FAB */}
        <Pressable
          style={[
            styles.fab,
            {
              backgroundColor: colors.blackFab,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Text style={[styles.fabText, { color: colors.white }]}>
            Share to {profile.name}
          </Text>
        </Pressable>

        {/* Month filter */}
        <MonthFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          month={month}
          year={year}
          onSelectMonth={setMonth}
          onSelectYear={setYear}
          colors={colors}
        />

        <EditLedgerSheet
          row={editRow}
          amount={editAmount}
          notes={editNotes}
          amountInputRef={amountInputRef}
          onChangeAmount={setEditAmount}
          onChangeNotes={setEditNotes}
          onClose={() => setEditRow(null)}
          colors={colors}
          onSave={() => {
            if (!editRow) return;

            const formattedAmount = editAmount.trim()
              ? `₹${editAmount.trim()}`
              : undefined;

            setLedgerRows((current) =>
              current.map((row) =>
                row.day === editRow.day
                  ? {
                      ...row,
                      amount: formattedAmount,
                      notes: editNotes.trim() || undefined,
                      highlighted: Boolean(editAmount.trim()),
                    }
                  : row
              )
            );

            setEditRow(null);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

function SummaryStat({
  value,
  label,
  valueColor,
  colors,
}: {
  value: string;
  label: string;
  valueColor: string;
  colors: (typeof pageColors)['light'] | (typeof pageColors)['dark'];
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function LedgerRowView({
  row,
  isLast,
  colors,
  onToggleAttendance,
  onEditRow,
}: {
  row: LedgerRow;
  isLast: boolean;
  colors: (typeof pageColors)['light'] | (typeof pageColors)['dark'];
  onToggleAttendance: (day: string, token: AttendanceToken) => void;
  onEditRow: (row: LedgerRow) => void;
}) {
  return (
    <View
      style={[
        styles.ledgerRow,
        {
          backgroundColor: row.highlighted ? colors.surfaceSoft : colors.surface,
          borderBottomColor: colors.divider,
        },
        !isLast && styles.ledgerRowBorder,
      ]}
    >
      <View style={styles.dateCell}>
        <Text style={[styles.dateNumber, { color: colors.text }]}>{row.day}</Text>
        <Text style={[styles.dateWeekday, { color: colors.text }]}>
          {row.weekday}
        </Text>
      </View>

      <View style={styles.attendanceCell}>
        <Pressable onPress={() => onToggleAttendance(row.day, 'A')}>
          <StatusPill
            label="A"
            tone="absent"
            active={row.attendance.includes('A')}
            colors={colors}
          />
        </Pressable>

        <Pressable onPress={() => onToggleAttendance(row.day, 'P')}>
          <StatusPill
            label="P"
            tone="present"
            active={row.attendance.includes('P')}
            colors={colors}
          />
        </Pressable>

        <Pressable onPress={() => onToggleAttendance(row.day, 'OT')}>
          <StatusPill
            label="OT"
            tone="overtime"
            active={row.attendance.includes('OT')}
            colors={colors}
          />
        </Pressable>

        <Pressable style={styles.moreButton}>
          <Text style={[styles.moreIcon, { color: colors.textMuted }]}>⋮</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => onEditRow(row)}
        style={styles.amountCell}
      >
        <Text
          style={[
            styles.amountText,
            { color: row.amount ? colors.red : colors.amountMuted },
          ]}
          numberOfLines={1}
        >
          {row.amount ?? '₹'}
        </Text>
        <Text style={[styles.chevron, { color: colors.chevron }]}>›</Text>
      </Pressable>
    </View>
  );
}

function StatusPill({
  label,
  tone,
  active = false,
  colors,
}: {
  label: 'A' | 'P' | 'OT';
  tone: 'absent' | 'present' | 'overtime';
  active?: boolean;
  colors: (typeof pageColors)['light'] | (typeof pageColors)['dark'];
}) {
  const toneColor =
    tone === 'absent'
      ? colors.red
      : tone === 'present'
      ? colors.green
      : colors.purple;

  return (
    <View
      style={[
        styles.attendancePill,
        {
          borderColor: toneColor,
          backgroundColor: active ? toneColor : colors.surface,
        },
      ]}
    >
      <Text
        style={[
          styles.attendancePillText,
          { color: active ? '#ffffff' : toneColor },
        ]}
      >
        {label}
      </Text>
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
  colors,
}: {
  open: boolean;
  onClose: () => void;
  month: string;
  year: string;
  onSelectMonth: (value: string) => void;
  onSelectYear: (value: string) => void;
  colors: (typeof pageColors)['light'] | (typeof pageColors)['dark'];
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2024', '2025', '2026', '2027'];

  return (
    <Modal transparent visible={open} animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={[styles.sheetBackdrop, { backgroundColor: colors.overlay }]}
        onPress={onClose}
      />
      <View style={[styles.sheet, { backgroundColor: colors.sheetBg }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.textLight }]} />

        <Text style={[styles.sheetTitle, { color: colors.text }]}>
          Select Month & Year
        </Text>

        <View style={styles.sheetRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {months.map((item) => {
              const selected = item === month;
              return (
                <Pressable
                  key={item}
                  onPress={() => onSelectMonth(item)}
                  style={[
                    styles.filterPill,
                    {
                      borderColor: selected ? colors.blue : colors.border,
                      backgroundColor: selected ? colors.blueSoft : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: selected ? colors.blue : colors.textMuted },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sheetRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {years.map((item) => {
              const selected = item === year;
              return (
                <Pressable
                  key={item}
                  onPress={() => onSelectYear(item)}
                  style={[
                    styles.filterPill,
                    {
                      borderColor: selected ? colors.blue : colors.border,
                      backgroundColor: selected ? colors.blueSoft : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: selected ? colors.blue : colors.textMuted },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          onPress={onClose}
          style={[styles.sheetButton, { backgroundColor: colors.blue }]}
        >
          <Text style={[styles.sheetButtonText, { color: '#ffffff' }]}>OK</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function EditLedgerSheet({
  row,
  amount,
  notes,
  amountInputRef,
  onChangeAmount,
  onChangeNotes,
  onClose,
  onSave,
  colors,
}: {
  row: LedgerRow | null;
  amount: string;
  notes: string;
  amountInputRef: React.RefObject<TextInput | null>;
  onChangeAmount: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  colors: (typeof pageColors)['light'] | (typeof pageColors)['dark'];
}) {
  return (
    <Modal transparent visible={Boolean(row)} animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={[styles.sheetBackdrop, { backgroundColor: colors.overlay }]}
        onPress={onClose}
      />

      <View style={[styles.sheet, { backgroundColor: colors.sheetBg }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.textLight }]} />

        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.surface }]}
          hitSlop={10}
        >
          <Text style={[styles.closeButtonText, { color: colors.text }]}>×</Text>
        </Pressable>

        <View style={styles.editSheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              Advance amount
            </Text>
            <Text style={[styles.sheetSubTitle, { color: colors.textMuted }]}>
              to {row?.label ?? 'entry'}
            </Text>
          </View>

          <Text style={[styles.sheetDate, { color: colors.text }]}>
            {row ? `${row.day} ${row.weekday}` : ''}
          </Text>
        </View>

        <View style={styles.amountRow}>
          <View
            style={[
              styles.amountInputWrap,
              { borderBottomColor: colors.inputBorder },
            ]}
          >
            <Text style={[styles.rupee, { color: colors.text }]}>₹</Text>

            <TextInput
              ref={amountInputRef}
              value={amount}
              onChangeText={onChangeAmount}
              autoFocus
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textLight}
              style={[styles.amountInput, { color: colors.inputText }]}
            />
          </View>
        </View>

        <Text style={[styles.notesLabel, { color: colors.text }]}>Notes</Text>

        <TextInput
          value={notes}
          onChangeText={onChangeNotes}
          placeholder="Eg. Food, petrol, rent"
          placeholderTextColor={colors.textLight}
          style={[
            styles.notesInput,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.inputText,
            },
          ]}
        />

        <Pressable
          onPress={onSave}
          style={[styles.sheetButton, { backgroundColor: colors.blue }]}
        >
          <Text style={[styles.sheetButtonText, { color: '#ffffff' }]}>OK</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  /* HEADER */
  header: {
    minHeight: 64,
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
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily,
  },
  headerTitle: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    fontFamily,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 24,
    lineHeight: 24,
  },

  /* CONTENT */
  content: {
    paddingBottom: 140,
  },

  /* OVERVIEW */
  overviewWrap: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
  },
  overviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  overviewTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  monthPicker: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthPickerIcon: {
    fontSize: 16,
  },
  monthPickerText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  monthPickerChevron: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    fontFamily,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily,
  },

  /* REPORT */
  reportBar: {
    minHeight: 58,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },

  /* TABLE */
  tableWrap: {
    borderTopWidth: 1,
  },
  tableHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  th: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
    paddingHorizontal: 14,
  },
  colDate: {
    width: 92,
  },
  colAttendance: {
    flex: 1,
  },
  colAmount: {
    width: 120,
  },

  ledgerRow: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ledgerRowBorder: {
    borderBottomWidth: 1,
  },

  dateCell: {
    width: 92,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily,
  },
  dateWeekday: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily,
  },

  attendanceCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  attendancePill: {
    minWidth: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  attendancePillText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
  },

  moreButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  moreIcon: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },

  amountCell: {
    width: 120,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  amountText: {
    maxWidth: 70,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
    textAlign: 'right',
  },
  chevron: {
    fontSize: 26,
    lineHeight: 26,
    fontWeight: '400',
    fontFamily,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 42,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  fabText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },

  /* SHEETS */
  sheetBackdrop: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '88%',
    gap: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
  },
  sheetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    fontFamily,
  },
  sheetSubTitle: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily,
  },
  sheetRow: {
    gap: 10,
  },
  pillRow: {
    gap: 10,
    paddingRight: 16,
  },
  filterPill: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
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
    marginTop: 4,
  },
  sheetButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },

  /* EDIT SHEET */
  closeButton: {
    position: 'absolute',
    right: 18,
    top: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
    fontFamily,
  },
  editSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sheetDate: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily,
  },
  amountRow: {
    width: '100%',
  },
  amountInputWrap: {
    width: '100%',
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 4,
    gap: 8,
  },
  rupee: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    fontFamily,
  },
  amountInput: {
    flex: 1,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    paddingVertical: 0,
    fontFamily,
  },
  notesLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  notesInput: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    fontFamily,
  },
});
