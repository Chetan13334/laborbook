import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppBottomBar } from '@/components/layout/app-bottom-bar';
import { Fonts } from '@/constants/theme';
import { buildDashboardSnapshot } from '@/lib/dashboard';
import { useCashbookRows, useLaborers } from '@/hooks/use-backend-data';
import { useRouter, type Href } from 'expo-router';
import { ActivityIndicator, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StatCard = {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  accent: string;
};

type ActionItem = {
  label: string;
  icon: string;
  accent: string;
  route: Href;
};

type LaborerItem = {
  initials: string;
  name: string;
  role: string;
  status: string;
  amount: string;
  amountColor: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  muted?: boolean;
};

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
};

const actions: ActionItem[] = [
  { label: 'Add Labor', icon: 'person_add', accent: '#005bbf', route: '/labor/add' },
  { label: 'Add Pay', icon: 'add_card', accent: '#006e2a', route: '/cashbook' },
  { label: 'Cash Book', icon: 'book', accent: '#191c1d', route: '/cashbook' },
  { label: 'Reports', icon: 'bar_chart', accent: '#bb1712', route: '/reports' },
];

const fontFamily = Fonts.sans;


export default function HomePage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();
  const { data: laborers, loading, error } = useLaborers();
  const cashbookRows = useCashbookRows();
  const dashboard = buildDashboardSnapshot(laborers, cashbookRows.data);

  console.log('[Home] laborers:', laborers, 'length:', laborers.length);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
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
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.headerCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
                  <Text style={styles.avatarText}>LB</Text>
                </View>
                <View>
                  <Text style={[styles.brand, { color: theme.text }]}>SiteBook</Text>
                  <Text style={[styles.brandMeta, { color: theme.textSecondary }]}>Operations dashboard</Text>
                </View>
              </View>

              <Pressable onPress={() => router.push('/notifications')} style={[styles.iconButton, { backgroundColor: theme.accentSoft }]}>
                <MaterialIcons
                  name="notifications"
                  size={24}
                  color={theme.accent}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionHint}>Fast access</Text>
            </View>
            <View style={styles.bentoGrid}>
              <StatCardView stat={{ title: 'Total Labor', value: String(dashboard.totalLabor), icon: 'groups', accent: '#005bbf' }} />
              <StatCardView stat={{ title: 'Today', value: String(dashboard.presentToday), subtitle: 'Present', icon: 'how_to_reg', accent: '#006e2a' }} />

              <View style={[styles.pendingCard, { borderColor: theme.border }]}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Pending Payments</Text>
                  <MaterialIcon name="pending_actions" color="#bb1712" size={20} />
                </View>
                <Text style={styles.pendingValue}>{dashboard.pendingPayments}</Text>
                <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                  <View style={styles.progressFill} />
                </View>
              </View>

              <View style={styles.expenseCard}>
                <View>
                  <Text style={styles.expenseLabel}>Total Monthly Expenses</Text>
                  <Text style={styles.expenseValue}>{dashboard.monthlyExpenses}</Text>
                </View>
                <MaterialIcon name="payments" color="rgba(255,255,255,0.22)" size={54} />
              </View>
            </View>
          </View>

          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionHint}>Tap to create</Text>
            </View>
            <View style={styles.actionsGrid}>
              {actions.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() => router.push(action.route)}
                  style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                >
                  <View style={[styles.actionIconShell, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                    <MaterialIcon name={action.icon} color={action.accent} size={22} />
                  </View>
                  <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.sectionSpacing}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Laborers</Text>
              <Pressable onPress={() => router.push('/labor')}>
                <Text style={styles.viewAll}>View All</Text>
              </Pressable>
            </View>

            <View style={styles.laborerStack}>
              {laborers.map((laborer) => (
                <View key={laborer.id} style={[styles.laborerCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, laborer.muted && styles.laborerMuted]}>
                  <View style={[styles.initialsBubble, { backgroundColor: mode === 'dark' ? theme.background : theme.accentSoft, borderColor: theme.border, borderWidth: 1 }]}>
                    <Text style={[styles.initialsText, { color: theme.accent }]}>{laborer.initials}</Text>
                  </View>
                  <View style={styles.laborerCopy}>
                    <Text style={[styles.laborerName, { color: theme.text }]}>{laborer.name}</Text>
                    <Text style={[styles.laborerMeta, { color: theme.textSecondary }]}>
                      {laborer.role} {'\u2022'} {laborer.status}
                    </Text>
                  </View>
                  <View style={styles.amountBlock}>
                    <Text style={[styles.amountText, { color: laborer.amountColor }]}>{laborer.amount}</Text>
                    {laborer.badge ? (
                      <View style={[styles.badge, { backgroundColor: laborer.badgeBg ?? '#e7e8e9' }]}>
                        <Text style={[styles.badgeText, { color: laborer.badgeText ?? '#414754' }]}>
                          {laborer.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <Pressable style={styles.fab}>
          <MaterialIcon name="fact_check" color="#ffffff" size={28} filled />
        </Pressable>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function HeroChip({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.heroChip, { backgroundColor: theme.accentSoft, borderColor: theme.border }, accent && styles.heroChipAccent]}>
      <Text style={[styles.heroChipLabel, { color: theme.textSecondary }, accent && { color: theme.accent }]}>{label}</Text>
      <Text style={[styles.heroChipValue, { color: theme.text }, accent && { color: theme.accent }]}>{value}</Text>
    </View>
  );
}

function StatCardView({ stat }: { stat: StatCard }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.smallCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <View style={styles.cardTopRow}>
        <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>{stat.title}</Text>
        <MaterialIcon name={stat.icon} color={stat.accent} size={20} />
      </View>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
        {stat.subtitle ? <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>{stat.subtitle}</Text> : null}
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

const sharedShadow =
  Platform.OS === 'android'
    ? { elevation: 1 }
    : {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    };

const sharedShadowLarge =
  Platform.OS === 'android'
    ? { elevation: 6 }
    : {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 152,
    gap: 16,
  },
  headerCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#004cca',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  header: {
    minHeight: 48,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#004cca',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004cca',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily,
  },
  brand: {
    color: '#131b2e',
    fontSize: 20,
    fontWeight: '700',
    fontFamily,
  },
  brandMeta: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,76,202,0.08)',
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    shadowColor: '#004cca',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    gap: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroEyebrow: {
    color: '#004cca',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily,
  },
  heroTitle: {
    marginTop: 6,
    color: '#131b2e',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    maxWidth: 280,
    fontFamily,
  },
  heroBadge: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(143,250,155,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeText: {
    color: '#00531e',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    fontFamily,
  },
  heroDescription: {
    color: '#424656',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    fontFamily,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroChip: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(0,76,202,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,76,202,0.10)',
    gap: 2,
  },
  heroChipAccent: {
    backgroundColor: 'rgba(0,76,202,0.10)',
    borderColor: 'rgba(0,76,202,0.16)',
  },
  heroChipLabel: {
    color: '#6b7280',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily,
  },
  heroChipLabelAccent: {
    color: '#004cca',
  },
  heroChipValue: {
    color: '#131b2e',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    fontFamily,
  },
  heroChipValueAccent: {
    color: '#004cca',
  },
  heroButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#004cca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#004cca',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroButtonText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  heroButtonArrow: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  icon: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Material Symbols Outlined' : undefined,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  sectionSpacing: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionHint: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  smallCard: {
    width: '48.5%',
    minHeight: 128,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    padding: 16,
    justifyContent: 'space-between',
    ...(sharedShadow as object),
  },
  pendingCard: {
    width: '100%',
    minHeight: 128,
    backgroundColor: 'rgba(223, 52, 41, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(223, 52, 41, 0.18)',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    ...(sharedShadow as object),
  },
  expenseCard: {
    width: '100%',
    minHeight: 128,
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#004cca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(sharedShadow as object),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: '#5a6076',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  statValue: {
    color: '#191c1d',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    fontFamily,
  },
  statSubtitle: {
    color: '#414754',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily,
  },
  pendingValue: {
    color: '#bb1712',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    fontFamily,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e7e8e9',
    overflow: 'hidden',
  },
  progressFill: {
    width: '66%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#bb1712',
  },
  expenseLabel: {
    color: '#ffffff',
    opacity: 0.92,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily,
  },
  expenseValue: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    fontFamily,
  },
  sectionTitle: {
    color: '#191c1d',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionIconShell: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(193,198,214,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionLabel: {
    color: '#2f384d',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily,
  },
  viewAll: {
    color: '#004cca',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  laborerStack: {
    gap: 8,
  },
  laborerCard: {
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(sharedShadow as object),
  },
  laborerMuted: {
    opacity: 0.6,
  },
  initialsBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d8e2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#004cca',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  laborerCopy: {
    flex: 1,
    gap: 2,
  },
  laborerName: {
    color: '#191c1d',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  laborerMeta: {
    color: '#5a6076',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#004cca',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...(sharedShadowLarge as object),
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
