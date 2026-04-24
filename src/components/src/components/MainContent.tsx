import { Box } from '@mui/material';
import type { UiDayData } from '../../../calculations/uiDataProfile';
import ToolbarComponent from './ToolbarComponent';
import SimulationComponent from './SimulationComponent';
import ChartsComponent from './ChartsComponent';

interface MainContentProps {
  weatherData: UiDayData[];
}

const MainContent = ({ weatherData }: MainContentProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        bgcolor: 'grey.50',
        overflow: 'auto',
      }}
    >
      {/* Toolbar Component*/}
      <ToolbarComponent /> 
      
      {/* Simulation Bereich Component*/}
      <SimulationComponent /> 
      
      {/* Charts Component */}
     <ChartsComponent weatherData={weatherData} /> 
    </Box>
  );
};

export default MainContent;