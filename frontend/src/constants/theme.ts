/**
 * Shared theme tokens for the app.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Text
    text: '#000000',
    textSecondary: '#737373',

    // Backgrounds
    background: '#FFFFFF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F2F2F2',

    // Surfaces
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',

    // Borders
    border: '#DBDBDB',

    // Accent
    accent: '#000000',
    accentSoft: '#F5F5F5',

    // Status
    success: '#34C759',
    warning: '#FF3B30',
    error: '#FF3B30',
  },

  dark: {
    // Text
    text: '#FFFFFF',
    textSecondary: '#A8A8A8',

    // Backgrounds
    background: '#000000',
    backgroundElement: '#000000',
    backgroundSelected: '#1A1A1A',

    // Surfaces
    surface: '#121212',
    surfaceElevated: '#1A1A1A',

    // Borders
    border: '#262626',

    // Accent
    accent: '#FFFFFF',
    accentSoft: '#1A1A1A',

    // Status
    success: '#30D158',
    warning: '#FF453A',
    error: '#FF453A',
  },
} as const;

export type ThemeColor =
  keyof typeof Colors.light &
  keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },

  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },

  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },

  web: {
    sans: '"Inter", "Segoe UI", system-ui, sans-serif',
    serif: 'Georgia, serif',
    rounded: '"SF Pro Rounded", "Avenir Next Rounded", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
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

export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
  }) ?? 0;

export const MaxContentWidth = 800;
