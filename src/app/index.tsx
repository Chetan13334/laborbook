import { Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#eef1ff" />

      <View style={styles.backgroundGlowLeft} />
      <View style={styles.backgroundGlowRight} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to manage your workforce</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneField}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  defaultValue="98765 43210"
                  placeholder="98765 43210"
                  placeholderTextColor="#8b8fa5"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
            </View>

            <Pressable style={styles.primaryButton} onPress={() => router.push('/home')}>
              <Text style={styles.primaryButtonText}>Get OTP</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.googleButton}>
              <Text style={styles.googleLogo}>G</Text>
              <Text style={styles.googleText}>Google</Text>
            </Pressable>

            <Text style={styles.footerText}>
              By signing in, you agree to our
              {'\n'}
              <Text style={styles.footerLink}>Terms of Service</Text> &{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eef1ff',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  backgroundGlowLeft: {
    position: 'absolute',
    left: -60,
    top: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 76, 202, 0.12)',
  },
  backgroundGlowRight: {
    position: 'absolute',
    right: -70,
    bottom: 0,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 221, 214, 0.14)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#004cca',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  title: {
    color: '#131b2e',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontFamily,
  },
  subtitle: {
    marginTop: 2,
    color: '#737687',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily,
  },
  fieldGroup: {
    marginTop: 22,
  },
  label: {
    color: '#424656',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily,
  },
  phoneField: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9def2',
    backgroundColor: '#f4f5ff',
  },
  countryCode: {
    color: '#5a6076',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  input: {
    flex: 1,
    color: '#131b2e',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    paddingVertical: 0,
    fontFamily,
  },
  primaryButton: {
    marginTop: 18,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a6bdc',
    shadowColor: '#0a6bdc',
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(194,198,217,0.5)',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#737687',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily,
  },
  googleButton: {
    marginTop: 26,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  googleLogo: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '800',
  },
  googleText: {
    color: '#131b2e',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily,
  },
  footerText: {
    marginTop: 42,
    color: '#737687',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily,
  },
  footerLink: {
    color: '#0a6bdc',
    fontWeight: '800',
  },
});
