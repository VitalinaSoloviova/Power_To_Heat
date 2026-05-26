import { CityDemandResolver } from '@services/resolvers/CityDemandResolver';

export interface ChargingConfig {
  storageCapacityMwh: number;
  maxChargePowerMw: number;          // max thermal charge power of the heat pump (MW)
  maxChargePercent: number;
  criticalThresholdPct: number;      // charge immediately regardless of price
  nearCriticalThresholdPct: number;  // charge if price < median
  halfCapacityThresholdPct: number;  // charge if price < P10
  residents: number;                 // city residents → derives connected households
}

const DEFAULT_CONFIG: ChargingConfig = {
  storageCapacityMwh: 300,
  maxChargePowerMw: 10,
  maxChargePercent: 90,
  criticalThresholdPct: 20,
  nearCriticalThresholdPct: 35,
  halfCapacityThresholdPct: 50,
  residents: 60_000,
};

// Standing thermal loss rate: 1 % of stored energy per hour (insulation loss)
const STANDING_LOSS_RATE_PER_HOUR = 0.001;

function deriveThresholds(cfg: ChargingConfig) {
  const capacity_kWh = cfg.storageCapacityMwh * 1_000;
  const chargeAmount_kWh = cfg.maxChargePowerMw * 1_000;

  return {
    capacity_kWh,
    chargeAmount_kWh,
    maxStorageLevel_kWh: capacity_kWh * (cfg.maxChargePercent / 100),
    halfCapacity_kWh:    capacity_kWh * (cfg.halfCapacityThresholdPct / 100),
    nearCritical_kWh:    capacity_kWh * (cfg.nearCriticalThresholdPct / 100),
    lowCapacity_kWh:     capacity_kWh * ((cfg.nearCriticalThresholdPct - 5) / 100),
    critical_kWh:        capacity_kWh * (cfg.criticalThresholdPct / 100),
  };
}

// Exported so EnergyStorageResolver can expose CAPACITY_KWH with the default config.
export const STORAGE_CAPACITY_KWH = DEFAULT_CONFIG.storageCapacityMwh * 1_000;

// Reference for demand-forecast normalisation: 7 days at 10 °C outside temperature.
const FORECAST_REFERENCE_HOURS = 7 * 24;
const FORECAST_REFERENCE_TEMP  = 10; // °C

export function calculateChargeAmount(
  currentLevel_kWh: number,
  currentPrice: number,        // €/MWh
  historicalPrices: number[],
  cfg: ChargingConfig = DEFAULT_CONFIG,
  forecastDemandKwh?: number,  // expected heat demand for the next ~7 days (kWh)
): number {
  const { chargeAmount_kWh, maxStorageLevel_kWh, halfCapacity_kWh, nearCritical_kWh, lowCapacity_kWh, critical_kWh } =
    deriveThresholds(cfg);

  const freeCapacity_kWh = Math.max(0, maxStorageLevel_kWh - currentLevel_kWh);
  if (freeCapacity_kWh === 0) return 0;

  // Demand-forecast bias: if a cold week is ahead, treat the storage as if it
  // were proportionally lower so that stricter charging thresholds kick in earlier.
  let compareLevel = currentLevel_kWh;
  if (forecastDemandKwh !== undefined) {
    const referenceDemandKwh =
      CityDemandResolver.getDemandKw(FORECAST_REFERENCE_TEMP, cfg.residents) * FORECAST_REFERENCE_HOURS;
    if (referenceDemandKwh > 0) {
      const demandRatio = Math.min(2.0, Math.max(0.5, forecastDemandKwh / referenceDemandKwh));
      compareLevel = currentLevel_kWh / demandRatio;
    }
  }

  if (currentPrice <= 0) return Math.min(chargeAmount_kWh, freeCapacity_kWh);

  const prices = historicalPrices.filter((p) => p >= 0).sort((a, b) => a - b);

  if (prices.length === 0) {
    return compareLevel <= critical_kWh
      ? Math.min(chargeAmount_kWh, freeCapacity_kWh)
      : 0;
  }

  const l = prices.length;
  const P10    = prices[Math.floor(l * 0.10)];
  const P25    = prices[Math.floor(l * 0.25)];
  const median = prices[Math.floor(l * 0.50)];

  if (compareLevel <= critical_kWh) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (compareLevel <= nearCritical_kWh && currentPrice < median) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (compareLevel <= lowCapacity_kWh && currentPrice <= P25) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }
  if (compareLevel <= halfCapacity_kWh && currentPrice <= P10) {
    return Math.min(chargeAmount_kWh, freeCapacity_kWh);
  }

  return 0;
}

/**
 * Advances the storage by one time step dt (hours).
 * Demand is computed via CityDemandResolver — the same formula used to
 * pre-populate chartsData.hours[i].energyDemand at data-load time.
 */
export function updateStorage(
  currentLevel_kWh: number,
  tempOut: number,
  dt: number,
  residents: number = DEFAULT_CONFIG.residents,
): { newLevel: number; demandKwh: number } {
  const heatDemand_kWh = CityDemandResolver.getDemandKw(tempOut, residents) * dt;
  const standingLoss_kWh = currentLevel_kWh * STANDING_LOSS_RATE_PER_HOUR * dt;
  const newLevel = currentLevel_kWh - heatDemand_kWh - standingLoss_kWh;
  return { newLevel, demandKwh: heatDemand_kWh };
}
