import React, { useMemo, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import useEnergyPricesAroundNow, { type PriceGraphPoint } from '../hooks/useEnergyPricesAroundNow';
import { useColors } from '@theme/useTheme';

interface Props {
  height?: number;
}

const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 160;

const POINT_BASE_RADIUS = 4;
const HORIZONTAL_POINT_PADDING = 12; // px padding from left/right edges for first/last points
const VERTICAL_POINT_PADDING = 12; // px padding from top/bottom edges for highest/lowest points

const formatHour = (ts: number) => new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });

const EnergyPriceAroundNowChart: React.FC<Props> = ({ height = 120 }) => {
  const colors = useColors();
  const { points, loading, error } = useEnergyPricesAroundNow();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const now = Date.now();

  const preparedPoints = useMemo<(PriceGraphPoint & { x: number })[]>(() => {
    if (!points || points.length === 0) return [] as (PriceGraphPoint & { x: number })[];
    // sort and compute min/max timestamps, then map into x [0, VIEW_WIDTH]
    const sortedPoints = [...points].sort((a, b) => a.timestamp - b.timestamp);
    const minTimestamp = sortedPoints[0].timestamp;
    const maxTimestamp = sortedPoints[sortedPoints.length - 1].timestamp;
    const totalTimestampRange = maxTimestamp - minTimestamp || 1;
    const usableWidth = VIEW_WIDTH - HORIZONTAL_POINT_PADDING * 2;
    return sortedPoints.map(point => ({
      ...point,
      x: HORIZONTAL_POINT_PADDING + ((point.timestamp - minTimestamp) / totalTimestampRange) * usableWidth,
    })) as (PriceGraphPoint & { x: number })[];
  }, [points]);

  const yValues = useMemo(() => preparedPoints.map(point => point.priceCtKwh), [preparedPoints]);
  const minPrice = yValues.length ? Math.min(...yValues) : 0;
  const maxPrice = yValues.length ? Math.max(...yValues) : 1;

  const yPositionOfPrice = (price: number) => {
    const pct = (price - minPrice) / (maxPrice - minPrice || 1);
    const usableHeight = VIEW_HEIGHT - VERTICAL_POINT_PADDING * 2;
    return VIEW_HEIGHT - (pct * usableHeight + VERTICAL_POINT_PADDING);
  };

  const pathData = useMemo(() => {
    if (preparedPoints.length === 0) return '';
    const coords = preparedPoints.map(point => `${point.x},${yPositionOfPrice(point.priceCtKwh)}`);
    return `M ${coords.join(' L ')} `;
  }, [preparedPoints, minPrice, maxPrice]);

  const nowXPosition = useMemo(() => {
    if (preparedPoints.length === 0) return VIEW_WIDTH / 2;
    const minTimestamp = preparedPoints[0].timestamp;
    const maxTimestamp = preparedPoints[preparedPoints.length - 1].timestamp;
    const totalTimestampRange = maxTimestamp - minTimestamp || 1;
    const usableWidth = VIEW_WIDTH - HORIZONTAL_POINT_PADDING * 2;
    return HORIZONTAL_POINT_PADDING + ((now - minTimestamp) / totalTimestampRange) * usableWidth;
  }, [preparedPoints, now]);

  return (
    <Box sx={{ width: '100%' }}>
      {loading && <Typography sx={{ color: colors.textSecondary }}>Loading…</Typography>}
      {error && <Typography sx={{ color: colors.textMuted }}>Price data unavailable</Typography>}
      {!loading && !error && (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <svg ref={svgRef} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
            {/* grid lines */}
            <g stroke={colors.chartGrid} strokeWidth={0.5}>
              <line x1={0} x2={VIEW_WIDTH} y1={VERTICAL_POINT_PADDING} y2={VERTICAL_POINT_PADDING} />
              <line x1={0} x2={VIEW_WIDTH} y1={VIEW_HEIGHT/2} y2={VIEW_HEIGHT/2} />
              <line x1={0} x2={VIEW_WIDTH} y1={VIEW_HEIGHT - VERTICAL_POINT_PADDING} y2={VIEW_HEIGHT - VERTICAL_POINT_PADDING} />
            </g>

            {/* past/future split with different stroke styles */}
            <motion.path d={pathData}
              fill="none"
              stroke={colors.energy}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 6px 12px ${colors.primarySoft})` }}
            />

            {/* now marker */}
            <line x1={nowXPosition} x2={nowXPosition} y1={VERTICAL_POINT_PADDING + 2} y2={VIEW_HEIGHT - VERTICAL_POINT_PADDING - 2} stroke={colors.primary} strokeWidth={1.5} strokeDasharray="4 4" />

            {/* points: draw non-current first, then current on top for visibility */}
            {preparedPoints.filter(point => point.period !== 'current').map((point) => {
              const indexInPrepared = preparedPoints.findIndex(pp => pp.timestamp === point.timestamp);
              const centerX = point.x; const centerY = yPositionOfPrice(point.priceCtKwh);
              const fillColor = point.period === 'past' ? colors.textMuted : colors.energy;
              return (
                <g key={`p-${point.timestamp}`} onMouseEnter={() => setHoveredIndex(indexInPrepared)} onMouseLeave={() => setHoveredIndex(null)}>
                  <circle cx={centerX} cy={centerY} r={POINT_BASE_RADIUS} fill={fillColor} stroke={colors.bgCardSolid} strokeWidth={1} />
                </g>
              );
            })}

            {preparedPoints.filter(point => point.period === 'current').map((point) => {
              const indexInPrepared = preparedPoints.findIndex(pp => pp.timestamp === point.timestamp);
              const centerX = point.x; const centerY = yPositionOfPrice(point.priceCtKwh);
              const innerRadius = POINT_BASE_RADIUS + 3;
              const outerRadius = innerRadius + 4;
              return (
                <g key={`current-${point.timestamp}`} onMouseEnter={() => setHoveredIndex(indexInPrepared)} onMouseLeave={() => setHoveredIndex(null)}>
                  <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
                  <circle cx={centerX} cy={centerY} r={innerRadius} fill={colors.primary} stroke={colors.bgCardSolid} strokeWidth={2} />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIndex !== null && preparedPoints[hoveredIndex] && (
            <Box sx={{ position: 'absolute', pointerEvents: 'none', left: `${(preparedPoints[hoveredIndex].x / VIEW_WIDTH) * 100}%`, top: 0, transform: 'translateX(-50%)', bgcolor: colors.bgCard, color: colors.textPrimary, px: 1, py: 0.5, borderRadius: 1, boxShadow: `0 6px 18px ${colors.primarySoft}` }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{formatHour(preparedPoints[hoveredIndex].timestamp)}</Typography>
              <Typography sx={{ fontSize: 12 }}>{preparedPoints[hoveredIndex].priceCtKwh.toFixed(1)} ct/kWh</Typography>
              <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{preparedPoints[hoveredIndex].period}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EnergyPriceAroundNowChart;
