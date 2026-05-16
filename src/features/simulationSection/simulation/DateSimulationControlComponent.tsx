import React from 'react';
import { Box } from '@mui/material';
import DateSelector from './dateSelector/DateSelector';
import { useDateState } from './dateSelector/useDateState';
import { useColors } from '@theme/useTheme';
import type { PlaybackControl, TimelineControl } from '@services/types';

import SimulationRangeToggleGroup from './SimulationRangeToggleGroup';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const daysInMonth = (month: number) => new Date(2024, month + 1, 0).getDate();

interface SimulationSliderProps {
  timeline: TimelineControl;
  playback: PlaybackControl;
  startDay: Date;
  onStartDayChange: (d: Date) => void;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({
  timeline,
  startDay,
  onStartDayChange,
}) => {
  const colors = useColors();
  const { range, onRangeChange } = timeline;
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
      <DateSelector
        startDay={startDay}
        onStartDayChange={onStartDayChange}
        colors={colors}
        MONTHS={MONTHS}
        daysInMonth={daysInMonth}
      />
     <SimulationRangeToggleGroup range={range} onRangeChange={onRangeChange} />
    </Box>
  );
};

export default SimulationSlider;
