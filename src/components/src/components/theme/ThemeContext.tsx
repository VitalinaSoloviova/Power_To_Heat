import { createContext, useContext, useMemo, useState } from 'react';
import { darkColors, lightColors, type AppColors, type ThemeMode } from './colors';

interface ThemeContextValue {
  /** Active theme name. */
  theme: ThemeMode;
  /** Switch to a different theme. */
  setTheme: (theme: ThemeMode) => void;
  /** Color palette for the current theme. */
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  /** Theme used on first render. Defaults to `'dark'`. */
  defaultTheme?: ThemeMode;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = 'dark',
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      colors: theme === 'dark' ? darkColors : lightColors,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Read the full theme context (theme name + setter + palette). */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a <ThemeProvider>');
  }
  return ctx;
};

/** Convenience hook: just the active color palette. */
export const useColors = (): AppColors => useTheme().colors;
