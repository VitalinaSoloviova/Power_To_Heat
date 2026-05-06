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
  constructor(
    private readonly powerResolver = new PowerGenerationResolver(),
    private readonly demandResolver = new CityDemandResolver(),
    private readonly storageResolver = new EnergyStorageResolver(),
  ) {}

  public getSimulationData(input: SimulationInput): SimulationData {
    const generation = this.powerResolver.resolve(input);
    const demand = this.demandResolver.resolve(input);
    const storage = this.storageResolver.resolve(input, generation, demand);

    return { generation, demand, storage };
  }
}
