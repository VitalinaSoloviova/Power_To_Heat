import type {
  SimulationDemand,
  SimulationEnergy,
  SimulationStorage,
} from '@services/types';

export interface StorageInputs {
  /** Energy currently produced by renewables. */
  energy: SimulationEnergy;
  /** Current vs. expected demand. */
  demand: SimulationDemand;
  /** Storage state at the previous step. */
  previous: SimulationStorage;
  /** Length of the step in hours (1 for hourly, 24 for daily, …). */
  stepHours: number;
}

export interface StorageOutput {
  /** Updated storage state. */
  storage: SimulationStorage;
  /** Net energy flow into the storage in kWh. Positive = charging. */
  flow: number;
}

/**
 * Updates the storage level for one simulation step.
 *
 * The formula is intentionally simple and self-contained so it can be
 * swapped out with a domain-specific model later.
 *
 * TODO: replace the linear surplus/deficit model with the real
 *       efficiency-aware formula once the energy team provides it.
 */
export const stepStorage = ({
  energy,
  demand,
  previous,
  stepHours,
}: StorageInputs): StorageOutput => {
  // Use expected demand as a forecast hint: when the next hours are
  // expected to be heavier, reduce the current balance a bit to make
  // charging less aggressive / discharging more aggressive.
  const forecastBias = (demand.expected - demand.current) * 0.15;
  const balanceKw = energy.generated - demand.current - forecastBias;
  const flow = balanceKw * stepHours; // kWh
  const level = Math.min(
    previous.capacity,
    Math.max(0, previous.level + flow),
  );
  return {
    storage: { level, capacity: previous.capacity },
    flow,
  };
};

/** Returns the storage state as a fraction (0..1). */
export const storageFraction = (s: SimulationStorage): number =>
  s.capacity > 0 ? Math.min(1, Math.max(0, s.level / s.capacity)) : 0;
