import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useColors } from '@theme/useTheme';

interface IslandFrameProps {
  children: ReactNode;
  label: string;
  /** 0..1 — used to drive subtle glow / activity pulses. */
  activity?: number;
  /** Hex color used for the label / soft outer glow. */
  accent?: string;
  size?: number;
  topSlot?: ReactNode;
  badge?: ReactNode;
  delay?: number;
}

/**
 * Round dark "scene bubble" used by every simulation island. 
 */
const IslandFrame: React.FC<IslandFrameProps> = ({
  children,
  label,
  activity = 0.5,
  accent = '#94a3b8',
  size = 220,
  topSlot,
  badge,
  delay = 0,
}) => {
  const colors = useColors();
  const glow = Math.min(1, Math.max(0, activity));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Label at the top */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.4,
            color: accent,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </div>

      {topSlot && <div style={{ minHeight: size * 0.55 }}>{topSlot}</div>}

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Drop shadow behind the bubble */}
        <div
          style={{
            position: 'absolute',
            width: size * 1,
            height: size * 0.25,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.25)',
            filter: 'blur(12px)',
            bottom: -size * 0.15,
            zIndex: -1,
          }}
        />

        {/* Translucent glass bubble */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 32%, rgba(15,23,42,0.28) 75%, rgba(2,6,23,0.45) 100%)',
            border: `1px solid ${accent}55`,
            boxShadow: `
              inset 0 2px 22px rgba(255,255,255,0.18),
              inset 0 -8px 22px rgba(0,0,0,0.25),
              0 18px 40px rgba(2,6,23,0.45),
              0 8px 20px rgba(2,6,23,0.35),
              0 0 ${10 + glow * 20}px ${accent}55
            `,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
        {/* faint top sheen */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '18%',
            width: '50%',
            height: '16%',
            zIndex: 1,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Scene fills the bubble edge-to-edge, masked to a circle */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </motion.div>

      {/* Badge at the bottom */}
      {badge && (
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          {badge}
        </div>
      )}
    </motion.div>
  );
};

export default IslandFrame;
