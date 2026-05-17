import { Box, Button, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import type { PlaybackControl } from '@services/types';
import { useColors } from '@theme/useTheme';

interface SimulationButtonProps {
  /** Play / pause + speed selection. */
  playback: PlaybackControl;
  /** Disabled while the underlying data is still loading. */
  loading: boolean;
  /** Disabled when there are no frames to play. */
  hasData: boolean;
}

const SimulationButton: React.FC<SimulationButtonProps> = ({
  playback,
  loading,
  hasData,
}) => {
  const colors = useColors();
  const { isPlaying, onTogglePlay, speedMultiplier, onSpeedMultiplierChange, onCancel, hasStarted } = playback;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
      <Button
        onClick={onTogglePlay}
        disabled={loading || !hasData}
        variant="outlined"
        sx={{
          color: isPlaying ? colors.textPrimary : colors.primary,
          borderColor: isPlaying ? colors.border : colors.primary,
          borderRadius: 2,
          px: 2.5,
          fontSize: 15,
          fontWeight: 800,
          textTransform: 'none',
          height: { xs: 32, sm: 40 },
          minWidth: 90,
          '&:hover': {
            borderColor: isPlaying ? colors.textPrimary : colors.primary,
            backgroundColor: isPlaying ? `${colors.textPrimary}12` : `${colors.primary}15`,
          },
          '&:disabled': {
            borderColor: colors.border,
            color: colors.textMuted,
          },
        }}
      >
        {isPlaying ? '⏸ Pause' : '▶ Simulate'}
      </Button>

      <Tooltip title="Cancel simulation">
          <Button
            onClick={() => onCancel?.()}
            disabled={loading || !hasStarted}
            variant="outlined"
            sx={{
              minWidth: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              borderRadius: 1,
              px: 0,
              py: 0,
              alignItems: 'center',
              justifyContent: 'center',
              color: isPlaying ? colors.danger : colors.textSecondary,
              borderColor: isPlaying ? colors.danger : colors.border,
              borderWidth: 1,
              fontSize: 20,
              '&:hover': {
                borderColor: isPlaying ? colors.danger : colors.primary,
                backgroundColor: isPlaying ? `${colors.danger}15` : `${colors.textPrimary}08`,
              },
              '&:disabled': {
                borderColor: colors.border,
                color: colors.textMuted,
              },
            }}
          >
            ⏹
          </Button>
      </Tooltip>

      <ToggleButtonGroup
        size="small"
        value={speedMultiplier}
        exclusive
        onChange={(_, v) => v !== null && onSpeedMultiplierChange(v)}
        sx={{
          minHeight: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          '& .MuiToggleButton-root': {
            px: 1.4,
            py: 1.3,
            fontSize: 10,
            fontWeight: 800,
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            height: { xs: 32, sm: 40 },
            '&.Mui-selected': {
              px: 1.4,
              py: 1.3,
              background: colors.primary,
              color: '#fff',
              '&:hover': { background: colors.primary },
            },
          },
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
