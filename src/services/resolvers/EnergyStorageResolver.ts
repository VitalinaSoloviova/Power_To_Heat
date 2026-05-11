import type {
  CityDemandPoint,
  EnergyStoragePoint,
  PowerGenerationPoint,
  SimulationInput,
} from '../types/SimulationTypes';

/**
 * Produces mocked hourly storage state by walking through generation
 * and demand and accumulating the battery level. Will later be driven
 * by a slider — values are still computed per hour so the UI can scrub.
 */
export class EnergyStorageResolver {
  // 2 x 10 MW Sand Batteries = 20 MW / 20,000 kWh capacity.
  private static readonly CAPACITY_KWH = 20_000;

  public resolve(
    input: SimulationInput,
    generation: PowerGenerationPoint[],
    demand: CityDemandPoint[],
  ): EnergyStoragePoint[] {
    const points: EnergyStoragePoint[] = [];
    let level = input.currentStorage;

    const length = Math.min(generation.length, demand.length);
    for (let h = 0; h < length; h++) {
      const gen = generation[h];
      const dem = demand[h];
      const balance = gen.totalGenerated - dem.demand; // kWh per hour (1h step)

      let chargedEnergy = 0;
      let consumedEnergy = 0;

      if (balance >= 0) {
        chargedEnergy = Math.min(balance, EnergyStorageResolver.CAPACITY_KWH - level);
        level += chargedEnergy;
      } else {
        consumedEnergy = Math.min(-balance, level);
        level -= consumedEnergy;
      }

      points.push({
        hour: h,
        timestamp: gen.timestamp,
        storageLevel: level,
        chargedEnergy,
        consumedEnergy,
      });
    }

    return points;
  }
}
