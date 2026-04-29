import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '../../../theme/useTheme';
import { getChartSx } from '../../../theme/colors';
import type { WeatherRangeForMonth } from '../../storageForecastUtils';

interface TemperatureChartProps {
  xLabels: string[];
  weatherHistory: WeatherRangeForMonth[];
  forecastTemperature: number[];
  historyYears: number;
}

const TemperatureChart = ({
  xLabels,
  weatherHistory,
  forecastTemperature,
  historyYears,
}: TemperatureChartProps) => {
  const colors = useColors();
  const chartSx = getChartSx(colors);

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
      <Box sx={{ height: 220 }}>
        <LineChart
          xAxis={[{ data: xLabels, scaleType: 'point' }]}
          series={[
            {
              data: maxSeries,
              label: `Historical max (${historyYears}y)`,
              color: colors.heat,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: minSeries,
              label: `Historical min (${historyYears}y)`,
              color: colors.cool,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: avgSeries,
              label: `Historical avg (${historyYears}y)`,
              color: colors.textSecondary,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: forecastTemperature,
              label: 'Forecast',
              color: colors.energy,
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
