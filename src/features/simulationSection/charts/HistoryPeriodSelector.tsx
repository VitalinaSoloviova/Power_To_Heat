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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',  gap: 0.75}}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 20px' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary, paddingTop: 0.5 }}>
          Historical period
        </Typography>
        <Tooltip
          arrow
          placement="top"
          title="Historical period that should be used for creating average data for the simulation."
        >
          <IconButton
            size="small"
            aria-label="Historical period information"
            sx={{ color: colors.textMuted, p: 0 }}
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
        sx={{ flexWrap: 'wrap' }}
      >
        {HISTORY_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt}
            value={opt}
            sx={{
              flex: '1 1 ',
              color: colors.textSecondary,
              borderColor: colors.border,
              fontSize: 12,
              px: 0.5,
              py: 0.5,
              minWidth: 40,
              width: { xs: 40, sm: 53 },
              height: { xs: 40, sm: 53 },
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
