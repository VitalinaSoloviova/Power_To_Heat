import { Box } from '@mui/material';
import MainContent from './MainContent.tsx';
import Sidebar from './Sidebar';
import { ThemeProvider } from './theme/ThemeContext';
import { useColors } from './theme/useTheme';

const AppShell = () => {
  const colors = useColors();
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
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppShell />
    </ThemeProvider>
  );
}

export default App;