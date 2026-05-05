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
export function useSimulationData(range: SimulationRange) {
  const [hours, setHours] = useState<UiHourData[] | null>(null);
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    
    uiService
      .getChartsData(1, range === 'month' ? 'daily' : 'hourly')
      .then((d) => {
        if (cancelled) return;
        setHours(d.hours);
        setFetchState('success');
      })
      .catch(() => {
        if (cancelled) return;
        setHours(null);
        setFetchState('error');
      });
    
    return () => {
      cancelled = true;
    };
  }, [range]);

  // Set loading state when range changes
  useEffect(() => {
    setFetchState('loading');
  }, [range]);

  const loading = fetchState === 'loading';

  const series = useMemo<SimulationPoint[]>(() => {
    const targetCount = POINTS_PER_RANGE[range];
    const stepHours = STEP_HOURS[range];

    if (!hours || hours.length === 0) {
      console.warn(`useSimulationData: No data available for range "${range}". Hours:`, hours);
      return [];
    }

    if (hours.length < targetCount) {
      console.warn(`useSimulationData: Only ${hours.length} hours available, need ${targetCount} for range "${range}"`);
    }

    const slice = hours.slice(0, targetCount);
    const capacity = 1000;
    let level = capacity * 0.5;

    return slice.map((h) => {
      const current = h.energyDemand;
      const expected = current * 0.97;

      const hour = h.datetime.getHours();
      const solar = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI)) * 700; // Increased from 500
      const wind = Math.max(80, (h.weather.wind ?? 6) * 45); // Minimum 80kW, default 6 m/s wind
      const generated = solar + wind;

      const energy = { generated, price: h.price };
      const demand = { current, expected };
      const { storage } = stepStorage({
        energy,
        demand,
        previous: { level, capacity },
        stepHours,
      });
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
  }, [hours, range]);

  return { series, loading };
}
