import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '../theme/ThemeContext';
import { getChartSx } from '../theme/colors';
import type { UiDayData } from '../../../../calculations/uiDataProfile';

interface ForecastChartProps {
  /** Days to plot. Order matters — used as the X axis. */
  data: UiDayData[];
}

const ForecastChart = ({ data }: ForecastChartProps) => {
  const colors = useColors();

  const xLabels = data.map((d) =>
    d.day.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  );
  const minTemp = data.map((d) => d.weather.minTemp);
  const maxTemp = data.map((d) => d.weather.maxTemp);
  const energyDemand = data.map((d) => d.energyDemand);

  return (
    <Box
      sx={{
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2.5,
        flex: 1.4,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', mb: 1.5, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, flex: 1 }}>
          Temperature & Energy Demand
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {[
            { c: colors.cool, l: 'Min Temp (°C)', dashed: false },
            { c: colors.heat, l: 'Max Temp (°C)', dashed: false },
            { c: colors.energy, l: 'Energy Demand (kW)', dashed: true },
          ].map((x) => (
            <Box key={x.l} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 14,
                  height: 0,
                  borderTop: `2px ${x.dashed ? 'dashed' : 'solid'} ${x.c}`,
                }}
              />
              <Typography sx={{ fontSize: 10.5, color: colors.textSecondary }}>{x.l}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 260, width: '100%' }}>
        <LineChart
          margin={{ top: 8, right: 56, bottom: 28, left: 44 }}
          xAxis={[
            {
              data: xLabels,
              scaleType: 'point',
            },
          ]}
          yAxis={[
            { id: 'temp', label: '°C', position: 'left' },
            { id: 'demand', label: 'kW', position: 'right' },
          ]}
          series={[
            {
              data: minTemp,
              label: 'Min Temp (°C)',
              color: colors.cool,
              showMark: false,
              curve: 'monotoneX',
              yAxisId: 'temp',
            },
            {
              data: maxTemp,
              label: 'Max Temp (°C)',
              color: colors.heat,
              showMark: false,
              curve: 'monotoneX',
              yAxisId: 'temp',
            },
            {
              data: energyDemand,
              id: 'energyDemand',
              label: 'Energy Demand (kW)',
              color: colors.energy,
              showMark: false,
              curve: 'monotoneX',
              yAxisId: 'demand',
            },
          ]}
          hideLegend
          sx={getChartSx(colors)}
        />
      </Box>
    </Box>
  );
};

export default ForecastChart;
