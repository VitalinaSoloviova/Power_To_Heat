export interface ChargingConfig {
  storageCapacityMwh: number;
  maxChargePercent: number;
  criticalThresholdPct: number;     // charge immediately regardless of price
  nearCriticalThresholdPct: number; // charge if price < median
  halfCapacityThresholdPct: number; // charge if price < P10
  residents: number;                // city residents → derives connected households
}

const DEFAULT_CONFIG: ChargingConfig = {
  storageCapacityMwh: 2_000,
  maxChargePercent: 89,
  criticalThresholdPct: 25,
  nearCriticalThresholdPct: 30,
  halfCapacityThresholdPct: 50,
  residents: 55_000,
};

const CHARGE_HOURS = 48; // target: full storage chargeable in 48 hours

function deriveThresholds(cfg: ChargingConfig) {
  const roundTripEfficiency = 0.9;
  const outputCapacity_kWh = cfg.storageCapacityMwh * 1_000 * roundTripEfficiency;

  return {
    outputCapacity_kWh,
    chargeAmount_kWh:    outputCapacity_kWh / CHARGE_HOURS,
    maxStorageLevel_kWh: outputCapacity_kWh * (cfg.maxChargePercent / 100),
    halfCapacity_kWh:    outputCapacity_kWh * (cfg.halfCapacityThresholdPct / 100),
    nearCritical_kWh:    outputCapacity_kWh * (cfg.nearCriticalThresholdPct / 100),
    lowCapacity_kWh:     outputCapacity_kWh * ((cfg.nearCriticalThresholdPct - 5) / 100),
    critical_kWh:        outputCapacity_kWh * (cfg.criticalThresholdPct / 100),
  };
}

// Exported so EnergyStorageResolver can expose CAPACITY_KWH with the default config.
export const STORAGE_CAPACITY_KWH =
  DEFAULT_CONFIG.storageCapacityMwh * 1_000 * 0.9;

// For display — actual charge amount is derived per-config in deriveThresholds
export const CHARGE_AMOUNT_KWH = STORAGE_CAPACITY_KWH / CHARGE_HOURS;

export function calculateChargeAmount(
  currentCapacity_kWh: number,
  currentPrice: number,        // €/MWh
  historicalPrices: number[],
  cfg: ChargingConfig = DEFAULT_CONFIG,
): number {
  const { chargeAmount_kWh, maxStorageLevel_kWh, halfCapacity_kWh, nearCritical_kWh, lowCapacity_kWh, critical_kWh } =
    deriveThresholds(cfg);

  const freeCapacity_kWh = Math.max(0, maxStorageLevel_kWh - currentCapacity_kWh);
  if (freeCapacity_kWh === 0) return 0;

  if (currentPrice <= 0) return freeCapacity_kWh;

  const prices = historicalPrices.filter((p) => p >= 0).sort((a, b) => a - b);

  if (prices.length === 0) {
    return currentCapacity_kWh <= critical_kWh
      ? Math.min(chargeAmount_kWh, freeCapacity_kWh)
      : 0;
  }

  const l = prices.length;
  const P10    = prices[Math.floor(l * 0.10)];
  const P25    = prices[Math.floor(l * 0.25)];
  const median = prices[Math.floor(l * 0.50)];

  if (currentCapacity_kWh <= critical_kWh) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= nearCritical_kWh && currentPrice < median) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= lowCapacity_kWh && currentPrice <= P25) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (currentCapacity_kWh <= halfCapacity_kWh && currentPrice <= P10) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
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

const PERSONS_PER_HOUSEHOLD = 2.2;       // avg German household size (report)
const DISTRICT_HEATING_SHARE = 0.15;     // 15% of households connected (Ramboll, 2025)
const H_TAVG_KW_PER_K = 0.1265;         // avg transmission heat loss coefficient kW/K (Höttges, 2020)
const TEMP_IN = 20;                      // target inside temperature °C

export function updateStorage(
  currentCapacity_kWh: number,
  tempOut: number,
  dt: number,
  residents: number = DEFAULT_CONFIG.residents,
): number {
  const households = (residents / PERSONS_PER_HOUSEHOLD) * DISTRICT_HEATING_SHARE;
  return currentCapacity_kWh - households * H_TAVG_KW_PER_K * (TEMP_IN - tempOut) * dt;
}
