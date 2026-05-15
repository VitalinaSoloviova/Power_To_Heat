import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  vbW: number;
  sx: number;
  isRain: boolean;
  isSnow: boolean;
  isWindy: boolean;
  isStormy: boolean;
  isFoggy: boolean;
}

const WeatherEffects: React.FC<Props> = ({ vbW, sx, isRain, isSnow, isWindy, isStormy, isFoggy }) => (
  <>
    <AnimatePresence>
      {isSnow && (
        <motion.rect key="snow-veil" width={vbW} height="60" fill="rgba(220,235,255,0.10)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} />
      )}
    </AnimatePresence>

    {isStormy && (
      <>
        <rect width={vbW} height="60" fill="url(#storm-sky)" />

        {([
          { boltDelay: 0,   glowX: 0.64, repeatDelay: 6.5  },
          { boltDelay: 3.8, glowX: 0.33, repeatDelay: 9.1  },
        ]).map(({ boltDelay, glowX, repeatDelay }, i) => (
          <g key={`storm-${i}`}>
            <motion.ellipse cx={vbW * glowX} cy={10} rx={vbW * 0.38} ry={28} fill="rgba(120,60,240,0.55)" animate={{ opacity: [0, 0, 1, 0.4, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }} />
            <g transform={`scale(${sx}, 1)`}>
              {i === 0 ? (
                <motion.g animate={{ opacity: [0, 0, 1, 0.7, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }}>
                  <path d="M 64 1 L 61 9 L 67 13 L 60 23 L 65 27 L 56 40 L 62 43 L 53 58" stroke="rgba(180,200,255,0.22)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 67 13 L 77 20 L 85 17 L 91 22" stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 60 23 L 49 31 L 42 28" stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 56 40 L 69 46 L 75 50" stroke="rgba(180,200,255,0.12)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 64 1 L 61 9 L 67 13 L 60 23 L 65 27 L 56 40 L 62 43 L 53 58" stroke="#dde8ff" strokeWidth={0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
              ) : (
                <motion.g animate={{ opacity: [0, 0, 1, 0.7, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay, delay: boltDelay }}>
                  <path d="M 32 2 L 35 11 L 29 16 L 36 26 L 30 32 L 38 44 L 31 54" stroke="rgba(180,200,255,0.22)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 29 16 L 20 24 L 14 21" stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 36 26 L 46 33 L 52 30 L 58 34" stroke="rgba(180,200,255,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 30 32 L 21 40 L 16 44" stroke="rgba(180,200,255,0.12)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 32 2 L 35 11 L 29 16 L 36 26 L 30 32 L 38 44 L 31 54" stroke="#dde8ff" strokeWidth={0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
              )}
            </g>
          </g>
        ))}
      </>
    )}

    {isFoggy && (
      <>
        <rect width={vbW} height="60" fill="url(#fog-base)" />
        {([
          { cy: 52, rx: 80, ry: 12, opacity: 0.65, dur: 28, dx: 12, blur: 18 },
          { cy: 46, rx: 70, ry:  9, opacity: 0.50, dur: 22, dx: -9, blur: 14 },
          { cy: 40, rx: 60, ry:  7, opacity: 0.38, dur: 35, dx: 14, blur: 12 },
          { cy: 35, rx: 55, ry:  5, opacity: 0.25, dur: 26, dx: -8, blur:  9 },
          { cy: 29, rx: 45, ry:  4, opacity: 0.16, dur: 40, dx: 10, blur:  7 },
        ]).map(({ cy, rx, ry, opacity, dur, dx, blur }, i) => (
          <motion.g key={`fog-bank-${i}`} animate={{ x: [0, dx * sx, 0] }} transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2.5 }}>
            <ellipse cx={50 * sx} cy={cy} rx={rx * sx} ry={ry} fill={`rgba(210,220,232,${opacity})`} style={{ filter: `blur(${blur}px)` }} />
          </motion.g>
        ))}
        {([
          { cy: 24, rx: 35, ry: 2.5, opacity: 0.12, dur: 50, dx:  8, blur: 6 },
          { cy: 19, rx: 28, ry: 2.0, opacity: 0.08, dur: 60, dx: -6, blur: 5 },
        ]).map(({ cy, rx, ry, opacity, dur, dx, blur }, i) => (
          <motion.g key={`fog-wisp-${i}`} animate={{ x: [0, dx * sx, 0] }} transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 5 }}>
            <ellipse cx={50 * sx} cy={cy} rx={rx * sx} ry={ry} fill={`rgba(220,228,240,${opacity})`} style={{ filter: `blur(${blur}px)` }} />
          </motion.g>
        ))}
      </>
    )}

    {/* Rain teardrops + ripples — fades in/out smoothly */}
    <AnimatePresence>
      {isRain && (
        <motion.g key="rain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          {[...Array(28)].map((_, i) => {
            const x = (i * 3.7 + Math.sin(i * 1.1) * 4) % 96 + 2;
            const sz = 0.28 + (i % 4) * 0.07;
            const speed = 1.2 + (i % 5) * 0.25;
            const delay = (i * 0.15) % speed;
            const startY = -(3 + (i % 6) * 2);
            return (
              <motion.g key={i} animate={{ y: [startY, 65] }} transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeIn' }}>
                <g transform={`translate(${x}, 0) scale(${sz / sx}, ${sz})`}>
                  <path d="M0,-2 C-1,-1.2 -1.2,0 -1.2,0.8 A1.2,1.2 0 0,1 1.2,0.8 C1.2,0 1,-1.2 0,-2 Z" fill="url(#drop-grad)" stroke="rgba(200,230,255,0.55)" strokeWidth={0.3} />
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
              <motion.ellipse key={`r-${i}`} cx={x} cy={57.5 + (i % 3) * 0.6} rx={0} ry={0} stroke="rgba(147,197,253,0.65)" strokeWidth={0.18} fill="none" animate={{ rx: [0, 1.8, 0], ry: [0, 0.5, 0], opacity: [0, 0.85, 0] }} transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeOut' }} />
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>

    {/* Wind streaks */}
    {isWindy && [...Array(6)].map((_, i) => (
      <motion.path key={i} d={`M 5 ${22 + i * 5} q 12 -1.5 24 0`} stroke="rgba(255,255,255,0.55)" strokeWidth={0.4} fill="none" strokeLinecap="round" animate={{ x: [-15, 110], opacity: [0, 0.8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'linear' }} />
    ))}

    {/* Snowflakes — fades in/out smoothly */}
    <AnimatePresence>
      {isSnow && (
        <motion.g key="snow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
          {[...Array(38)].map((_, i) => {
            const x = (i * 2.8 + Math.sin(i * 1.7) * 6) % 96 + 2;
            const r = 0.3 + (i % 5) * 0.08;
            const speed = 4 + (i % 6) * 0.9;
            const delay = (i * 0.21) % speed;
            const startY = -(1 + (i % 10) * 1.2);
            const drift = (i % 2 === 0 ? 1 : -1) * (1.5 + (i % 4) * 1.2);
            return (
              <motion.g key={i} animate={{ y: [startY, 66], x: [0, drift] }} transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }}>
                <ellipse cx={x} cy={0} rx={r / sx} ry={r} fill="rgba(255,255,255,0.88)" />
              </motion.g>
            );
          })}
        </motion.g>
      )}
    </AnimatePresence>

    <rect width={vbW} height="60" fill="url(#haze)" />
    <rect width={vbW} height="60" fill="url(#vignette)" />
  </>
);

export default WeatherEffects;
