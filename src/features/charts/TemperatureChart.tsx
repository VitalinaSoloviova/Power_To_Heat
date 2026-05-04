import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '@theme/useTheme';
import { getChartSx } from '@theme/colors';
import type { WeatherRangeForMonth } from '@features/forecast/storageForecastUtils';

interface TemperatureChartProps {
  xLabels: string[];
  weatherHistory: WeatherRangeForMonth[];
  actualYears: number;
  firstYear: string;
  lastUsedDate: string;
}

const TemperatureChart = ({
  xLabels,
  weatherHistory,
  actualYears,
  firstYear,
  lastUsedDate,
}: TemperatureChartProps) => {
  const colors = useColors();
  const chartSx = getChartSx(colors);

  const label = firstYear === 'unknown'
    ? `${actualYears}y`
    : `since ${firstYear} (${actualYears}y)`;

  const minSeries = weatherHistory.map((p) => p.minTemp);
  const avgSeries = weatherHistory.map((p) => p.avgTemp);
  const maxSeries = weatherHistory.map((p) => p.maxTemp);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.bgBase,
      }}
    >
      <Typography sx={{ fontSize: 13, color: colors.textPrimary, fontWeight: 600, mb: 1 }}>
        Temperature (°C)
      </Typography>
      <Typography sx={{ fontSize: 11, color: colors.textSecondary, mb: 1 }}>
        Data used until: {lastUsedDate}
      </Typography>
      <Box sx={{ height: 220 }}>
        <LineChart
          xAxis={[{ data: xLabels, scaleType: 'point' }]}
          series={[
            {
              data: maxSeries,
              label: `Historical max`,
              color: colors.heat,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: minSeries,
              label: `Historical min`,
              color: colors.cool,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: avgSeries,
              label: `Historical avg (${label})`,
              color: colors.textSecondary,
              showMark: false,
              curve: 'monotoneX' as const,
            },
          ]}
          margin={{ left: 50, right: 20, top: 10, bottom: 30 }}
          sx={chartSx}
        />
      </Box>
    </Box>
  );
};

export default TemperatureChart;
