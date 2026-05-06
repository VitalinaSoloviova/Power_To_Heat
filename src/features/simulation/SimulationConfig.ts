/**
 * Static configuration for the simulation feature.
 * Holds thresholds and color recommendations used by the calculator
 * and the UI components.
 */
export class SimulationConfig {
  /** Schwellwerte als Single Source of Truth für alle Berechnungen. */
  static readonly THRESHOLDS = {
    chargeThreshold: 20,        // kW surplus to start charging
    dischargeThreshold: -20,    // kW deficit to start discharging
    activityThreshold: 30,      // kW minimum for "active" state
    maxIntensityKw: 800,        // kW for 100% intensity calculation
    storage: {
      empty: 0.02,              // 2% considered "empty"
      sparks: 0.1,              // 10% minimum for rising spark particles
      low: 0.15,                // 15% considered "low"
      high: 0.7,                // 70% considered "high"
      full: 0.95,               // 95% considered "full"
    },
    intensity: {
      low: 0.3,                 // < 30% = low
      medium: 0.7,              // < 70% = medium, sonst high
    },
  } as const;

  /** Color recommendations for energy flows and storage levels. */
  static readonly FLOW_COLORS = {
    production: '#16a34a',      // green for generation
    consumption: '#0ea5e9',     // blue for consumption
    charging: '#22c55e',        // bright green for charging
    discharging: '#ef4444',     // red for discharging
    storage: {
      low: '#fde047',           // yellow
      medium: '#f472b6',        // pink
      high: '#a855f7',          // violet
      full: '#ef4444',          // red
    },
  } as const;

  /** Convenience accessor (matches the previous service API). */
  static getThresholds() {
    return this.THRESHOLDS;
  }

  /** Convenience accessor (matches the previous service API). */
  static getFlowColors() {
    return this.FLOW_COLORS;
  }
}
