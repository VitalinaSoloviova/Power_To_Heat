import { Box } from '@mui/material';
import ToolbarComponent from './ToolbarComponent';
import SimulationComponent from '@features/simulation/SimulationComponent';
import TopWidgetsRow from '@features/widgets/topRow/TopWidgetsRow';
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
    </Box>
  );
};

export default MainContent;