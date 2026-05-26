import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import DateChip from './DateChip';
import MonthDayPopover from './MonthDayPopover';
import { useDateState } from './useDateState';
import { InfoOutlineRounded } from '@mui/icons-material';
import { tx } from '@theme/tokens';

interface DateSelectorProps {
  startDay: Date;
  onStartDayChange: (d: Date) => void;
  colors: any;
  MONTHS: string[];
  daysInMonth: (month: number) => number;
  simulationRange: 'day' | 'week' | 'month';
}

const DateSelector: React.FC<DateSelectorProps> = ({ startDay, onStartDayChange, colors, MONTHS, daysInMonth, simulationRange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = anchorEl !== null;
  const dateState = useDateState(startDay);
  React.useEffect(() => { dateState.sync(startDay); }, [startDay]);

  // For 'month' mode, always use day 1 as start
  const applyDate = (month: number, day: number) => {
    let d;
    if (simulationRange === 'month') {
      d = new Date(Date.UTC(new Date().getFullYear(), month, 1));
    } else {
      const maxDay = daysInMonth(month);
      const clampedDay = Math.min(day, maxDay);
      d = new Date(Date.UTC(new Date().getFullYear(), month, clampedDay));
    }
    onStartDayChange(d);
    setAnchorEl(null);
  };

  const year = new Date().getUTCFullYear();
  const startDate = new Date(Date.UTC(year, dateState.selectedMonth, dateState.selectedDay));
  let labelMonthDay = '';
  if (simulationRange === 'day') {
    labelMonthDay = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  } else if (simulationRange === 'week') {
    const endDate = new Date(Date.UTC(year, dateState.selectedMonth, dateState.selectedDay + 6));
    const formatOptions = { day: '2-digit', month: 'short' } as const;
    const startLabel = startDate.toLocaleDateString('en-GB', formatOptions);
    const endLabel = endDate.toLocaleDateString('en-GB', formatOptions);
    labelMonthDay = `${startLabel} - ${endLabel}`;
  } else if (simulationRange === 'month') {
    labelMonthDay = startDate.toLocaleDateString('en-US', { month: 'long' });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 53, minWidth: 0}}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 20px' }}>
        <Typography variant="caption" sx={{ fontSize: 13, color: colors.textSecondary, marginBottom: 1}}>
        Starting Date
      </Typography>
        <Tooltip
          arrow
          placement="top"
          title="Simulation starting dates."
        >
          <IconButton
            size="small"
            aria-label="Starting Date Information"
            sx={{ color: colors.textMuted, p: 0 }}
          >
            <InfoOutlineRounded sx={{ fontSize: tx.lg }} />
          </IconButton>
        </Tooltip>
      </Box>
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
        simulationRange={simulationRange}
      />
    </Box>
  );
};

export default DateSelector;
