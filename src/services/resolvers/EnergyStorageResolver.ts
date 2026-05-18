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
}

export interface StorageStepOutput {
    storage: { level: number; capacity: number };
    flow: number;
    mode: 'charging' | 'emergency' | 'idle';
    generated: number;
    emergencyPurchase: number;
}

export class EnergyStorageResolver {
    static readonly CAPACITY_KWH = STORAGE_CAPACITY_KWH;

    static step({
        price, tempOut, previous, stepHours, historicalPrices,
        chargingConfig, emergencyBuyEnabled = true,
    }: StorageStepInput): StorageStepOutput {
        const { level, capacity } = previous;

        const chargeAmount_kWh = calculateChargeAmount(level, price, historicalPrices, chargingConfig) * stepHours;

        let newLevel = level;
        if (chargeAmount_kWh > 0) {
            newLevel = Math.min(newLevel + chargeAmount_kWh, capacity);
        }

        const levelAfterDemand = updateStorage(newLevel, tempOut, stepHours, chargingConfig?.residents);
        const rawEmergency = Math.max(0, -levelAfterDemand);
        const emergencyPurchase_kWh = emergencyBuyEnabled ? rawEmergency : 0;
        newLevel = Math.max(0, levelAfterDemand + emergencyPurchase_kWh);
        const purchasedEnergy_kWh = chargeAmount_kWh + emergencyPurchase_kWh;

        return {
            storage: { level: newLevel, capacity },
            flow: newLevel - level,
            generated: purchasedEnergy_kWh,
            emergencyPurchase: emergencyPurchase_kWh,
            // emergency takes precedence — if storage went empty, flag it even if regular charging also ran
            mode: emergencyPurchase_kWh > 0
                ? 'emergency'
                : chargeAmount_kWh > 0
                    ? 'charging'
                    : 'idle',
        };
    }
}
