import { useState } from 'react';
import { Box } from '@mui/material';
import { useColors } from '../../theme/useTheme';
import {
  DEFAULT_DURATION,
  DEFAULT_HISTORY_YEARS,
  DEFAULT_STORAGE_LEVEL,
  type Duration,
  type HistoryYears,
} from './constants';
import { useBuyRecommendation } from './hooks/useBuyRecommendation';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import RecommendationSection from './components/RecommendationSection';
import ComparisonChartsSection from './components/ComparisonChartsSection';

const StorageForecast = () => {
  const colors = useColors();

  const [storageLevel, setStorageLevel] = useState<number>(DEFAULT_STORAGE_LEVEL);
  const [duration, setDuration] = useState<Duration>(DEFAULT_DURATION);
  const [historyYears, setHistoryYears] = useState<HistoryYears>(DEFAULT_HISTORY_YEARS);

  const { xLabels, recommendation, periodLabel } = useBuyRecommendation({
    storageLevel,
    duration,
    historyYears,
  });

  return (
    <Box
      sx={{
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2.5,
        mx: 3,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Header historyYears={historyYears} periodLabel={periodLabel} />

      <ControlsBar
        storageLevel={storageLevel}
        onStorageLevelChange={setStorageLevel}
        duration={duration}
        onDurationChange={setDuration}
        historyYears={historyYears}
        onHistoryYearsChange={setHistoryYears}
      />

      <RecommendationSection
        decision={recommendation.decision}
        score={recommendation.score}
        explanation={recommendation.explanation}
        currentPrice={recommendation.currentPrice}
        historicalAvgPrice={recommendation.historicalAvgPrice}
        forecastAvgPrice={recommendation.forecastAvgPrice}
        breakdown={recommendation.breakdown}
      />

      <ComparisonChartsSection
        xLabels={xLabels}
        historyYears={historyYears}
        historicalPrices={recommendation.historicalPrices}
        forecastPrices={recommendation.forecastPrices}
        historicalDemand={recommendation.historicalDemand}
        forecastDemand={recommendation.forecastDemand}
        weatherHistory={recommendation.weatherHistory}
        forecastTemperature={recommendation.forecastTemperature}
      />
    </Box>
  );
};

export default StorageForecast;
