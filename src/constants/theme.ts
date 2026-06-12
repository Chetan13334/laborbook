/**
 * Shared theme tokens for the app.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#131b2e',
    background: '#faf8ff',
    backgroundElement: 'rgba(255,255,255,0.84)',
    backgroundSelected: 'rgba(0,76,202,0.08)',
    textSecondary: '#5a6076',
    surface: '#ffffff',
    surfaceElevated: 'rgba(255,255,255,0.92)',
    border: 'rgba(255,255,255,0.82)',
    accent: '#004cca',
    accentSoft: 'rgba(0,76,202,0.10)',
    success: '#00531e',
    warning: '#bb1712',
  },
  dark: {
    text: '#eef0ff',
    background: '#0e1324',
    backgroundElement: 'rgba(20,27,48,0.92)',
    backgroundSelected: 'rgba(41,252,243,0.10)',
    textSecondary: '#a7b0cf',
    surface: '#151c31',
    surfaceElevated: 'rgba(24,33,57,0.96)',
    border: 'rgba(255,255,255,0.10)',
    accent: '#29fcf3',
    accentSoft: 'rgba(41,252,243,0.14)',
    success: '#8ffa9b',
    warning: '#ffb4a9',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
