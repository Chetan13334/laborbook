import { useColorScheme } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Colors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';
export type AppTheme = (typeof Colors.light) & {
  mode: ThemeMode;
};

type AppThemeContextValue = {
  mode: ThemeMode;
  theme: AppTheme;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);
const STORAGE_KEY = 'laborbook.theme-mode';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    return systemScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(
    () => ({
      ...Colors[mode],
      mode,
    }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
      toggleMode: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [mode, theme]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (context) {
    return context;
  }

  return {
    mode: 'light' as ThemeMode,
    theme: { ...Colors.light, mode: 'light' as ThemeMode },
    setMode: () => {},
    toggleMode: () => {},
  };
}
