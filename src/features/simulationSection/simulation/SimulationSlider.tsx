import { useState } from 'react';
import { Box, Slider, ToggleButton, ToggleButtonGroup, Typography, Popover, IconButton } from '@mui/material';
import { useColors } from '@theme/useTheme';

import { formatTimestamp } from './simulationUtils';
import SimulationButton from './SimulationButton';
import type { PlaybackControl, SimulationRange, TimelineControl } from '@services/types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const daysInMonth = (month: number) =>
  new Date(2024, month + 1, 0).getDate(); // 2024 = leap year, safe for all months

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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = anchorEl !== null;

  const selectedMonth = startDay.getMonth();
  const selectedDay = startDay.getDate();

  const applyDate = (month: number, day: number) => {
    const maxDay = daysInMonth(month);
    const clampedDay = Math.min(day, maxDay);
    const d = new Date(Date.UTC(new Date().getFullYear(), month, clampedDay));
    onStartDayChange(d);
  };

  const labelMonthDay = startDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

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
      {/* Date picker chip */}
      <Box
        component="button"
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.4,
          py: 0.5,
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: open ? colors.bgCardSolid : 'transparent',
          color: colors.textPrimary,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s',
          '&:hover': { bgcolor: colors.bgCardSolid },
        }}
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
          <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {labelMonthDay}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
        {/* Day picker */}
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
      </Popover>

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
