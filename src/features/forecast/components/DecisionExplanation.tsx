import { Box, Typography } from '@mui/material';
import { useColors } from '../../../theme/useTheme';

interface DecisionExplanationProps {
  explanation: string;
  currentPrice: number;
  historicalAvgPrice: number;
  forecastAvgPrice: number;
  score: number;
}

const DecisionExplanation = ({
  explanation,
  currentPrice,
  historicalAvgPrice,
  forecastAvgPrice,
  score,
}: DecisionExplanationProps) => {
  const colors = useColors();
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.4 }}>
        {explanation}
      </Typography>
      <Typography sx={{ fontSize: 11, color: colors.textSecondary, mt: 0.5 }}>
        Now: {currentPrice} €/MWh · Forecast avg: {forecastAvgPrice} €/MWh · Historical avg:{' '}
        {historicalAvgPrice} €/MWh · Confidence: {score}%
      </Typography>
    </Box>
  );
};

export default DecisionExplanation;
