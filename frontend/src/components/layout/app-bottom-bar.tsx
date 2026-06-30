import { useAppTheme } from '@/components/app-theme';
import { Fonts } from '@/constants/theme';
import { usePathname, useRouter, type Href } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type BottomBarItem = {
  label: string;
  route: Href;
  activeRoutes?: string[];
  icon: 'labor' | 'cashbook' | 'settings';
};

const items: BottomBarItem[] = [
  { label: 'Labor', icon: 'labor', route: '/', activeRoutes: ['/', '/labor'] },
  { label: 'Cash book', icon: 'cashbook', route: '/cashbook', activeRoutes: ['/cashbook'] },
  { label: 'Settings', icon: 'settings', route: '/settings', activeRoutes: ['/settings'] },
];

export function AppBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, mode } = useAppTheme();

  const isLight = mode === 'light';
  const navBg = isLight ? '#ffffff' : '#111111';
  const navBorder = isLight ? '#e5e7eb' : '#1f2937';
  const iconShellBg = isLight ? '#f3f4f6' : '#1a1a1a';
  const iconShellActiveBg = isLight ? theme.accent : '#2a2a2a';
  const iconActiveColor = '#ffffff';
  const iconInactiveColor = isLight ? '#6b7280' : '#9a9a9a';
  const labelActiveColor = isLight ? theme.accent : '#ffffff';
  const labelInactiveColor = isLight ? '#6b7280' : '#9a9a9a';

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <View style={[styles.bottomNav, { backgroundColor: navBg, borderColor: navBorder }]}>
        {items.map((item) => {
          const active = isActive(pathname, item);

          return (
            <Pressable
              key={item.label}
              onPress={() => {
                if (!active) router.push(item.route);
              }}
              style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
            >
              <View style={[styles.iconShell, { backgroundColor: active ? iconShellActiveBg : iconShellBg }]}>
                <BottomIcon kind={item.icon} color={active ? iconActiveColor : iconInactiveColor} />
              </View>

              <Text
                style={[
                  styles.navLabel,
                  { color: active ? labelActiveColor : labelInactiveColor },
                  active && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BottomIcon({ kind, color }: { kind: BottomBarItem['icon']; color: string }) {
  if (kind === 'labor') {
    return (
      <View style={styles.laborIcon}>
        <View style={[styles.head, { borderColor: color }]} />
        <View style={[styles.shoulders, { borderColor: color }]} />
      </View>
    );
  }

  if (kind === 'cashbook') {
    return (
      <View style={[styles.bookIcon, { borderColor: color }]}>
        <View style={[styles.bookTop, { backgroundColor: color }]} />
        <View style={[styles.bookLine, { backgroundColor: color }]} />
        <View style={[styles.bookLine, { backgroundColor: color, width: '45%' }]} />
        <View style={[styles.rupeeBar, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.settingsIcon}>
      <View style={[styles.settingsRing, { borderColor: color }]} />
      <View style={[styles.settingsDot, { backgroundColor: color }]} />
      <View style={[styles.settingsDot2, { backgroundColor: color }]} />
    </View>
  );
}

function isActive(pathname: string | null, item: BottomBarItem) {
  if (!pathname) return false;
  if (item.activeRoutes?.includes(pathname)) return true;
  return item.activeRoutes?.some((route) => pathname.startsWith(`${route}/`)) ?? false;
}

const shadow =
  Platform.OS === 'android'
    ? { elevation: 12 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      };

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 8,
  },
  bottomNav: {
    marginHorizontal: 16,
    height: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    ...(shadow as object),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconShell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  navLabelActive: {
    fontWeight: '800',
  },
  laborIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    width: 8,
    height: 8,
    borderRadius: 999,
    borderWidth: 2,
    marginBottom: 1,
  },
  shoulders: {
    width: 16,
    height: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bookIcon: {
    width: 18,
    height: 22,
    borderWidth: 2,
    borderRadius: 3,
    paddingTop: 2,
    paddingHorizontal: 2,
    gap: 2,
  },
  bookTop: {
    width: '100%',
    height: 2,
    borderRadius: 999,
  },
  bookLine: {
    width: '75%',
    height: 2,
    borderRadius: 999,
  },
  rupeeBar: {
    position: 'absolute',
    right: 3,
    bottom: 2,
    width: 2,
    height: 8,
    borderRadius: 999,
  },
  settingsIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRing: {
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 2,
  },
  settingsDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 999,
    top: 2,
  },
  settingsDot2: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 999,
    bottom: 2,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
});
