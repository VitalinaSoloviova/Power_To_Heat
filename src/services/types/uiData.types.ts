/**
 * UI / resolver data types (chart & simulation outputs).
 */

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
