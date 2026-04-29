import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import { DURATION_OPTIONS, type Duration } from '../constants';

interface DurationControlProps {
  value: Duration;
  onChange: (value: Duration) => void;
}

const DurationControl = ({ value, onChange }: DurationControlProps) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
        Forecast duration
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        onChange={(_, v) => v && onChange(v as Duration)}
      >
        {DURATION_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt}
            value={opt}
            sx={{
              color: colors.textSecondary,
              borderColor: colors.border,
              '&.Mui-selected': {
                color: colors.textPrimary,
                bgcolor: colors.heatSoft,
              },
            }}
          >
            {opt} {opt === 1 ? 'month' : 'months'}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default DurationControl;
