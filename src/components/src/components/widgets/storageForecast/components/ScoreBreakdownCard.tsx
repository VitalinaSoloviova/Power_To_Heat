import { Box, Typography } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import { type ScoreBreakdown } from '../../storageForecastUtils';
import ScoreRow from './ScoreRow';

interface ScoreBreakdownCardProps {
  breakdown: ScoreBreakdown;
}

const ScoreBreakdownCard = ({ breakdown }: ScoreBreakdownCardProps) => {
  const colors = useColors();
  return (
    <Box
      sx={{
        flex: '1 1 280px',
        minWidth: 240,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.bgBase,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 0.5 }}>
        Score breakdown
      </Typography>
      <ScoreRow label="Price (45%)" value={breakdown.price} color={colors.heat} />
      <ScoreRow label="Demand (35%)" value={breakdown.demand} color={colors.energy} />
      <ScoreRow label="Weather (15%)" value={breakdown.weather} color={colors.cool} />
      <ScoreRow label="Storage (5%)" value={breakdown.storage} color={colors.textSecondary} />
    </Box>
  );
};

export default ScoreBreakdownCard;
