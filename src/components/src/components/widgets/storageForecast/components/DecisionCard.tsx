import { Box } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import { type BuyDecision } from '../../storageForecastUtils';
import DecisionBadge from './DecisionBadge';
import DecisionExplanation from './DecisionExplanation';

interface DecisionCardProps {
  decision: BuyDecision;
  score: number;
  explanation: string;
  currentPrice: number;
  historicalAvgPrice: number;
  forecastAvgPrice: number;
}

const DecisionCard = ({
  decision,
  score,
  explanation,
  currentPrice,
  historicalAvgPrice,
  forecastAvgPrice,
}: DecisionCardProps) => {
  const colors = useColors();
  const accent =
    decision === 'buy' ? colors.energy : decision === 'wait' ? colors.cool : colors.heat;

  return (
    <Box
      sx={{
        flex: '2 1 360px',
        minWidth: 0,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${accent}`,
        bgcolor: colors.bgBase,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <DecisionBadge decision={decision} />
      <DecisionExplanation
        explanation={explanation}
        currentPrice={currentPrice}
        historicalAvgPrice={historicalAvgPrice}
        forecastAvgPrice={forecastAvgPrice}
        score={score}
      />
    </Box>
  );
};

export default DecisionCard;
