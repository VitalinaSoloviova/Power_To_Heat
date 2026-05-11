import { useEffect, useMemo, useState } from 'react';
import { uiService } from '@services/serviceContainer';
import type { SimulationPoint, SimulationRange } from '../simulationTypes';
import { stepStorage } from '../storageCalculationUtils';
import type { UiHourData } from '@calculations/uiDataProfile';
import type { WeatherCondition } from '@services/CurrentWeatherService';

const POINTS_PER_RANGE: Record<SimulationRange, number> = {
  day: 24,
  week: 7 * 24,
  month: 30,
};

const STEP_HOURS: Record<SimulationRange, number> = {
  day: 1,
  week: 1,
  month: 24,
};


const normalizeWeatherCondition = (
  description: string | undefined,
  windSpeed = 0,
): WeatherCondition => {
  const d = (description ?? '').toLowerCase();
  if (d.includes('rain') || d.includes('drizzle')) return 'rainy';
  if (d.includes('snow')) return 'snowy';
  if (d.includes('storm') || d.includes('thunder')) return 'stormy';
  if (d.includes('fog') || d.includes('mist')) return 'foggy';
  if (d.includes('cloud') || d.includes('overcast')) return 'cloudy';
  if (windSpeed >= 8) return 'windy';
  if (d.includes('clear') || d.includes('sun')) return 'sunny';
  return 'unknown';
};

/**
 * Builds a `SimulationPoint[]` series from the real chart data exposed
 * by `UIService`. Returns an empty array while loading or on error.
 */
export function useSimulationData(range: SimulationRange, startDay: Date, initialStoragePercent: number) {
  const [hours, setHours] = useState<UiHourData[] | null>(null);
  const [currentRange, setCurrentRange] = useState<SimulationRange>(range);

  useEffect(() => {
    let cancelled = false;
    const granularity = range === 'month' ? 'daily' : 'hourly';

    uiService
      .getChartsData(1, granularity, startDay)
      .then((d) => {
        if (cancelled) return;
        setHours(d.hours);
        setCurrentRange(range);
      })
      .catch(() => {
        if (cancelled) return;
        setHours(null);
        setCurrentRange(range);
      });

    return () => {
      cancelled = true;
    };
  }, [range, startDay]);

  const loading = range !== currentRange;

  const series = useMemo<SimulationPoint[]>(() => {
    const targetCount = POINTS_PER_RANGE[range];
    const stepHours = STEP_HOURS[range];

    if (!hours || hours.length === 0) {
      return [];
    }

    if (hours.length < targetCount) {
      // Use available data even if less than target
    }

    const slice = hours.slice(0, targetCount);
    const capacity = 20000;
    const clampedInitialStoragePercent = Math.min(100, Math.max(0, initialStoragePercent));
    let level = capacity * (clampedInitialStoragePercent / 100);

    return slice.map((h, pointIndex) => {
      const current = h.energyDemand / 100;
      const expected = current * 0.97;

      const hour = h.datetime.getUTCHours();
      const solar = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI)) * 700; // Increased from 500
      const wind = Math.max(80, (h.weather.wind ?? 6) * 45); // Minimum 80kW, default 6 m/s wind
      const generated = solar + wind;

      const energy = { generated, price: h.price };
      const demand = { current, expected };
      const storage = pointIndex === 0
        ? { level, capacity }
        : stepStorage({
            energy,
            demand,
            previous: { level, capacity },
            stepHours,
          }).storage;
      level = storage.level;

      return {
        timestamp: h.datetime.toISOString(),
        weather: {
          temperature: h.weather.temp,
          condition: normalizeWeatherCondition(h.weather.description, h.weather.wind),
          cloudCoverage:
            h.weather.description?.toLowerCase().includes('cloud') ? 0.75 : 0.2,
          windSpeed: h.weather.wind,
        },
        energy,
        demand,
        storage,
      };
    });
  }, [hours, range, initialStoragePercent]);

  return { series, loading };
}
