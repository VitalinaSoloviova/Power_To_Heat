import { useEffect, useState } from 'react';
import {
    type ChartsData,
    type HistoryYears,
} from '@services/ui/ChartUIService';
import type { Granularity } from '@calculations/DataResolver';
import { uiService } from '@services/serviceRegistry';

interface UseChartsDataResult {
    data: ChartsData | null;
    loading: boolean;
    error: Error | null;
}

export function useChartsData(
    historyYears: HistoryYears,
    startDate?: Date,
    granularity: Granularity = 'daily',
    residents?: number,
): UseChartsDataResult {
    const [data, setData] = useState<ChartsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Use a primitive in the dep array so a new Date object with the same value doesn't refetch
    const startMs = startDate?.getTime();

    useEffect(() => {
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError(null);

        uiService
            .getChartUIData({ historyYears, granularity, startDate, residents })
            .then((d) => {
                if (cancelled) return;
                setData(d);
                setLoading(false);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e instanceof Error ? e : new Error(String(e)));
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyYears, granularity, startMs, residents]);

    return { data, loading, error };
}
