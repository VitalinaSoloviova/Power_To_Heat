// Power-to-Heat dashboard palettes (dark + light variants share the same keys)

export interface AppColors {
  // Background layers
  bgDeep: string;
  bgBase: string;
  bgSurface: string;
  bgSurfaceHover: string;
  bgCard: string;
  bgCardSolid: string;

  // Borders / dividers
  border: string;
  borderStrong: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Accents
  primary: string;
  primarySoft: string;
  primaryGlow: string;

  // Energy
  energy: string;
  energySoft: string;
  heat: string;
  heatSoft: string;
  storage: string;
  warning: string;
  danger: string;

  // Status
  cool: string;
  coolSoft: string;

  // Chart
  chartAxis: string;
  chartAxisLabel: string;
  chartTitle: string;
  chartGrid: string;
}

// Dark dashboard palette
export const darkColors: AppColors = {
  // Background layers
  bgDeep: '#0a1420',
  bgBase: '#0f1c2e',
  bgSurface: '#162338',
  bgSurfaceHover: '#1d2c44',
  bgCard: 'rgba(22, 35, 56, 0.75)',
  bgCardSolid: '#162338',

  // Borders / dividers
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.1)',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // Accents
  primary: '#6366f1',
  primarySoft: 'rgba(99,102,241,0.18)',
  primaryGlow: 'rgba(99,102,241,0.45)',

  // Energy
  energy: '#10b981',
  energySoft: 'rgba(16,185,129,0.15)',
  heat: '#f97316',
  heatSoft: 'rgba(249,115,22,0.15)',
  storage: '#a855f7',
  warning: '#facc15',
  danger: '#ef4444',

  // Status
  cool: '#3b82f6',
  coolSoft: 'rgba(59,130,246,0.18)',

  // Chart
  chartAxis: 'rgba(241,245,249,0.55)',
  chartAxisLabel: '#cbd5e1',
  chartTitle: '#f1f5f9',
  chartGrid: 'rgba(255,255,255,0.06)',
};

// Light dashboard palette - FIXED & IMPROVED
export const lightColors: AppColors = {
  // Background layers
  bgDeep: '#f8fafc',
  bgBase: '#f1f5f9',
  bgSurface: '#ffffff',
  bgSurfaceHover: '#f8fafc',
  bgCard: 'rgba(255,255,255,0.95)',
  bgCardSolid: '#ffffff',

  // Borders / dividers
  border: 'rgba(15,23,42,0.08)',
  borderStrong: 'rgba(15,23,42,0.16)',

  // Text
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',

  // Accents
  primary: '#4f46e5',
  primarySoft: 'rgba(79,70,229,0.12)',
  primaryGlow: 'rgba(79,70,229,0.25)',

  // Energy
  energy: '#059669',           // Deep emerald
  energySoft: 'rgba(5,150,105,0.12)',
  heat: '#ea580c',             // Stronger, more visible orange
  heatSoft: 'rgba(234,88,12,0.12)',
  storage: '#7c3aed',
  warning: '#d97706',
  danger: '#dc2626',

  // Status
  cool: '#1e40af',             // Deeper blue for better contrast
  coolSoft: 'rgba(30,64,175,0.12)',

  // Chart - Much better visibility in light mode
  chartAxis: 'rgba(15,23,42,0.45)',
  chartAxisLabel: '#334155',
  chartTitle: '#0f172a',
  chartGrid: 'rgba(15,23,42,0.08)',
};

export type ThemeMode = 'light' | 'dark';

export const palettes: Record<ThemeMode, AppColors> = {
  dark: darkColors,
  light: lightColors,
};

/** Get the palette for the requested theme. */
export const getColors = (theme: ThemeMode): AppColors => palettes[theme];

/**
 * Reusable chart styling
 */
export const getChartSx = (c: AppColors) => ({
  '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { 
    stroke: c.chartAxis 
  },
  '& .MuiChartsAxis-tickLabel': { 
    fill: `${c.chartAxisLabel} !important`, 
    fontSize: 10 
  },
  '& .MuiChartsAxis-label': { 
    fill: `${c.chartTitle} !important`, 
    fontSize: 11, 
    fontWeight: 600 
  },
  '& .MuiChartsGrid-line': { 
    stroke: c.chartGrid, 
    strokeDasharray: '2 4' 
  },
  '& .MuiLineElement-series-energyDemand': { 
    strokeDasharray: '4 4' 
  },
});

/**
 * Default fallback (keeps backward compatibility)
 */
export const colors: AppColors = darkColors;