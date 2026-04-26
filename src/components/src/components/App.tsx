import { Box } from '@mui/material';
import MainContent from './MainContent.tsx';
import Sidebar from './Sidebar';
import { colors } from './theme/colors';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        bgcolor: colors.bgBase,
      }}
    >
      <Sidebar />
      <MainContent />
    </Box>
  );
}

export default App;