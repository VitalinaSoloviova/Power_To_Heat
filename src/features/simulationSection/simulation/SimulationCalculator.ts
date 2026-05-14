import type { SimulationPoint } from '../simulationTypes';
import { SimulationConfig } from './SimulationConfig';

/**
 * Pure calculation service for the energy simulation.
 * Transforms a raw `SimulationPoint` into derived UI metrics
 * (energy, storage, flows, activity states).
 */
export class SimulationCalculator {
  /**
   * Get comprehensive simulation state for UI rendering.
   */
  static getSimulationState(point: SimulationPoint) {
    const energy = this.getEnergyMetrics(point);
    const storage = this.getStorageMetrics(point);
    const flows = this.getFlowMetrics(energy, storage);
    const activities = this.getActivityState(energy, storage);

    return {
      energy,
      storage,
      flows,
      activities,
      timestamp: point.timestamp,
      weather: point.weather,
    };
  }

  /**
   * Calculate energy generation and consumption metrics.
   */
  private static getEnergyMetrics(point: SimulationPoint) {
    const generatedKw = point.energy.generated;
    const demandKw = point.demand.current;
    const balance = generatedKw - demandKw;

    return {
      generated: generatedKw,
      demand: demandKw,
      balance,
      price: point.energy.price,
      expectedDemand: point.demand.expected,
    };
  }

  /**
   * Calculate storage-related metrics and state.
   */
  private static getStorageMetrics(point: SimulationPoint) {
    const level = point.storage.level;
    const capacity = point.storage.capacity;
    const fraction = capacity > 0 ? level / capacity : 0;
    const { empty, low, high, full } = SimulationConfig.THRESHOLDS.storage;

    return {
      level,
      capacity,
      fraction,
      percentage: Math.round(fraction * 100),
      isEmpty: fraction < empty,
      isLow: fraction < low,
      isMedium: fraction >= low && fraction < high,
      isHigh: fraction >= high,
      isFull: fraction > full,
    };
  }

  /**
   * Calculate energy flow directions and charging state.
   */
  private static getFlowMetrics(
    energy: ReturnType<typeof SimulationCalculator.getEnergyMetrics>,
    storage: ReturnType<typeof SimulationCalculator.getStorageMetrics>
  ) {
    const { balance } = energy;
    const { isEmpty } = storage;
    const { chargeThreshold, dischargeThreshold } = SimulationConfig.THRESHOLDS;

    const isCharging = balance > chargeThreshold;
    const isDischarging = balance < dischargeThreshold && !isEmpty;
    const isIdle = !isCharging && !isDischarging;

    return {
      isCharging,
      isDischarging,
      isIdle,
      chargingPower: isCharging ? balance : 0,
      dischargingPower: isDischarging ? Math.abs(balance) : 0,
      flowDirection: isCharging ? 'to-storage' as const :
                     isDischarging ? 'from-storage' as const :
                     'balanced' as const,
    };
  }

  /**
   * Calculate visual activity states for production and consumption.
   */
  private static getActivityState(
    energy: ReturnType<typeof SimulationCalculator.getEnergyMetrics>,
    storage: ReturnType<typeof SimulationCalculator.getStorageMetrics>
  ) {
    const { generated, demand } = energy;
    const { isEmpty } = storage;
    const { activityThreshold, maxIntensityKw } = SimulationConfig.THRESHOLDS;

    const productionIntensity = Math.min(1, generated / maxIntensityKw);
    const productionActive = generated > activityThreshold;

    const consumptionIntensity = Math.min(1, demand / maxIntensityKw);
    const consumptionActive = demand > activityThreshold && (!isEmpty || generated > 0);

    return {
      production: {
        intensity: productionIntensity,
        active: productionActive,
        level: this.getIntensityLevel(productionIntensity),
      },
      consumption: {
        intensity: consumptionIntensity,
        active: consumptionActive,
        level: this.getIntensityLevel(consumptionIntensity),
      },
    };
  }

  /**
   * Convert numeric intensity to descriptive level.
   */
  private static getIntensityLevel(intensity: number): 'low' | 'medium' | 'high' {
    const { low, medium } = SimulationConfig.THRESHOLDS.intensity;
    if (intensity < low) return 'low';
    if (intensity < medium) return 'medium';
    return 'high';
  }
}
