import { useEffect, useMemo, useState } from 'react';
import { uiService } from '@services/serviceRegistry';
import type { ChartsData, HistoryYears } from '@services/ui/ChartUIService';
import type { DataCoverage } from '@services/DataCoverageCalculator';
import type { SimulationPoint, SimulationRange } from '@services/types';

/**
 * Builds a `SimulationPoint[]` series from the real chart data exposed
 * by `UIService`.
 *
 * Separation of concerns:
 *  - The effect only fetches chart data when (range, startDay, historyYears)
 *    change. Chart fetches are deduplicated/cached inside `ChartUIService`,
 *    so peer hooks (e.g. `useChartsData`) share the same network request.
 *  - The memo recomputes the simulation series purely (no network) whenever
 *    `initialStoragePercent` changes — so the storage slider does NOT trigger
 *    a refetch.
 */
export function useSimulationData(
  range: SimulationRange,
  startDay: Date,
  initialStoragePercent: number,
  historyYears: HistoryYears = 10,
) {
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);

  // Stable primitive for deps so a new Date object with the same value doesn't refetch.
  const startMs = startDay.getTime();
  const requestKey = `${range}:${startMs}:${historyYears}`;

  useEffect(() => {
    let cancelled = false;
    const granularity = range === 'month' ? 'daily' : 'hourly';

    uiService
      .getChartsData(historyYears, granularity, new Date(startMs))
      .then((data) => {
        if (cancelled) return;
        setChartsData(data);
        setLoadedRequestKey(requestKey);
      })
      .catch(() => {
        if (cancelled) return;
        setChartsData(null);
        setLoadedRequestKey(requestKey);
      });

    return () => {
      cancelled = true;
    };
  }, [range, startMs, historyYears, requestKey]);

  const series = useMemo<SimulationPoint[]>(() => {
    if (!chartsData || loadedRequestKey !== requestKey) return [];

    return uiService.computeSimulationSeries({
      chartsData,
      range,
      initialStoragePercent,
    }).series;
  }, [chartsData, loadedRequestKey, requestKey, range, initialStoragePercent]);

  const loading = loadedRequestKey !== requestKey;
  const dataYears: DataCoverage | null = chartsData?.dataYears ?? null;

  return { series, loading, dataYears };
}
