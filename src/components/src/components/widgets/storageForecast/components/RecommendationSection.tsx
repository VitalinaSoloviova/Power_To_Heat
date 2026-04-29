import { Box } from '@mui/material';
import DecisionCard from './DecisionCard';
import ScoreBreakdownCard from './ScoreBreakdownCard';
import { type BuyDecision, type ScoreBreakdown } from '../../storageForecastUtils';

interface RecommendationSectionProps {
  decision: BuyDecision;
  score: number;
  explanation: string;
  currentPrice: number;
  historicalAvgPrice: number;
  forecastAvgPrice: number;
  breakdown: ScoreBreakdown;
}

const RecommendationSection = ({
  decision,
  score,
  explanation,
  currentPrice,
  historicalAvgPrice,
  forecastAvgPrice,
  breakdown,
}: RecommendationSectionProps) => (
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
    <DecisionCard
      decision={decision}
      score={score}
      explanation={explanation}
      currentPrice={currentPrice}
      historicalAvgPrice={historicalAvgPrice}
      forecastAvgPrice={forecastAvgPrice}
    />
    <ScoreBreakdownCard breakdown={breakdown} />
  </Box>
);

export default RecommendationSection;
