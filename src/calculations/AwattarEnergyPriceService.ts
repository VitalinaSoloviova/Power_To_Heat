import type { CurrentEnergyPriceService, CurrentEnergyPrice, EnergyPriceStatus } from '@services/currentData/CurrentEnergyPriceService';

interface AwattarEntry {
    start_timestamp: number;
    end_timestamp: number;
    marketprice: number;
    unit: string;
}

interface AwattarResponse {
    data: AwattarEntry[];
}

export class AwattarEnergyPriceService implements CurrentEnergyPriceService {
    private readonly baseUrl: string;
    constructor(baseUrl: string = 'http://localhost:3001') {
        this.baseUrl = baseUrl;
    }

    async getCurrent(): Promise<CurrentEnergyPrice> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/energy-price/current`
            );

            if (!response.ok) throw new Error('API error');

            const json = await response.json() as AwattarResponse;
            const entries = json.data ?? [];

            const now = Date.now();
            const in24h = now + 24 * 60 * 60 * 1000;

            // Current entry: the slot that contains now
            const current = entries.find(
                (e) => e.start_timestamp <= now && e.end_timestamp > now
            ) ?? entries[0];

            // EUR/MWh → ct/kWh  (÷ 10)
            const mwhToCtKwh = (eurMwh: number) => eurMwh / 10;

            const ctPerKwh = Number(mwhToCtKwh(current?.marketprice ?? 284).toFixed(1));

            // 24h average: all entries whose start falls within the next 24h
            const next24 = entries.filter((e) => e.start_timestamp >= now && e.start_timestamp < in24h);
            const avg24h = next24.length > 0
                ? Number((next24.reduce((sum, e) => sum + mwhToCtKwh(e.marketprice), 0) / next24.length).toFixed(1))
                : undefined;

            const trend = avg24h !== undefined ? deriveTrend(ctPerKwh, avg24h) : undefined;

            return {
                value: ctPerKwh,
                unit: 'ct/kWh',
                status: classify(ctPerKwh),
                fetchedAt: new Date(),
                avg24h,
                trend,
            };
        } catch (error) {
            console.warn('Failed to fetch real energy price → using fallback', error);
            return {
                value: 28.4,
                unit: 'ct/kWh',
                status: 'medium',
                fetchedAt: new Date(),
            };
        }
    }
}

function classify(ctPerKwh: number): EnergyPriceStatus {
    if (ctPerKwh < 20) return 'low';
    if (ctPerKwh < 35) return 'medium';
    return 'high';
}

function deriveTrend(current: number, avg24h: number): 'rising' | 'falling' | 'stable' {
    const diff = avg24h - current;
    if (diff > 1.5) return 'rising';
    if (diff < -1.5) return 'falling';
    return 'stable';
}

