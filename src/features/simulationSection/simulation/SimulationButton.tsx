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
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': {
            borderColor: isPlaying ? colors.danger : colors.primary,
            backgroundColor: isPlaying ? `${colors.danger}15` : `${colors.primary}15`,
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
              minWidth  : 36,
              height: 36,
              borderRadius: 1,
              px: 0,
              py: 0,
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textSecondary,
              borderColor: colors.border,
              borderWidth: 1,
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
