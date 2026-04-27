// src/calculations/energyDemand.ts
import type { CityProfile } from "./CityData";

/**
 * Returns estimated hourly demand in kilowatts for the whole city.
 * If outsideTemp >= targetInsideTemp => demand = 0
 */
export function getEnergyDemand(outsideTemp: number, city: CityProfile): number {
  return Math.max(
    0,
    city.clients * city.energyDemandPerPerson * (city.targetInsideTemp - outsideTemp)
  );
}
