import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from './simulationTypes';
import type { Granularity } from '@calculations/DataResolver';
import { useChartsData } from '@features/charts/hooks/useChartsData';
import { HISTORY_OPTIONS, DEFAULT_HISTORY_YEARS, type HistoryYears } from '@services/UIService';
import ComparisonChart from '@features/charts/ComparisonChart';
import TemperatureChart from '@features/charts/TemperatureChart';

interface SimulationChartsSidebarProps {
  startDay: Date;
  range: SimulationRange;
}

const POINTS: Record<SimulationRange, number> = { day: 24, week: 168, month: 30 };
const GRANULARITY: Record<SimulationRange, Granularity> = {
  day: 'hourly',
  week: 'hourly',
  month: 'daily',
};

const COMPACT_W = 240;
const EXPANDED_W = 400;
const COMPACT_CHART_H = 120;
const EXPANDED_CHART_H = 180;

const SimulationChartsSidebar: React.FC<SimulationChartsSidebarProps> = ({ startDay, range }) => {
  const [hovered, setHovered] = useState(false);
  const [historyYears, setHistoryYears] = useState<HistoryYears>(DEFAULT_HISTORY_YEARS);
  const colors = useColors();

  const { data: charts } = useChartsData(historyYears, startDay, GRANULARITY[range]);

  const n = POINTS[range];
  const xLabels = (charts?.xLabels ?? []).slice(0, n);
  const historicalPrices = (charts?.hours ?? []).slice(0, n).map((h) => h.price);
  const historicalDemand = (charts?.hours ?? []).slice(0, n).map((h) => h.energyDemand);
  const weatherHistory = (charts?.hours ?? []).slice(0, n).map((h) => ({
    month: h.datetime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    minTemp: h.weather.minTemp,
    maxTemp: h.weather.maxTemp,
    avgTemp: h.weather.temp,
  }));

  const firstYear = charts?.dataYears.weatherFirstDate?.slice(0, 4)
    ?? String(new Date().getFullYear() - historyYears);
  const chartH = hovered ? EXPANDED_CHART_H : COMPACT_CHART_H;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        flexShrink: 0,
        width: hovered ? EXPANDED_W : COMPACT_W,
        transition: 'width 0.32s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
        overflow: 'hidden',
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.bgCardSolid,
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.28)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: colors.textSecondary,
            letterSpacing: 1.2,
            mb: 1,
          }}
        >
          COMPARISON CHARTS
        </Typography>

        {/* History years selector */}
        <Box>
          <Typography sx={{ fontSize: 10, color: colors.textSecondary, mb: 0.5 }}>
            Historical period
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={historyYears}
            onChange={(_, v) => v && setHistoryYears(v as HistoryYears)}
            sx={{ flexWrap: 'wrap', gap: 0.25 }}
          >
            {HISTORY_OPTIONS.map((opt) => (
              <ToggleButton
                key={opt}
                value={opt}
                sx={{
                  color: colors.textSecondary,
                  borderColor: colors.border,
                  fontSize: 10,
                  px: 0.75,
                  py: 0.25,
                  minWidth: 28,
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
      </Box>

      {/* Charts */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: colors.border, borderRadius: 2 },
        }}
      >
        <ComparisonChart
          title="Electricity price (€/MWh)"
          lastUsedDate=""
          xLabels={xLabels}
          historical={historicalPrices}
          forecast={[]}
          historicalLabel={`Avg price (${historyYears}y)`}
          historyColor={colors.cool}
          forecastColor={colors.heat}
          chartHeight={chartH}
        />
        <ComparisonChart
          title="Heat demand"
          lastUsedDate=""
          xLabels={xLabels}
          historical={historicalDemand}
          forecast={[]}
          historicalLabel={`Avg demand (${historyYears}y)`}
          historyColor={colors.cool}
          forecastColor={colors.energy}
          chartHeight={chartH}
        />
        <TemperatureChart
          xLabels={xLabels}
          weatherHistory={weatherHistory}
          actualYears={historyYears}
          firstYear={firstYear}
          lastUsedDate=""
          chartHeight={chartH + 20}
        />
      </Box>
    </Box>
  );
};

export default SimulationChartsSidebar;
