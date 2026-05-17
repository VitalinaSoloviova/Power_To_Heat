import React from 'react';
import { Box } from '@mui/material';
import DateSelector from './dateSelector/DateSelector';
import { useColors } from '@theme/useTheme';
import type { PlaybackControl, TimelineControl } from '@services/types';

import SimulationRangeToggleGroup from './SimulationRangeToggleGroup';
import HistoryPeriodSelector from '../charts/HistoryPeriodSelector';
import type { HistoryYears } from '@services/ui/ChartUIService';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const daysInMonth = (month: number) => new Date(2024, month + 1, 0).getDate();

interface SimulationSliderProps {
  timeline: TimelineControl;
  playback: PlaybackControl;
  startDay: Date;
  onStartDayChange: (d: Date) => void;
  historyYears: HistoryYears;
  setHistoryYears: (v: HistoryYears) => void;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({
  timeline,
  startDay,
  onStartDayChange,
  historyYears,
  setHistoryYears,
}) => {
  const colors = useColors();
  const { range, onRangeChange } = timeline;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 2,
        px: 3,
        py: 1.5,
        borderTop: `1px solid ${colors.border}`,
        bgcolor: colors.bgCard,
        '& > *': {
          width: '100%',
        },
      }}
    >
      <HistoryPeriodSelector historyYears={historyYears} setHistoryYears={setHistoryYears} />

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
