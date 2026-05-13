// src/theme/colors.ts
export interface AppColors {
  bgDeep: string;
  bgBase: string;
  bgSurface: string;
  bgSurfaceHover: string;
  bgCard: string;
  bgCardSolid: string;

  border: string;
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  primary: string;
  primarySoft: string;
  primaryGlow: string;

  energy: string;
  energySoft: string;
  heat: string;
  heatSoft: string;
  storage: string;
  warning: string;
  danger: string;

  cool: string;
  coolSoft: string;

  chartAxis: string;
  chartAxisLabel: string;
  chartTitle: string;
  chartGrid: string;
}

// Dark
export const darkColors: AppColors = {
  bgDeep: '#0a1420',
  bgBase: '#0f1c2e',
  bgSurface: '#162338',
  bgSurfaceHover: '#1d2c44',
  bgCard: 'rgba(22, 35, 56, 0.85)',
  bgCardSolid: '#162338',

  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  primary: '#6366f1',
  primarySoft: 'rgba(99,102,241,0.18)',
  primaryGlow: 'rgba(99,102,241,0.45)',

  energy: '#10b981',
  energySoft: 'rgba(16,185,129,0.15)',
  heat: '#fb923c',
  heatSoft: 'rgba(251,146,60,0.18)',
  storage: '#a855f7',
  warning: '#facc15',
  danger: '#ef4444',

  cool: '#60a5fa',
  coolSoft: 'rgba(96,165,250,0.18)',

  chartAxis: 'rgba(241,245,249,0.6)',
  chartAxisLabel: '#cbd5e1',
  chartTitle: '#f1f5f9',
  chartGrid: 'rgba(255,255,255,0.08)',
};

// Light - Improved contrast
export const lightColors: AppColors = {
  bgDeep: '#f8fafc',
  bgBase: '#f1f5f9',
  bgSurface: '#ffffff',
  bgSurfaceHover: '#f8fafc',
  bgCard: 'rgba(255,255,255,0.98)',
  bgCardSolid: '#ffffff',

  border: 'rgba(15,23,42,0.12)',
  borderStrong: 'rgba(15,23,42,0.22)',

  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',

  primary: '#4f46e5',
  primarySoft: 'rgba(79,70,229,0.12)',
  primaryGlow: 'rgba(79,70,229,0.25)',

  energy: '#059669',
  energySoft: 'rgba(5,150,105,0.12)',
  **heat: '#e86a00',**           // Strong visible orange
  heatSoft: 'rgba(232,106,0,0.12)',
  storage: '#7c3aed',
  warning: '#d97706',
  danger: '#dc2626',

  cool: '#1e40af',
  coolSoft: 'rgba(30,64,175,0.12)',

  chartAxis: 'rgba(15,23,42,0.6)',
  chartAxisLabel: '#1e2937',
  chartTitle: '#0f172a',
  chartGrid: 'rgba(15,23,42,0.1)',
};

export type ThemeMode = 'light' | 'dark';

export const palettes: Record<ThemeMode, AppColors> = { dark: darkColors, light: lightColors };
export const getColors = (theme: ThemeMode): AppColors => palettes[theme];

export const getChartSx = (c: AppColors) => ({
  '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: c.chartAxis },
  '& .MuiChartsAxis-tickLabel': { fill: `${c.chartAxisLabel} !important`, fontSize: 10 },
  '& .MuiChartsAxis-label': { fill: `${c.chartTitle} !important`, fontSize: 11, fontWeight: 600 },
  '& .MuiChartsGrid-line': { stroke: c.chartGrid, strokeDasharray: '2 4' },
});

export const colors: AppColors = darkColors;