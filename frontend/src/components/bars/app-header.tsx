import { useAppTheme } from '@/components/app-theme';
import { Fonts } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function AppHeader() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <View style={[styles.headerCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <View style={styles.headerInner}>
        <View style={styles.brandRow}>
            <View>
            <Text style={[styles.brand, { color: theme.text }]}>SiteBook</Text>
            <Text style={[styles.brandMeta, { color: theme.textSecondary }]}>Operations dashboard</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/notifications')} style={[styles.iconButton, { backgroundColor: theme.accentSoft }]}>
          <MaterialIcons name="notifications" size={24} color={theme.accent} />
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
    fontFamily: Fonts.sans,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  brandMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
