import { motion } from 'framer-motion';

interface EnergyFlowProps {
  intensity: number;        // 0..1
  color?: string;
  particleCount?: number;
  height?: number;
}

/**
 * Animated energy flow line with moving particles
 */
const EnergyFlow: React.FC<EnergyFlowProps> = ({
  intensity,
  color = '#10b981',
  particleCount = 4,
  height = 120,
}) => {
  const opacity = Math.max(0.2, 0.3 + intensity * 0.7); // Always visible, brighter with intensity
  const speed = Math.max(0.8, 6 - intensity * 5); // Slower when low intensity
  const particleOpacity = Math.max(0.4, intensity); // Particles fade with low intensity
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
      {/* Animated particles along the path */}
      {[...Array(particleCount)].map((_, i) => (
        <motion.circle
          key={i}
          r={1.5 + intensity * 2}
          fill={color}
          opacity={particleOpacity}
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
            filter: `drop-shadow(0 0 ${2 + intensity * 4}px ${color})`,
          }}
        />
      ))}
    </svg>
  );
};

export default EnergyFlow;
