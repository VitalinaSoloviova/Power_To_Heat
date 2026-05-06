import { Box, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type {
  PlaybackControl,
  SimulationRange,
  TimelineControl,
} from './simulationTypes';
import { formatTimestamp } from './simulationUtils';
import SimulationButton from './SimulationButton';

interface SimulationSliderProps {
  /** Range / index / series state. */
  timeline: TimelineControl;
  /** Play / pause + speed selection. */
  playback: PlaybackControl;
  /** Disabled while data is still loading. */
  loading: boolean;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({
  timeline,
  playback,
  loading,
}) => {
  const colors = useColors();
  const { range, onRangeChange, index, onIndexChange, series } = timeline;
  const point = series[index];
  const max = Math.max(0, series.length - 1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        px: 3,
        py: 1.5,
        borderTop: `1px solid ${colors.border}`,
        bgcolor: colors.bgCard,
      }}
    >
      <ToggleButtonGroup
        size="small"
        exclusive
        value={range}
        onChange={(_, v) => v && onRangeChange(v as SimulationRange)}
        sx={{
          '& .MuiToggleButton-root': {
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            textTransform: 'none',
            px: 1.5,
            py: 0.25,
            fontSize: 12,
            '&.Mui-selected': {
              color: '#fff',
              background: colors.primary,
              borderColor: colors.primary,
              '&:hover': { background: colors.primary },
            },
          },
        }}
      >
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month" disabled>Month</ToggleButton>
      </ToggleButtonGroup>

      <SimulationButton
        playback={playback}
        loading={loading}
        hasData={series.length > 0}
      />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={index}
          min={0}
          max={max}
          step={1}
          onChange={(_, v) => onIndexChange(Array.isArray(v) ? v[0] : v)}
          sx={{
            color: colors.primary,
            '& .MuiSlider-rail': { opacity: 0.3 },
          }}
        />
        <Typography
          sx={{
            fontVariantNumeric: 'tabular-nums',
            color: colors.textPrimary,
            fontSize: 12,
            minWidth: 100,
            textAlign: 'right',
          }}
        >
          {point ? formatTimestamp(point.timestamp, range) : '—'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SimulationSlider;
