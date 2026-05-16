import { useEffect, useState } from 'react';

interface AwattarEntry {
  start_timestamp: number;
  end_timestamp: number;
  marketprice: number; // EUR/MWh
  unit: string;
}

interface AwattarResponse {
  data: AwattarEntry[];
}

export type PeriodTag = 'past' | 'current' | 'future';

export interface PriceGraphPoint {
  timestamp: number; // ms
  priceCtKwh: number;
  period: PeriodTag;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export const useEnergyPricesAroundNow = () => {
  const [points, setPoints] = useState<PriceGraphPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/energy-price/current`);
        if (!res.ok) throw new Error('api error');
        const json = (await res.json()) as AwattarResponse;
        const entries = (json.data ?? []).slice();

        const now = Date.now();
        const rangeStart = now - 24 * 60 * 60 * 1000;
        const rangeEnd = now + 24 * 60 * 60 * 1000;

        // First filter out entries that start before the range start,
        // then keep only those that start at or before the (range end + 1h) boundary.
        const windowStartFiltered = entries.filter(e => e.start_timestamp >= rangeStart);
        const window = windowStartFiltered.filter(e => e.start_timestamp <= rangeEnd + 60 * 60 * 1000);

        // ensure ordering
        window.sort((a, b) => a.start_timestamp - b.start_timestamp);

        const pts: PriceGraphPoint[] = window.map((e) => {
          const ts = e.start_timestamp;
          const priceCt = Number((e.marketprice / 10).toFixed(2));
          const period: PeriodTag = ts + 60 * 60 * 1000 <= now ? 'past' : (ts <= now && now < ts + 60 * 60 * 1000) ? 'current' : 'future';
          return { timestamp: ts, priceCtKwh: priceCt, period };
        });

        if (!cancelled) {
          setPoints(pts);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    };

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { points, loading, error } as const;
};

export default useEnergyPricesAroundNow;
