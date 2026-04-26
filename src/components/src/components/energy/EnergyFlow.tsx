import React from 'react';

interface EnergyFlowProps {
  intensity: number;        // 0..1
  active: boolean;
  color?: string;
  particleCount?: number;
  height?: number;
}

/**
 * Static energy flow line - animations removed
 */
const EnergyFlow: React.FC<EnergyFlowProps> = ({
  intensity,
  active,
  color = '#10b981',
  particleCount = 4,
  height = 120,
}) => {
  const opacity = active ? 0.9 : 0.15;
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
      {/* Static main line */}
      <path
        d={d}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
        style={{ filter: `drop-shadow(0 0 ${4 + intensity * 8}px ${color})` }}
      />
      {/* Static particles along the path */}
      {active &&
        [...Array(particleCount)].map((_, i) => (
          <circle
            key={i}
            r={2.5 + intensity * 2}
            fill={color}
            cx={15 + (i * 30)}
            cy={60}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        ))}
    </svg>
  );
};

export default EnergyFlow;
