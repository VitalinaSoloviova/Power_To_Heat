import { Box } from '@mui/material';
import ToolbarComponent from './ToolbarComponent';
import SimulationComponent from '@features/simulation/SimulationComponent';
import TopWidgetsRow from '@features/widgets/topRow/TopWidgetsRow';
import FlowWidget from '@features/widgets/FlowWidget';
import { useColors } from '@theme/useTheme';
import StorageForecast from '@features/forecast';

const MainContent = () => {
  const colors = useColors();
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.bgBase,
        overflow: 'auto',
        color: colors.textPrimary,
      }}
    >
      <ToolbarComponent />
      <TopWidgetsRow />
      <SimulationComponent />
      <StorageForecast />

      {/* Bottom widgets row */}
      <Box sx={{ display: 'flex', gap: 2, px: 3, mb: 2 }}>
        <FlowWidget />
        {/* <ForecastChart data={dummyWeatherDataApril} /> */}
      </Box>
    </Box>
  );
};

export default MainContent;