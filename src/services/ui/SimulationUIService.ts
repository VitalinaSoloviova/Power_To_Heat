import type {
  SimulationData,
  SimulationInput,
} from '../types/SimulationTypes';

import { PowerGenerationResolver } from '../resolvers/PowerGenerationResolver';
import { CityDemandResolver } from '../resolvers/CityDemandResolver';
import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';

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