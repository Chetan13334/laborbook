import { useRouter } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBottomBar } from '@/components/app-bottom-bar';
import { AppBackdrop } from '@/components/app-backdrop';

type Laborer = {
  initials: string;
  name: string;
  role: string;
  status: 'Present' | 'Absent';
  amount: string;
  amountColor: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  muted?: boolean;
};

const laborers: Laborer[] = [
  {
    initials: 'RK',
    name: 'Rajesh Kumar',
    role: 'Mason',
    status: 'Present',
    amount: '\u20B9450',
    amountColor: '#bb1712',
    badge: 'Unpaid',
    badgeBg: '#ba1a1a1a',
    badgeText: '#ba1a1a',
  },
  {
    initials: 'MS',
    name: 'Manoj Singh',
    role: 'Helper',
    status: 'Present',
    amount: '\u20B9300',
    amountColor: '#006e2a',
    badge: 'Paid',
    badgeBg: '#8ffa9b33',
    badgeText: '#00531e',
  },
  {
    initials: 'AP',
    name: 'Amit Patel',
    role: 'Electrician',
    status: 'Absent',
    amount: '\u20B90',
    amountColor: '#414754',
    muted: true,
  },
  {
    initials: 'ST',
    name: 'Suresh Tiwari',
    role: 'Carpenter',
    status: 'Present',
    amount: '\u20B9600',
    amountColor: '#bb1712',
    badge: 'Unpaid',
    badgeBg: '#ba1a1a1a',
    badgeText: '#ba1a1a',
  },
  {
    initials: 'VK',
    name: 'Vikram K.',
    role: 'Painter',
    status: 'Present',
    amount: '\u20B9350',
    amountColor: '#006e2a',
    badge: 'Paid',
    badgeBg: '#8ffa9b33',
    badgeText: '#00531e',
  },
];

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function LaborPage() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Labor</Text>
          <Pressable
            onPress={() => router.push('/labor/add')}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.addButtonText}>Add Labor</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>All Laborers</Text>
            <Text style={styles.summaryValue}>{laborers.length} total records</Text>
          </View>

          <View style={styles.list}>
            {laborers.map((laborer) => (
              <Pressable
                key={laborer.name}
                onPress={() => router.push(`/labor/${toSlug(laborer.name)}`)}
                style={({ pressed }) => [
                  styles.card,
                  laborer.muted && styles.cardMuted,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.initialsBubble}>
                  <Text style={styles.initialsText}>{laborer.initials}</Text>
                </View>

                <View style={styles.copy}>
                  <Text style={styles.name}>{laborer.name}</Text>
                  <Text style={styles.meta}>
                    {laborer.role} {'\u2022'} {laborer.status}
                  </Text>
                </View>

                <View style={styles.right}>
                  <Text style={[styles.amount, { color: laborer.amountColor }]}>{laborer.amount}</Text>
                  {laborer.badge ? (
                    <View style={[styles.badge, { backgroundColor: laborer.badgeBg ?? '#e7e8e9' }]}>
                      <Text style={[styles.badgeText, { color: laborer.badgeText ?? '#414754' }]}>
                        {laborer.badge}
                      </Text>
                    </View>
                  ) : null}
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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e4',
    backgroundColor: '#f8f9fa',
  },
  title: {
    color: '#005bbf',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    fontFamily,
  },
  addButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#005bbf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c1c6d6',
    padding: 16,
    ...(shadow as object),
  },
  summaryLabel: {
    color: '#414754',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  summaryValue: {
    marginTop: 4,
    color: '#191c1d',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily,
  },
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c1c6d6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(shadow as object),
  },
  cardMuted: {
    opacity: 0.6,
  },
  initialsBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e7e8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#005bbf',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: '#191c1d',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily,
  },
  meta: {
    color: '#414754',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
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
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
