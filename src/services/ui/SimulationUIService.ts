// TODO: this service is currently unused and has been commented out
// because CityDemandResolver was refactored (resolve() → static calculate()).
// Re-enable once the simulation UI service layer is wired up.

// import { CityDemandResolver } from '../resolvers/CityDemandResolver';
// import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';
// import type {
//   SimulationData,
//   SimulationInput,
// } from '../types/SimulationTypes';

// export type { SimulationData, SimulationInput };

// export class SimulationUIService {
//   private readonly demandResolver: CityDemandResolver;
//   private readonly storageResolver: EnergyStorageResolver;

//   constructor(
//     demandResolver = new CityDemandResolver(),
//     storageResolver = new EnergyStorageResolver(),
//   ) {
//     this.demandResolver = demandResolver;
//     this.storageResolver = storageResolver;
//   }

//   public getSimulationData(input: SimulationInput): SimulationData {
//     const demand = this.demandResolver.resolve(input);
//     const storage = this.storageResolver.resolve(input, demand);
//     return { demand, storage };
//   }
// }
