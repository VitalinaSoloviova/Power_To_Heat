import type { SimulationRange } from './simulationTypes';

export type DayPhase =
  | 'midnight'    // 0-3   tiefste Nacht
  | 'late-night'  // 3-5   späte Nacht
  | 'dawn'        // 5-7   Morgendämmerung
  | 'sunrise'     // 7-8   Sonnenaufgang
  | 'morning'     // 8-11  Vormittag
  | 'midday'      // 11-14 Mittag
  | 'afternoon'   // 14-17 Nachmittag
  | 'sunset'      // 17-18 Sonnenuntergang
  | 'dusk'        // 18-20 Abenddämmerung
  | 'evening'     // 20-22 Abend
  | 'night';      // 22-24 Nacht

/** Phasen die als "nachts" gelten (kein Sonnenlicht). */
export const NIGHT_PHASES: ReadonlySet<DayPhase> = new Set([
  'midnight',
  'late-night',
  'night',
]);

/** Helligkeits-Multiplikator (0..1) für eine Phase. */
export const brightnessForPhase = (phase: DayPhase): number => {
  switch (phase) {
    case 'midnight':
    case 'late-night':
    case 'night':
      return 0.55;
    case 'dawn':
    case 'dusk':
      return 0.75;
    case 'sunrise':
    case 'sunset':
    case 'evening':
      return 0.85;
    case 'morning':
    case 'afternoon':
      return 0.95;
    case 'midday':
      return 1;
  }
};

/** Maps a timestamp to a fine-grained day phase used by the weather sphere. */
export const phaseForTimestamp = (timestamp: string): DayPhase => {
  const h = new Date(timestamp).getHours();
  if (h < 3) return 'midnight';
  if (h < 5) return 'late-night';
  if (h < 7) return 'dawn';
  if (h < 8) return 'sunrise';
  if (h < 11) return 'morning';
  if (h < 14) return 'midday';
  if (h < 17) return 'afternoon';
  if (h < 18) return 'sunset';
  if (h < 20) return 'dusk';
  if (h < 22) return 'evening';
  return 'night';
};

/**
 * Returns sun elevation (0 at horizon, 1 at zenith).
 * Below the horizon it returns 0 — the sphere then shows the moon.
 */
export const sunElevation = (timestamp: string): number => {
  const d = new Date(timestamp);
  const h = d.getHours() + d.getMinutes() / 60;
  if (h <= 6 || h >= 18) return 0;
  return Math.sin(((h - 6) / 12) * Math.PI);
};

/** Format a timestamp for the slider label, using the selected range. */
export const formatTimestamp = (
  timestamp: string,
  range: SimulationRange,
): string => {
  const d = new Date(timestamp);
  if (range === 'month') {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
