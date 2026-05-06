import { Box, Typography, IconButton } from '@mui/material';
import { useColors } from '@theme/useTheme';

interface SimulationHeaderProps {
  loading: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  hasData: boolean;
}

const SimulationHeader: React.FC<SimulationHeaderProps> = ({ 
  loading, 
  isPlaying, 
  onTogglePlay, 
  hasData 
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
        <IconButton
          onClick={onTogglePlay}
          disabled={loading || !hasData}
          sx={{
            color: isPlaying ? colors.danger : colors.primary,
            border: `1px solid ${isPlaying ? colors.danger : colors.primary}`,
            borderRadius: 2,
            px: 2,
            py: 0.5,
            fontSize: 12,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: isPlaying ? `${colors.danger}15` : `${colors.primary}15`,
            },
          }}
        >
          {isPlaying ? '⏸️ Stop' : '▶️ Auto'}
        </IconButton>
      </Box>
    </Box>
  );
};

export default SimulationHeader;
