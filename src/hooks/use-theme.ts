import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/components/app-theme';

export function useTheme() {
  const { theme } = useAppTheme();
  return theme ?? Colors.light;
}
