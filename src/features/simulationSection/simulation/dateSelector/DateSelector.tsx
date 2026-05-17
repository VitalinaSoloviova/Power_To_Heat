import React from 'react';
import { Box, Typography } from '@mui/material';
import DateChip from './DateChip';
import MonthDayPopover from './MonthDayPopover';
import { useDateState } from './useDateState';

interface DateSelectorProps {
  startDay: Date;
  onStartDayChange: (d: Date) => void;
  colors: any;
  MONTHS: string[];
  daysInMonth: (month: number) => number;
}

const DateSelector: React.FC<DateSelectorProps> = ({ startDay, onStartDayChange, colors, MONTHS, daysInMonth }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = anchorEl !== null;
  const dateState = useDateState(startDay);
  React.useEffect(() => { dateState.sync(startDay); }, [startDay]);

  const applyDate = (month: number, day: number) => {
    const maxDay = daysInMonth(month);
    const clampedDay = Math.min(day, maxDay);
    const d = new Date(Date.UTC(new Date().getFullYear(), month, clampedDay));
    onStartDayChange(d);
    setAnchorEl(null);
  };

  const labelMonthDay = new Date(Date.UTC(new Date().getFullYear(), dateState.selectedMonth, dateState.selectedDay)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',}}>
      <Typography variant="caption" sx={{ fontSize: 12, color: colors.textSecondary || colors.textPrimary }}>
        Simulation period
      </Typography>
      <DateChip label={labelMonthDay} onClick={e => setAnchorEl(e.currentTarget)} open={open} colors={colors} />
      <MonthDayPopover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        selectedMonth={dateState.selectedMonth}
        selectedDay={dateState.selectedDay}
        applyDate={(m, d) => {
          dateState.setMonth(m);
          dateState.setDay(d);
          applyDate(m, d);
        }}
        colors={colors}
        MONTHS={MONTHS}
        daysInMonth={daysInMonth}
      />
    </Box>
  );
};

export default DateSelector;
