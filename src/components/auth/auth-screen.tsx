import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { buildDashboardSnapshot, useCashbookRows, useLaborers } from '@/database';
import { useRouter, type Href } from 'expo-router';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ActionItem = {
  label: string;
  icon: string;
  accent: string;
  route: Href;
};

const actions: ActionItem[] = [
  { label: 'Add Labor', icon: 'person_add', accent: '#ffffff', route: '/labor/add' },
  { label: 'Cashbook', icon: 'book', accent: '#ffffff', route: '/cashbook' },
  { label: 'Reports', icon: 'bar_chart', accent: '#ffffff', route: '/reports' },
  { label: 'Settings', icon: 'settings', accent: '#ffffff', route: '/settings' },
];

const materialIcons: Record<string, string> = {
  notifications: 'notifications',
  groups: 'groups',
  how_to_reg: 'how_to_reg',
  pending_actions: 'pending_actions',
  payments: 'payments',
  person_add: 'person_add',
  add_card: 'add_card',
  book: 'book',
  bar_chart: 'bar_chart',
  fact_check: 'fact_check',
  home: 'home',
  analytics: 'analytics',
  settings: 'settings',
  work: 'work',
  arrow_forward: 'arrow_forward',
};

const iconFallbacks: Record<string, string> = {
  notifications: '\u{1F514}',
  groups: '\u{1F465}',
  how_to_reg: '\u2705',
  pending_actions: '\u23F3',
  payments: '\u{1F4B3}',
  person_add: '\u2795',
  add_card: '\u{1F4B3}',
  book: '\u{1F4D8}',
  bar_chart: '\u{1F4CA}',
  fact_check: '\u2611\uFE0F',
  home: '\u{1F3E0}',
  analytics: '\u{1F4C8}',
  settings: '\u2699\uFE0F',
  work: '\u{1F6E0}',
  arrow_forward: '\u2192',
};

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function HomePage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();
  const { data: laborers, loading, error } = useLaborers();
  const cashbookRows = useCashbookRows();
  const dashboard = buildDashboardSnapshot(laborers, cashbookRows);

  const recentLaborers = laborers.slice(0, 4);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <AppBackdrop />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <AppBackdrop />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View
            style={[
              styles.headerCard,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View style={[styles.avatar, { backgroundColor: mode === 'dark' ? '#ffffff' : theme.accent }]} />
                <View>
                  <Text style={[styles.brand, { color: theme.text }]}>SiteBook</Text>
                  <Text style={[styles.brandMeta, { color: theme.textSecondary }]}>
                    Operations dashboard
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/notifications')}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: mode === 'dark' ? '#111111' : theme.accentSoft,
                    borderColor: theme.border,
                  },
                ]}
              >
                <MaterialIcon
                  name="notifications"
                  color={mode === 'dark' ? '#ffffff' : theme.accent}
                  size={22}
                />
              </Pressable>
            </View>
          </View>

          {/* Title + CTA */}
          <View style={styles.pageHeadingRow}>
            <View style={styles.pageHeadingCopy}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>SiteBook</Text>
              <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>My labors</Text>
            </View>

            <Pressable
              onPress={() => router.push('/labor/add')}
              style={({ pressed }) => [
                styles.addLaborButton,
                {
                  backgroundColor: mode === 'dark' ? '#ffffff' : theme.text,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.addLaborButtonText,
                  { color: mode === 'dark' ? '#111111' : '#ffffff' },
                ]}
              >
                Add Labor
              </Text>
            </Pressable>
          </View>

          {/* Search */}
          <Pressable
            onPress={() => router.push('/labor')}
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
              },
            ]}
          >
            <MaterialIcon
              name="work"
              color={theme.textSecondary}
              size={16}
            />
            <Text style={[styles.searchPlaceholder, { color: theme.textSecondary }]}>
              Search by name, role or amount...
            </Text>
          </Pressable>

          {/* Overview */}
          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
              <Text style={[styles.sectionHint, { color: theme.textSecondary }]}>Today</Text>
            </View>

            <View style={styles.statsGrid}>
              <OverviewCard
                label="Total Labor"
                value={String(dashboard.totalLabor)}
                icon="groups"
                accent="#4da3ff"
              />
              <OverviewCard
                label="Present"
                value={String(dashboard.presentToday)}
                icon="how_to_reg"
                accent="#31c46d"
              />
              <OverviewCard
                label="Pending"
                value={dashboard.pendingPayments}
                icon="pending_actions"
                accent="#ff6b57"
              />
              <OverviewCard
                label="Expenses"
                value={dashboard.monthlyExpenses}
                icon="payments"
                accent="#d9d9d9"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
              <Text style={[styles.sectionHint, { color: theme.textSecondary }]}>Tap to open</Text>
            </View>

            <View style={styles.actionsGrid}>
              {actions.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() => router.push(action.route)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    {
                      backgroundColor: theme.surfaceElevated,
                      borderColor: theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.actionIconWrap}>
                    <MaterialIcon name={action.icon} color={theme.text} size={20} />
                  </View>
                  <Text style={[styles.actionLabel, { color: theme.text }]}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent Laborers */}
          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>My Labors</Text>

              {laborers.length > 0 ? (
                <Pressable onPress={() => router.push('/labor')}>
                  <Text style={[styles.viewAll, { color: theme.accent }]}>View All</Text>
                </Pressable>
              ) : null}
            </View>

            {error ? (
              <View
                style={[
                  styles.emptyStateCard,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  Something went wrong
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  We couldn’t load your labor data right now.
                </Text>
              </View>
            ) : laborers.length === 0 ? (
              <View
                style={[
                  styles.emptyStateCard,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.emptyIconWrap,
                    {
                      backgroundColor: mode === 'dark' ? '#111111' : theme.accentSoft,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <MaterialIcon
                    name="groups"
                    color={mode === 'dark' ? '#ffffff' : theme.accent}
                    size={24}
                  />
                </View>

                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No laborers yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Add your first labor profile to start tracking attendance, payments, and cashbook activity.
                </Text>

                <Pressable
                  onPress={() => router.push('/labor/add')}
                  style={({ pressed }) => [
                    styles.emptyButton,
                    {
                      backgroundColor: mode === 'dark' ? '#ffffff' : theme.accent,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.emptyButtonText,
                      { color: mode === 'dark' ? '#111111' : '#ffffff' },
                    ]}
                  >
                    Add Labor
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.laborerStack}>
                {recentLaborers.map((laborer: any) => {
                  const name = laborer.full_name ?? laborer.name ?? 'Labor';
                  const role = laborer.work_type ?? laborer.role ?? 'Worker';
                  const amount =
                    laborer.amount ??
                    laborer.pending_amount ??
                    laborer.daily_wage ??
                    null;

                  const initials = getInitials(name);

                  return (
                    <Pressable
                      key={laborer.id ?? name}
                      onPress={() => {
                        if (laborer.id) {
                          router.push(`/labor/${laborer.id}/profile` as Href);
                        } else {
                          router.push('/labor');
                        }
                      }}
                      style={({ pressed }) => [
                        styles.laborerCard,
                        {
                          backgroundColor: theme.surfaceElevated,
                          borderColor: theme.border,
                        },
                        pressed && styles.pressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.initialsBubble,
                          {
                            backgroundColor: mode === 'dark' ? '#000000' : theme.accentSoft,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.initialsText,
                            { color: mode === 'dark' ? '#ffffff' : theme.accent },
                          ]}
                        >
                          {initials}
                        </Text>
                      </View>

                      <View style={styles.laborerCopy}>
                        <Text style={[styles.laborerName, { color: theme.text }]}>
                          {name}
                        </Text>
                        <Text style={[styles.laborerMeta, { color: theme.textSecondary }]}>
                          {role}
                        </Text>
                      </View>

                      <View style={styles.laborerRight}>
                        {amount !== null && amount !== undefined ? (
                          <Text style={[styles.amountText, { color: theme.text }]}>
                            {formatMoney(amount)}
                          </Text>
                        ) : null}
                        <MaterialIcon
                          name="arrow_forward"
                          color={theme.textSecondary}
                          size={16}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Add Button */}
        <Pressable
          onPress={() => router.push('/labor/add')}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: mode === 'dark' ? '#ffffff' : theme.accent,
            },
            pressed && styles.pressed,
          ]}
        >
          <MaterialIcon
            name="person_add"
            color={mode === 'dark' ? '#111111' : '#ffffff'}
            size={24}
            filled
          />
        </Pressable>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function OverviewCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
}) {
  const { theme, mode } = useAppTheme();

  return (
    <View
      style={[
        styles.overviewCard,
        {
          backgroundColor: theme.surfaceElevated,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.overviewTopRow}>
        <Text style={[styles.overviewLabel, { color: theme.textSecondary }]}>{label}</Text>
        <MaterialIcon name={icon} color={accent} size={18} />
      </View>

      <Text style={[styles.overviewValue, { color: theme.text }]}>{value}</Text>

      <View
        style={[
          styles.overviewAccentBar,
          {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <View style={[styles.overviewAccentFill, { backgroundColor: accent }]} />
      </View>
    </View>
  );
}

function MaterialIcon({
  name,
  color,
  size,
  filled = false,
}: {
  name: string;
  color: string;
  size: number;
  filled?: boolean;
}) {
  const glyph = Platform.OS === 'web' ? materialIcons[name] ?? name : iconFallbacks[name] ?? '?';

  const webFillStyle =
    Platform.OS === 'web' && filled
      ? ({ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } as any)
      : null;

  return (
    <Text
      style={[
        styles.icon,
        webFillStyle,
        {
          color,
          fontSize: size,
          lineHeight: size,
        },
      ]}
    >
      {glyph}
    </Text>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatMoney(value: string | number) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}`;
}

const sharedShadow =
  Platform.OS === 'android'
    ? { elevation: 2 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      };

const sharedShadowLarge =
  Platform.OS === 'android'
    ? { elevation: 8 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 150,
    gap: 18,
  },

  headerCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...sharedShadow,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  brand: {
    fontSize: 19,
    fontWeight: '800',
    fontFamily,
  },
  brandMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  pageHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pageHeadingCopy: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    fontFamily,
  },
  pageSubtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily,
  },
  addLaborButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLaborButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },

  searchBar: {
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...sharedShadow,
  },
  searchPlaceholder: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
  },

  sectionSpacing: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  overviewCard: {
    width: '48.5%',
    minHeight: 116,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    ...sharedShadow,
  },
  overviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  overviewValue: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontFamily,
  },
  overviewAccentBar: {
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  overviewAccentFill: {
    width: '65%',
    height: '100%',
    borderRadius: 999,
  },

  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...sharedShadow,
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  actionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily,
    textAlign: 'center',
  },

  laborerStack: {
    gap: 10,
  },
  laborerCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...sharedShadow,
  },
  initialsBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    fontFamily,
  },
  laborerCopy: {
    flex: 1,
    gap: 2,
  },
  laborerName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily,
  },
  laborerMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  laborerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  viewAll: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },

  emptyStateCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...sharedShadow,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    fontFamily,
    textAlign: 'center',
  },
  emptySubtitle: {
    maxWidth: 280,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 6,
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },

  fab: {
    position: 'absolute',
    right: 22,
    bottom: 94,
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...sharedShadowLarge,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },

  icon: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Material Symbols Outlined' : undefined,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});