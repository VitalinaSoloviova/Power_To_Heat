import { Box } from '@mui/material';
import ToolbarComponent from './ToolbarComponent';
import SimulationComponent from './SimulationComponent';
import ChartsComponent from './ChartsComponent';

const MainContent = () => {
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
     <ChartsComponent /> 
    </Box>
  );
};

export default MainContent;