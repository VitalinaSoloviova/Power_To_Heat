import {
    calculateChargeAmount,
    STORAGE_CAPACITY_KWH,
    updateStorage,
} from '@features/simulationSection/simulation/P2HChargingLogic';

export interface StorageStepInput {
    price: number;                           // EUR/MWh — day-ahead market price
    tempOut: number;                         // °C — outdoor temperature for heat-loss calculation
    previous: { level: number; capacity: number };
    stepHours: number;                       // 1 for hourly, 24 for daily
    historicalPrices: number[];              // past prices used to compute P10/P25/median
}

export interface StorageStepOutput {
    storage: { level: number; capacity: number };
    flow: number;       // kWh change in storage level (positive = charged, negative = lost)
    mode: 'charging' | 'emergency' | 'idle';
    generated: number;  // kWh of electricity purchased this step
    emergencyPurchase: number; // kWh bought directly when storage cannot cover demand
}

export class EnergyStorageResolver {
    static readonly CAPACITY_KWH = STORAGE_CAPACITY_KWH; // 1800 MWh usable sand battery capacity

    static step({ price, tempOut, previous, stepHours, historicalPrices }: StorageStepInput): StorageStepOutput {
        const { level, capacity } = previous;

        const chargeAmount_kWh = calculateChargeAmount(level, price, historicalPrices);

        let newLevel = level;
        if (chargeAmount_kWh > 0) {
            newLevel = Math.min(newLevel + chargeAmount_kWh, capacity);
        }

        const levelAfterDemand = updateStorage(newLevel, tempOut, stepHours);
        const emergencyPurchase_kWh = Math.max(0, -levelAfterDemand);
        newLevel = Math.max(0, levelAfterDemand);
        const purchasedEnergy_kWh = chargeAmount_kWh + emergencyPurchase_kWh;

        return {
            storage: { level: newLevel, capacity },
            flow: newLevel - level,
            mode: chargeAmount_kWh > 0
                ? 'charging'
                : emergencyPurchase_kWh > 0
                    ? 'emergency'
                    : 'idle',
            generated: purchasedEnergy_kWh,
            emergencyPurchase: emergencyPurchase_kWh,
        };
    }
}
