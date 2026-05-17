import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from '@services/types';

interface SimulationRangeToggleGroupProps {
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
}

const SimulationRangeToggleGroup: React.FC<SimulationRangeToggleGroupProps> = ({ range, onRangeChange }) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, height: 60,  }}>
      <Typography variant="caption" sx={{ fontSize: 12, color: colors.textSecondary || colors.textPrimary }}>
        Simulation range
      </Typography>
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
            px: 2,
            py: 0.25,
            fontSize: 12,
            height: 35,
            '&.Mui-selected': {
              color: '#fff',
              height: 35,
              background: colors.primary,
              borderColor: colors.primary,
              '&:hover': { background: colors.primary },
            },
          },
        }}
      >
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SimulationRangeToggleGroup;
