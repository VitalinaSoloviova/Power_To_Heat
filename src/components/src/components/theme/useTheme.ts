import { createContext, useContext } from 'react';
import type { AppColors, ThemeMode } from './colors';

export interface ThemeContextValue {
  /** Active theme name. */
  theme: ThemeMode;
  /** Switch to a different theme. */
  setTheme: (theme: ThemeMode) => void;
  /** Color palette for the current theme. */
  colors: AppColors;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

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
