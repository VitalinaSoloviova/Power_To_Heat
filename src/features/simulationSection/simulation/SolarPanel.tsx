import { motion } from 'framer-motion';

interface SolarPanelProps {
  /** X position of the solar panel */
  x: number;
  /** Y position of the solar panel */
  y: number;
  /** Width of the panel */
  width?: number;
  /** Height of the panel */
  height?: number;
  /** Sun power level for sheen effect (0-1) */
  sunPower?: number;
}

/**
 * Solar panel component with photovoltaic cells and sun sheen effect.
 * Displays a flat, frontal view with detailed cell grid.
 */
const SolarPanel: React.FC<SolarPanelProps> = ({
  x,
  y,
  width = 40,
  height = 28,
  sunPower = 0.5,
}) => {
  const cellMargin = 2;
  const cellWidth = (width - cellMargin * 2) / 6;
  const cellHeight = (height - cellMargin * 2) / 3;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* panel frame */}
      <rect x="0" y="0" width={width} height={height} fill="url(#pwPanelFrameG)" rx="2" />
      {/* panel surface */}
      <rect x="2" y="2" width={width - 4} height={height - 4} fill="url(#pwPanelG)" />
      {/* cells grid (3x6) */}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => {
          const x1 = cellMargin + 2 + c * cellWidth;
          const y1 = cellMargin + 2 + r * cellHeight;
          return (
            <rect
              key={`${r}-${c}`}
              x={x1}
              y={y1}
              width={cellWidth - 0.4}
              height={cellHeight - 0.4}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="0.2"
            />
          );
        }),
      )}
      {/* sun sheen pulse */}
      <motion.rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        fill="#bae6fd"
        animate={{ opacity: [0, sunPower * 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </g>
  );
};

export default SolarPanel;