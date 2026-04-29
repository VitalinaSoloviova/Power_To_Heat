import { Paper, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import type { UiDayData } from '../../../calculations/uiDataProfile';

interface ChartsComponentProps {
  weatherData: UiDayData[];
}

const ChartsComponent = ({ weatherData }: ChartsComponentProps) => {
  const chartData = weatherData.map(data => ({
    day: data.day.getDate(), 
    date: data.day.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }), 
    minTemp: data.weather.minTemp,
    maxTemp: data.weather.maxTemp,
    avgTemp: data.weather.avgTemp
  }));

  const xAxisData = chartData.map(d => d.date);
  const minTempData = chartData.map(d => d.minTemp);
  const maxTempData = chartData.map(d => d.maxTemp);
  const maxMaxTemp = Math.max(...maxTempData);

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
      
      <Box 
        sx={{ 
          width: '70%', 
          height: '200px', 
          mt: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ flex: 1 }}>
          <LineChart
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
              label: 'Date'
            }]}
            yAxis={[
              {
                max: maxMaxTemp,
                label: 'Temperature (°C)'
              }
            ]}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ChartsComponent;
