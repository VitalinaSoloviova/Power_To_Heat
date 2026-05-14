/**
 * RunCard
 *
 * Compact summary card shown in the Analytics sidebar list.
 * Displays the simulation date, range badge, and four key stats
 * (storage start level, total cost, cheap/expensive split, savings).
 * Clicking the card selects it; the trash icon deletes it from history.
 */

import { Box, Typography, Chip, IconButton } from '@mui/material';
import { DeleteRounded } from '@mui/icons-material';
import { useColors } from '@theme/useTheme';
import { computeRunStats } from './analyticsTypes';
import type { SimulationRun } from './analyticsTypes';

const RANGE_LABEL: Record<string, string> = { day: 'Day', week: 'Week', month: 'Month' };

interface Props {
  run: SimulationRun;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const RunCard: React.FC<Props> = ({ run, selected, onSelect, onDelete }) => {
  const colors = useColors();
  const stats = computeRunStats(run.series);

  const startDate = new Date(run.params.startDay).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const savedAt = new Date(run.savedAt).toLocaleString('de-DE', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  const { historyYears, dataYears } = run.params;
  const coverageStr = dataYears
    ? `${Math.min(dataYears.weather, dataYears.price)}Y actual`
    : '—';

  const infos = [
    `Storage: ${run.params.storageLevel} %`,
    ...(historyYears != null ? [`History: ${historyYears}Y requested · ${coverageStr}`] : []),
    `Cost: ${stats.totalCost.toFixed(2)} €`,
    `Cheap / Expensive: ${stats.cheapCount} / ${stats.expensiveCount}`,
    `Savings: ${stats.savings >= 0 ? '+' : ''}${stats.savings.toFixed(0)} €`,
  ];

  return (
    <Box
      onClick={onSelect}
      sx={{
        mb: 1,
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${selected ? colors.primary : colors.border}`,
        bgcolor: selected ? `${colors.primary}10` : colors.bgCardSolid,
        cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
        '&:hover': { borderColor: colors.primary },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Chip
          label={RANGE_LABEL[run.params.range]}
          size="small"
          sx={{ fontSize: 10, height: 18, bgcolor: `${colors.primary}20`, color: colors.primary, border: 'none' }}
        />
        <Typography sx={{ fontSize: 11, color: colors.textSecondary, flex: 1 }}>
          {startDate}
        </Typography>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          sx={{ p: 0.25, color: colors.textMuted, '&:hover': { color: colors.warning } }}
        >
          <DeleteRounded sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
        {infos.map((info) => (
          <Typography key={info} sx={{ fontSize: 11, color: colors.textSecondary }}>
            · {info}
          </Typography>
        ))}
      </Box>

      <Typography sx={{ fontSize: 9.5, color: colors.textMuted, mt: 0.75 }}>
        {savedAt}
      </Typography>
    </Box>
  );
};

export default RunCard;
