import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { DeleteRounded, CompareArrowsRounded } from '@mui/icons-material';
import { useColors } from '@theme/useTheme';
import { getGlassSx } from '@theme/colors';
import { tx, radii } from '@theme/tokens';
import { computeRunStats } from './analyticsTypes';
import type { SimulationRun } from './analyticsTypes';

const RANGE_LABEL: Record<string, string> = { day: 'Day', week: 'Week', month: 'Month' };

interface Props {
  run: SimulationRun;
  selected: boolean;
  isComparing?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onCompare?: () => void;
}

const RunCard: React.FC<Props> = ({ run, selected, isComparing, onSelect, onDelete, onCompare }) => {
  const colors = useColors();
  const stats = computeRunStats(run.series);

  const startDate = new Date(run.params.startDay).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short',
  });
  const savedAt = new Date(run.savedAt).toLocaleString('en-US', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const { historyYears, dataYears } = run.params;
  const coverageStr = dataYears
    ? `${Math.min(dataYears.weather, dataYears.price)}Y actual`
    : '—';

  const infos = [
    ...(run.params.cityName ? [`City: ${run.params.cityName}`] : []),
    ...(run.params.residents != null ? [`Residents: ${run.params.residents.toLocaleString('en-US')}`] : []),
    `Storage: ${run.params.storageLevel} %`,
    ...(historyYears !== null && historyYears !== undefined ? [`History: ${historyYears}Y requested · ${coverageStr}`] : []),
    `Cost: ${stats.totalCost.toFixed(2)} €`,
    `Cheap / Expensive: ${stats.cheapCount} / ${stats.expensiveCount}`,
    `Savings: ${stats.savings >= 0 ? '+' : ''}${stats.savings.toFixed(0)} €`,
  ];

  return (
    <Box
      onClick={onSelect}
      sx={{
        ...getGlassSx(colors),
        mb: 1,
        p: 1.5,
        borderRadius: radii.md,
        // Only override border for selected/comparing — let getGlassSx handle default
        ...(selected
          ? { border: `1.5px solid ${colors.primary}`, background: `${colors.iridescent}, ${colors.primarySoft}` }
          : isComparing
            ? { border: `1.5px solid ${colors.heat}`, background: `${colors.iridescent}, ${colors.heatSoft}` }
            : {}),
        cursor: 'pointer',
        transition: 'border-color .2s, box-shadow .2s, transform .2s',
        '&:hover': { borderColor: colors.primary, transform: 'translateY(-1px)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Chip
          label={RANGE_LABEL[run.params.range]}
          size="small"
          sx={{ fontSize: tx.xs, height: 18, bgcolor: `${colors.primary}20`, color: colors.primary, border: 'none' }}
        />
        <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary, flex: 1 }}>
          {startDate}
        </Typography>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          sx={{ p: 0.5, color: colors.textMuted, '&:hover': { color: colors.danger } }}
        >
          <DeleteRounded sx={{ fontSize: tx.xl }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
        {infos.map((info) => (
          <Typography key={info} sx={{ fontSize: tx.sm, color: colors.textSecondary }}>
            · {info}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.75 }}>
        <Typography sx={{ fontSize: 9.5, color: colors.textMuted, flex: 1 }}>
          {savedAt}
        </Typography>

        {/* Compare button — only for non-selected cards */}
        {!selected && onCompare && (
          <Tooltip title={isComparing ? 'Remove from comparison' : 'Compare with selected'} placement="top">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onCompare(); }}
              sx={{
                p: 0.5,
                borderRadius: radii.sm,
                color: isComparing ? colors.heat : colors.textMuted,
                bgcolor: isComparing ? `${colors.heat}18` : 'transparent',
                border: `1px solid ${isComparing ? `${colors.heat}55` : 'transparent'}`,
                '&:hover': {
                  color: colors.heat,
                  bgcolor: `${colors.heat}18`,
                  border: `1px solid ${colors.heat}55`,
                },
              }}
            >
              <CompareArrowsRounded sx={{ fontSize: tx.xl }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default RunCard;
