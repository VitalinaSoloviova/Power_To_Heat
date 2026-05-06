import type {
  CityDemandPoint,
  SimulationInput,
} from '../types/SimulationTypes';

/**
 * Produces mocked hourly city energy demand.
 * Demand grows for both very low and very high temperatures
 * (heating / cooling) and follows a simple daily usage pattern.
 */
export class CityDemandResolver {
  // Base per-capita load and comfort temperature.
  private static readonly BASE_DEMAND_KW_PER_PERSON = 0.5;
  private static readonly COMFORT_TEMP = 20;

  public resolve(input: SimulationInput): CityDemandPoint[] {
    const { cityPopulation, weather, forecastHours } = input;
    const points: CityDemandPoint[] = [];
    const start = new Date();
    start.setMinutes(0, 0, 0);

    for (let h = 0; h < forecastHours; h++) {
      const ts = new Date(start);
      ts.setHours(start.getHours() + h);
      const demand = this.calculateDemand(
        cityPopulation,
        weather.temperature,
        ts.getHours(),
      );
      points.push({
        hour: h,
        timestamp: ts.toISOString(),
        demand,
      });
    }

    return points;
  }

  private calculateDemand(population: number, temp: number, hour: number): number {
    // Heating/cooling load grows quadratically away from comfort temperature.
    const tempDelta = Math.abs(temp - CityDemandResolver.COMFORT_TEMP);
    const climateFactor = 1 + (tempDelta * tempDelta) / 200;

    // Day pattern: morning + evening peaks, low at night.
    const dayFactor =
      0.6 +
      0.4 * Math.max(
        Math.sin(((hour - 6) / 12) * Math.PI),       // daytime peak
        0.5 * Math.sin(((hour - 18) / 6) * Math.PI), // evening peak
      );

    return (
      population *
      CityDemandResolver.BASE_DEMAND_KW_PER_PERSON *
      climateFactor *
      Math.max(0.3, dayFactor)
    );
  }
}
