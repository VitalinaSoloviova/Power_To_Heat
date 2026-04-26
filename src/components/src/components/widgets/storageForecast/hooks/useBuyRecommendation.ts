import { useMemo } from 'react';
import { getForecastMonths, calculateBuyRecommendation } from '../../storageForecastUtils';
import type { Duration, HistoryYears } from '../constants';

interface UseBuyRecommendationInput {
  storageLevel: number;
  duration: Duration;
  historyYears: HistoryYears;
}

export const useBuyRecommendation = ({
  storageLevel,
  duration,
  historyYears,
}: UseBuyRecommendationInput) => {
  const forecastMonths = useMemo(() => getForecastMonths(duration), [duration]);

  const recommendation = useMemo(() => {
    return calculateBuyRecommendation({
      forecastMonths,
      currentLevelPct: storageLevel,
      yearsBack: historyYears,
    });
  }, [forecastMonths, storageLevel, historyYears]);

  const xLabels = useMemo(() => {
    return forecastMonths.map((m) =>
      m.toLocaleDateString('en-GB', { month: 'short' })
    );
  }, [forecastMonths]);

  const periodLabel = useMemo(() => {
    if (forecastMonths.length === 0) return '';
    const start = forecastMonths[0];
    const end = forecastMonths[forecastMonths.length - 1];
    return `${start.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
  }, [forecastMonths]);

  return {
    xLabels,
    recommendation,
    periodLabel,
  };
};