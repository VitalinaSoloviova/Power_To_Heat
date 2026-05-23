const PERSONS_PER_HOUSEHOLD = 2.2;      // avg German household size (Destatis)
const DISTRICT_HEATING_SHARE = 0.15;    // 15 % of households on district heating (Ramboll, 2025)
const H_TAVG_KW_PER_K = 0.1265;        // avg transmission heat-loss coefficient kW/K (Höttges, 2020)
const TEMP_IN = 20;                     // target indoor temperature °C

/**
 * Single source of truth for city-level heat demand.
 *
 * All demand figures — chart data, storage simulation, and forecast —
 * are derived from this one method. The result (kW) is written into
 * chartsData.hours[i].energyDemand once at data-load time; downstream
 * code reads from that array rather than calling this directly.
 */
export class CityDemandResolver {
  /**
   * Heat demand power for a given outside temperature and population.
   * Returns kW (= kWh per hour). Zero when tempOut >= TEMP_IN.
   */
  static getDemandKw(tempOut: number, residents: number): number {
    const households = (residents / PERSONS_PER_HOUSEHOLD) * DISTRICT_HEATING_SHARE;
    return households * H_TAVG_KW_PER_K * Math.max(0, TEMP_IN - tempOut);
  }
}
