// Dark dashboard palette (Power-to-Heat style)
export const colors = {
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
  primary: '#6366f1',         // purple (active nav, active button)
  primarySoft: 'rgba(99,102,241,0.18)',
  primaryGlow: 'rgba(99,102,241,0.45)',

  // Energy
  energy: '#10b981',          // green - production
  energySoft: 'rgba(16,185,129,0.15)',
  heat: '#f97316',            // orange - heat / discharge
  heatSoft: 'rgba(249,115,22,0.15)',
  storage: '#a855f7',         // violet - storage / forecast
  warning: '#facc15',
  danger: '#ef4444',

  // Statusfarben
  cool: '#3b82f6',
  coolSoft: 'rgba(59,130,246,0.18)',
} as const;

export type AppColors = typeof colors;
