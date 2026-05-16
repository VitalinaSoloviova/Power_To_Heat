import { InfoOutlineRounded } from '@mui/icons-material';
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { HISTORY_OPTIONS, type HistoryYears } from '@services/ui/ChartUIService';
import { useColors } from '@theme/useTheme';

interface HistoryPeriodSelectorProps {
  historyYears: HistoryYears;
  setHistoryYears: (v: HistoryYears) => void;
}

const HistoryPeriodSelector: React.FC<HistoryPeriodSelectorProps> = ({ historyYears, setHistoryYears }) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1.5, gap: 0.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary }}>
          Historical period
        </Typography>
        <Tooltip
          arrow
          placement="top"
          title="Historical average data range used for simulation generation"
        >
          <IconButton
            size="small"
            aria-label="Historical period information"
            sx={{ color: colors.textMuted, p: 0.25 }}
          >
            <InfoOutlineRounded sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>
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
              minWidth: 60,
              minHeight: 60, 
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
