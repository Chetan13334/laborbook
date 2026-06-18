import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { appDatabase, useSettings } from '@/database';
import { useRouter } from 'expo-router';
import {
    Alert,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function SettingsPage() {
  const router = useRouter();
  const { theme, mode, setMode } = useAppTheme();
  const settings = useSettings();

  const palette = mode === 'dark'
    ? {
        screen: theme.background,
        card: theme.surfaceElevated,
        cardSoft: theme.accentSoft,
        border: theme.border,
        text: theme.text,
        subtext: theme.textSecondary,
        accent: theme.accent,
        accentDark: theme.success,
        chip: theme.accentSoft,
        chipBorder: theme.border,
        muted: theme.background,
        shadow: '#000',
        track: 'rgba(255,255,255,0.10)',
        knob: '#ffffff',
        glowA: 'rgba(0,76,202,0.15)',
        glowB: 'rgba(41,252,243,0.08)',
      }
    : {
        screen: theme.background,
        card: theme.surfaceElevated,
        cardSoft: theme.accentSoft,
        border: theme.border,
        text: theme.text,
        subtext: theme.textSecondary,
        accent: theme.accent,
        accentDark: theme.success,
        chip: theme.accentSoft,
        chipBorder: theme.border,
        muted: theme.background,
        shadow: 'rgba(0,0,0,0.05)',
        track: '#d8e2ff',
        knob: '#ffffff',
        glowA: 'rgba(0,76,202,0.06)',
        glowB: 'rgba(41,252,243,0.05)',
      };

  return (
    <View style={[styles.screen, { backgroundColor: palette.screen }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={palette.screen} />

      <AppBackdrop />
      <View style={[styles.glowA, { backgroundColor: palette.glowA }]} />
      <View style={[styles.glowB, { backgroundColor: palette.glowB }]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: palette.cardSoft, borderColor: palette.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.backIcon, { color: palette.accent }]}>{'\u2190'}</Text>
          </Pressable>

          <View style={styles.topTitleWrap}>
            <Text style={[styles.pageTitle, { color: palette.text }]}>Settings</Text>
            <Text style={[styles.pageSubTitle, { color: palette.subtext }]}>Control the app experience</Text>
          </View>

          <View style={styles.headerBadge}>
            <Text style={[styles.headerBadgeText, { color: palette.accentDark }]}>Pro</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                shadowColor: palette.shadow,
              },
            ]}
          >
              <View style={styles.heroRow}>
              <View style={[styles.heroAvatar, { backgroundColor: mode === 'dark' ? '#1a233d' : '#d8e2ff' }]}>
                <Text style={[styles.heroAvatarText, { color: palette.accent }]}>LB</Text>
              </View>
              <View style={styles.heroCopy}>
                <Text style={[styles.heroName, { color: palette.text }]}>LaborBook Admin</Text>
                <Text style={[styles.heroMeta, { color: palette.subtext }]}>Manage labor, payments, and alerts from one place</Text>
              </View>
            </View>

            <View style={styles.heroStats}>
              <StatPill label="Version" value="1.0.0" palette={palette} />
              <StatPill label="Mode" value={mode === 'dark' ? 'Dark' : 'Light'} palette={palette} />
              <StatPill label="Cloud" value="Synced" palette={palette} />
            </View>
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: palette.card, borderColor: palette.border, shadowColor: palette.shadow },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Appearance & Alerts</Text>

            <SettingSwitch
              title="Dark Mode"
              description="Switch the app to a darker, low-light friendly look."
              enabled={mode === 'dark'}
              onToggle={() => {
                const nextMode = mode === 'dark' ? 'light' : 'dark';
                setMode(nextMode);
                appDatabase.settings.setMode(nextMode);
              }}
              palette={palette}
            />

            <View style={[styles.divider, { backgroundColor: palette.border }]} />

            <SettingSwitch
              title="Push Notifications"
              description="Get updates for payments, attendance, and important reminders."
              enabled={settings.notificationsEnabled ?? false}
              onToggle={() => appDatabase.settings.toggleNotifications()}
              palette={palette}
            />
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: palette.card, borderColor: palette.border, shadowColor: palette.shadow },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Preferences</Text>

            <SettingsRow
              label="Language"
              value="English"
              palette={palette}
              onPress={() => {}}
            />
            <SettingsRow
              label="Currency"
              value="INR (₹)"
              palette={palette}
              onPress={() => {}}
            />
            <SettingsRow
              label="Data Backup"
              value="Auto sync enabled"
              palette={palette}
              onPress={() => {}}
            />
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: palette.card, borderColor: palette.border, shadowColor: palette.shadow },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Security</Text>

            <SettingsRow label="Change PIN" value="Update login PIN" palette={palette} onPress={() => {}} />
            <SettingsRow label="Privacy" value="Permissions & access" palette={palette} onPress={() => {}} />
            <SettingsRow label="Backup Now" value="Last backup today" palette={palette} onPress={() => {}} />
          </View>

          <View style={[styles.footerCard, { backgroundColor: palette.cardSoft, borderColor: palette.border }]}>
            <Text style={[styles.footerText, { color: palette.subtext }]}>
              Need help? We keep things simple, clean, and secure.
            </Text>
          </View>
        </View>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function StatPill({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: {
    accent: string;
    chip: string;
    chipBorder: string;
    text: string;
    subtext: string;
  };
}) {
  return (
    <View style={[styles.statPill, { backgroundColor: palette.chip, borderColor: palette.chipBorder }]}>
      <Text style={[styles.statPillLabel, { color: palette.subtext }]}>{label}</Text>
      <Text style={[styles.statPillValue, { color: palette.text }]}>{value}</Text>
    </View>
  );
}

function SettingSwitch({
  title,
  description,
  enabled,
  onToggle,
  palette,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  palette: {
    accent: string;
    accentDark: string;
    cardSoft: string;
    border: string;
    text: string;
    subtext: string;
    track: string;
    knob: string;
  };
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [styles.switchRow, pressed && styles.pressed]}>
      <View style={styles.switchCopy}>
        <Text style={[styles.switchTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.switchDescription, { color: palette.subtext }]}>{description}</Text>
      </View>
      <View
        style={[
          styles.switchTrack,
          { backgroundColor: enabled ? theme.success : palette.track },
        ]}
      >
        <View
          style={[
            styles.switchKnob,
            {
              backgroundColor: palette.knob,
              transform: [{ translateX: enabled ? 20 : 0 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function SettingsRow({
  label,
  value,
  palette,
  onPress,
}: {
  label: string;
  value: string;
  palette: {
    text: string;
    subtext: string;
    accent: string;
    muted: string;
  };
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Alert.alert(label, value);
        onPress();
      }}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View>
        <Text style={[styles.rowLabel, { color: palette.text }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: palette.subtext }]}>{value}</Text>
      </View>
      <Text style={[styles.rowArrow, { color: palette.accent }]}>{'\u2192'}</Text>
    </Pressable>
  );
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
  glowA: {
    position: 'absolute',
    left: -60,
    top: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  glowB: {
    position: 'absolute',
    right: -70,
    bottom: 80,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily,
  },
  topTitleWrap: {
    flex: 1,
    gap: 2,
  },
  pageTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.4,
    fontFamily,
  },
  pageSubTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  headerBadge: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(143,250,155,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    fontFamily,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 128,
    gap: 14,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  heroAvatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    fontFamily,
  },
  heroMeta: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  heroStats: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
  statPillLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily,
  },
  statPillValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '900',
    fontFamily,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 2,
  },
  switchCopy: {
    flex: 1,
    gap: 3,
  },
  switchTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  switchDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    fontFamily,
  },
  switchTrack: {
    width: 52,
    height: 30,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  divider: {
    height: 1,
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowPressed: {
    opacity: 0.88,
  },
  rowLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily,
  },
  rowValue: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily,
  },
  rowArrow: {
    fontSize: 16,
    fontWeight: '900',
  },
  footerCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
