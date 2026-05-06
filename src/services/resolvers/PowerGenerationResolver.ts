import type {
  PowerGenerationPoint,
  SimulationInput,
} from '../types/SimulationTypes';

/**
 * Produces mocked hourly power-generation data based on weather and the
 * number of wind turbines / solar panels.
 *
 * NOTE: Formulas are intentionally simple but plausible. Replace with a
 * real physical model or backend call later.
 */
export class PowerGenerationResolver {
  // Nominal output assumptions (per unit) — tweak when real specs are known.
  private static readonly TURBINE_RATED_KW = 50;
  private static readonly PANEL_RATED_KW = 0.4;

  public resolve(input: SimulationInput): PowerGenerationPoint[] {
    const { weather, windTurbineCount, solarPanelCount, forecastHours } = input;
    const points: PowerGenerationPoint[] = [];
    const start = new Date();
    start.setMinutes(0, 0, 0);

    for (let h = 0; h < forecastHours; h++) {
      const ts = new Date(start);
      ts.setHours(start.getHours() + h);

      const windPower = this.calculateWindPower(weather.windSpeed, windTurbineCount);
      const solarPower = this.calculateSolarPower(
        weather.cloudCoverage,
        solarPanelCount,
        ts.getHours(),
      );

      points.push({
        hour: h,
        timestamp: ts.toISOString(),
        windPower,
        solarPower,
        totalGenerated: windPower + solarPower,
      });
    }

    return points;
  }

  /** Mocked wind power — scales with windSpeed up to ~12 m/s, then plateaus. */
  private calculateWindPower(windSpeed: number, count: number): number {
    if (windSpeed < 3) return 0; // cut-in speed
    const efficiency = Math.min(1, (windSpeed - 3) / 9);
    return count * PowerGenerationResolver.TURBINE_RATED_KW * efficiency;
  }

  /** Mocked solar power — sun curve attenuated by cloud coverage. */
  private calculateSolarPower(cloudCoverage: number, count: number, hour: number): number {
    // Daylight curve, 0 at night, peak at noon.
    const sunIntensity = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
    const cloudFactor = 1 - Math.min(1, Math.max(0, cloudCoverage)) * 0.7;
    return count * PowerGenerationResolver.PANEL_RATED_KW * sunIntensity * cloudFactor;
  }
}
