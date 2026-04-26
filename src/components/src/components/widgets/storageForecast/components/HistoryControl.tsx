import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import { HISTORY_OPTIONS, type HistoryYears } from '../constants';

interface HistoryControlProps {
  value: HistoryYears;
  onChange: (value: HistoryYears) => void;
}

const HistoryControl = ({ value, onChange }: HistoryControlProps) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
        Historical comparison period
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        onChange={(_, v) => v && onChange(v as HistoryYears)}
      >
        {HISTORY_OPTIONS.map((opt) => (
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
            {opt}Y
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default HistoryControl;
