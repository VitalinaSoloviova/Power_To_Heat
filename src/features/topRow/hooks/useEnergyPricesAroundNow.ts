import { useEffect, useState } from 'react';
import { uiService } from '@services/serviceRegistry';
import type { PriceGraphPoint } from '@services/ui/UIService';

export type { PeriodTag, PriceGraphPoint } from '@services/ui/UIService';

export const useEnergyPricesAroundNow = () => {
  const [points, setPoints] = useState<PriceGraphPoint[]>([]);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const pts = await uiService.getEnergyPricesAroundNow();

        if (!cancelled) {
          setPoints(pts);
          setCurrentTimestamp(Date.now());
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { points, currentTimestamp, loading, error } as const;
};

export default useEnergyPricesAroundNow;
