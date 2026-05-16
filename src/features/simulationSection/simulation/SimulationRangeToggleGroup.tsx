import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from '@services/types';

interface SimulationRangeToggleGroupProps {
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
}

const SimulationRangeToggleGroup: React.FC<SimulationRangeToggleGroupProps> = ({ range, onRangeChange }) => {
  const colors = useColors();
  return (
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
      {/* <ToggleButton value="month" disabled>Month</ToggleButton> */}
    </ToggleButtonGroup>
  );
};

export default SimulationRangeToggleGroup;
