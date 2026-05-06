// Shared types for the simulation feature.
// Keeping these in one place makes the islands, slider and calculation
// utilities easy to extend without coupling them to a specific data source.

import type { WeatherCondition } from "@services/CurrentWeatherService";

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
// These let SimulationComponent / SimulationControls / SimulationSlider /
// SimulationButton share a single, named contract instead of forwarding
// 8–12 individual props through every layer.
// ---------------------------------------------------------------------------

/** Play / pause + speed selection for the auto-simulation loop. */
export interface PlaybackControl {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (multiplier: number) => void;
}

/** Time-range selection and current frame index of the simulation slider. */
export interface TimelineControl {
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
  index: number;
  onIndexChange: (i: number) => void;
  series: SimulationPoint[];
}

/** Storage level slider (battery start-of-day percentage). */
export interface StorageControl {
  currentStoragePercent: number;
  onStorageChange: (val: number) => void;
}
