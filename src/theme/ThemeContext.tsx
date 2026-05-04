import { useMemo, useState } from 'react';
import { darkColors, lightColors, type ThemeMode } from './colors';
import { ThemeContext, type ThemeContextValue } from './useTheme';

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
