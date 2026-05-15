import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  sx: number;
  isNight: boolean;
  sunXPct: number;
  sunYPct: number;
  sky: { top: string; mid: string; bottom: string };
  cloudsVisible: boolean;
  isWindy: boolean;
}

const WeatherSkyContent: React.FC<Props> = ({ sx, isNight, sunXPct, sunYPct, sky, cloudsVisible, isWindy }) => (
  <g transform={`scale(${sx}, 1)`}>

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

    <AnimatePresence mode="wait">
      {isNight ? (
        <motion.g key="moon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <ellipse cx="82" cy="14" rx={7 / sx}   ry={7}   fill="url(#sun-glow)" />
          <ellipse cx="82" cy="14" rx={3.2 / sx} ry={3.2} fill="#f1f5f9" />
          <ellipse cx="83.2" cy="13" rx={2.4 / sx} ry={2.4} fill={sky.mid} />
        </motion.g>
      ) : (
        <motion.g key="sun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <motion.ellipse cx={sunXPct} cy={sunYPct} rx={9 / sx} ry={9} fill="url(#sun-glow)" animate={{ cx: sunXPct, cy: sunYPct }} transition={{ duration: 0.65, ease: 'easeInOut' }} />
          <motion.ellipse cx={sunXPct} cy={sunYPct} rx={3.2 / sx} ry={3.2} animate={{ cx: sunXPct, cy: sunYPct, fill: '#fde047' }} transition={{ duration: 0.65, ease: 'easeInOut' }} />
        </motion.g>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {cloudsVisible && (
        <motion.g key="clouds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2.5 }}>
          <motion.g animate={{ x: [0, isWindy ? 18 : 6, 0] }} transition={{ duration: isWindy ? 8 : 22, repeat: Infinity, ease: 'easeInOut' }} opacity={isNight ? 0.55 : 0.92}>
            <ellipse cx="20" cy="14" rx="9"   ry="3"   fill={isNight ? '#475569' : '#ffffff'} />
            <ellipse cx="26" cy="12" rx="7"   ry="2.6" fill={isNight ? '#64748b' : '#ffffff'} />
          </motion.g>
          <motion.g animate={{ x: [0, isWindy ? -22 : -10, 0] }} transition={{ duration: isWindy ? 7 : 26, repeat: Infinity, ease: 'easeInOut' }} opacity={isNight ? 0.5 : 0.88}>
            <ellipse cx="60" cy="10"  rx="11"  ry="3.2" fill={isNight ? '#475569' : '#ffffff'} />
            <ellipse cx="68" cy="8.5" rx="6.5" ry="2.4" fill={isNight ? '#64748b' : '#ffffff'} />
          </motion.g>
          <motion.g animate={{ x: [0, isWindy ? 14 : 4, 0] }} transition={{ duration: isWindy ? 9 : 28, repeat: Infinity, ease: 'easeInOut' }} opacity={isNight ? 0.45 : 0.82}>
            <ellipse cx="88" cy="18" rx="8" ry="2.8" fill={isNight ? '#475569' : '#ffffff'} />
          </motion.g>
        </motion.g>
      )}
    </AnimatePresence>
  </g>
);

export default WeatherSkyContent;
