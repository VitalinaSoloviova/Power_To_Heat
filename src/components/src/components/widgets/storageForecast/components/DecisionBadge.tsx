import { Box } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import { buyDecisionLabel, type BuyDecision } from '../../storageForecastUtils';

interface DecisionBadgeProps {
  decision: BuyDecision;
}

const DecisionBadge = ({ decision }: DecisionBadgeProps) => {
  const colors = useColors();
  const accent =
    decision === 'buy' ? colors.energy : decision === 'wait' ? colors.cool : colors.heat;

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 1.5,
        bgcolor: accent,
        color: '#fff',
        fontWeight: 700,
        fontSize: 16,
        minWidth: 140,
        textAlign: 'center',
      }}
    >
      {buyDecisionLabel(decision)}
    </Box>
  );
};

export default DecisionBadge;
