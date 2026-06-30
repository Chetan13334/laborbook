import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/components/app-theme';

export function AppBackdrop() {
  const { theme } = useAppTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.base, { backgroundColor: theme.background }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#faf8ff',
  },
});
