import { motion } from 'framer-motion';
import IslandBadge from './IslandBadge';
import type { SimulationPoint } from './simulationTypes';
import { storageFraction } from './storageCalculationUtils';
import { SimulationConfig } from './SimulationConfig';

interface StorageIslandProps {
  point: SimulationPoint;
  isCharging: boolean;
  isDischarging: boolean;
  size?: number;
}

// Energy palette — yellow → pink → violet → red
const ENERGY_LOW = '#fde047';     // yellow
const ENERGY_MID = '#f472b6';     // pink
const ENERGY_HIGH = '#a855f7';    // violet
const ENERGY_TOP = '#ef4444';     // red
const ENERGY_GLOW = '#f9a8d4';    // soft pink for glow
const CHARGE = '#22c55e';
const DISCHARGE = '#ef4444';

/**
 * Energy storage tank — white cylindrical tank housing visualises
 * stored ENERGY (not water, not heat). Energy is rendered as a
 * vibrant gradient from yellow at the bottom through pink and violet
 * to red at the top, glowing brighter as it fills.
 */
const StorageIsland: React.FC<StorageIslandProps> = ({
  point,
  isCharging,
  isDischarging,
  size = 250,
}) => {
  const fraction = storageFraction(point.storage);

  const badgeComponent = (
    <IslandBadge
      label="Storage Capacity"
      text={`${Math.round(point.storage.level)} / ${point.storage.capacity} kWh · ${(fraction * 100).toFixed(0)}%`}
      color="#ffffff"
      bgColor="rgba(168, 85, 247, 0.9)"
      icon="🔋"
    />
  );

  // Tank silhouette in viewBox 200x260
  const tankX = 25;
  const tankW = 150;
  const tankTopY = 45;
  const tankBottomY = 215;
  const tankH = tankBottomY - tankTopY;
  const fillH = tankH * fraction;
  const fillY = tankBottomY - fillH;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Label at the top */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.6,
            color: ENERGY_HIGH,
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${ENERGY_GLOW}`,
          }}
        >
          Energy Storage
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          width: size,
          height: size * 1.15,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* Energy ambient glow */}
        {fraction > SimulationConfig.THRESHOLDS.storage.low && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: '10% 15%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${ENERGY_GLOW}66 0%, ${ENERGY_HIGH}33 50%, transparent 75%)`,
              filter: 'blur(28px)',
              zIndex: -1,
            }}
          />
        )}

        <svg
          width="100%"
          height="100%"
          viewBox="20 35 160 190"
          preserveAspectRatio="xMidYMax meet"
          style={{ 
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.45))',
            padding: '0 0px',  // 10px links/rechts padding
          }}
        >
          <defs>
            {/* White tank body */}
            <linearGradient id="stTankBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="20%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="80%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="stTankTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            {/* Energy gradient: yellow at bottom → pink → violet → red at top */}
            <linearGradient id="stEnergy" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={ENERGY_LOW} />
              <stop offset="40%" stopColor={ENERGY_MID} />
              <stop offset="75%" stopColor={ENERGY_HIGH} />
              <stop offset="100%" stopColor={ENERGY_TOP} />
            </linearGradient>
            <linearGradient id="stGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
            </linearGradient>
            <linearGradient id="stPad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
            <clipPath id="stWindowClip">
              <rect x={tankX + 30} y={tankTopY + 30} width={tankW - 60} height={tankH - 60} rx="4" />
            </clipPath>
            <filter id="stBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Top terminal (battery-style cap with lightning) */}
          <rect x={tankX + tankW / 2 - 8} y={tankTopY - 8} width="16" height="8" rx="2" fill="#475569" />
          <path
            d={`M ${tankX + tankW / 2 - 2} ${tankTopY - 6}
                L ${tankX + tankW / 2 + 1} ${tankTopY - 3}
                L ${tankX + tankW / 2 - 1} ${tankTopY - 3}
                L ${tankX + tankW / 2 + 2} ${tankTopY}`}
            stroke={ENERGY_LOW}
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 1.5px ${ENERGY_LOW})` }}
          />

          {/* Top dome */}
          <ellipse cx={tankX + tankW / 2} cy={tankTopY + 4} rx={tankW / 2} ry="10" fill="url(#stTankTop)" />

          {/* Main white tank body */}
          <rect
            x={tankX}
            y={tankTopY + 4}
            width={tankW}
            height={tankH - 4}
            rx="8"
            fill="url(#stTankBody)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.5"
          />

          {/* Subtle metal seams */}
          <line x1={tankX} x2={tankX + tankW} y1={tankTopY + 30} y2={tankTopY + 30} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <line x1={tankX} x2={tankX + tankW} y1={tankBottomY - 30} y2={tankBottomY - 30} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

          {/* Vertical highlight */}
          <rect x={tankX + 6} y={tankTopY + 8} width="3" height={tankH - 16} fill="rgba(255,255,255,0.5)" rx="1" />

          {/* Glass viewing window */}
          <rect
            x={tankX + 30}
            y={tankTopY + 30}
            width={tankW - 60}
            height={tankH - 60}
            rx="4"
            fill="#0a0a14"
          />

          <g clipPath="url(#stWindowClip)">
            {/* Faint capacity grid */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={`grid-${i}`}
                x1={tankX + 30}
                x2={tankX + tankW - 30}
                y1={tankTopY + 30 + ((tankH - 60) / 8) * i}
                y2={tankTopY + 30 + ((tankH - 60) / 8) * i}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
            ))}

            {/* Stored energy fill */}
            <motion.rect
              x={tankX + 30}
              width={tankW - 60}
              fill="url(#stEnergy)"
              initial={false}
              animate={{
                y: Math.max(tankTopY + 30, fillY),
                height: Math.min(tankH - 60, fillH),
              }}
              transition={{
                y: { type: 'spring', stiffness: 60, damping: 16 },
                height: { type: 'spring', stiffness: 60, damping: 16 },
              }}
              style={{ filter: `drop-shadow(0 0 6px ${ENERGY_GLOW})` }}
            />

            {/* Pulsing brightness overlay */}
            <motion.rect
              x={tankX + 30}
              width={tankW - 60}
              fill="url(#stEnergy)"
              initial={false}
              animate={{
                y: Math.max(tankTopY + 30, fillY),
                height: Math.min(tankH - 60, fillH),
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                y: { type: 'spring', stiffness: 60, damping: 16 },
                height: { type: 'spring', stiffness: 60, damping: 16 },
                opacity: { duration: 2.4, repeat: Infinity },
              }}
              style={{ mixBlendMode: 'screen' }}
            />

            {/* Glowing energy surface line */}
            {fraction > SimulationConfig.THRESHOLDS.storage.empty && (
              <motion.line
                x1={tankX + 30}
                x2={tankX + tankW - 30}
                y1={Math.max(tankTopY + 30, fillY)}
                y2={Math.max(tankTopY + 30, fillY)}
                stroke="#ffffff"
                strokeWidth="1.2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 4px ${ENERGY_GLOW})` }}
              />
            )}

            {/* Rising energy sparks */}
            {fraction > SimulationConfig.THRESHOLDS.storage.sparks &&
              [0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={`spark-${i}`}
                  cx={tankX + 38 + i * 8}
                  cy={tankBottomY - 32}
                  r={1}
                  fill="#ffffff"
                  animate={{
                    cy: [tankBottomY - 32, fillY + 4],
                    opacity: [0.9, 0],
                    r: [1, 0.3],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeOut',
                  }}
                  style={{ filter: `drop-shadow(0 0 2px ${ENERGY_MID})` }}
                />
              ))}

            {/* Charging lightning bolt */}
            {isCharging && (
              <motion.path
                d={`M ${tankX + tankW / 2 - 5} ${tankTopY + 36}
                    L ${tankX + tankW / 2 + 2} ${tankTopY + 56}
                    L ${tankX + tankW / 2 - 2} ${tankTopY + 56}
                    L ${tankX + tankW / 2 + 5} ${tankTopY + 78}`}
                stroke={CHARGE}
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 4px ${CHARGE})` }}
              />
            )}

            {/* Discharging lightning bolt */}
            {isDischarging && (
              <motion.path
                d={`M ${tankX + tankW / 2 + 5} ${tankTopY + 78}
                    L ${tankX + tankW / 2 - 2} ${tankTopY + 56}
                    L ${tankX + tankW / 2 + 2} ${tankTopY + 56}
                    L ${tankX + tankW / 2 - 5} ${tankTopY + 36}`}
                stroke={DISCHARGE}
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 4px ${DISCHARGE})` }}
              />
            )}
          </g>

          {/* Glass shine over window */}
          <rect
            x={tankX + 30}
            y={tankTopY + 30}
            width={tankW - 60}
            height={tankH - 60}
            rx="4"
            fill="url(#stGlass)"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="1"
            pointerEvents="none"
          />

          {/* Bottom info strip */}
          <g>
            <rect
              x={tankX + 10}
              y={tankBottomY - 22}
              width={tankW - 20}
              height="14"
              rx="3"
              fill="rgba(15,23,42,0.9)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.4"
            />
            {/* Lightning glyph */}
            <path
              d={`M ${tankX + 16} ${tankBottomY - 18}
                  L ${tankX + 20} ${tankBottomY - 14}
                  L ${tankX + 18} ${tankBottomY - 14}
                  L ${tankX + 21} ${tankBottomY - 10}
                  L ${tankX + 16} ${tankBottomY - 13}
                  L ${tankX + 18} ${tankBottomY - 13} Z`}
              fill={ENERGY_LOW}
              style={{ filter: `drop-shadow(0 0 2px ${ENERGY_MID})` }}
            />
            <text
              x={tankX + tankW - 14}
              y={tankBottomY - 12}
              fontSize="9"
              fontWeight="700"
              fill={ENERGY_GLOW}
              textAnchor="end"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              style={{ letterSpacing: 0.5 }}
            >
              {Math.round(fraction * 100)}%
            </text>
          </g>

         </svg>
      </motion.div>

      {/* Badge at the bottom */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        {badgeComponent}
      </div>
    </motion.div>
  );
};

export default StorageIsland;
