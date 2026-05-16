import React from 'react';
import { Box, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import DateSelector from './dateSelector/DateSelector';
import { useDateState } from './dateSelector/useDateState';
import { useColors } from '@theme/useTheme';

import { formatTimestamp } from './simulationUtils';
import SimulationButton from './SimulationButton';
import type { PlaybackControl, SimulationRange, TimelineControl } from '@services/types';
import SimulationTimestamp from './SimulationTimestamp';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const daysInMonth = (month: number) => new Date(2024, month + 1, 0).getDate();

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
  onStartDayChange,
}) => {
  const colors = useColors();
  const { range, onRangeChange, index, onIndexChange, series } = timeline;
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
      }}
    >
      {/* Date picker chip + popover als eigene Komponente */}
      <DateSelector
        startDay={startDay}
        onStartDayChange={onStartDayChange}
        colors={colors}
        MONTHS={MONTHS}
        daysInMonth={daysInMonth}
      />

      {/* Range buttons */}
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
       {/**<ToggleButton value="month" disabled>Month</ToggleButton> */} 
      </ToggleButtonGroup>

      <SimulationButton
        playback={playback}
        loading={loading}
        hasData={series.length > 0}
      />

      {/* Slider + current timestamp */}
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
