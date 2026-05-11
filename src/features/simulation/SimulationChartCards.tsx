import { useState, useMemo, useCallback, memo } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '@theme/useTheme';
import { getChartSx } from '@theme/colors';
import { useChartsData } from '@features/charts/hooks/useChartsData';
import { HISTORY_OPTIONS, DEFAULT_HISTORY_YEARS, type HistoryYears } from '@services/UIService';
import type { SimulationRange } from './simulationTypes';
import type { Granularity } from '@calculations/DataResolver';

interface SimulationChartCardsProps {
  startDay: Date;
  range: SimulationRange;
  vertical?: boolean;
}

interface CardSeries {
  data: number[];
  color: string;
  label: string;
  area: boolean;
}

interface CardConfig {
  id: string;
  title: string;
  mainValue: number;
  unit: string;
  formatValue: (v: number) => string;
  series: CardSeries[];
  xLabels: string[];
}

const GRANULARITY: Record<SimulationRange, Granularity> = {
  day: 'hourly',
  week: 'hourly',
  month: 'daily',
};
const POINTS: Record<SimulationRange, number> = { day: 24, week: 168, month: 30 };

const COMPACT_H = 140;
const EXPANDED_H = 320;

const mean = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const miniChartSx = (base: object) => ({
  ...base,
  '& .MuiChartsAxis-root': { display: 'none' },
  '& .MuiChartsLegend-root': { display: 'none' },
  '& .MuiLineElement-root': { strokeWidth: 2.5 },
  '& .MuiLineChart-area': { opacity: '0.10 !important' },
});

const fullChartSx = (base: object) => ({
  ...base,
  '& .MuiLineElement-root': { strokeWidth: 2.5 },
  '& .MuiLineChart-area': { opacity: '0.10 !important' },
});

// Isolated card — only re-renders when its own `expanded` flag or data changes
const ChartCard = memo<{
  card: CardConfig;
  expanded: boolean;
  vertical: boolean;
  onToggle: (id: string | null) => void;
}>(function ChartCard({ card, expanded, vertical, onToggle }) {
  const colors = useColors();
  const chartSx = getChartSx(colors);
  const hasData = card.series[0]?.data.length > 0;

  const handleClick = useCallback(
    () => onToggle(expanded ? null : card.id),
    [onToggle, expanded, card.id],
  );

  return (
    <Box
      onClick={handleClick}
      sx={{
        ...(vertical ? { width: '100%' } : { flex: 1, minWidth: 0 }),
        height: expanded ? EXPANDED_H : COMPACT_H,
        transition: 'height 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.25s',
        overflow: 'hidden',
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${expanded ? colors.primary : colors.border}`,
        borderRadius: 2.5,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: expanded
          ? `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${colors.primary}30`
          : 'none',
        position: 'relative',
      }}
    >
      <Typography sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
        {card.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.25 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, lineHeight: 1 }}>
          {hasData ? card.formatValue(card.mainValue) : '—'}
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 0.25 }}>
          {card.unit}
        </Typography>
      </Box>
      <Box sx={{ mt: 'auto', height: 50, mx: -0.5, opacity: expanded ? 0 : 1, transition: 'opacity 0.15s' }}>
        {hasData && (
          <LineChart
            xAxis={[{ data: card.xLabels, scaleType: 'point' }]}
            series={card.series.map((s) => ({
              data: s.data,
              color: s.color,
              area: s.area,
              baseline: 'min' as const,
              showMark: false,
              curve: 'monotoneX' as const,
            }))}
            margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            height={50}
            sx={miniChartSx(chartSx)}
          />
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 80,
          left: 8,
          right: 8,
          bottom: 8,
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.22s 0.1s',
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        {hasData && (
          <LineChart
            xAxis={[{ data: card.xLabels, scaleType: 'point', tickLabelStyle: { fontSize: 9 } }]}
            series={card.series.map((s) => ({
              data: s.data,
              label: s.label,
              color: s.color,
              area: s.area,
              baseline: 'min' as const,
              showMark: false,
              curve: 'monotoneX' as const,
            }))}
            margin={{ left: 44, right: 8, top: 8, bottom: 32 }}
            sx={fullChartSx(chartSx)}
          />
        )}
      </Box>
    </Box>
  );
});

const SimulationChartCards: React.FC<SimulationChartCardsProps> = ({ startDay, range, vertical = false }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [historyYears, setHistoryYears] = useState<HistoryYears>(DEFAULT_HISTORY_YEARS);
  const colors = useColors();

  const { data: charts } = useChartsData(historyYears, startDay, GRANULARITY[range]);

  const n = POINTS[range];
  const xLabels = useMemo(() => (charts?.xLabels ?? []).slice(0, n), [charts?.xLabels, n]);
  const hours = useMemo(() => (charts?.hours ?? []).slice(0, n), [charts?.hours, n]);

  const prices  = useMemo(() => hours.map((h) => h.price), [hours]);
  const demands = useMemo(() => hours.map((h) => h.energyDemand / 1000), [hours]);
  const avgTemps = useMemo(() => hours.map((h) => h.weather.temp), [hours]);
  const minTemps = useMemo(() => hours.map((h) => h.weather.minTemp), [hours]);
  const maxTemps = useMemo(() => hours.map((h) => h.weather.maxTemp), [hours]);

  const cards = useMemo<CardConfig[]>(() => [
    {
      id: 'price',
      title: 'Electricity Price',
      mainValue: mean(prices),
      unit: '€/MWh',
      formatValue: (v) => v.toFixed(0),
      xLabels,
      series: [
        { data: prices, color: colors.cool, label: `Avg price (${historyYears}y)`, area: true },
      ],
    },
    {
      id: 'demand',
      title: 'Heat Demand',
      mainValue: mean(demands),
      unit: 'MW',
      formatValue: (v) => v.toFixed(1),
      xLabels,
      series: [
        { data: demands, color: colors.heat, label: `Avg demand (${historyYears}y)`, area: true },
      ],
    },
    {
      id: 'temp',
      title: 'Temperature',
      mainValue: mean(avgTemps),
      unit: '°C',
      formatValue: (v) => v.toFixed(1),
      xLabels,
      series: [
        { data: maxTemps, color: colors.heat,          label: 'Historical max', area: false },
        { data: avgTemps, color: colors.textSecondary,  label: `Historical avg (${historyYears}y)`, area: false },
        { data: minTemps, color: colors.cool,           label: 'Historical min', area: false },
      ],
    },
  ], [prices, demands, avgTemps, minTemps, maxTemps, xLabels, historyYears, colors]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1.5, gap: 1.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary }}>
          Historical period
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={historyYears}
          onChange={(_, v) => v && setHistoryYears(v as HistoryYears)}
        >
          {HISTORY_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt}
              value={opt}
              sx={{
                color: colors.textSecondary,
                borderColor: colors.border,
                fontSize: 12,
                px: 1.25,
                py: 0.5,
                minWidth: 36,
                '&.Mui-selected': {
                  color: colors.textPrimary,
                  bgcolor: colors.primarySoft,
                  borderColor: colors.primary,
                },
              }}
            >
              {opt}Y
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: 1.5, alignItems: 'stretch' }}>
        {cards.map((card) => (
          <ChartCard
            key={card.id}
            card={card}
            expanded={hoveredId === card.id}
            vertical={vertical}
            onToggle={setHoveredId}
          />
        ))}
      </Box>
    </Box>
  );
};

export default memo(SimulationChartCards);
