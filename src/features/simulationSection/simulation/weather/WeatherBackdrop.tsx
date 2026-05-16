import { useMemo, useRef, useEffect, useState } from 'react';
import { phaseForTimestamp, sunElevation, NIGHT_PHASES } from '../simulationUtils';
import type { SimulationWeather } from '@services/types';
import WeatherDefs from './WeatherDefs';
import WeatherSkyContent from './WeatherSkyContent';
import WeatherEffects from './WeatherEffects';


interface WeatherBackdropProps {
  timestamp: string;
  weather: SimulationWeather;
}

interface SkyStop {
  hour: number;
  top: [number, number, number];
  mid: [number, number, number];
  bottom: [number, number, number];
}

const STOPS: SkyStop[] = [
  { hour:  0, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] },
  { hour:  1, top: [  2,   6,  23], mid: [ 13,  20,  40], bottom: [ 33,  45,  65] },
  { hour:  2, top: [  3,   8,  28], mid: [ 16,  24,  46], bottom: [ 38,  50,  72] },
  { hour:  3, top: [  6,  10,  35], mid: [ 22,  28,  58], bottom: [ 50,  55,  90] },
  { hour:  4, top: [ 18,  18,  55], mid: [ 55,  45,  90], bottom: [120,  80, 120] },
  { hour:  5, top: [ 30,  27,  75], mid: [ 99,  76, 118], bottom: [253, 186, 116] },
  { hour:  6, top: [ 60,  70, 140], mid: [180, 130, 150], bottom: [253, 200, 140] },
  { hour:  7, top: [ 80, 130, 210], mid: [160, 200, 230], bottom: [240, 220, 180] },
  { hour:  8, top: [ 96, 165, 250], mid: [125, 211, 252], bottom: [186, 230, 253] },
  { hour:  9, top: [ 76, 150, 245], mid: [125, 211, 252], bottom: [200, 232, 253] },
  { hour: 10, top: [ 64, 140, 242], mid: [125, 211, 252], bottom: [210, 234, 254] },
  { hour: 11, top: [ 58, 134, 240], mid: [125, 211, 252], bottom: [216, 234, 254] },
  { hour: 12, top: [ 56, 130, 240], mid: [125, 211, 252], bottom: [219, 234, 254] },
  { hour: 13, top: [ 58, 132, 238], mid: [125, 211, 252], bottom: [216, 234, 254] },
  { hour: 14, top: [ 64, 140, 232], mid: [130, 210, 248], bottom: [212, 232, 252] },
  { hour: 15, top: [ 78, 130, 210], mid: [150, 170, 230], bottom: [220, 200, 200] },
  { hour: 16, top: [ 90, 110, 200], mid: [200, 150, 170], bottom: [250, 190, 150] },
  { hour: 17, top: [ 90,  70, 150], mid: [220, 130, 110], bottom: [253, 170, 110] },
  { hour: 18, top: [ 60,  50, 120], mid: [180,  90, 100], bottom: [230, 130, 100] },
  { hour: 19, top: [ 35,  35,  90], mid: [110,  60, 120], bottom: [180,  90, 130] },
  { hour: 20, top: [ 15,  23,  42], mid: [ 49,  46, 129], bottom: [124,  58, 237] },
  { hour: 21, top: [  9,  15,  32], mid: [ 30,  30,  90], bottom: [ 80,  50, 160] },
  { hour: 22, top: [  4,  10,  26], mid: [ 18,  22,  60], bottom: [ 50,  45, 100] },
  { hour: 23, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] },
  { hour: 24, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRgb = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
const rgb = (c: [number, number, number]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

const interpolateSky = (hour: number) => {
  let prev = STOPS[0];
  let next = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (hour >= STOPS[i].hour && hour <= STOPS[i + 1].hour) {
      prev = STOPS[i];
      next = STOPS[i + 1];
      break;
    }
  }
  const span = next.hour - prev.hour || 1;
  const t = (hour - prev.hour) / span;
  return {
    top: rgb(lerpRgb(prev.top, next.top, t)),
    mid: rgb(lerpRgb(prev.mid, next.mid, t)),
    bottom: rgb(lerpRgb(prev.bottom, next.bottom, t)),
  };
};

const WeatherBackdrop: React.FC<WeatherBackdropProps> = ({ timestamp, weather }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // sx: scale factor so that 1 SVG unit = same pixel size in x and y.
  // Formula: sx = (containerWidth / containerHeight) * (60 / 100)
  // This makes viewBox width = 100*sx, which gives equal x/y unit pixel sizes.
  const [sx, setSx] = useState(1.5);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (height > 0) setSx((width / height) * 0.6);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const vbW = 100 * sx;

  const date = new Date(timestamp);
  const h = date.getUTCHours() + date.getUTCMinutes() / 60;
  const phase = phaseForTimestamp(timestamp);
  const isNight = NIGHT_PHASES.has(phase);

  const sky = useMemo(() => interpolateSky(h), [h]);
  const elevation = sunElevation(timestamp);

  const cloudsVisible =
    weather.condition === 'cloudy' ||
    weather.condition === 'rainy' ||
    weather.condition === 'snowy' ||
    weather.condition === 'stormy' ||
    (weather.cloudCoverage ?? 0) > 0.3;
  const isRain = weather.condition === 'rainy';
  const isSnow = weather.condition === 'snowy';
  const isWindy = weather.condition === 'windy';
  const isStormy = weather.condition === 'stormy';
  const isFoggy = weather.condition === 'foggy';

  const dayProgress = Math.min(1, Math.max(0, (h - 6) / 12));
  const sunXPct = 8 + dayProgress * 84;
  const sunYPct = 78 - elevation * 60;

  const hazeOpacity = isNight ? 0.55 : 0.38;
  const sunCoreColor =
    phase === 'sunset' || phase === 'sunrise' || phase === 'dusk' || phase === 'dawn'
      ? '#fb923c'
      : '#fde047';

  const tween = { duration: 0.9, ease: 'easeInOut' as const };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${vbW} 60`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <WeatherDefs sky={sky} isNight={isNight} hazeOpacity={hazeOpacity} sunCoreColor={sunCoreColor} tween={tween} />

      {/* Sky background — rect stretches fine, no distortion concern */}
      <rect width={vbW} height="60" fill="url(#sky-grad)" />

      {/* Render scaled sky content and effects as separate components */}
      <WeatherSkyContent sx={sx} isNight={isNight} sunXPct={sunXPct} sunYPct={sunYPct} sky={sky} cloudsVisible={cloudsVisible} isWindy={isWindy} />

      <WeatherEffects vbW={vbW} sx={sx} isRain={isRain} isSnow={isSnow} isWindy={isWindy} isStormy={isStormy} isFoggy={isFoggy} />
    </svg>
  );
};

export default WeatherBackdrop;
