import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useRef, useEffect, useState } from 'react';
import type { SimulationWeather } from './simulationTypes';
import { phaseForTimestamp, sunElevation, NIGHT_PHASES } from './simulationUtils';

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
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <motion.stop offset="0%"   animate={{ stopColor: sky.top    }} transition={tween} />
          <motion.stop offset="55%"  animate={{ stopColor: sky.mid    }} transition={tween} />
          <motion.stop offset="100%" animate={{ stopColor: sky.bottom }} transition={tween} />
        </linearGradient>
        <radialGradient id="sun-glow">
          <stop offset="0%"   stopColor={isNight ? '#e2e8f0' : '#fde047'} stopOpacity={0.85} />
          <stop offset="60%"  stopColor={isNight ? '#cbd5e1' : '#fb923c'} stopOpacity={0.25} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"    stopColor="rgba(2,6,23,0)" />
          <stop offset="55%"   stopColor="rgba(2,6,23,0)" />
          <stop offset="100%"  stopColor={`rgba(2,6,23,${hazeOpacity})`} />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="55%" r="75%">
          <stop offset="65%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(2,6,23,0.5)" />
        </radialGradient>
        <radialGradient id="drop-grad" cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="rgba(240,249,255,0.98)" />
          <stop offset="45%"  stopColor="rgba(147,197,253,0.82)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.60)"  />
        </radialGradient>
        {/* Storm: dark sky + purple lightning glow */}
        <linearGradient id="storm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(4,4,14,0.80)" />
          <stop offset="70%"  stopColor="rgba(8,6,22,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* Fog: dense ground fog */}
        <linearGradient id="fog-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(195,208,225,0)" />
          <stop offset="45%"  stopColor="rgba(195,208,225,0.18)" />
          <stop offset="75%"  stopColor="rgba(210,220,232,0.52)" />
          <stop offset="100%" stopColor="rgba(220,228,238,0.72)" />
        </linearGradient>
        {/* Blur filter for soft fog banks */}
        <filter id="fog-blur" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="3 1.5" />
        </filter>
        {/* Lightning glow filter */}
        <filter id="bolt-glow" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Sky background — rect stretches fine, no distortion concern */}
      <rect width={vbW} height="60" fill="url(#sky-grad)" />

      {/* All decorative elements inside a scale group.
          scale(sx, 1) maps the original 0-100 x-coordinate space to vbW,
          making 1 SVG unit equal in px for both x and y axes.
          Circles are replaced by ellipses with rx = r/sx to compensate. */}
      <g transform={`scale(${sx}, 1)`}>

        {/* Stars — CSS animation, no per-element framer-motion overhead */}
        <style>{`
          @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.9} }
        `}</style>
        {[...Array(20)].map((_, i) => (
          <ellipse
            key={i}
            cx={(i * 13.7) % 100}
            cy={((i * 7.3) % 30) + 2}
            rx={0.18 / sx}
            ry={0.18}
            fill="#f8fafc"
            style={{
              opacity: isNight ? 0.15 : 0,
              transition: 'opacity 2s',
              animation: isNight
                ? `twinkle ${2 + (i % 3)}s ease-in-out ${(i % 5) * 0.3}s infinite`
                : 'none',
            }}
          />
        ))}

        {/* Sun / Moon */}
        <AnimatePresence mode="wait">
          {isNight ? (
            <motion.g
              key="moon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ellipse cx="82" cy="14" rx={7 / sx}   ry={7}   fill="url(#sun-glow)" />
              <ellipse cx="82" cy="14" rx={3.2 / sx} ry={3.2} fill="#f1f5f9" />
              {/* offset circle creates the crescent shadow */}
              <ellipse cx="83.2" cy="13" rx={2.4 / sx} ry={2.4} fill={sky.mid} />
            </motion.g>
          ) : (
            <motion.g
              key="sun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.ellipse
                cx={sunXPct} cy={sunYPct}
                rx={9 / sx} ry={9}
                fill="url(#sun-glow)"
                animate={{ cx: sunXPct, cy: sunYPct }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
              />
              <motion.ellipse
                cx={sunXPct} cy={sunYPct}
                rx={3.2 / sx} ry={3.2}
                animate={{ cx: sunXPct, cy: sunYPct, fill: sunCoreColor }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Clouds */}
        <AnimatePresence>
          {cloudsVisible && (
            <motion.g
              key="clouds"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
            >
              <motion.g
                animate={{ x: [0, isWindy ? 18 : 6, 0] }}
                transition={{ duration: isWindy ? 8 : 22, repeat: Infinity, ease: 'easeInOut' }}
                opacity={isNight ? 0.55 : 0.92}
              >
                <ellipse cx="20" cy="14" rx="9"   ry="3"   fill={isNight ? '#475569' : '#ffffff'} />
                <ellipse cx="26" cy="12" rx="7"   ry="2.6" fill={isNight ? '#64748b' : '#ffffff'} />
              </motion.g>
              <motion.g
                animate={{ x: [0, isWindy ? -22 : -10, 0] }}
                transition={{ duration: isWindy ? 7 : 26, repeat: Infinity, ease: 'easeInOut' }}
                opacity={isNight ? 0.5 : 0.88}
              >
                <ellipse cx="60" cy="10"  rx="11"  ry="3.2" fill={isNight ? '#475569' : '#ffffff'} />
                <ellipse cx="68" cy="8.5" rx="6.5" ry="2.4" fill={isNight ? '#64748b' : '#ffffff'} />
              </motion.g>
              <motion.g
                animate={{ x: [0, isWindy ? 14 : 4, 0] }}
                transition={{ duration: isWindy ? 9 : 28, repeat: Infinity, ease: 'easeInOut' }}
                opacity={isNight ? 0.45 : 0.82}
              >
                <ellipse cx="88" cy="18" rx="8" ry="2.8" fill={isNight ? '#475569' : '#ffffff'} />
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Rain teardrops + ripples — fades in/out smoothly */}
        <AnimatePresence>
          {isRain && (
            <motion.g
              key="rain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            >
              {[...Array(28)].map((_, i) => {
                const x = (i * 3.7 + Math.sin(i * 1.1) * 4) % 96 + 2;
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
                    <g transform={`translate(${x}, 0) scale(${sz / sx}, ${sz})`}>
                      <path
                        d="M0,-2 C-1,-1.2 -1.2,0 -1.2,0.8 A1.2,1.2 0 0,1 1.2,0.8 C1.2,0 1,-1.2 0,-2 Z"
                        fill="url(#drop-grad)"
                        stroke="rgba(200,230,255,0.55)"
                        strokeWidth={0.3}
                      />
                      <ellipse cx="-0.3" cy="-1.1" rx="0.32" ry="0.52" fill="rgba(255,255,255,0.7)" />
                      <ellipse cx="0.05" cy="0.5"  rx="0.52" ry="0.32" fill="rgba(200,235,255,0.38)" />
                      <ellipse cx="0.75" cy="-0.2" rx="0.13" ry="0.38" fill="rgba(255,255,255,0.32)" />
                    </g>
                  </motion.g>
                );
              })}
              {[...Array(12)].map((_, i) => {
                const x = (i * 8.5 + 3) % 95;
                const speed = 1.2 + (i % 5) * 0.25;
                const delay = (i * 0.22) % speed;
                return (
                  <motion.ellipse
                    key={`r-${i}`}
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
            </motion.g>
          )}
        </AnimatePresence>

        {/* Wind streaks */}
        {isWindy && [...Array(6)].map((_, i) => (
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

        {/* Snowflakes — fades in/out smoothly */}
        <AnimatePresence>
          {isSnow && (
            <motion.g
              key="snow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              {[...Array(38)].map((_, i) => {
                const x = (i * 2.8 + Math.sin(i * 1.7) * 6) % 96 + 2;
                const r = 0.3 + (i % 5) * 0.08;
                const speed = 4 + (i % 6) * 0.9;
                const delay = (i * 0.21) % speed;
                const startY = -(1 + (i % 10) * 1.2);
                const drift = (i % 2 === 0 ? 1 : -1) * (1.5 + (i % 4) * 1.2);
                return (
                  <motion.g
                    key={i}
                    animate={{ y: [startY, 66], x: [0, drift] }}
                    transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }}
                  >
                    <ellipse
                      cx={x} cy={0}
                      rx={r / sx} ry={r}
                      fill="rgba(255,255,255,0.88)"
                    />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>
      </g>

      {/* Snow fog overlay — soft white veil when snowing */}
      <AnimatePresence>
        {isSnow && (
          <motion.rect
            key="snow-veil"
            width={vbW} height="60"
            fill="rgba(220,235,255,0.10)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* Storm: dark sky + purple glow + branching lightning */}
      {isStormy && (
        <>
          <rect width={vbW} height="60" fill="url(#storm-sky)" />

          {/* Two independent lightning events, offset in time */}
          {([
            { boltDelay: 0,   glowX: 0.64, repeatDelay: 6.5  },
            { boltDelay: 3.8, glowX: 0.33, repeatDelay: 9.1  },
          ]).map(({ boltDelay, glowX, repeatDelay }, i) => (
            <g key={`storm-${i}`}>
              {/* Purple sky glow around the strike — ellipse outside scale group */}
              <motion.ellipse
                cx={vbW * glowX} cy={10}
                rx={vbW * 0.38} ry={28}
                fill="rgba(120,60,240,0.55)"
                animate={{ opacity: [0, 0, 1, 0.4, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }}
              />
              {/* Bolt + branches inside scale group */}
              <g transform={`scale(${sx}, 1)`}>
                {i === 0 ? (
                  <motion.g
                    animate={{ opacity: [0, 0, 1, 0.7, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }}
                  >
                    {/* Glow layer — wide strokes, no SVG filter needed */}
                    <path d="M 64 1 L 61 9 L 67 13 L 60 23 L 65 27 L 56 40 L 62 43 L 53 58"
                      stroke="rgba(180,200,255,0.22)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 67 13 L 77 20 L 85 17 L 91 22"
                      stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 60 23 L 49 31 L 42 28"
                      stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 56 40 L 69 46 L 75 50"
                      stroke="rgba(180,200,255,0.12)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Sharp bolt on top */}
                    <path d="M 64 1 L 61 9 L 67 13 L 60 23 L 65 27 L 56 40 L 62 43 L 53 58"
                      stroke="#dde8ff" strokeWidth={0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 67 13 L 77 20 L 85 17 L 91 22"
                      stroke="#c4d4ff" strokeWidth={0.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 60 23 L 49 31 L 42 28"
                      stroke="#c4d4ff" strokeWidth={0.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 56 40 L 69 46 L 75 50"
                      stroke="#c4d4ff" strokeWidth={0.35} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.g>
                ) : (
                  <motion.g
                    animate={{ opacity: [0, 0, 1, 0.7, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }}
                  >
                    {/* Glow layer */}
                    <path d="M 32 2 L 35 11 L 29 16 L 36 26 L 30 32 L 38 44 L 31 54"
                      stroke="rgba(180,200,255,0.22)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 29 16 L 20 24 L 14 21"
                      stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 36 26 L 46 33 L 52 30 L 58 34"
                      stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 30 32 L 21 40 L 16 44"
                      stroke="rgba(180,200,255,0.12)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Sharp bolt on top */}
                    <path d="M 32 2 L 35 11 L 29 16 L 36 26 L 30 32 L 38 44 L 31 54"
                      stroke="#dde8ff" strokeWidth={0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 29 16 L 20 24 L 14 21"
                      stroke="#c4d4ff" strokeWidth={0.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 36 26 L 46 33 L 52 30 L 58 34"
                      stroke="#c4d4ff" strokeWidth={0.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 30 32 L 21 40 L 16 44"
                      stroke="#c4d4ff" strokeWidth={0.35} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.g>
                )}
              </g>
            </g>
          ))}
        </>
      )}

      {/* Fog: layered volumetric banks drifting at different heights */}
      {isFoggy && (
        <>
          {/* Base gradient haze */}
          <rect width={vbW} height="60" fill="url(#fog-base)" />

          {/* Fog bank ellipses — x CSS-transform (GPU) + CSS blur (GPU) */}
          {([
            { cy: 52, rx: 80, ry: 12, opacity: 0.65, dur: 28, dx: 12, blur: 18 },
            { cy: 46, rx: 70, ry:  9, opacity: 0.50, dur: 22, dx: -9, blur: 14 },
            { cy: 40, rx: 60, ry:  7, opacity: 0.38, dur: 35, dx: 14, blur: 12 },
            { cy: 35, rx: 55, ry:  5, opacity: 0.25, dur: 26, dx: -8, blur:  9 },
            { cy: 29, rx: 45, ry:  4, opacity: 0.16, dur: 40, dx: 10, blur:  7 },
          ]).map(({ cy, rx, ry, opacity, dur, dx, blur }, i) => (
            <motion.g
              key={`fog-bank-${i}`}
              animate={{ x: [0, dx * sx, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2.5 }}
            >
              <ellipse
                cx={50 * sx} cy={cy}
                rx={rx * sx} ry={ry}
                fill={`rgba(210,220,232,${opacity})`}
                style={{ filter: `blur(${blur}px)` }}
              />
            </motion.g>
          ))}

          {/* Thin wispy upper layers */}
          {([
            { cy: 24, rx: 35, ry: 2.5, opacity: 0.12, dur: 50, dx:  8, blur: 6 },
            { cy: 19, rx: 28, ry: 2.0, opacity: 0.08, dur: 60, dx: -6, blur: 5 },
          ]).map(({ cy, rx, ry, opacity, dur, dx, blur }, i) => (
            <motion.g
              key={`fog-wisp-${i}`}
              animate={{ x: [0, dx * sx, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 5 }}
            >
              <ellipse
                cx={50 * sx} cy={cy}
                rx={rx * sx} ry={ry}
                fill={`rgba(220,228,240,${opacity})`}
                style={{ filter: `blur(${blur}px)` }}
              />
            </motion.g>
          ))}
        </>
      )}

      {/* Contrast layers — drawn over full viewBox width */}
      <rect width={vbW} height="60" fill="url(#haze)" />
      <rect width={vbW} height="60" fill="url(#vignette)" />
    </svg>
  );
};

export default WeatherBackdrop;
