import { usePathname, useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/components/app-theme';

type BottomBarItem = {
  label: string;
  route: Href;
  activeRoutes?: string[];
  icon: 'labor' | 'cashbook' | 'settings';
};

const items: BottomBarItem[] = [
  { label: 'Labor', icon: 'labor', route: '/labor', activeRoutes: ['/labor'] },
  { label: 'Cash book', icon: 'cashbook', route: '/cashbook', activeRoutes: ['/cashbook'] },
  { label: 'Settings', icon: 'settings', route: '/settings', activeRoutes: ['/settings'] },
];

export function AppBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <View style={[styles.bottomNav, { backgroundColor: theme.surface }]}>
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
              <View style={[styles.iconShell, active && styles.iconShellActive]}>
                <BottomIcon kind={item.icon} active={active} />
              </View>

              <Text style={[styles.navLabel, active ? styles.navLabelActive : styles.navLabelInactive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BottomIcon({ kind, active }: { kind: BottomBarItem['icon']; active: boolean }) {
  const color = active ? '#ffffff' : '#9a9a9a';

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
    backgroundColor: '#111111',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
  },
  iconShellActive: {
    backgroundColor: '#202020',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#9a9a9a',
  },
  navLabelActive: {
    color: '#ffffff',
  },
  navLabelInactive: {
    color: '#9a9a9a',
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
