import { useEffect, useState } from 'react';
import { uiService } from '@services/serviceRegistry';
import type { HistoryYears } from '@services/ui/ChartUIService';
import type { DataCoverage } from '@services/DataCoverageCalculator';
import type { SimulationPoint, SimulationRange } from '@services/types';
import type { ChargingConfig } from '@features/simulationSection/simulation/P2HChargingLogic';

export interface SimulationDataOptions {
  chargingConfig?: ChargingConfig;
  emergencyBuyEnabled?: boolean;
  priceHistoryDays?: number;
}

export function useSimulationData(
  range: SimulationRange,
  startDay: Date,
  initialStoragePercent: number,
  historyYears: HistoryYears = 10,
  options: SimulationDataOptions = {},
) {
  const [series, setSeries] = useState<SimulationPoint[]>([]);
  const [dataYears, setDataYears] = useState<DataCoverage | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);

  const startMs = startDay.getTime();
  const optionsKey = JSON.stringify(options);
  const requestKey = `${range}:${startMs}:${historyYears}:${initialStoragePercent}:${optionsKey}`;

  useEffect(() => {
    let cancelled = false;
    uiService
      .getSimulationUIData({
        range,
        startDate: new Date(startMs),
        initialStoragePercent,
        historyYears,
        chargingConfig: options.chargingConfig,
        emergencyBuyEnabled: options.emergencyBuyEnabled,
        priceHistoryDays: options.priceHistoryDays,
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

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, startMs, initialStoragePercent, historyYears, optionsKey, requestKey]);

  return { series, loading: loadedRequestKey !== requestKey, dataYears };
}
