/**
 * Design tokens — typography, radii, weights.
 */

// Font sizes (px)
export const tx = {
  xs:      11,   // tags, alert badges
  sm:      12,   // timestamps, metadata, secondary body
  base:    13,   // normal body text
  md:      14,   // primary body text
  lg:      16,   // card titles, emphasized text
  xl:      20,   // section headings
  display: 30,   // large metric values
} as const;

// Font weights
export const fw = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

// Border radii (MUI spacing units)
export const radii = {
  sm:  1,    //  8 px — chips, tags
  md:  2,    // 16 px — cards, buttons
  lg:  2.5,  // 20 px — main panels
} as const;

// Letter spacing
export const ls = {
  label: 0.8,   // uppercase section labels
} as const;

// Transition durations
export const duration = {
  fast: '0.18s',   // opacity fades, quick hover effects
  base: '0.25s',   // standard interactions (hover, color changes)
  slow: '0.32s',   // expand/collapse, height animations
} as const;

// Easing curves
export const easing = {
  standard: 'cubic-bezier(0.4,0,0.2,1)',  // MUI standard — used for collapse/expand
} as const;
