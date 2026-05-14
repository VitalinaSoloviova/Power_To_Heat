import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';

interface SimulationHeaderProps {
  loading: boolean;
}

const SimulationHeader: React.FC<SimulationHeaderProps> = ({ 
  loading
}) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        pt: 2,
      }}
    >
      <Typography
        sx={{
          color: colors.textPrimary,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 1.2,
          py: 2,
          textTransform: 'uppercase',
        }}
      >
        Energy Flow Simulation
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {loading && (
          <Typography sx={{ color: colors.textMuted, fontSize: 11 }}>
            Loading data…
          </Typography>
        )}
        
      </Box>
    </Box>
  );
};

export default memo(SimulationHeader);
