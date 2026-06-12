import { useLocalSearchParams, useRouter } from 'expo-router';
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

type Profile = {
  id: string;
  name: string;
  role: string;
  dailyRate: string;
  joinedDate: string;
  workSites: string;
  pendingDues: string;
  duesNote: string;
  attendance: {
    present: number;
    absent: number;
    upcoming: number;
  };
  activity: {
    title: string;
    time: string;
    description: string;
    icon: string;
    color: string;
  }[];
  payments: {
    title: string;
    ref: string;
    date: string;
    amount: string;
  }[];
};

const profiles: Record<string, Profile> = {
  'rajesh-kumar': {
    id: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    role: 'Skilled Mason',
    dailyRate: '₹850.00',
    joinedDate: '12 Oct 2023',
    workSites: 'Vesta Plaza, Orion Heights',
    pendingDues: '₹12,400.00',
    duesNote: 'Unpaid amount for 14 working days including overtime.',
    attendance: {
      present: 12,
      absent: 2,
      upcoming: 16,
    },
    activity: [
      {
        title: 'Marked Present',
        time: 'Today, 08:30 AM',
        description: 'Logged attendance for Orion Heights site. Shift start recorded.',
        icon: 'check',
        color: '#0053da',
      },
      {
        title: 'Partial Payment Released',
        time: 'Yesterday',
        description: 'Payment of ₹5,000.00 processed via Bank Transfer.',
        icon: 'payments',
        color: '#006a66',
      },
      {
        title: 'Site Transfer',
        time: '14 Jan, 2024',
        description: 'Moved from Vesta Plaza to Orion Heights Project.',
        icon: 'construction',
        color: '#0e6500',
      },
    ],
    payments: [
      {
        title: 'January Salary (Advance)',
        ref: '#TXN-008912',
        date: '15 Jan 2024',
        amount: '₹5,000.00',
      },
      {
        title: 'December Settlement',
        ref: '#TXN-007742',
        date: '02 Jan 2024',
        amount: '₹24,500.00',
      },
    ],
  },
};

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function LaborProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const profile = id ? profiles[String(id)] ?? profiles['rajesh-kumar'] : profiles['rajesh-kumar'];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#faf8ff" />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backIcon}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.brand}>LaborBook</Text>
          <Pressable style={styles.avatarButton}>
            <Text style={styles.avatarText}>{'\u25cf'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              <View style={styles.glassCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.photoRing}>
                    <View style={styles.photo}>
                      <Text style={styles.photoInitials}>RK</Text>
                    </View>
                    <View style={styles.statusDot} />
                  </View>

                  <Text style={styles.name}>{profile.name}</Text>
                  <Text style={styles.role}>{profile.role} • ID: #LB-9023</Text>

                  <View style={styles.actionRow}>
                    <Pressable style={styles.whatsappButton}>
                      <Text style={styles.actionIcon}>{'\u2709'}</Text>
                      <Text style={styles.actionTextLight}>WhatsApp</Text>
                    </Pressable>
                    <Pressable style={styles.pdfButton}>
                      <Text style={styles.actionIconDark}>{'\u2B07'}</Text>
                      <Text style={styles.actionTextDark}>Export PDF</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.infoList}>
                  <InfoRow label="Daily Rate" value={profile.dailyRate} valueAccent />
                  <InfoRow label="Joined Date" value={profile.joinedDate} />
                  <InfoRow label="Work Sites" value={profile.workSites} />
                </View>
              </View>

              <View style={styles.duesCard}>
                <View style={styles.duesTop}>
                  <View>
                    <Text style={styles.duesLabel}>Pending Dues</Text>
                    <Text style={styles.duesValue}>{profile.pendingDues}</Text>
                  </View>
                  <View style={styles.walletBubble}>
                    <Text style={styles.walletIcon}>{'\u{1F4B0}'}</Text>
                  </View>
                </View>
                <Text style={styles.duesNote}>{profile.duesNote}</Text>
                <Pressable style={styles.paymentButton}>
                  <Text style={styles.paymentButtonText}>Process Payment</Text>
                  <Text style={styles.paymentArrow}>{'\u2192'}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Attendance Calendar</Text>

                <View style={styles.calendarGrid}>
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <Text key={day} style={styles.calendarDayLabel}>
                      {day}
                    </Text>
                  ))}
                  {Array.from({ length: 16 }, (_, index) => index + 1).map((day) => (
                    <View
                      key={day}
                      style={[
                        styles.calendarCell,
                        day === 7 && styles.calendarToday,
                        day === 4 || day === 11 ? styles.calendarAbsent : null,
                        day <= 10 ? styles.calendarPresent : styles.calendarUpcoming,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDay,
                          day === 7 && styles.calendarDayActive,
                          day === 4 || day === 11 ? styles.calendarDayAbsent : null,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.legendRow}>
                  <Legend color="#0e6500" label={`Present (${profile.attendance.present})`} />
                  <Legend color="#bb1712" label={`Absent (${profile.attendance.absent})`} />
                  <Legend color="#dae2fd" label={`Upcoming (${profile.attendance.upcoming})`} />
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.timeline}>
                  {profile.activity.map((item) => (
                    <View key={item.title} style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: item.color }]}>
                        <Text style={styles.timelineDotIcon}>{activityIcon(item.icon)}</Text>
                      </View>
                      <View style={styles.activityCard}>
                        <View style={styles.activityHeader}>
                          <Text style={styles.activityTitle}>{item.title}</Text>
                          <Text style={styles.activityTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.activityDescription}>{item.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Payment History</Text>
                  <Text style={styles.viewAll}>View All</Text>
                </View>

                <View style={styles.paymentGrid}>
                  {profile.payments.map((payment) => (
                    <View key={payment.ref} style={styles.paymentCard}>
                      <View style={styles.paymentHeader}>
                        <View style={styles.receiptBubble}>
                          <Text style={styles.receiptIcon}>{'\u{1F4C4}'}</Text>
                        </View>
                        <View style={styles.paymentCopy}>
                          <Text style={styles.paymentTitle}>{payment.title}</Text>
                          <Text style={styles.paymentRef}>Ref: {payment.ref}</Text>
                        </View>
                      </View>
                      <View style={styles.paymentFooter}>
                        <View>
                          <Text style={styles.paymentMetaLabel}>Date</Text>
                          <Text style={styles.paymentDate}>{payment.date}</Text>
                        </View>
                        <Text style={styles.paymentAmount}>{payment.amount}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function InfoRow({
  label,
  value,
  valueAccent = false,
}: {
  label: string;
  value: string;
  valueAccent?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueAccent && styles.infoValueAccent]}>{value}</Text>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function activityIcon(name: string) {
  const icons: Record<string, string> = {
    check: '\u2713',
    payments: '\u{1F4B3}',
    construction: '\u{1F3D7}',
  };

  return icons[name] ?? '•';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,76,202,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#004cca',
    fontSize: 18,
    fontWeight: '800',
    fontFamily,
  },
  brand: {
    color: '#004cca',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontFamily,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(193,198,214,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0053da',
    fontSize: 18,
    fontWeight: '900',
    fontFamily,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  columns: {
    gap: 16,
  },
  leftColumn: {
    gap: 16,
  },
  rightColumn: {
    gap: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    shadowColor: '#004cca',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 10,
  },
  photoRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#ffffff',
    padding: 4,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#d8e2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: {
    color: '#004cca',
    fontSize: 28,
    fontWeight: '900',
    fontFamily,
  },
  statusDot: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#79ff5b',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  name: {
    color: '#131b2e',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily,
  },
  role: {
    color: '#424656',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#25D366',
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#e2e7ff',
  },
  actionIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    fontFamily,
  },
  actionTextLight: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  actionIconDark: {
    color: '#004cca',
    fontSize: 14,
    fontWeight: '900',
    fontFamily,
  },
  actionTextDark: {
    color: '#004cca',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  infoList: {
    marginTop: 16,
    gap: 10,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(194,198,217,0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoLabel: {
    color: '#424656',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  infoValue: {
    color: '#131b2e',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
    fontFamily,
  },
  infoValueAccent: {
    color: '#004cca',
  },
  duesCard: {
    backgroundColor: 'rgba(0,76,202,0.12)',
    borderRadius: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#004cca',
    padding: 16,
    shadowColor: '#004cca',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  duesTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  duesLabel: {
    color: '#004cca',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily,
  },
  duesValue: {
    color: '#003ea8',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontFamily,
  },
  walletBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#004cca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    color: '#ffffff',
    fontSize: 18,
  },
  duesNote: {
    marginTop: 8,
    color: '#424656',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
  },
  paymentButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#004cca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  paymentArrow: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    shadowColor: '#004cca',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  sectionTitle: {
    color: '#131b2e',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily,
  },
  calendarGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarDayLabel: {
    width: '12%',
    textAlign: 'center',
    color: '#424656',
    fontSize: 12,
    fontWeight: '700',
    fontFamily,
  },
  calendarCell: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarPresent: {
    backgroundColor: 'rgba(14,101,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(121,255,91,0.7)',
  },
  calendarAbsent: {
    backgroundColor: 'rgba(187,23,18,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,169,0.7)',
  },
  calendarUpcoming: {
    backgroundColor: 'rgba(210,217,244,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(194,198,217,0.4)',
  },
  calendarToday: {
    backgroundColor: '#004cca',
    shadowColor: '#004cca',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  calendarDay: {
    color: '#131b2e',
    fontSize: 13,
    fontWeight: '700',
    fontFamily,
  },
  calendarDayActive: {
    color: '#ffffff',
  },
  calendarDayAbsent: {
    color: '#bb1712',
  },
  legendRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(194,198,217,0.45)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#424656',
    fontSize: 12,
    fontWeight: '700',
    fontFamily,
  },
  timeline: {
    marginTop: 16,
    gap: 16,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 34,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    fontFamily,
  },
  activityCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  activityTitle: {
    color: '#131b2e',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
    flexShrink: 1,
  },
  activityTime: {
    color: '#424656',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  activityDescription: {
    marginTop: 4,
    color: '#424656',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    color: '#004cca',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  paymentGrid: {
    marginTop: 16,
    gap: 12,
  },
  paymentCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  receiptBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,106,102,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptIcon: {
    fontSize: 18,
  },
  paymentCopy: {
    flex: 1,
    gap: 2,
  },
  paymentTitle: {
    color: '#131b2e',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  paymentRef: {
    color: '#424656',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  paymentMetaLabel: {
    color: '#424656',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily,
  },
  paymentDate: {
    color: '#131b2e',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily,
  },
  paymentAmount: {
    color: '#006a66',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
