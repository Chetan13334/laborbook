import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/components/app-theme';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

const materialIcons: Record<string, string> = {
  notifications: 'notifications',
};

const iconFallbacks: Record<string, string> = {
  notifications: '\u{1F514}',
};

function MaterialIcon({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  const glyph = Platform.OS === 'web' ? materialIcons[name] ?? name : iconFallbacks[name] ?? '?';
  return (
    <Text
      style={[
        styles.icon,
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

export function AppHeader() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <View style={[styles.headerCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <View style={styles.headerInner}>
        <View style={styles.brandRow}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <Text style={styles.avatarText}>LB</Text>
          </View>
          <View>
            <Text style={[styles.brand, { color: theme.text }]}>LaborBook</Text>
            <Text style={[styles.brandMeta, { color: theme.textSecondary }]}>Operations dashboard</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/notifications')} style={[styles.iconButton, { backgroundColor: theme.accentSoft }]}>
          <MaterialIcon name="notifications" color={theme.accent} size={24} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#004cca',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    width: '100%',
  },
  headerInner: {
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
    fontSize: 20,
    fontWeight: '700',
    fontFamily,
  },
  brandMeta: {
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
  },
  icon: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Material Symbols Outlined' : undefined,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
