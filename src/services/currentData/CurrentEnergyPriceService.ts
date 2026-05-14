/** Coarse status bucket used by the UI to colour the price widget. */
export type EnergyPriceStatus = "low" | "medium" | "high";

export interface CurrentEnergyPrice {
    /** Price value in the unit below. */
    value: number;
    /** Display unit, e.g. "ct/kWh" or "EUR/MWh". */
    unit: string;
    /** Coarse classification for the status badge. */
    status: EnergyPriceStatus;
    /** When this snapshot was produced (UTC). */
    fetchedAt: Date;
    /** Average price over the next 24 hours (same unit). */
    avg24h?: number;
    /** Whether the 24h average is higher, lower, or similar to the current price. */
    trend?: 'rising' | 'falling' | 'stable';
}

export interface CurrentEnergyPriceService {
    getCurrent(): Promise<CurrentEnergyPrice>;
}

