import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

export type TimeOfDay = 'day' | 'dusk' | 'night' | 'dawn';
export type Weather = 'clear' | 'cloudy' | 'rain' | 'snow';

interface FloatingIslandProps {
  /** Island content (turbines, battery, city, …). Rendered on top of the ground. */
  children?: ReactNode;
  /** Total component size in pixels. */
  size?: number;
  /** Animation entry delay (seconds). */
  delay?: number;
  /** Day/night cycle. */
  timeOfDay?: TimeOfDay;
  /** Weather effect rendered above the island. */
  weather?: Weather;
  /** Optional label shown under the island. */
  label?: string;
}

/* ------------------------------ Sky palette ------------------------------- */

const SKY: Record<TimeOfDay, { from: string; to: string; tint: string }> = {
  day:   { from: '#bfe3ff', to: '#eaf6ff', tint: 'rgba(255,255,255,0)' },
  dusk:  { from: '#ffb88c', to: '#ffd6a0', tint: 'rgba(255,140,80,0.15)' },
  night: { from: '#0f172a', to: '#1e293b', tint: 'rgba(15,23,42,0.35)' },
  dawn:  { from: '#fbcfe8', to: '#fde68a', tint: 'rgba(255,200,150,0.12)' },
};

/* --------------------------- Sun / Moon component ------------------------- */

const Celestial: React.FC<{ timeOfDay: TimeOfDay; size: number }> = ({ timeOfDay, size }) => {
  const isNight = timeOfDay === 'night';
  const r = size * 0.07;
  const cx = size * 0.78;
  const cy = size * 0.18;

  return (
    <motion.g
      key={timeOfDay}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <radialGradient id={`celestial-glow-${timeOfDay}`}>
          <stop offset="0%" stopColor={isNight ? 'rgba(226,232,240,0.4)' : 'rgba(253,224,71,0.5)'} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 2.5} fill={`url(#celestial-glow-${timeOfDay})`} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isNight ? '#f1f5f9' : '#fde047'}
      />
      {isNight && (
        <circle cx={cx + r * 0.35} cy={cy - r * 0.25} r={r * 0.7} fill={SKY.night.from} />
      )}
    </motion.g>
  );
};

/* -------------------------------- Clouds ---------------------------------- */

const Cloud: React.FC<{ x: number; y: number; scale: number; color: string }> = ({ x, y, scale, color }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={14} ry={7} fill={color} />
    <ellipse cx={10} cy={-3} rx={10} ry={6} fill={color} />
    <ellipse cx={-10} cy={-2} rx={9} ry={5} fill={color} />
  </g>
);

const Clouds: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <>
    <motion.g
      animate={{ x: [0, size * 0.2, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Cloud x={size * 0.2} y={size * 0.22} scale={size / 280} color={color} />
    </motion.g>
    <motion.g
      animate={{ x: [0, -size * 0.15, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Cloud x={size * 0.55} y={size * 0.12} scale={(size / 280) * 0.8} color={color} />
    </motion.g>
  </>
);

/* ------------------------------ Precipitation ----------------------------- */

const Precipitation: React.FC<{ size: number; type: 'rain' | 'snow' }> = ({ size, type }) => {
  const drops = 16;
  return (
    <g>
      {[...Array(drops)].map((_, i) => {
        const x = (i / drops) * size + (i % 2 ? 4 : 0);
        const delay = (i * 0.12) % 1.4;
        return (
          <motion.circle
            key={i}
            cx={x}
            r={type === 'snow' ? 1.6 : 1}
            fill={type === 'snow' ? '#ffffff' : '#7dd3fc'}
            initial={{ cy: size * 0.3, opacity: 0 }}
            animate={{ cy: size * 0.62, opacity: [0, 1, 0] }}
            transition={{
              duration: type === 'snow' ? 3 : 1.4,
              repeat: Infinity,
              delay,
              ease: type === 'snow' ? 'easeInOut' : 'linear',
            }}
          />
        );
      })}
    </g>
  );
};

/* --------------------------------- Island --------------------------------- */

const FloatingIsland: React.FC<FloatingIslandProps> = ({
  children,
  size = 240,
  delay = 0,
  timeOfDay = 'day',
  weather = 'clear',
  label,
}) => {
  const sky = SKY[timeOfDay];
  const isNight = timeOfDay === 'night';
  const cloudColor = isNight ? 'rgba(148,163,184,0.55)' : 'rgba(255,255,255,0.95)';

  // Frame size: leaves room for the shadow below the island.
  const frameW = size;
  const frameH = size * 1.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        width: frameW,
        height: frameH,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* gentle floating motion applied to the whole island (not the shadow) */}
      <div style={{ position: 'relative', width: frameW, height: frameH }}>
        {/* Ground shadow – stays put */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: label ? 24 : 6,
            width: size * 0.55,
            height: size * 0.06,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(2px)',
            zIndex: 0,
          }}
          animate={{ scaleX: [1, 0.92, 1], opacity: [0.9, 0.7, 0.9] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        />

        {/* Floating island body */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 1,
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
              filter: 'drop-shadow(0 18px 24px rgba(15,23,42,0.18))',
              overflow: 'visible',
            }}
          >
            <defs>
              {/* Sky / dome gradient */}
              <linearGradient id={`sky-${timeOfDay}-${size}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sky.from} />
                <stop offset="100%" stopColor={sky.to} />
              </linearGradient>
              {/* Earth gradient */}
              <linearGradient id={`earth-${size}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa00" />
                <stop offset="12%" stopColor="#8b5e34" />
                <stop offset="100%" stopColor="#5c3a1e" />
              </linearGradient>
              {/* Grass gradient */}
              <linearGradient id={`grass-${size}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              {/* Sky clipper – everything inside the dome */}
              <clipPath id={`dome-clip-${size}`}>
                <ellipse cx={size / 2} cy={size * 0.5} rx={size * 0.46} ry={size * 0.46} />
              </clipPath>
            </defs>

            {/* Sky dome */}
            <g clipPath={`url(#dome-clip-${size})`}>
              <rect width={size} height={size} fill={`url(#sky-${timeOfDay}-${size})`} />
              <AnimatePresence mode="wait">
                <Celestial key={timeOfDay} timeOfDay={timeOfDay} size={size} />
              </AnimatePresence>
              {(weather === 'cloudy' || weather === 'rain' || weather === 'snow') && (
                <Clouds size={size} color={cloudColor} />
              )}
              {(weather === 'rain' || weather === 'snow') && (
                <Precipitation size={size} type={weather === 'snow' ? 'snow' : 'rain'} />
              )}
              {/* Night tint stars */}
              {isNight &&
                [...Array(10)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={(i * 53) % size}
                    cy={20 + ((i * 31) % (size * 0.3))}
                    r={0.8}
                    fill="white"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              {/* Atmospheric tint overlay */}
              <rect width={size} height={size} fill={sky.tint} />
            </g>

            {/* Earth (rocky base) – flat & compact */}
            <path
              d={`
                M ${size * 0.12} ${size * 0.78}
                Q ${size * 0.1}  ${size * 0.88}, ${size * 0.25} ${size * 0.94}
                Q ${size * 0.4}  ${size * 0.99}, ${size * 0.5}  ${size * 0.98}
                Q ${size * 0.6}  ${size * 0.99}, ${size * 0.75} ${size * 0.94}
                Q ${size * 0.9}  ${size * 0.88}, ${size * 0.88} ${size * 0.78}
                Z
              `}
              fill={`url(#earth-${size})`}
            />
            {/* Grass top */}
            <ellipse
              cx={size / 2}
              cy={size * 0.78}
              rx={size * 0.38}
              ry={size * 0.05}
              fill={`url(#grass-${size})`}
            />
          </svg>

          {/* Children sit on top of the grass platform */}
          {children && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: size * 0.1,
                height: size * 0.68,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: size * 0.02,
                pointerEvents: 'none',
              }}
            >
              <div style={{ pointerEvents: 'auto' }}>{children}</div>
            </div>
          )}
        </motion.div>

        {/* Optional label below the shadow */}
        {label && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.2,
              color: '#6b7280',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FloatingIsland;
