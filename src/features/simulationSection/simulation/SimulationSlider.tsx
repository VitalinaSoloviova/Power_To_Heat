import React from 'react';
import { Box, Slider} from '@mui/material';
import { useDateState } from './dateSelector/useDateState';
import { useColors } from '@theme/useTheme';

import { formatTimestamp } from './simulationUtils';
import type { PlaybackControl, TimelineControl } from '@services/types';
import SimulationTimestamp from './SimulationTimestamp';
import SimulationButton from './SimulationButton';

interface SimulationSliderProps {
  /** Range / index / series state. */
  timeline: TimelineControl;
  /** Play / pause + speed selection. */
  playback: PlaybackControl;
  /** Disabled while data is still loading. */
  loading: boolean;
  startDay: Date;
  onStartDayChange: (d: Date) => void;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({
  timeline,
  playback,
  loading,
  startDay,
}) => {
  const colors = useColors();
  const { range, index, onIndexChange, series } = timeline;
  const point = series[index];
  const max = Math.max(0, series.length - 1);

  // Date state hook
  const dateState = useDateState(startDay);
  React.useEffect(() => { dateState.sync(startDay); }, [startDay]);

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
        height: 90,
      }}
    >
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
        <SimulationTimestamp timestamp={point?.timestamp} range={range} formatTimestamp={formatTimestamp} />
      </Box>
    </Box>
  );
};

export default SimulationSlider;
