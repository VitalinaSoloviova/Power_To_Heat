/**
 * Shared types for the UI data layer.
 * All inputs and outputs of the UIService and its sub-services live here.
 */

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

export interface WeatherData {
  temperature: number;   // °C
  windSpeed: number;     // m/s
  cloudCoverage: number; // 0..1
}

// ---------------------------------------------------------------------------
// Per-hour outputs of the resolvers
// ---------------------------------------------------------------------------

export interface PowerGenerationPoint {
  hour: number;
  timestamp: string;
  windPower: number;       // kW
  solarPower: number;      // kW
  totalGenerated: number;  // kW
}

export interface CityDemandPoint {
  hour: number;
  timestamp: string;
  demand: number;          // kW
}

export interface EnergyStoragePoint {
  hour: number;
  timestamp: string;
  storageLevel: number;    // kWh after this hour
  chargedEnergy: number;   // kWh added this hour
  consumedEnergy: number;  // kWh drawn this hour
}

export interface ChartSeriesPoint {
  hour: number;
  timestamp: string;
  generation: number;
  demand: number;
  storageLevel: number;
}

export interface ChartData {
  /** Pre-formatted x-axis labels (e.g. "00:00", "01:00"). */
  xLabels: string[];
  /** Combined chart series ready for line/area charts. */
  series: ChartSeriesPoint[];
}

export interface UIData {
  simulationData: SimulationData;
  chartData: ChartData;
}
