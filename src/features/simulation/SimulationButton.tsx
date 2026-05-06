import { Box, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useColors } from '@theme/useTheme';

interface SimulationButtonProps {
  loading: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  hasData: boolean;
  speedMultiplier: number;
  onSpeedMultiplierChange: (multiplier: number) => void;
}

const SimulationButton: React.FC<SimulationButtonProps> = ({ 
  loading, 
  isPlaying, 
  onTogglePlay, 
  hasData,
  speedMultiplier,
  onSpeedMultiplierChange,
}) => {
  const colors = useColors();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> 
      <Button
        onClick={onTogglePlay}
        disabled={loading || !hasData}
        variant="outlined"
        sx={{
          color: isPlaying ? colors.danger : colors.primary,
          borderColor: isPlaying ? colors.danger : colors.primary,
          borderRadius: 2,
          px: 2,
          py: 0.5,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            borderColor: isPlaying ? colors.danger : colors.primary,
            backgroundColor: isPlaying ? `${colors.danger}15` : `${colors.primary}15`,
          },
          '&:disabled': {
             borderColor: colors.border,
             color: colors.textMuted
          }
        }}
      >
        {isPlaying ? '⏸ Stop' : '▶ Simulate'}
      </Button>

      <ToggleButtonGroup
        size="small"
        value={speedMultiplier}
        exclusive
        onChange={(_, v) => v !== null && onSpeedMultiplierChange(v)}
        sx={{
          height: 32,
          '& .MuiToggleButton-root': {
            px: 1,
            py: 0,
            fontSize: 10,
            fontWeight: 700,
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            '&.Mui-selected': {
              background: colors.primary,
              color: '#fff',
              '&:hover': { background: colors.primary },
            }
          }
        }}
      >
        <ToggleButton value={1}>1x</ToggleButton>
        <ToggleButton value={1.5}>1.5x</ToggleButton>
        <ToggleButton value={2}>2x</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SimulationButton;
