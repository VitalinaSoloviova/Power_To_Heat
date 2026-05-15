import { motion } from 'framer-motion';
import React from 'react';

interface WeatherDefsProps {
  sky: { top: string; mid: string; bottom: string };
  isNight: boolean;
  hazeOpacity: number;
  sunCoreColor: string;
  tween: { duration: number; ease: any };
}

const WeatherDefs: React.FC<WeatherDefsProps> = ({ sky, isNight, hazeOpacity, sunCoreColor, tween }) => (
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
);

export default WeatherDefs;
