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

  const prepared = useMemo<(PriceGraphPoint & { x: number })[]>(() => {
    if (!points || points.length === 0) return [] as (PriceGraphPoint & { x: number })[];
    // sort and compute min/max timestamps, then map into x [0, VIEW_W]
    const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);
    const minTs = sorted[0].timestamp;
    const maxTs = sorted[sorted.length - 1].timestamp;
    const totalTs = maxTs - minTs || 1;
    return sorted.map(p => ({ ...p, x: ((p.timestamp - minTs) / totalTs) * VIEW_W })) as (PriceGraphPoint & { x: number })[];
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

  const nowX = useMemo(() => {
    if (prepared.length === 0) return VIEW_W / 2;
    const minTs = prepared[0].timestamp;
    const maxTs = prepared[prepared.length - 1].timestamp;
    const totalTs = maxTs - minTs || 1;
    return ((now - minTs) / totalTs) * VIEW_W;
  }, [prepared, now]);

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

            {/* points: draw non-current first, then current on top for visibility */}
            {prepared.filter(p => p.period !== 'current').map((p, i) => {
              const cx = p.x; const cy = yOf(p.priceCtKwh);
              const fill = p.period === 'past' ? colors.textMuted : colors.energy;
              return (
                <g key={`p-${p.timestamp}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <circle cx={cx} cy={cy} r={pointRadius} fill={fill} stroke={colors.bgCardSolid} strokeWidth={1} />
                </g>
              );
            })}

            {prepared.filter(p => p.period === 'current').map((p, idx) => {
              // compute index for hover mapping: find original index in prepared
              const i = prepared.findIndex(pp => pp.timestamp === p.timestamp);
              const cx = p.x; const cy = yOf(p.priceCtKwh);
              const innerR = pointRadius + 3;
              const outerR = innerR + 4;
              return (
                <g key={`current-${p.timestamp}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
                  <circle cx={cx} cy={cy} r={innerR} fill={colors.primary} stroke={colors.bgCardSolid} strokeWidth={2} />
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
