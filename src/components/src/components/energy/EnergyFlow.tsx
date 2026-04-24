import { motion } from 'framer-motion';

interface EnergyFlowProps {
  intensity: number;        // 0..1
  active: boolean;
  color?: string;
  particleCount?: number;
  height?: number;
}

/**
 * Reusable horizontal animated energy flow line with glowing
 * particles travelling along an SVG path. Fills the parent width.
 */
const EnergyFlow: React.FC<EnergyFlowProps> = ({
  intensity,
  active,
  color = '#10b981',
  particleCount = 4,
  height = 120,
}) => {
  const opacity = active ? 0.9 : 0.15;
  const speed = Math.max(1.2, 4 - intensity * 3);
  const d = 'M 0 60 C 40 60, 80 60, 120 60';

  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 120 120"
      preserveAspectRatio="none"
      style={{ overflow: 'visible' }}
    >
      {/* Dashed base line */}
      <path
        d={d}
        stroke={color}
        strokeWidth={1.2}
        strokeDasharray="3 5"
        fill="none"
        opacity={0.25}
        strokeLinecap="round"
      />
      {/* Glowing main line */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        animate={{ opacity }}
        transition={{ duration: 0.4 }}
        style={{ filter: `drop-shadow(0 0 ${4 + intensity * 8}px ${color})` }}
      />
      {/* Particles along the path */}
      {active &&
        [...Array(particleCount)].map((_, i) => (
          <motion.circle
            key={i}
            r={2.5 + intensity * 2}
            fill={color}
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: 'linear',
              delay: (speed / particleCount) * i,
            }}
            style={{
              offsetPath: `path('${d}')`,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        ))}
    </svg>
  );
};

export default EnergyFlow;
