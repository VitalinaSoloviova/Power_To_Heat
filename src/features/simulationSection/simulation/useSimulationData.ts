import { useEffect, useState } from 'react';
import { uiService } from '@services/serviceRegistry';
import type { HistoryYears } from '@services/ui/ChartUIService';
import type { DataCoverage } from '@services/DataCoverageCalculator';
import type { SimulationPoint, SimulationRange } from '@services/types';

/**
 * Builds a `SimulationPoint[]` series from the real chart data exposed
 * by `UIService`.
 *
 * Separation of concerns:
 *  - The hook requests one central simulation payload from `UIService`.
 *  - Chart fetches and simulation calculations are deduplicated/cached there,
 *    so storage changes recompute only the dependent simulation series.
 */
export function useSimulationData(
  range: SimulationRange,
  startDay: Date,
  initialStoragePercent: number,
  historyYears: HistoryYears = 10,
) {
  const [series, setSeries] = useState<SimulationPoint[]>([]);
  const [dataYears, setDataYears] = useState<DataCoverage | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);

  // Stable primitive for deps so a new Date object with the same value doesn't refetch.
  const startMs = startDay.getTime();
  const requestKey = `${range}:${startMs}:${historyYears}:${initialStoragePercent}`;

  useEffect(() => {
    let cancelled = false;
    uiService
      .getSimulationUIData({
        range,
        startDate: new Date(startMs),
        initialStoragePercent,
        historyYears,
      })
      .then((data) => {
        if (cancelled) return;
        setSeries(data.series);
        setDataYears(data.dataYears);
        setLoadedRequestKey(requestKey);
      })
      .catch(() => {
        if (cancelled) return;
        setSeries([]);
        setDataYears(null);
        setLoadedRequestKey(requestKey);
      });

    return () => {
      cancelled = true;
    };
  }, [range, startMs, initialStoragePercent, historyYears, requestKey]);

  const loading = loadedRequestKey !== requestKey;

  return { series, loading, dataYears };
}
