


import { PowerGenerationResolver } from '../resolvers/PowerGenerationResolver';
import { CityDemandResolver } from '../resolvers/CityDemandResolver';
import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';
import type { CityDemandPoint, EnergyStoragePoint, PowerGenerationPoint, WeatherData } from '@services/types/SimulationTypes';

export interface SimulationInput {
  weather: WeatherData;
  windTurbineCount: number; // ???
  solarPanelCount: number;  // ???
  currentStorage: number;   // kWh currently stored
  cityPopulation: number;
  forecastHours: number;    // how many hourly points to produce
}

export interface SimulationData {
  generation: PowerGenerationPoint[];
  demand: CityDemandPoint[];
  storage: EnergyStoragePoint[];
}

/**
 * Orchestrates the simulation-related resolvers and returns a single
 * SimulationData object containing generation, demand and storage series.
 */
export class SimulationUIService {
  private readonly powerResolver: PowerGenerationResolver;
  private readonly demandResolver: CityDemandResolver;
  private readonly storageResolver: EnergyStorageResolver;

  constructor(
    powerResolver = new PowerGenerationResolver(),
    demandResolver = new CityDemandResolver(),
    storageResolver = new EnergyStorageResolver(),
  ) {
    this.powerResolver = powerResolver;
    this.demandResolver = demandResolver;
    this.storageResolver = storageResolver;
  }

  public getSimulationData(input: SimulationInput): SimulationData {
    const generation = this.powerResolver.resolve(input);
    const demand = this.demandResolver.resolve(input);
    const storage = this.storageResolver.resolve(
      input,
      generation,
      demand,
    );

    return {
      generation,
      demand,
      storage,
    };
  }
}