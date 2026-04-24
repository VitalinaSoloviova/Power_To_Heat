import { Box } from '@mui/material';
import MainContent from './MainContent.tsx';
import Sidebar from './Sidebar';
import { dummyWeatherDataApril } from '../../../DummyWeather';

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw'
    }}>
      <Sidebar />
      <MainContent weatherData={dummyWeatherDataApril} />
    </Box>
  );
}

export default App;