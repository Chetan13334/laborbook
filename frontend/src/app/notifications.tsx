import { AppBackdrop } from '@/components/app-backdrop';
import { useAppTheme } from '@/components/app-theme';
import { AppBottomBar } from '@/components/bars/app-bottom-bar';
import { Fonts } from '@/constants/theme';
import { useNotifications } from '@/database';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Fonts.sans;

export default function NotificationsPage() {
  const router = useRouter();
  const { theme, mode } = useAppTheme();
  const notifications = useNotifications();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <AppBackdrop />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
          <Pressable onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.headerButtonText, { color: theme.accent }]}>{'\u2190'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <NotifyCard
              key={notification.id}
              title={notification.title}
              desc={notification.desc}
              color={notification.color}
              themeText={theme.text}
              themeSecondary={theme.textSecondary}
            />
          ))}
        </ScrollView>

        <AppBottomBar />
      </SafeAreaView>
    </View>
  );
}

function NotifyCard({
  title,
  desc,
  color,
  themeText,
  themeSecondary,
}: {
  title: string;
  desc: string;
  color: string;
  themeText: string;
  themeSecondary: string;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.copy}>
        <Text style={[styles.cardTitle, { color: themeText }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: themeSecondary }]}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    fontFamily,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.84)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    fontFamily,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily,
  },
});
