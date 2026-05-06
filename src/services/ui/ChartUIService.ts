import type { ChartData, SimulationData } from '../types/SimulationTypes';
import { ChartDataResolver } from '../resolvers/ChartDataResolver';

/**
 * Orchestrates chart-related resolvers and returns chart-ready data.
 */
export class ChartUIService {
  constructor(private readonly chartResolver = new ChartDataResolver()) {}

  public getChartData(simulation: SimulationData): ChartData {
    return this.chartResolver.resolve(simulation);
  }
}
