
import type { Granularity } from '@calculations/DataResolver';
import { useChartsData } from '@features/charts/hooks/useChartsData';
import { Box } from '@mui/material';
import { type HistoryYears, DEFAULT_HISTORY_YEARS } from '@services/ui/ChartUIService';
import { useColors } from '@theme/useTheme';
import { useMemo, useState } from 'react';
import { ChartCard, type CardConfig } from './ChartCard';
import type { SimulationRange } from '@services/types';

interface SimulationChartCardsProps {
  startDay: Date;
  range: SimulationRange;
  vertical?: boolean;
  historyYears?: HistoryYears;
  onHistoryYearsChange?: (v: HistoryYears) => void;
}

const GRANULARITY: Record<SimulationRange, Granularity> = {
  day: 'hourly',
  week: 'hourly',
  month: 'daily',
};
const POINTS: Record<SimulationRange, number> = { day: 24, week: 168, month: 30 };

const mean = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;


const SimulationChartCards: React.FC<SimulationChartCardsProps> = ({
  startDay, range, vertical = false,
  historyYears: historyYearsProp,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const historyYears = historyYearsProp ?? DEFAULT_HISTORY_YEARS;
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: 2, alignItems: 'stretch' }}>
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

export default SimulationChartCards;
