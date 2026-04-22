import { 
  AppBar, 
  Toolbar as MUIToolbar, 
  Typography, 
} from '@mui/material';


const ToolbarComponent = () => {
  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{ bgcolor: 'white', borderRadius: 2, mb: 2 }}
    >
      <MUIToolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main' }}>
          Power-to-Heat Control
        </Typography>

      </MUIToolbar>
    </AppBar>
  );
};

export default ToolbarComponent;