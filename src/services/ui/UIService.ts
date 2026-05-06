import type {
  SimulationInput,
  UIData,
  SimulationData,
  ChartData,
} from '../types/SimulationTypes';

import { SimulationUIService } from './SimulationUIService';
import { ChartUIService } from './ChartUIService';

export class UIService {
  private readonly simulationUIService: SimulationUIService;
  private readonly chartUIService: ChartUIService;

  constructor(
    simulationUIService = new SimulationUIService(),
    chartUIService = new ChartUIService(),
  ) {
    this.simulationUIService = simulationUIService;
    this.chartUIService = chartUIService;
  }

  public getUIData(input: SimulationInput): UIData {
    const simulationData: SimulationData =
      this.simulationUIService.getSimulationData(input);

    const chartData: ChartData =
      this.chartUIService.getChartData(simulationData);

    return {
      simulationData,
      chartData,
    };
  }
}