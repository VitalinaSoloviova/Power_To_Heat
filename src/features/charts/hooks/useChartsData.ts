import { useEffect, useState } from 'react';
import {
    type ChartsData,
    type HistoryYears,
} from '@services/UIService';
import { uiService } from '@services/serviceContainer';

interface UseChartsDataResult {
    data: ChartsData | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Loads the historical-comparison chart data for the requested number of historical years.
 */
export function useChartsData(
    historyYears: HistoryYears
): UseChartsDataResult {
    const [data, setData] = useState<ChartsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError(null);

        uiService
            .getChartsData(historyYears)
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
    }, [historyYears]);

    return { data, loading, error };
}
