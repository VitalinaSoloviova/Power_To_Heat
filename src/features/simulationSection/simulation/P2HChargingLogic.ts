export interface ChargingConfig {
  storageCapacityMwh: number;
  maxChargePercent: number;
  criticalThresholdPct: number;     // charge immediately regardless of price
  nearCriticalThresholdPct: number; // charge if price < median
  halfCapacityThresholdPct: number; // charge if price < P10
}

const DEFAULT_CONFIG: ChargingConfig = {
  storageCapacityMwh: 2_000,
  maxChargePercent: 89,
  criticalThresholdPct: 25,
  nearCriticalThresholdPct: 30,
  halfCapacityThresholdPct: 50,
};

function deriveThresholds(cfg: ChargingConfig) {
  const roundTripEfficiency = 0.9;
  const outputCapacity_kWh = cfg.storageCapacityMwh * 1_000 * roundTripEfficiency;

  return {
    outputCapacity_kWh,
    maxStorageLevel_kWh: outputCapacity_kWh * (cfg.maxChargePercent / 100),
    halfCapacity_kWh:    outputCapacity_kWh * (cfg.halfCapacityThresholdPct / 100),
    nearCritical_kWh:    outputCapacity_kWh * (cfg.nearCriticalThresholdPct / 100),
    // low = midpoint between critical (25 %) and nearCritical
    lowCapacity_kWh:     outputCapacity_kWh * ((cfg.nearCriticalThresholdPct - 5) / 100),
    critical_kWh:        outputCapacity_kWh * (cfg.criticalThresholdPct / 100),
  };
}

// Exported so EnergyStorageResolver can expose CAPACITY_KWH with the default config.
export const STORAGE_CAPACITY_KWH =
  DEFAULT_CONFIG.storageCapacityMwh * 1_000 * 0.9;

export const CHARGE_AMOUNT_KWH = 20_000; // 20 MWh added per hourly charge event

export function calculateChargeAmount(
  currentCapacity_kWh: number,
  currentPrice: number,        // €/MWh
  historicalPrices: number[],
  cfg: ChargingConfig = DEFAULT_CONFIG,
): number {
  const { maxStorageLevel_kWh, halfCapacity_kWh, nearCritical_kWh, lowCapacity_kWh, critical_kWh } =
    deriveThresholds(cfg);

  const freeCapacity_kWh = Math.max(0, maxStorageLevel_kWh - currentCapacity_kWh);
  if (freeCapacity_kWh === 0) return 0;

  if (currentPrice <= 0) return freeCapacity_kWh;

  const prices = historicalPrices.filter((p) => p >= 0).sort((a, b) => a - b);

  if (prices.length === 0) {
    return currentCapacity_kWh <= critical_kWh
      ? Math.min(lowCapacity_kWh - currentCapacity_kWh, freeCapacity_kWh)
      : 0;
  }

  const l = prices.length;
  const P10    = prices[Math.floor(l * 0.10)];
  const P25    = prices[Math.floor(l * 0.25)];
  const median = prices[Math.floor(l * 0.50)];

  if (currentCapacity_kWh <= critical_kWh) {
    return Math.min(lowCapacity_kWh - currentCapacity_kWh, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= nearCritical_kWh && currentPrice < median) {
    return Math.min(CHARGE_AMOUNT_KWH * 1.5, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= lowCapacity_kWh && currentPrice <= P25) {
    return Math.min(CHARGE_AMOUNT_KWH, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= halfCapacity_kWh && currentPrice <= P10) {
    return Math.min(CHARGE_AMOUNT_KWH * 0.5, freeCapacity_kWh);
  }

  return 0;
}

export function charge(
  currentCapacity_kWh: number,
  _date: string,
  currentPrice: number,
  historicalPrices: number[],
  cfg?: ChargingConfig,
): boolean {
  return calculateChargeAmount(currentCapacity_kWh, currentPrice, historicalPrices, cfg) > 0;
}

const households = 4_900;
const heat_loss_coefficient = 0.11225; // kW/K per household
const tempIn = 20;

export function updateStorage(
  currentCapacity_kWh: number,
  tempOut: number,
  dt: number,
): number {
  return currentCapacity_kWh - households * heat_loss_coefficient * (tempIn - tempOut) * dt;
}
