import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/components/app-theme';

export function AppBackdrop() {
  const { theme } = useAppTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.base, { backgroundColor: theme.background }]} />
      <View style={[styles.glowTopLeft, { backgroundColor: theme.mode === 'dark' ? 'rgba(0,76,202,0.22)' : 'rgba(0,76,202,0.10)' }]} />
      <View style={[styles.glowTopRight, { backgroundColor: theme.mode === 'dark' ? 'rgba(41,252,243,0.16)' : 'rgba(0,221,214,0.09)' }]} />
      <View style={[styles.glowBottomRight, { backgroundColor: theme.mode === 'dark' ? 'rgba(143,250,155,0.08)' : 'rgba(143,250,155,0.06)' }]} />
      <View style={[styles.glowBottomLeft, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(17,24,39,0.03)' }]} />
      <View style={[styles.noiseBandTop, { backgroundColor: theme.mode === 'dark' ? 'rgba(14,19,36,0.35)' : 'rgba(255,255,255,0.34)' }]} />
      <View style={[styles.noiseBandBottom, { backgroundColor: theme.mode === 'dark' ? 'rgba(14,19,36,0.22)' : 'rgba(255,255,255,0.22)' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#faf8ff',
  },
  glowTopLeft: {
    position: 'absolute',
    left: -100,
    top: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 76, 202, 0.10)',
  },
  glowTopRight: {
    position: 'absolute',
    right: -120,
    top: 50,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 221, 214, 0.09)',
  },
  glowBottomRight: {
    position: 'absolute',
    right: -80,
    bottom: 90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(143, 250, 155, 0.06)',
  },
  glowBottomLeft: {
    position: 'absolute',
    left: -80,
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(17, 24, 39, 0.03)',
  },
  noiseBandTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.34)',
  },
  noiseBandBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
