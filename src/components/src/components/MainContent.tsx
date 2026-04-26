import { Box } from '@mui/material';
import ToolbarComponent from './ToolbarComponent';
import SimulationComponent from './SimulationComponent';
import StatsRow from './StatsRow';
import FlowWidget from './widgets/FlowWidget';
import { useColors } from './theme/useTheme';
import { dummyWeatherDataApril } from '../../../DummyWeather';
import ForecastChart from './widgets/ForecastChart';

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
      <StatsRow />
      <SimulationComponent />

      {/* Bottom widgets row */}
      <Box sx={{ display: 'flex', gap: 2, px: 3, mb: 2 }}>
        <FlowWidget />
        <ForecastChart data={dummyWeatherDataApril} />
      </Box>
    </Box>
  );
};

export default MainContent;