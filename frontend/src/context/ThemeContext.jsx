import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';

/**
 * ThemeContext
 *
 * Global frontend state for light/dark theme mode.
 *
 * Responsibilities:
 * - Store current theme (light | dark)
 * - Provide toggleTheme() action
 * - Persist theme preference to localStorage
 * - Synchronize 'dark' class on <html> element for Tailwind CSS
 *
 * No business logic.
 * No API calls.
 * No backend dependencies.
 */

const THEME_STORAGE_KEY = 'atmosync-theme';
const DARK_CLASS = 'dark';

export const ThemeContext = createContext(null);

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }

  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Sync 'dark' class on <html> whenever theme changes
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Silently fail — theme works for session
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeLight = useCallback(() => setTheme('light'), []);
  const setThemeDark = useCallback(() => setTheme('dark'), []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      toggleTheme,
      setThemeLight,
      setThemeDark,
    }),
    [theme, toggleTheme, setThemeLight, setThemeDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme
 *
 * Custom hook to consume ThemeContext.
 * Throws if used outside ThemeProvider.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}

