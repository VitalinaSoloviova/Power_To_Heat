import { SimulationUIService, type SimulationData, type SimulationInput } from './SimulationUIService';
import { ChartUIService } from './ChartUIService';
import type { UIData, ChartData } from '@services/types/SimulationTypes';

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