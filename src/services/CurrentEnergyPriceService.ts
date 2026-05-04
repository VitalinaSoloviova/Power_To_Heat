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
}

export interface CurrentEnergyPriceService {
    getCurrent(): Promise<CurrentEnergyPrice>;
}

/**
 * Mock implementation – returns a plausible value with a deterministic
 * status mapping. Replace with a real adapter (e.g. ENTSO-E, aWATTar)
 * later without changing the widget layer.
 */
export class MockCurrentEnergyPriceService implements CurrentEnergyPriceService {
    public async getCurrent(): Promise<CurrentEnergyPrice> {
        const value = 28.4; // ct/kWh
        return {
            value,
            unit: "ct/kWh",
            status: classify(value),
            fetchedAt: new Date(),
        };
    }
}

function classify(centsPerKilowattHour: number): EnergyPriceStatus {
    // Have to be recalculated. How do we decide if its "low", "medium" or "high"?
    if (centsPerKilowattHour < 20) return "low";
    if (centsPerKilowattHour < 35) return "medium";
    return "high";
}
