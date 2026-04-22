import { 
  Paper, 
  Typography
} from '@mui/material';


const SimulationComponent = () => {
  return (
    <Paper sx={{ p: 2, height: '60%', display: 'flex', flexDirection: 'column', borderRadius: 2, mb: 2 }}>
      <Typography  gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        color: 'primary.main'
      }}>
        Simulation Bereich
      </Typography>
      
      <Typography variant="body2" sx={{ mt: 2 }}>
        Simulation controls werden hier angezeigt...
      </Typography>
    </Paper>
  );
};

export default SimulationComponent;

