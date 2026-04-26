import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '../../../theme/useTheme';
import { getChartSx } from '../../../theme/colors';

interface ComparisonChartProps {
  title: string;
  xLabels: string[];
  historical: number[];
  forecast: number[];
  historicalLabel: string;
  historyColor: string;
  forecastColor: string;
}

const ComparisonChart = ({
  title,
  xLabels,
  historical,
  forecast,
  historicalLabel,
  historyColor,
  forecastColor,
}: ComparisonChartProps) => {
  const colors = useColors();
  const chartSx = getChartSx(colors);

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
        {title}
      </Typography>
      <Box sx={{ height: 200 }}>
        <LineChart
          xAxis={[{ data: xLabels, scaleType: 'point' }]}
          series={[
            {
              data: historical,
              label: historicalLabel,
              color: historyColor,
              showMark: false,
              curve: 'monotoneX' as const,
            },
            {
              data: forecast,
              label: 'Forecast',
              color: forecastColor,
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

export default ComparisonChart;
