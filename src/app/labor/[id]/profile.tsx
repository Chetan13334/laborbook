import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { Fonts } from '@/constants/theme';
import { useLaborProfile } from '@/database';
import { updateLabor } from '@/backend/api/laborers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Fonts.sans;

export default function LaborProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { theme, mode } = useAppTheme();
  const { data: profile, loading, error } = useLaborProfile(typeof id === 'string' ? id : undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dailyRate, setDailyRate] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setRole(profile.role);
      setDailyRate(profile.dailyRate);
    }
  }, [profile]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border }]}>
          <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.backIcon, { color: theme.accent }]}>{'<'}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 40 }} />
        ) : error || !profile ? (
          <Text style={{ color: theme.error, textAlign: 'center', marginVertical: 40 }}>Error loading profile</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.profileCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <View style={[styles.avatar, { backgroundColor: mode === 'dark' ? theme.background : theme.accentSoft, borderColor: theme.border, borderWidth: 1 }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>{profile.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
              <Text style={[styles.role, { color: theme.textSecondary }]}>{profile.role}</Text>

              <View style={styles.actionRow}>
                <Pressable style={[styles.actionButton, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.actionButtonText, { color: theme.background }]}>WhatsApp</Text>
                </Pressable>
                <Pressable style={[styles.secondaryButton, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
                  <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>Export PDF</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <InfoRow label="Daily Rate" value={profile.dailyRate} accent />
              <InfoRow label="Joined Date" value={profile.joinedDate} />
              <InfoRow label="Work Sites" value={profile.workSites} />
            </View>

            <View style={[styles.section, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Edit Profile</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Labor name"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              />
              <TextInput
                value={role}
                onChangeText={setRole}
                placeholder="Role"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              />
              <TextInput
                value={dailyRate}
                onChangeText={setDailyRate}
                placeholder="Daily rate"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              />
              <Pressable
                onPress={() => {
                  updateLabor(profile.id, {
                    name,
                    role,
                    amount: dailyRate,
                  });
                }}
                style={({ pressed }) => [styles.saveButton, { backgroundColor: theme.accent }, pressed && styles.pressed]}
              >
                <Text style={[styles.saveButtonText, { color: theme.background }]}>Save Changes</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

      </SafeAreaView>
    </View>
  );
}

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: accent ? theme.accent : theme.text }]}>{value}</Text>
    </View>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.statPill, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    minHeight: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, fontWeight: '900', fontFamily },
  headerTitle: { fontSize: 20, lineHeight: 26, fontWeight: '900', fontFamily },
  headerSpacer: { width: 38 },
  content: { padding: 16, paddingBottom: 120, gap: 12 },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26, lineHeight: 32, fontWeight: '900', fontFamily },
  name: { fontSize: 24, lineHeight: 30, fontWeight: '900', fontFamily },
  role: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontFamily },
  actionRow: { marginTop: 8, flexDirection: 'row', gap: 10 },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: { color: '#ffffff', fontSize: 13, lineHeight: 18, fontWeight: '800', fontFamily },
  secondaryButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: 13, lineHeight: 18, fontWeight: '800', fontFamily },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    fontFamily,
  },
  saveButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { fontSize: 13, lineHeight: 18, fontWeight: '800', fontFamily },
  section: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  infoRow: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontFamily },
  infoValue: { flex: 1, textAlign: 'right', fontSize: 13, lineHeight: 18, fontWeight: '800', fontFamily },
  duesCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 6 },
  duesLabel: { fontSize: 12, lineHeight: 16, fontWeight: '900', textTransform: 'uppercase', fontFamily },
  duesValue: { fontSize: 30, lineHeight: 36, fontWeight: '900', fontFamily },
  duesNote: { fontSize: 13, lineHeight: 18, fontWeight: '600', fontFamily },
  statRow: { flexDirection: 'row', gap: 8 },
  statPill: { flex: 1, borderRadius: 8, borderWidth: 1, padding: 12, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, lineHeight: 24, fontWeight: '900', fontFamily },
  statLabel: { fontSize: 10, lineHeight: 12, fontWeight: '800', textTransform: 'uppercase', fontFamily },
  sectionTitle: { fontSize: 17, lineHeight: 24, fontWeight: '900', fontFamily },
  stack: { gap: 10 },
  activityItem: { flexDirection: 'row', gap: 10, borderBottomWidth: 1, paddingBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  activityCopy: { flex: 1, gap: 2 },
  activityTitle: { fontSize: 14, lineHeight: 20, fontWeight: '900', fontFamily },
  activityTime: { fontSize: 12, lineHeight: 16, fontWeight: '700', fontFamily },
  activityDescription: { fontSize: 13, lineHeight: 18, fontWeight: '500', fontFamily },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
