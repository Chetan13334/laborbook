import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/components/app-theme';

type BottomBarItem = {
  label: string;
  icon: string;
  route: string;
  activeRoutes?: string[];
};

const items: BottomBarItem[] = [
  { label: 'Home', icon: 'home', route: '/home', activeRoutes: ['/', '/home'] },
  { label: 'Labor', icon: 'groups', route: '/labor', activeRoutes: ['/labor'] },
  { label: 'Settings', icon: 'settings', route: '/settings', activeRoutes: ['/settings'] },
];

const materialIcons: Record<string, string> = {
  home: 'home',
  groups: 'groups',
  payments: 'payments',
  analytics: 'analytics',
  settings: 'settings',
};

const iconFallbacks: Record<string, string> = {
  home: '\u{1F3E0}',
  groups: '\u{1F465}',
  payments: '\u{1F4B3}',
  analytics: '\u{1F4C8}',
  settings: '\u2699\uFE0F',
};

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export function AppBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: theme.mode === 'dark' ? 'rgba(20,27,48,0.88)' : 'rgba(255,255,255,0.84)',
          borderColor: theme.border,
          shadowColor: theme.mode === 'dark' ? '#000' : '#0f172a',
        },
      ]}
    >
      {items.map((item) => {
        const active = isActive(pathname, item);

        return (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            style={({ pressed }) => [
              styles.navItem,
              active && [styles.navItemActive, { backgroundColor: theme.accentSoft }],
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.iconShell,
                active && [
                  styles.iconShellActive,
                  {
                    backgroundColor: theme.accent,
                    shadowColor: theme.accent,
                  },
                ],
              ]}
            >
              <MaterialIcon name={item.icon} active={active} />
            </View>
            <Text style={[styles.navLabel, { color: theme.textSecondary }, active && { color: theme.accent }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MaterialIcon({ name, active }: { name: string; active: boolean }) {
  const glyph = Platform.OS === 'web' ? materialIcons[name] ?? name : iconFallbacks[name] ?? '?';

  return (
    <Text
      style={[
        styles.navIcon,
        active && styles.navIconActive,
        Platform.OS === 'web' && { fontFamily: 'Material Symbols Outlined' },
      ]}
    >
      {glyph}
    </Text>
  );
}

function isActive(pathname: string | null, item: BottomBarItem) {
  if (!pathname) return false;

  if (item.activeRoutes?.includes(pathname)) {
    return true;
  }

  return item.activeRoutes?.some((route) => pathname.startsWith(`${route}/`)) ?? false;
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(193,198,214,0.70)',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 78,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(0,76,202,0.08)',
  },
  iconShell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconShellActive: {
    backgroundColor: '#004cca',
    shadowColor: '#004cca',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  navIcon: {
    color: '#495164',
    fontSize: 19,
    lineHeight: 19,
    fontWeight: '800',
    fontFamily,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  navIconActive: {
    color: '#ffffff',
  },
  navLabel: {
    color: '#495164',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily,
  },
  navLabelActive: {
    color: '#004cca',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
