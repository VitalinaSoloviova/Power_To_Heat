import React, { useMemo, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import useEnergyPricesAroundNow, { type PriceGraphPoint } from '../hooks/useEnergyPricesAroundNow';
import { useColors } from '@theme/useTheme';

interface Props {
  height?: number;
}

const VIEW_W = 480;
const VIEW_H = 160;

const pointRadius = 4;

const formatHour = (ts: number) => new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });

const EnergyPriceAroundNowChart: React.FC<Props> = ({ height = 120 }) => {
  const colors = useColors();
  const { points, loading, error } = useEnergyPricesAroundNow();
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const now = Date.now();
  const rangeStart = now - 24 * 60 * 60 * 1000;
  const rangeEnd = now + 24 * 60 * 60 * 1000;
  const total = rangeEnd - rangeStart;

  const prepared = useMemo(() => {
    if (!points || points.length === 0) return [] as PriceGraphPoint[];
    // Map timestamps into x [0, VIEW_W]
    return points.map(p => ({ ...p, x: ((p.timestamp - rangeStart) / total) * VIEW_W })) as unknown as (PriceGraphPoint & { x: number })[];
  }, [points]);

  const ys = useMemo(() => prepared.map(p => p.priceCtKwh), [prepared]);
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 1;

  const yOf = (price: number) => {
    const pct = (price - minY) / (maxY - minY || 1);
    return VIEW_H - (pct * (VIEW_H - 20) + 10); // padding
  };

  const pathD = useMemo(() => {
    if (prepared.length === 0) return '';
    const coords = prepared.map(p => `${p.x},${yOf(p.priceCtKwh)}`);
    return `M ${coords.join(' L ')} `;
  }, [prepared, minY, maxY]);

  const nowX = ((now - rangeStart) / total) * VIEW_W;

  return (
    <Box sx={{ width: '100%' }}>
      {loading && <Typography sx={{ color: colors.textSecondary }}>Loading…</Typography>}
      {error && <Typography sx={{ color: colors.textMuted }}>Price data unavailable</Typography>}
      {!loading && !error && (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
            {/* grid lines */}
            <g stroke={colors.chartGrid} strokeWidth={0.5}>
              <line x1={0} x2={VIEW_W} y1={10} y2={10} />
              <line x1={0} x2={VIEW_W} y1={VIEW_H/2} y2={VIEW_H/2} />
              <line x1={0} x2={VIEW_W} y1={VIEW_H-10} y2={VIEW_H-10} />
            </g>

            {/* past/future split with different stroke styles */}
            <motion.path d={pathD}
              fill="none"
              stroke={colors.energy}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 6px 12px ${colors.primarySoft})` }}
            />

            {/* now marker */}
            <line x1={nowX} x2={nowX} y1={6} y2={VIEW_H-6} stroke={colors.primary} strokeWidth={1.5} strokeDasharray="4 4" />

            {/* points */}
            {prepared.map((p, i) => {
              const cx = p.x; const cy = yOf(p.priceCtKwh);
              const isCurrent = p.period === 'current';
              const fill = isCurrent ? colors.primary : (p.period === 'past' ? colors.textMuted : colors.energy);
              const r = isCurrent ? pointRadius + 2 : pointRadius;
              return (
                <g key={p.timestamp} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={colors.bgCardSolid} strokeWidth={isCurrent ? 2 : 1} />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hover !== null && prepared[hover] && (
            <Box sx={{ position: 'absolute', pointerEvents: 'none', left: `${(prepared[hover].x/VIEW_W)*100}%`, top: 0, transform: 'translateX(-50%)', bgcolor: colors.bgCard, color: colors.textPrimary, px: 1, py: 0.5, borderRadius: 1, boxShadow: `0 6px 18px ${colors.primarySoft}` }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{formatHour(prepared[hover].timestamp)}</Typography>
              <Typography sx={{ fontSize: 12 }}>{prepared[hover].priceCtKwh.toFixed(1)} ct/kWh</Typography>
              <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{prepared[hover].period}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EnergyPriceAroundNowChart;
