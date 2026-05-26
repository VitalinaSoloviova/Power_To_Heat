import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from '@services/types';
import { InfoOutlineRounded } from '@mui/icons-material';
import { tx, fw } from '@theme/tokens';

interface SimulationRangeToggleGroupProps {
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
}

const SimulationRangeToggleGroup: React.FC<SimulationRangeToggleGroupProps> = ({ range, onRangeChange }) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, minHeight: 60 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 20px' }}>
        <Typography variant="caption" sx={{ fontSize: 13, color: colors.textSecondary || colors.textPrimary }}>
        Simulation range
      </Typography>
        <Tooltip
          arrow
          placement="top"
          title="Range of the simulation from the selected starting date."
        >
          <IconButton
            size="small"
            aria-label="Simulation range information"
            sx={{ color: colors.textMuted, p: 0 }}
          >
            <InfoOutlineRounded sx={{ fontSize: tx.lg }} />
          </IconButton>
        </Tooltip>
      </Box>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={range}
        onChange={(_, v) => v && onRangeChange(v as SimulationRange)}
        sx={{
          flexWrap: 'wrap',
          '& .MuiToggleButton-root': {
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            textTransform: 'none',
            px: { xs: 1, sm: 2 },
            py: 0.25,
            fontSize: 13,
            minHeight: 40,
            '&.Mui-selected': {
              color: '#fff',
              minHeight: 40,
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
