import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import type { SimulationWeather } from './simulationTypes';
import { phaseForTimestamp, sunElevation, NIGHT_PHASES } from './simulationUtils';

interface WeatherBackdropProps {
  timestamp: string;
  weather: SimulationWeather;
}

/* ------------------------------------------------------------------ */
/* Continuous color stops per hour-of-day. The backdrop interpolates  */
/* between the two surrounding stops so the sky changes smoothly      */
/* while the slider moves, instead of snapping at phase boundaries.   */
/* ------------------------------------------------------------------ */

interface SkyStop {
  hour: number;
  top: [number, number, number];
  mid: [number, number, number];
  bottom: [number, number, number];
}

// One color stop per hour (00..24). 24 wraps back to 00 so interpolation
// between 23:00 and 24:00 stays smooth across midnight.
const STOPS: SkyStop[] = [
  { hour:  0, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] }, // deep night
  { hour:  1, top: [  2,   6,  23], mid: [ 13,  20,  40], bottom: [ 33,  45,  65] },
  { hour:  2, top: [  3,   8,  28], mid: [ 16,  24,  46], bottom: [ 38,  50,  72] },
  { hour:  3, top: [  6,  10,  35], mid: [ 22,  28,  58], bottom: [ 50,  55,  90] },
  { hour:  4, top: [ 18,  18,  55], mid: [ 55,  45,  90], bottom: [120,  80, 120] }, // pre-dawn
  { hour:  5, top: [ 30,  27,  75], mid: [ 99,  76, 118], bottom: [253, 186, 116] }, // dawn
  { hour:  6, top: [ 60,  70, 140], mid: [180, 130, 150], bottom: [253, 200, 140] }, // sunrise
  { hour:  7, top: [ 80, 130, 210], mid: [160, 200, 230], bottom: [240, 220, 180] },
  { hour:  8, top: [ 96, 165, 250], mid: [125, 211, 252], bottom: [186, 230, 253] }, // morning
  { hour:  9, top: [ 76, 150, 245], mid: [125, 211, 252], bottom: [200, 232, 253] },
  { hour: 10, top: [ 64, 140, 242], mid: [125, 211, 252], bottom: [210, 234, 254] },
  { hour: 11, top: [ 58, 134, 240], mid: [125, 211, 252], bottom: [216, 234, 254] },
  { hour: 12, top: [ 56, 130, 240], mid: [125, 211, 252], bottom: [219, 234, 254] }, // noon
  { hour: 13, top: [ 58, 132, 238], mid: [125, 211, 252], bottom: [216, 234, 254] },
  { hour: 14, top: [ 64, 140, 232], mid: [130, 210, 248], bottom: [212, 232, 252] },
  { hour: 15, top: [ 78, 130, 210], mid: [150, 170, 230], bottom: [220, 200, 200] },
  { hour: 16, top: [ 90, 110, 200], mid: [200, 150, 170], bottom: [250, 190, 150] }, // golden hour
  { hour: 17, top: [ 90,  70, 150], mid: [220, 130, 110], bottom: [253, 170, 110] }, // warm sunset
  { hour: 18, top: [ 60,  50, 120], mid: [180,  90, 100], bottom: [230, 130, 100] },
  { hour: 19, top: [ 35,  35,  90], mid: [110,  60, 120], bottom: [180,  90, 130] },
  { hour: 20, top: [ 15,  23,  42], mid: [ 49,  46, 129], bottom: [124,  58, 237] }, // late dusk
  { hour: 21, top: [  9,  15,  32], mid: [ 30,  30,  90], bottom: [ 80,  50, 160] },
  { hour: 22, top: [  4,  10,  26], mid: [ 18,  22,  60], bottom: [ 50,  45, 100] },
  { hour: 23, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] }, // night
  { hour: 24, top: [  2,   6,  23], mid: [ 11,  18,  36], bottom: [ 30,  41,  59] }, // wrap
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
  // Find surrounding stops.
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

/**
 * Full-width weather scene rendered behind the simulation islands.
 * Sky colors are interpolated from hour-keyed stops, and animated with
 * framer-motion so the transitions between slider steps are smooth.
 */
const WeatherBackdrop: React.FC<WeatherBackdropProps> = ({ timestamp, weather }) => {
  const date = new Date(timestamp);
  const h = date.getUTCHours() + date.getUTCMinutes() / 60;
  const phase = phaseForTimestamp(timestamp);
  const isNight = NIGHT_PHASES.has(phase);

  const sky = useMemo(() => interpolateSky(h), [h]);
  const elevation = sunElevation(timestamp);

  const cloudsVisible =
    weather.condition === 'cloudy' ||
    weather.condition === 'rainy' ||
    (weather.cloudCoverage ?? 0) > 0.3;
  const isRain = weather.condition === 'rainy';
  const isWindy = weather.condition === 'windy';

  const dayProgress = Math.min(1, Math.max(0, (h - 6) / 12));
  const sunXPct = 8 + dayProgress * 84;
  const sunYPct = 78 - elevation * 60;

  // Soft daytime tint vs deep neon at night — drives the bottom haze
  // that gives islands their contrast.
  const hazeOpacity = isNight ? 0.55 : 0.38;
  const sunCoreColor =
    phase === 'sunset' || phase === 'sunrise'
      ? '#fb923c'
      : phase === 'dusk' || phase === 'dawn'
      ? '#fb923c'
      : '#fde047';

  // Smooth animation duration between sky updates.
  const tween = { duration: 0.9, ease: 'easeInOut' as const };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <motion.stop offset="0%"   animate={{ stopColor: sky.top    }} transition={tween} />
          <motion.stop offset="55%"  animate={{ stopColor: sky.mid    }} transition={tween} />
          <motion.stop offset="100%" animate={{ stopColor: sky.bottom }} transition={tween} />
        </linearGradient>
        <radialGradient id="sun-glow">
          <stop
            offset="0%"
            stopColor={isNight ? '#e2e8f0' : '#fde047'}
            stopOpacity={0.85}
          />
          <stop
            offset="60%"
            stopColor={isNight ? '#cbd5e1' : '#fb923c'}
            stopOpacity={0.25}
          />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Bottom haze: improves contrast between sky and islands without
            killing the colors. Stronger toward the bottom + sides. */}
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(2,6,23,0)" />
          <stop offset="55%" stopColor="rgba(2,6,23,0)" />
          <stop offset="100%" stopColor={`rgba(2,6,23,${hazeOpacity})`} />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="55%" r="75%">
          <stop offset="65%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(2,6,23,0.5)" />
        </radialGradient>
        <radialGradient id="drop-grad" cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="rgba(240,249,255,0.98)" />
          <stop offset="45%"  stopColor="rgba(147,197,253,0.82)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.60)"  />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect width="100" height="60" fill="url(#sky-grad)" />

      {/* stars */}
      {[...Array(40)].map((_, i) => (
        <motion.circle
          key={i}
          cx={(i * 13.7) % 100}
          cy={((i * 7.3) % 30) + 2}
          r={0.18}
          fill="#f8fafc"
          animate={{ opacity: isNight ? [0.2, 0.9, 0.2] : 0 }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.3 }}
        />
      ))}

      {/* sun / moon */}
      <AnimatePresence mode="wait">
        {isNight ? (
          <motion.g
            key="moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <circle cx="82" cy="14" r="7" fill="url(#sun-glow)" />
            <circle cx="82" cy="14" r="3.2" fill="#f1f5f9" />
            <circle cx="83.2" cy="13" r="2.4" fill={sky.mid} />
          </motion.g>
        ) : (
          <motion.g
            key="sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.circle
              cx={sunXPct}
              cy={sunYPct}
              r={9}
              fill="url(#sun-glow)"
              animate={{ cx: sunXPct, cy: sunYPct }}
              transition={{ type: 'spring', stiffness: 35, damping: 16 }}
            />
            <motion.circle
              cx={sunXPct}
              cy={sunYPct}
              r={3.2}
              animate={{ cx: sunXPct, cy: sunYPct, fill: sunCoreColor }}
              transition={{ type: 'spring', stiffness: 35, damping: 16 }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* clouds */}
      {cloudsVisible && (
        <>
          <motion.g
            animate={{ x: [0, isWindy ? 18 : 6, 0] }}
            transition={{ duration: isWindy ? 8 : 22, repeat: Infinity, ease: 'easeInOut' }}
            opacity={isNight ? 0.55 : 0.92}
          >
            <ellipse cx="20" cy="14" rx="9" ry="3" fill={isNight ? '#475569' : '#ffffff'} />
            <ellipse cx="26" cy="12" rx="7" ry="2.6" fill={isNight ? '#64748b' : '#ffffff'} />
          </motion.g>
          <motion.g
            animate={{ x: [0, isWindy ? -22 : -10, 0] }}
            transition={{ duration: isWindy ? 7 : 26, repeat: Infinity, ease: 'easeInOut' }}
            opacity={isNight ? 0.5 : 0.88}
          >
            <ellipse cx="60" cy="10" rx="11" ry="3.2" fill={isNight ? '#475569' : '#ffffff'} />
            <ellipse cx="68" cy="8.5" rx="6.5" ry="2.4" fill={isNight ? '#64748b' : '#ffffff'} />
          </motion.g>
          <motion.g
            animate={{ x: [0, isWindy ? 14 : 4, 0] }}
            transition={{ duration: isWindy ? 9 : 28, repeat: Infinity, ease: 'easeInOut' }}
            opacity={isNight ? 0.45 : 0.82}
          >
            <ellipse cx="88" cy="18" rx="8" ry="2.8" fill={isNight ? '#475569' : '#ffffff'} />
          </motion.g>
        </>
      )}

      {/* rain teardrops */}
      {isRain && [...Array(32)].map((_, i) => {
        const x = (i * 3.2 + Math.sin(i * 1.1) * 4) % 96 + 2;
        const sz = 0.28 + (i % 4) * 0.07;
        const speed = 1.2 + (i % 5) * 0.25;
        const delay = (i * 0.15) % speed;
        const startY = -(3 + (i % 6) * 2);
        return (
          <motion.g
            key={i}
            animate={{ y: [startY, 65] }}
            transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeIn' }}
          >
            <g transform={`translate(${x}, 0) scale(${sz})`}>
              <path
                d="M0,-2 C-1,-1.2 -1.2,0 -1.2,0.8 A1.2,1.2 0 0,1 1.2,0.8 C1.2,0 1,-1.2 0,-2 Z"
                fill="url(#drop-grad)"
                stroke="rgba(200,230,255,0.55)"
                strokeWidth={0.3}
              />
              {/* upper gloss highlight */}
              <ellipse cx="-0.3" cy="-1.1" rx="0.32" ry="0.52" fill="rgba(255,255,255,0.7)" />
              {/* lower refraction — light bending through the drop */}
              <ellipse cx="0.05" cy="0.5" rx="0.52" ry="0.32" fill="rgba(200,235,255,0.38)" />
              {/* right-edge rim shimmer */}
              <ellipse cx="0.75" cy="-0.2" rx="0.13" ry="0.38" fill="rgba(255,255,255,0.32)" />
            </g>
          </motion.g>
        );
      })}

      {/* rain ripples */}
      {isRain && [...Array(16)].map((_, i) => {
        const x = (i * 5.9 + 3) % 95;
        const speed = 1.2 + (i % 5) * 0.25;
        const delay = (i * 0.22) % speed;
        return (
          <motion.ellipse
            key={i}
            cx={x} cy={57.5 + (i % 3) * 0.6}
            rx={0} ry={0}
            stroke="rgba(147,197,253,0.65)"
            strokeWidth={0.18}
            fill="none"
            animate={{ rx: [0, 1.8, 0], ry: [0, 0.5, 0], opacity: [0, 0.85, 0] }}
            transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        );
      })}

      {/* wind streaks */}
      {isWindy &&
        [...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 5 ${22 + i * 5} q 12 -1.5 24 0`}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={0.4}
            fill="none"
            strokeLinecap="round"
            animate={{ x: [-15, 110], opacity: [0, 0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
          />
        ))}

      {/* contrast layers — keep islands readable on every sky */}
      <rect width="100" height="60" fill="url(#haze)" />
      <rect width="100" height="60" fill="url(#vignette)" />
    </svg>
  );
};

export default WeatherBackdrop;
