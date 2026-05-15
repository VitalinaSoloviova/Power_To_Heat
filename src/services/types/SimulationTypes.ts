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

export interface SimulationInput {
  weather: WeatherData;
  windTurbineCount: number;
  solarPanelCount: number;
  currentStorage: number;   // kWh currently stored
  cityPopulation: number;
  forecastHours: number;    // how many hourly points to produce
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

// ---------------------------------------------------------------------------
// Aggregated simulation + chart outputs
// ---------------------------------------------------------------------------

export interface SimulationData {
  generation: PowerGenerationPoint[];
  demand: CityDemandPoint[];
  storage: EnergyStoragePoint[];
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

  // ---------------------------------------------------------------------------
  // Simulation feature types (migrated from features/simulationSection)
  // ---------------------------------------------------------------------------

  import type { WeatherCondition } from "../currentData/CurrentWeatherService";
  import type { HistoryYears } from "@services/UIService";

  export type SimulationRange = 'day' | 'week' | 'month';

  export interface SimulationWeather {
    temperature: number;        // °C
    condition: WeatherCondition;
    cloudCoverage?: number;     // 0..1
    windSpeed?: number;         // m/s
  }

  export interface SimulationEnergy {
    generated: number;          // kW (renewable output at this timestamp)
    price: number;              // €/MWh
  }

  export interface SimulationDemand {
    current: number;            // kW
    expected: number;           // kW (forecast / reference)
  }

  export interface SimulationStorage {
    level: number;              // kWh currently stored
    capacity: number;           // kWh maximum
  }

  export interface SimulationPoint {
    timestamp: string;          // ISO timestamp
    weather: SimulationWeather;
    energy: SimulationEnergy;
    demand: SimulationDemand;
    storage: SimulationStorage;
  }

  /** Convenience aggregate consumed by the islands. */
  export interface SimulationFrame {
    point: SimulationPoint;
    index: number;
    total: number;
    range: SimulationRange;
  }

  // ---------------------------------------------------------------------------
  // Shared control prop groups for the simulation UI.
  // ---------------------------------------------------------------------------

  export interface PlaybackControl {
    isPlaying: boolean;
    onTogglePlay: () => void;
    speedMultiplier: number;
    onSpeedMultiplierChange: (multiplier: number) => void;
  }

  export interface TimelineControl {
    range: SimulationRange;
    onRangeChange: (r: SimulationRange) => void;
    index: number;
    onIndexChange: (i: number) => void;
    series: SimulationPoint[];
  }

  export interface StorageControl {
    currentStoragePercent: number;
    onStorageChange: (val: number) => void;
  }

  export interface ReplayParams {
    startDay: Date;
    range: SimulationRange;
    storageLevel: number;
    historyYears: HistoryYears;
  }
