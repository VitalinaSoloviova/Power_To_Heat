import { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';

import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '@theme/useTheme';
import { getChartSx, getGlassSx } from '@theme/colors';
import { tx, fw, radii } from '@theme/tokens';
import { computeRunStats } from './analyticsTypes';
import type { SimulationRun, RunStats } from './analyticsTypes';

const AutoHeight: React.FC<{ children: (h: number) => React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(160);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      if (h > 0) setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} style={{ flex: 1, minHeight: 0 }}>{children(height)}</div>;
};

interface DualChartProps {
  title: string;
  unit: string;
  dataA: number[];
  dataB: number[];
  colorA: string;
  colorB: string;
  labelA: string;
  labelB: string;
}

const DualChart: React.FC<DualChartProps> = ({ title, unit, dataA, dataB, colorA, colorB, labelA, labelB }) => {
  const colors = useColors();
  const chartSx = getChartSx(colors);
  const len = Math.min(dataA.length, dataB.length);
  const indices = Array.from({ length: len }, (_, i) => String(i + 1));
  const slicedA = dataA.slice(0, len);
  const slicedB = dataB.slice(0, len);
  const avgA = slicedA.length ? slicedA.reduce((a, b) => a + b, 0) / slicedA.length : 0;
  const avgB = slicedB.length ? slicedB.reduce((a, b) => a + b, 0) / slicedB.length : 0;

  return (
    <Box sx={{ ...getGlassSx(colors), backdropFilter: 'none', WebkitBackdropFilter: 'none', p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary, fontWeight: fw.medium }}>{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
          <Typography sx={{ fontSize: tx.xs, color: colorA, fontWeight: fw.bold }}>
            A: {avgA.toFixed(1)} {unit}
          </Typography>
          <Typography sx={{ fontSize: tx.xs, color: colorB, fontWeight: fw.bold }}>
            B: {avgB.toFixed(1)} {unit}
          </Typography>
        </Box>
      </Box>
      <AutoHeight>
        {(h) => len > 0 ? (
          <LineChart
            xAxis={[{ data: indices, scaleType: 'point', tickLabelStyle: { fontSize: 0 } }]}
            series={[
              { data: slicedA, color: colorA, area: false, showMark: false, curve: 'monotoneX', label: labelA },
              { data: slicedB, color: colorB, area: false, showMark: false, curve: 'monotoneX', label: labelB,
                valueFormatter: (v) => `${v?.toFixed(1)} ${unit}` },
            ]}
            height={h}
            margin={{ left: 44, right: 8, top: 4, bottom: 8 }}
            sx={{
              ...chartSx,
              '& .MuiLineElement-root': { strokeWidth: 2 },
              '& .MuiChartsLegend-root': { display: 'none' },
            }}
          />
        ) : null}
      </AutoHeight>
    </Box>
  );
};

interface Props {
  runA: SimulationRun;
  runB: SimulationRun;
  onClose: () => void;
}

const RANGE_LABEL: Record<string, string> = { day: 'Day', week: 'Week', month: 'Month' };

const SummaryCard: React.FC<{
  run: SimulationRun;
  stats: RunStats;
  label: string;
  color: string;
}> = ({ run, stats, label, color }) => {
  const colors = useColors();
  return (
    <Box sx={{
      ...getGlassSx(colors),
      flex: 1,
      minWidth: 0,
      borderLeft: `3px solid ${color}`,
      p: 1.5,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}>

      {/* Date + range */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Typography sx={{ fontSize: tx.md, fontWeight: fw.bold, color: colors.textPrimary }}>{label}</Typography>
        <Chip label={RANGE_LABEL[run.params.range]} size="small"
          sx={{ fontSize: tx.xs, height: 16, bgcolor: `${color}22`, color, border: 'none' }} />
      </Box>

      {/* City + residents */}
      {(run.params.cityName || run.params.residents !== undefined) && (
        <Typography sx={{ fontSize: tx.xs, color: colors.textMuted }}>
          {[run.params.cityName, run.params.residents !== undefined ? `${run.params.residents.toLocaleString('en-US')} residents` : null]
            .filter(Boolean).join(' · ')}
        </Typography>
      )}

      {/* Key metrics */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.25 }}>
        {([
          { label: 'Cost',      value: `${stats.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} €`, color: colors.textPrimary },
          { label: 'Savings',   value: `${stats.savings >= 0 ? '+' : ''}${stats.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })} €`,
            color: stats.savings >= 0 ? colors.cool : colors.warning },
        ] as { label: string; value: string; color: string }[]).map(row => (
          <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary }}>{row.label}</Typography>
            <Typography sx={{ fontSize: tx.sm, fontWeight: fw.bold, color: row.color }}>{row.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Purchase breakdown */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.25 }}>
        {[
          { label: 'Cheap',     count: stats.cheapCount,     color: colors.cool    },
          { label: 'Expensive', count: stats.expensiveCount, color: colors.warning },
          ...(stats.emergencyCount > 0 ? [{ label: 'Emergency', count: stats.emergencyCount, color: colors.danger }] : []),
        ].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color }} />
            <Typography sx={{ fontSize: tx.xs, color: colors.textSecondary }}>
              {item.label} <Typography component="span" sx={{ fontWeight: fw.bold, color: item.color, fontSize: tx.xs }}>{item.count}</Typography>
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Storage + initial level */}
      {run.params.storageCapacityMwh !== undefined && (
        <Typography sx={{ fontSize: tx.xs, color: colors.textMuted }}>
          {run.params.storageCapacityMwh.toLocaleString('en-US')} MWh · Initial {run.params.storageLevel} %
        </Typography>
      )}
    </Box>
  );
};

const CompareView: React.FC<Props> = ({ runA, runB, onClose }) => {
  const colors = useColors();
  const statsA = useMemo(() => computeRunStats(runA.series), [runA.series]);
  const statsB = useMemo(() => computeRunStats(runB.series), [runB.series]);

  const labelA = new Date(runA.params.startDay).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  const labelB = new Date(runB.params.startDay).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

  const pricesA      = useMemo(() => runA.series.map(p => p.energy.price), [runA.series]);
  const pricesB      = useMemo(() => runB.series.map(p => p.energy.price), [runB.series]);
  const demandsA     = useMemo(() => runA.series.map(p => p.demand.current), [runA.series]);
  const demandsB     = useMemo(() => runB.series.map(p => p.demand.current), [runB.series]);
  const tempsA       = useMemo(() => runA.series.map(p => p.weather.temperature), [runA.series]);
  const tempsB       = useMemo(() => runB.series.map(p => p.weather.temperature), [runB.series]);
  const storageA     = useMemo(() => runA.series.map(p => Math.round((p.storage.level / p.storage.capacity) * 100)), [runA.series]);
  const storageB     = useMemo(() => runB.series.map(p => Math.round((p.storage.level / p.storage.capacity) * 100)), [runB.series]);

  const colorA = colors.cool;
  const colorB = colors.heat;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}>

      {/* Summary cards + close */}
      <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, alignItems: 'flex-start' }}>
        <SummaryCard run={runA} stats={statsA} label={labelA} color={colorA} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, flexShrink: 0, pt: 1 }}>
          <Typography sx={{ fontSize: tx.xs, color: colors.textMuted, fontWeight: fw.medium }}>vs.</Typography>
          <Button size="small" startIcon={<CloseRounded />} onClick={onClose}
            sx={{ mt: 1, fontSize: tx.xs, borderRadius: radii.md, border: `1px solid ${colors.border}`,
              color: colors.textSecondary, '&:hover': { bgcolor: colors.bgSurface } }}>
            Close
          </Button>
        </Box>
        <SummaryCard run={runB} stats={statsB} label={labelB} color={colorB} />
      </Box>

      {/* 2×2 chart grid */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1.5 }}>
        <DualChart title="Electricity Price" unit="€/MWh" dataA={pricesA}  dataB={pricesB}  colorA={colorA} colorB={colorB} labelA={labelA} labelB={labelB} />
        <DualChart title="Heat Demand"       unit="MW"    dataA={demandsA} dataB={demandsB} colorA={colorA} colorB={colorB} labelA={labelA} labelB={labelB} />
        <DualChart title="Temperature"       unit="°C"    dataA={tempsA}   dataB={tempsB}   colorA={colorA} colorB={colorB} labelA={labelA} labelB={labelB} />
        <DualChart title="Storage Level"     unit="%"     dataA={storageA} dataB={storageB} colorA={colorA} colorB={colorB} labelA={labelA} labelB={labelB} />
      </Box>
    </Box>
  );
};

export default CompareView;
