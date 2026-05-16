import { useEffect, useMemo, useState } from 'react';
import { uiService } from '@services/serviceRegistry';
import type { ChartsData, HistoryYears } from '@services/ui/ChartUIService';
import type { DataCoverage } from '@services/DataCoverageCalculator';
import type { SimulationPoint, SimulationRange } from '@services/types';

/**
 * Builds a `SimulationPoint[]` series from the real chart data exposed
 * by `UIService`. Returns an empty array while loading or on error.
 */
export function useSimulationData(
  range: SimulationRange,
  startDay: Date,
  initialStoragePercent: number,
  historyYears: HistoryYears = 10,
) {
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const requestKey = `${range}:${startDay.getTime()}:${historyYears}`;

  useEffect(() => {
    let cancelled = false;
    const granularity = range === 'month' ? 'daily' : 'hourly';

    uiService
      .getChartsData(historyYears, granularity, startDay)
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
  }, [range, startDay, historyYears, requestKey]);

  const series = useMemo<SimulationPoint[]>(() => {
    if (!chartsData || loadedRequestKey !== requestKey) return [];

    return uiService.getSimulationSeriesFromCharts({
      chartsData,
      range,
      initialStoragePercent,
    }).series;
  }, [chartsData, loadedRequestKey, requestKey, range, initialStoragePercent]);

  const loading = loadedRequestKey !== requestKey;
  const dataYears: DataCoverage | null = chartsData?.dataYears ?? null;

  return { series, loading, dataYears };
}
