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
