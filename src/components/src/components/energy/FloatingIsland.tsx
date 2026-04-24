import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FloatingIslandProps {
  children: ReactNode;
  delay?: number;
  accent?: string;
  width?: number;
  height?: number;
}

/**
 * Reusable floating card with soft Apple-style shadow,
 * subtle floating motion and glassmorphism background.
 */
const FloatingIsland: React.FC<FloatingIslandProps> = ({
  children,
  delay = 0,
  accent = 'rgba(99, 102, 241, 0.25)',
  width = 200,
  height = 240,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: 'relative',
      width,
      height,
      borderRadius: 28,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: `0 20px 60px -20px ${accent}, 0 8px 24px -12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.6)`,
      padding: '24px 18px',
      zIndex: 2,
    }}
  >
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default FloatingIsland;
