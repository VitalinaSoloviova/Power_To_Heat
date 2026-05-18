import { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '@theme/useTheme';
import { getChartSx, getGlassSx } from '@theme/colors';
import { tx, fw, radii } from '@theme/tokens';
import { computeRunStats } from './analyticsTypes';
import type { SimulationRun } from './analyticsTypes';

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

const CompareView: React.FC<Props> = ({ runA, runB, onClose }) => {
  const colors = useColors();
  const statsA = useMemo(() => computeRunStats(runA.series), [runA.series]);
  const statsB = useMemo(() => computeRunStats(runB.series), [runB.series]);

  const labelA = new Date(runA.params.startDay).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  const labelB = new Date(runB.params.startDay).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

  const pricesA      = useMemo(() => runA.series.map(p => p.energy.price), [runA.series]);
  const pricesB      = useMemo(() => runB.series.map(p => p.energy.price), [runB.series]);
  const demandsA     = useMemo(() => runA.series.map(p => p.demand.current / 10), [runA.series]);
  const demandsB     = useMemo(() => runB.series.map(p => p.demand.current / 10), [runB.series]);
  const tempsA       = useMemo(() => runA.series.map(p => p.weather.temperature), [runA.series]);
  const tempsB       = useMemo(() => runB.series.map(p => p.weather.temperature), [runB.series]);
  const storageA     = useMemo(() => runA.series.map(p => Math.round((p.storage.level / p.storage.capacity) * 100)), [runA.series]);
  const storageB     = useMemo(() => runB.series.map(p => Math.round((p.storage.level / p.storage.capacity) * 100)), [runB.series]);

  const colorA = colors.cool;
  const colorB = colors.heat;

  const statRows = [
    { label: 'Cost',      a: `${statsA.totalCost.toFixed(0)} €`,     b: `${statsB.totalCost.toFixed(0)} €` },
    { label: 'Savings',   a: `${statsA.savings >= 0 ? '+' : ''}${statsA.savings.toFixed(0)} €`, b: `${statsB.savings >= 0 ? '+' : ''}${statsB.savings.toFixed(0)} €` },
    { label: 'Cheap',     a: String(statsA.cheapCount),               b: String(statsB.cheapCount) },
    { label: 'Expensive', a: String(statsA.expensiveCount),           b: String(statsB.expensiveCount) },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colorA }} />
          <Typography sx={{ fontSize: tx.md, fontWeight: fw.bold, color: colors.textPrimary }}>{labelA}</Typography>
        </Box>
        <Typography sx={{ fontSize: tx.md, color: colors.textMuted }}>vs.</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colorB }} />
          <Typography sx={{ fontSize: tx.md, fontWeight: fw.bold, color: colors.textPrimary }}>{labelB}</Typography>
        </Box>
        <Button
          size="small"
          startIcon={<CloseRounded />}
          onClick={onClose}
          sx={{ ml: 'auto', fontSize: tx.sm, borderRadius: radii.md, borderColor: colors.border, color: colors.textSecondary,
            border: `1px solid ${colors.border}`, '&:hover': { bgcolor: colors.bgSurface } }}
        >
          Close
        </Button>
      </Box>

      {/* Stats strip */}
      <Box sx={{ ...getGlassSx(colors), px: 2, py: 1.2, display: 'flex', gap: 3, flexShrink: 0, overflow: 'hidden', flexWrap: 'wrap' }}>
        {statRows.map(row => (
          <Box key={row.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
            <Typography sx={{ fontSize: 9, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', mb: 0.3 }}>
              {row.label}
            </Typography>
            <Typography sx={{ fontSize: tx.base, fontWeight: fw.bold, color: colorA }}>{row.a}</Typography>
            <Typography sx={{ fontSize: tx.base, fontWeight: fw.bold, color: colorB }}>{row.b}</Typography>
          </Box>
        ))}
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
