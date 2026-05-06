import type {
  ChartData,
  SimulationData,
} from '../types/SimulationTypes';

import { ChartDataResolver } from '../resolvers/ChartDataResolver';

/**
 * Orchestrates chart-related resolvers and returns chart-ready data.
 */
export class ChartUIService {
  private readonly chartResolver: ChartDataResolver;

  constructor(
    chartResolver = new ChartDataResolver(),
  ) {
    this.chartResolver = chartResolver;
  }

  public getChartData(
    simulation: SimulationData,
  ): ChartData {
    return this.chartResolver.resolve(simulation);
  }
}