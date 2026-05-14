import { useState } from 'react';
import { Box } from '@mui/material';
import MainContent from './MainContent.tsx';
import Sidebar from './Sidebar.tsx';
import { ThemeProvider } from '@theme/ThemeContext';
import { useColors } from '@theme/useTheme';

const AppShell = () => {
  const colors = useColors();
  const [page, setPage] = useState('overview');
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        bgcolor: colors.bgBase,
      }}
    >
      <Sidebar activePage={page} onPageChange={setPage} />
      <MainContent activePage={page} onPageChange={setPage} />
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