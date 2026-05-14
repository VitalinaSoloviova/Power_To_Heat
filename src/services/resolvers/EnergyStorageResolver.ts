export interface StorageStepInput {
    price: number;                          // EUR/MWh — day-ahead market price
    demandKw: number;                       // kW — heating demand this step
    previous: { level: number; capacity: number };
    stepHours: number;                      // 1 for hourly, 24 for daily
}

export interface StorageStepOutput {
    storage: { level: number; capacity: number };
    flow: number;                           // kWh, positive = charging, negative = discharging
    mode: 'charging' | 'discharging' | 'direct';
}

// Price thresholds (EUR/MWh)
const LOW_PRICE_THRESHOLD  = 60;   // below → cheap enough to charge storage
const HIGH_PRICE_THRESHOLD = 100;  // above → too expensive, drain storage instead

// Maximum Power-to-Heat input power in kW
const MAX_P2H_KW = 3_000;

export class EnergyStorageResolver {
    static readonly CAPACITY_KWH = 20_000; // 2 × 10 MWh sand batteries

    /**
     * Price-aware P2H storage strategy.
     * Assumes unlimited grid access — price determines WHEN to buy, not whether.
     *
     * LOW price  → buy at full P2H power, charge storage with surplus
     * HIGH price → switch P2H off, drain storage to cover demand
     *              (if storage empty: P2H must run regardless — emergency mode)
     * MEDIUM     → buy just enough to cover current demand, storage unchanged
     */
    static step({ price, demandKw, previous, stepHours }: StorageStepInput): StorageStepOutput {
        const { level, capacity } = previous;
        const demandKwh = demandKw * stepHours;

        if (price < LOW_PRICE_THRESHOLD) {
            // Cheap: run P2H at max, store the surplus heat
            const p2hKwh   = MAX_P2H_KW * stepHours;
            const surplus  = p2hKwh - demandKwh;
            const charged  = Math.min(Math.max(0, surplus), capacity - level);
            return {
                storage: { level: level + charged, capacity },
                flow: charged,
                mode: 'charging',
            };
        }

        if (price > HIGH_PRICE_THRESHOLD) {
            // Expensive: turn P2H off, cover demand from storage
            const discharged = Math.min(demandKwh, level);
            const shortfall  = demandKwh - discharged; // > 0 only if storage empty
            // If storage can't cover all demand, P2H must run for the shortfall (emergency)
            const emergencyCharge = shortfall > 0 ? 0 : 0; // shortfall is met by P2H but not stored
            return {
                storage: { level: level - discharged, capacity },
                flow: -(discharged + emergencyCharge),
                mode: discharged >= demandKwh ? 'discharging' : 'discharging',
            };
        }

        // Medium price: P2H covers demand directly, no net storage change
        return {
            storage: { level, capacity },
            flow: 0,
            mode: 'direct',
        };
    }
}
