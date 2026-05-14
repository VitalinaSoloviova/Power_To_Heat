import { memo } from 'react';
import { motion } from 'framer-motion';
import IslandFrame from './IslandFrame';
import GroundPatch from './GroundPatch';
import Tree from './Tree';
import type { SimulationPoint } from '../simulationTypes';
import { phaseForTimestamp, brightnessForPhase } from '../simulationUtils';

interface CityIslandProps {
  point: SimulationPoint;
  size?: number;
}

const ACCENT = '#fbbf24';

interface BuildingSpec {
  x: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  hasAntenna?: boolean;
}

// Layered skyline (back row + front row) for depth.
const BACK: BuildingSpec[] = [
  { x: 36, w: 22, h: 60, cols: 2, rows: 6 },
  { x: 60, w: 18, h: 78, cols: 2, rows: 8 },
  { x: 80, w: 28, h: 96, cols: 3, rows: 10, hasAntenna: true },
  { x: 110, w: 20, h: 70, cols: 2, rows: 7 },
  { x: 132, w: 24, h: 82, cols: 3, rows: 9 },
];

const FRONT: BuildingSpec[] = [
  { x: 30,  w: 20, h: 44, cols: 2, rows: 4 },
  { x: 52,  w: 26, h: 52, cols: 3, rows: 5 },
  { x: 124, w: 22, h: 50, cols: 2, rows: 5 },
  { x: 148, w: 22, h: 38, cols: 2, rows: 4 },
];

const Building = memo<{ b: BuildingSpec; demand: number; dim: number; gradId: string }>(function Building({
  b,
  demand,
  dim,
  gradId,
}) {
  const total = b.rows * b.cols;
  return (
    <g>
      <rect
        x={b.x}
        y={150 - b.h}
        width={b.w}
        height={b.h}
        rx={1}
        fill={`url(#${gradId})`}
      />
      {/* glossy left edge */}
      <rect
        x={b.x + 0.6}
        y={150 - b.h + 2}
        width={1.4}
        height={b.h - 6}
        rx={0.6}
        fill="rgba(255,255,255,0.18)"
      />
      {/* roof line */}
      <rect x={b.x} y={150 - b.h} width={b.w} height={2} fill="rgba(0,0,0,0.35)" />
      {Array.from({ length: b.rows }).map((_, r) =>
        Array.from({ length: b.cols }).map((_, c) => {
          const idx = r * b.cols + c;
          const lit = idx / total < demand;
          const cellW = (b.w - 4) / b.cols;
          const cellH = (b.h - 6) / b.rows;
          const wx = b.x + 2 + c * cellW;
          const wy = 150 - b.h + 4 + r * cellH;
          return (
            <motion.rect
              key={`${r}-${c}`}
              x={wx + cellW * 0.1}
              y={wy + cellH * 0.15}
              width={cellW * 0.7}
              height={cellH * 0.6}
              rx={0.3}
              fill={lit ? '#fde68a' : 'rgba(15,23,42,0.7)'}
              animate={
                lit
                  ? { opacity: [0.7 * dim, 1 * dim, 0.7 * dim] }
                  : { opacity: 0.7 }
              }
              transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.04 }}
              style={lit ? { filter: 'drop-shadow(0 0 1.5px #fde68a)' } : undefined}
            />
          );
        }),
      )}
      {b.hasAntenna && (
        <>
          <rect x={b.x + b.w / 2 - 0.5} y={150 - b.h - 14} width={1} height={14} fill="#94a3b8" />
          <motion.circle
            cx={b.x + b.w / 2}
            cy={150 - b.h - 14}
            r={1.4}
            fill="#ef4444"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 0 2px #ef4444)' }}
          />
        </>
      )}
    </g>
  );
});

/**
 * Demand island — layered skyline of cool blue/grey towers with warm
 * windows that brighten with consumption and dim with time of day.
 */
const CityIsland: React.FC<CityIslandProps> = ({ point, size = 220 }) => {
  const demandLevel = Math.min(1, point.demand.current / 800);
  const phase = phaseForTimestamp(point.timestamp);
  const dim = brightnessForPhase(phase);

  return (
    <IslandFrame
      label="City"
      accent={ACCENT}
      activity={demandLevel}
      size={size}
      delay={0.1}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="cyBack" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="cyFront" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="cyGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="cyTreeG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        <GroundPatch gradientId="cyGround" />

        {/* back row */}
        {BACK.map((b) => (
          <Building key={`b-${b.x}`} b={b} demand={demandLevel} dim={dim} gradId="cyBack" />
        ))}
        {/* front row */}
        {FRONT.map((b) => (
          <Building key={`f-${b.x}`} b={b} demand={demandLevel} dim={dim} gradId="cyFront" />
        ))}

        {/* foreground trees */}
        <Tree x={22} y={152} size={8} gradientId="cyTreeG" />
        <Tree x={80} y={156} size={5} gradientId="cyTreeG" />
        <Tree x={122} y={156} size={5} gradientId="cyTreeG" />
        <Tree x={180} y={152} size={8} gradientId="cyTreeG" />
      </svg>
    </IslandFrame>
  );
};

export default CityIsland;
