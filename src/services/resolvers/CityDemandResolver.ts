import type { CityProfile } from '@calculations/CityData';

export class CityDemandResolver {
    /**
     * Calculates the heating energy demand in kW for a given outside temperature.
     * Demand is positive only when outside temperature is below the target indoor
     * temperature; it scales linearly with the temperature difference.
     */
    static calculate(outsideTemp: number, city: CityProfile): number {
        return Math.max(
            0,
            city.clients * city.energyDemandPerPerson * (city.targetInsideTemp - outsideTemp),
        );
    }
}
