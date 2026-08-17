export type ThemeMode = 'light' | 'dark' | '3d' | 'focus';

export const THEME_STORAGE_KEY = 'netwho-theme';

export const THEME_OPTIONS: Array<{ value: ThemeMode; label: string; icon: string; description: string }> = [
  { value: 'light', label: 'Light', icon: '☀', description: 'A clean and balanced interface for everyday use.' },
  { value: 'dark', label: 'Dark', icon: '🌙', description: 'A comfortable darker interface for low-light environments.' },
  { value: '3d', label: '3D', icon: '◈', description: 'A layered and interactive visual experience with enhanced depth.' },
  { value: 'focus', label: 'Focus', icon: '◉', description: 'A distraction-free interface designed for concentrated work.' },
];

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return '3d';
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (savedTheme && THEME_OPTIONS.some((option) => option.value === savedTheme)) {
    return savedTheme;
  }

  return '3d';
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme === 'dark' || theme === '3d' ? 'dark' : 'light';
}
