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

  // Glass effect
  backdropBlur: string;
  iridescent: string;      // diagonal shimmer gradient layered on top of bgCard (dark) or used for selection state (light)
  glassShadow: string;     // full box-shadow string for glass cards
  borderGradient?: string; // if set, used as gradient border via background padding-box/border-box technique

  // App background — rich gradient so backdrop-filter has depth to blur
  bgGradient: string;
}

// ── Dark: Original Main ───────────────────────────────────────────────────────
export const darkColors: AppColors = {
  bgDeep:         '#0a1420',
  bgBase:         '#0f1c2e',
  bgSurface:      '#162338',
  bgSurfaceHover: '#1d2c44',

  bgCard:         'rgba(22, 35, 56, 0.75)',
  bgCardSolid:    '#162338',

  border:         'rgba(255,255,255,0.06)',
  borderStrong:   'rgba(255,255,255,0.10)',

  textPrimary:    '#f1f5f9',
  textSecondary:  '#94a3b8',
  textMuted:      '#64748b',

  primary:        '#6366f1',
  primarySoft:    'rgba(99,102,241,0.18)',
  primaryGlow:    'rgba(99,102,241,0.45)',

  energy:         '#10b981',
  energySoft:     'rgba(16,185,129,0.15)',
  heat:           '#f97316',
  heatSoft:       'rgba(249,115,22,0.15)',
  storage:        '#a855f7',
  warning:        '#facc15',
  danger:         '#ef4444',

  cool:           '#3b82f6',
  coolSoft:       'rgba(59,130,246,0.18)',

  chartAxis:      'rgba(241,245,249,0.55)',
  chartAxisLabel: '#cbd5e1',
  chartTitle:     '#f1f5f9',
  chartGrid:      'rgba(255,255,255,0.06)',

  backdropBlur:   'blur(18px)',

  // Subtle white diagonal highlight — standard glass look
  iridescent: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.06) 100%)',

  // Glass shadow matching the original navy/blue palette
  glassShadow: [
    '0 8px 32px rgba(0,0,0,0.32)',
    '0 2px 8px rgba(0,0,0,0.20)',
    'inset 0 1px 0 rgba(255,255,255,0.10)',
    'inset 0 -1px 0 rgba(0,0,0,0.15)',
    'inset 1px 0 0 rgba(255,255,255,0.04)',
  ].join(', '),

  // Subtle blue/indigo gradient orbs on deep navy
  bgGradient: [
    'radial-gradient(ellipse 60% 50% at 15% 60%, rgba(59,130,246,0.14) 0%, transparent 70%)',
    'radial-gradient(ellipse 55% 45% at 82% 20%, rgba(99,102,241,0.16) 0%, transparent 70%)',
    'radial-gradient(ellipse 50% 55% at 55% 85%, rgba(168,85,247,0.10) 0%, transparent 65%)',
    '#0f1c2e',
  ].join(', '),
};

// ── Light: Iridescent Soap Bubble Glass ───────────────────────────────────────
export const lightColors: AppColors = {
  // Soft lavender backgrounds — delicate, cards pop via gradient border
  bgDeep:         '#e4dcf8',
  bgBase:         '#ece6fc',
  bgSurface:      '#f3eefd',
  bgSurfaceHover: '#ede8fb',

  // Near-white frosted cards — clean surface, iridescent only on border
  bgCard:         'rgba(255, 255, 255, 0.78)',
  bgCardSolid:    'rgba(255, 255, 255, 0.95)',

  // Solid lavender border — used for dividers / sidebars; cards use borderGradient
  border:         'rgba(150, 130, 240, 0.45)',
  borderStrong:   'rgba(180, 160, 255, 0.80)',

  // Text — deep navy for contrast on white cards
  textPrimary:    '#111830',
  textSecondary:  '#2d3d5c',
  textMuted:      '#556080',

  // Primary accent — soft lavender
  primary:        '#9b8ff8',
  primarySoft:    'rgba(155, 143, 248, 0.18)',
  primaryGlow:    'rgba(155, 143, 248, 0.32)',

  // Energy colors — pastel, harmonised with the lavender/mint/blush palette
  energy:         '#34c997',
  energySoft:     'rgba(52, 201, 151, 0.16)',
  heat:           '#f4956a',
  heatSoft:       'rgba(244, 149, 106, 0.16)',
  storage:        '#c084fc',
  warning:        '#f0c060',
  danger:         '#f08080',

  // Status — pastel sky blue
  cool:           '#70b8fa',
  coolSoft:       'rgba(112, 184, 250, 0.16)',

  // Chart — readable on white card background
  chartAxis:      'rgba(40, 50, 110, 0.50)',
  chartAxisLabel: '#3a4878',
  chartTitle:     '#111830',
  chartGrid:      'rgba(80, 70, 180, 0.10)',

  backdropBlur:   'blur(20px)',

  // Used for selected/comparing RunCard surface shimmer
  iridescent: [
    'linear-gradient(135deg,',
    '  rgba(196,181,253,0.14) 0%,',
    '  rgba(147,197,253,0.10) 35%,',
    '  rgba(167,243,208,0.08) 68%,',
    '  rgba(253,186,208,0.08) 100%)',
  ].join(''),

  // Soap-bubble gradient border (lavender → sky → mint → blush)
  // Used by getGlassSx via the padding-box/border-box background-clip technique
  borderGradient: [
    'linear-gradient(135deg,',
    '  rgba(196,181,253,1.0) 0%,',
    '  rgba(147,197,253,0.95) 30%,',
    '  rgba(167,243,208,0.90) 65%,',
    '  rgba(253,186,208,0.95) 100%)',
  ].join(''),

  // Light-mode glass shadow: pastel drop shadow + bright top rim
  glassShadow: [
    '0 6px 32px rgba(120,100,220,0.18)',
    '0 2px 10px rgba(120,100,220,0.11)',
    'inset 0 1px 0 rgba(255,255,255,0.92)',
    'inset 0 -1px 0 rgba(160,140,255,0.14)',
  ].join(', '),

  // Soft pastel orbs on near-white lavender base
  bgGradient: [
    'radial-gradient(ellipse 65% 55% at 12% 68%, rgba(196,181,253,0.38) 0%, transparent 62%)',
    'radial-gradient(ellipse 58% 50% at 88% 18%, rgba(147,197,253,0.32) 0%, transparent 62%)',
    'radial-gradient(ellipse 52% 55% at 50% 92%, rgba(167,243,208,0.26) 0%, transparent 58%)',
    'radial-gradient(ellipse 44% 40% at 72% 46%, rgba(253,186,208,0.22) 0%, transparent 52%)',
    '#f0ebff',
  ].join(', '),
};

export type ThemeMode = 'light' | 'dark';

export const palettes: Record<ThemeMode, AppColors> = {
  dark: darkColors,
  light: lightColors,
};

/** Get the palette for the requested theme. */
export const getColors = (theme: ThemeMode): AppColors => palettes[theme];

/**
 * Returns sx props for a frosted glass card surface.
 *
 * Dark mode — layers (bottom → top):
 *  1. bgCard — semi-transparent navy base
 *  2. iridescent — subtle white diagonal shimmer
 *  3. backdrop-filter blur
 *  4. border — faint white edge
 *  5. glassShadow — outer depth + inner rim
 *
 * Light mode (when borderGradient is set) — uses background-clip technique:
 *  • `bgCard padding-box` fills the content area (clean near-white)
 *  • `borderGradient border-box` fills the 1.5 px border area with the rainbow gradient
 *  • The border itself is `transparent` so the gradient shows through
 */
export const getGlassSx = (c: AppColors) => {
  if (c.borderGradient) {
    // bgCard must be wrapped as a gradient image so padding-box clip applies correctly.
    // A plain rgba/hex value is treated as background-color and ignores per-layer clipping.
    const cardLayer = `linear-gradient(${c.bgCard}, ${c.bgCard})`;
    return {
      background: `${cardLayer} padding-box, ${c.borderGradient} border-box`,
      backdropFilter: c.backdropBlur,
      WebkitBackdropFilter: c.backdropBlur,
      border: '1.5px solid transparent',
      borderRadius: 2.5,
      boxShadow: c.glassShadow,
    };
  }
  return {
    background: [c.iridescent, c.bgCard].join(', '),
    backdropFilter: c.backdropBlur,
    WebkitBackdropFilter: c.backdropBlur,
    border: `1px solid ${c.border}`,
    borderRadius: 2.5,
    boxShadow: c.glassShadow,
  };
};

/**
 * Reusable sx props for uppercase section labels (PURCHASE LOG, SIMULATION HISTORY, …).
 * Spread into a Typography sx prop.
 */
export const getSectionLabelSx = (c: AppColors) => ({
  fontSize: 11,
  fontWeight: 700,
  color: c.textSecondary,
  letterSpacing: 0.8,
  textTransform: 'uppercase' as const,
});

/**
 * Reusable chart styling — reads axis/grid colors directly from the palette.
 * Pass it to a chart's `sx` prop: `<LineChart sx={getChartSx(colors)} />`.
 */
export const getChartSx = (c: AppColors) => ({
  '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: c.chartAxis },
  '& .MuiChartsAxis-tickLabel': { fill: `${c.chartAxisLabel} !important`, fontSize: 10 },
  '& .MuiChartsAxis-label': { fill: `${c.chartTitle} !important`, fontSize: 11, fontWeight: 600 },
  '& .MuiChartsGrid-line': { stroke: c.chartGrid, strokeDasharray: '2 4' },
  '& .MuiLineElement-series-energyDemand': { strokeDasharray: '4 4' },
});

/**
 * Default palette used when no theme context is available.
 * Components currently importing `colors` directly keep working (dark theme).
 */
export const colors: AppColors = darkColors;
