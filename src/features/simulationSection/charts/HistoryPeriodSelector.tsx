import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { HISTORY_OPTIONS, type HistoryYears } from '@services/ui/ChartUIService';
import { useColors } from '@theme/useTheme';

interface HistoryPeriodSelectorProps {
  historyYears: HistoryYears;
  setHistoryYears: (v: HistoryYears) => void;
}

const HistoryPeriodSelector: React.FC<HistoryPeriodSelectorProps> = ({ historyYears, setHistoryYears }) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1.5, gap: 1.5 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary }}>
        Historical period
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={historyYears}
        onChange={(_, v) => v && setHistoryYears(v as HistoryYears)}
      >
        {HISTORY_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt}
            value={opt}
            sx={{
              color: colors.textSecondary,
              borderColor: colors.border,
              fontSize: 12,
              px: 1.25,
              py: 0.5,
              minWidth: 36,
              '&.Mui-selected': {
                color: colors.textPrimary,
                bgcolor: colors.primarySoft,
                borderColor: colors.primary,
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

export default HistoryPeriodSelector;
