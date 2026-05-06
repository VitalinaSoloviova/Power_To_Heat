import type {
  ChartData,
} from '../types/SimulationTypes';

import { ChartDataResolver } from '../resolvers/ChartDataResolver';
import type { SimulationData } from './SimulationUIService';

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