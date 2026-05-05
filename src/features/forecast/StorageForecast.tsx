import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import {
  DEFAULT_DURATION,
  DEFAULT_HISTORY_YEARS,
  DEFAULT_STORAGE_LEVEL,
  type Duration,
  type HistoryYears
} from '@services/UIService';
import { useBuyRecommendation } from './hooks/useBuyRecommendation';
import { useChartsData } from '@features/charts/hooks/useChartsData';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import RecommendationSection from './components/RecommendationSection';
import ComparisonChartsSection from '@features/charts/ComparisonChartsSection';

const StorageForecast = () => {
  const colors = useColors();

  const [storageLevel, setStorageLevel] = useState<number>(DEFAULT_STORAGE_LEVEL);
  const [duration, setDuration] = useState<Duration>(DEFAULT_DURATION);
  const [historyYears, setHistoryYears] = useState<HistoryYears>(DEFAULT_HISTORY_YEARS);

  const { recommendation, periodLabel } = useBuyRecommendation({
    storageLevel,
    duration,
    historyYears,
  });

  const { data: charts, loading: chartsLoading, error: chartsError } =
    useChartsData(duration, historyYears);

  const xLabels = charts?.xLabels ?? [];
  const historicalPrices = charts?.hours.map((h) => h.price) ?? [];
  const historicalDemand = charts?.hours.map((h) => h.energyDemand) ?? [];
  const weatherHistory =
    charts?.hours.map((h) => ({
      month: h.datetime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      minTemp: h.weather.minTemp,
      maxTemp: h.weather.maxTemp,
      avgTemp: h.weather.temp,
    })) ?? [];

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

      {chartsError && (
        <Typography sx={{ color: colors.heat, fontSize: 13 }}>
          Error loading chart data: {chartsError.message}
        </Typography>
      )}
      {chartsLoading && !charts && (
        <Typography sx={{ color: colors.textSecondary, fontSize: 13 }}>
          Loading chart data…
        </Typography>
      )}

      <ComparisonChartsSection
        xLabels={xLabels}
        actualPriceYears={charts?.dataYears.priceYears ?? historyYears}
        actualWeatherYears={charts?.dataYears.weatherYears ?? historyYears}
        actualWeatherFirstDate={charts?.dataYears.weatherFirstDate ?? null}
        actualPriceFirstDate={charts?.dataYears.priceFirstDate ?? null}
        actualWeatherLastDate={charts?.dataYears.weatherLastDate ?? null}
        actualPriceLastDate={charts?.dataYears.priceLastDate ?? null}
        historicalPrices={historicalPrices}
        forecastPrices={[]}
        historicalDemand={historicalDemand}
        forecastDemand={[]}
        weatherHistory={weatherHistory}
      />
    </Box>
  );
};

export default StorageForecast;
