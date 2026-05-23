import {
    calculateChargeAmount,
    STORAGE_CAPACITY_KWH,
    updateStorage,
} from '@features/simulationSection/simulation/P2HChargingLogic';
import type { ChargingConfig } from '@features/simulationSection/simulation/P2HChargingLogic';

export interface StorageStepInput {
    price: number;
    tempOut: number;
    previous: { level: number; capacity: number };
    stepHours: number;
    historicalPrices: number[];
    chargingConfig?: ChargingConfig;
    emergencyBuyEnabled?: boolean;
    forecastDemandKwh?: number; // expected heat demand for the next ~7 days (kWh)
}

export interface StorageStepOutput {
    storage: { level: number; capacity: number };
    flow: number;
    mode: 'charging' | 'emergency' | 'idle';
    generated: number;
    emergencyPurchase: number;
    demandKwh: number;   // heat demand served this step (kWh)
}

export class EnergyStorageResolver {
    static readonly CAPACITY_KWH = STORAGE_CAPACITY_KWH;

    static step({
        price, tempOut, previous, stepHours, historicalPrices,
        chargingConfig, emergencyBuyEnabled = true, forecastDemandKwh,
    }: StorageStepInput): StorageStepOutput {
        const { level, capacity } = previous;

        // Charge amount per step = hourly charge power × step duration
        const chargeAmount_kWh = calculateChargeAmount(level, price, historicalPrices, chargingConfig, forecastDemandKwh) * stepHours;

        let newLevel = level;
        if (chargeAmount_kWh > 0) {
            newLevel = Math.min(newLevel + chargeAmount_kWh, capacity);
        }

        const { newLevel: levelAfterDemand, demandKwh } = updateStorage(
            newLevel, tempOut, stepHours, chargingConfig?.residents,
        );

        const rawEmergency = Math.max(0, -levelAfterDemand);
        const emergencyPurchase_kWh = emergencyBuyEnabled ? rawEmergency : 0;
        newLevel = Math.max(0, levelAfterDemand + emergencyPurchase_kWh);
        const purchasedEnergy_kWh = chargeAmount_kWh + emergencyPurchase_kWh;

        return {
            storage: { level: newLevel, capacity },
            flow: newLevel - level,
            generated: purchasedEnergy_kWh,
            emergencyPurchase: emergencyPurchase_kWh,
            demandKwh,
            // emergency takes precedence — if storage went empty, flag it even if regular charging also ran
            mode: emergencyPurchase_kWh > 0
                ? 'emergency'
                : chargeAmount_kWh > 0
                    ? 'charging'
                    : 'idle',
        };
    }

    /** Compute heat demand for a step without advancing the simulation (used for the first frame). */
    static computeDemandKwh({
        tempOut, levelKwh, stepHours, chargingConfig,
    }: {
        tempOut: number;
        levelKwh: number;
        stepHours: number;
        chargingConfig?: ChargingConfig;
    }): number {
        const { demandKwh } = updateStorage(levelKwh, tempOut, stepHours, chargingConfig?.residents);
        return demandKwh;
    }
}
