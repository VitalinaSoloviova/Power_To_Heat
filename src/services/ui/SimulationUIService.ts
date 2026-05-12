// TODO: this service is currently unused and has been commented out
// because CityDemandResolver was refactored (resolve() → static calculate()).
// Re-enable once the simulation UI service layer is wired up.

// import { PowerGenerationResolver } from '../resolvers/PowerGenerationResolver';
// import { CityDemandResolver } from '../resolvers/CityDemandResolver';
// import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';
// import type {
//   SimulationData,
//   SimulationInput,
// } from '../types/SimulationTypes';

// export type { SimulationData, SimulationInput };

// export class SimulationUIService {
//   private readonly powerResolver: PowerGenerationResolver;
//   private readonly demandResolver: CityDemandResolver;
//   private readonly storageResolver: EnergyStorageResolver;

//   constructor(
//     powerResolver = new PowerGenerationResolver(),
//     demandResolver = new CityDemandResolver(),
//     storageResolver = new EnergyStorageResolver(),
//   ) {
//     this.powerResolver = powerResolver;
//     this.demandResolver = demandResolver;
//     this.storageResolver = storageResolver;
//   }

//   public getSimulationData(input: SimulationInput): SimulationData {
//     const generation = this.powerResolver.resolve(input);
//     const demand = this.demandResolver.resolve(input);
//     const storage = this.storageResolver.resolve(input, generation, demand);
//     return { generation, demand, storage };
//   }
// }
