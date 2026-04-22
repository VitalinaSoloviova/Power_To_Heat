import { Paper, Typography } from '@mui/material';

const ChartsComponent = () => {
  return (
    <Paper
      sx={{ p: 2, height: "30%", display: "flex", flexDirection: "column", borderRadius: 2, mb: 2 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        Charts Bereich
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Charts werden hier angezeigt...
      </Typography>
    </Paper>
  );
};

export default ChartsComponent;
