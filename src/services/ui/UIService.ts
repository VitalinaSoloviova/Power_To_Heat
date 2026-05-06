import type { SimulationInput, UIData } from '../types/SimulationTypes';
import { SimulationUIService } from './SimulationUIService';
import { ChartUIService } from './ChartUIService';

/**
 * Top-level UI service. Single entry point for the UI layer to
 * fetch every piece of data it needs in one call.
 */
export class UIService {
  constructor(
    private readonly simulationService = new SimulationUIService(),
    private readonly chartService = new ChartUIService(),
  ) {}

  public getUIData(input: SimulationInput): UIData {
    const simulationData = this.simulationService.getSimulationData(input);
    const chartData = this.chartService.getChartData(simulationData);

    return { simulationData, chartData };
  }
}
