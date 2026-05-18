import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import { tx, fw } from '@theme/tokens';

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
        pt: 1,
      }}
    >
      <Typography
        sx={{
          color: colors.textPrimary,
          fontSize: 17,
          fontWeight: fw.bold,
          letterSpacing: 1.2,
          py: 1,
          textTransform: 'uppercase',
        }}
      >
        Energy Flow Simulation
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {loading && (
          <Typography sx={{ color: colors.textMuted, fontSize: tx.sm }}>
            Loading data…
          </Typography>
        )}
        
      </Box>
    </Box>
  );
};

export default memo(SimulationHeader);
