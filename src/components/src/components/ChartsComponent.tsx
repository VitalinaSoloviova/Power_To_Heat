import { Paper, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import type { UiDayData } from '../../../calculations/uiDataProfile';

interface ChartsComponentProps {
  weatherData: UiDayData[];
}

const ChartsComponent = ({ weatherData }: ChartsComponentProps) => {
  // Prepare chart data from weather data
  const chartData = weatherData.map(data => ({
    day: data.day,
    minTemp: data.weather.minTemp,
    maxTemp: data.weather.maxTemp,
    avgTemp: data.weather.avgTemp
  }));

  const xAxisData = chartData.map(d => d.day);
  const minTempData = chartData.map(d => d.minTemp);
  const maxTempData = chartData.map(d => d.maxTemp);

  return (
    <Paper
      sx={{ p: 2, height: "auto", display: "flex", flexDirection: "column", borderRadius: 2, mb: 2 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        Temperature Overview
      </Typography>
      
      <Box sx={{ width: '100%' }}>
        <LineChart
          height={350}
          sx={{ width: '100%' }}
          series={[
            {
              data: minTempData,
              label: 'Min Temperature (°C)',
              color: '#2196f3'
            },
            {
              data: maxTempData,
              label: 'Max Temperature (°C)',
              color: '#ff6b6b'
            },
          ]}
          xAxis={[{
            scaleType: 'point',
            data: xAxisData,
            label: 'Day of Month'
          }]}
        />
      
      </Box>
    </Paper>
  );
};

export default ChartsComponent;
