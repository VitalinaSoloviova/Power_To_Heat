import { Popover, Typography, Box, IconButton } from '@mui/material';
import React from 'react';

interface MonthDayPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedMonth: number;
  selectedDay: number;
  applyDate: (month: number, day: number) => void;
  colors: any;
  MONTHS: string[];
  daysInMonth: (month: number) => number;
}

const MonthDayPopover: React.FC<MonthDayPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  selectedMonth,
  selectedDay,
  applyDate,
  colors,
  MONTHS,
  daysInMonth,
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    slotProps={{
      paper: {
        sx: {
          bgcolor: colors.bgCardSolid,
          border: `1px solid ${colors.border}`,
          borderRadius: 2.5,
          p: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
          minWidth: 220,
        },
      },
    }}
  >
    {/* Month picker */}
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1, mb: 1, textTransform: 'uppercase' }}>
        Month
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5 }}>
        {MONTHS.map((m, i) => (
          <Box
            key={m}
            component="button"
            onClick={() => applyDate(i, selectedDay)}
            sx={{
              border: 'none',
              borderRadius: 1.5,
              px: 0,
              py: 0.6,
              fontSize: 11,
              fontWeight: selectedMonth === i ? 700 : 400,
              cursor: 'pointer',
              bgcolor: selectedMonth === i ? colors.primary : 'transparent',
              color: selectedMonth === i ? '#fff' : colors.textSecondary,
              transition: 'all 0.15s',
              '&:hover': {
                bgcolor: selectedMonth === i ? colors.primary : colors.bgBase,
                color: selectedMonth === i ? '#fff' : colors.textPrimary,
              },
            }}
          >
            {m}
          </Box>
        ))}
      </Box>
    </Box>

    {/* Day picker */}
    <Box>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1, mb: 1, textTransform: 'uppercase' }}>
        Day
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => applyDate(selectedMonth, Math.max(1, selectedDay - 1))}
          sx={{ color: colors.textSecondary, p: 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, minWidth: 28, textAlign: 'center' }}>
          {selectedDay}
        </Typography>
        <IconButton
          size="small"
          onClick={() => applyDate(selectedMonth, Math.min(daysInMonth(selectedMonth), selectedDay + 1))}
          sx={{ color: colors.textSecondary, p: 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
      </Box>
    </Box>
  </Popover>
);

export default MonthDayPopover;
