import type { DataResolver, Granularity } from '@calculations/DataResolver';
import type { UIData, ChartData, SimulationInput, SimulationRange } from '../types';
import {
	ChartUIService,
	type ChartsData,
	type HistoryYears,
} from './ChartUIService';
import {
	SimulationUIService,
	type SimulationData,
	type SimulationSeriesInput,
	type SimulationSeriesData,
} from './SimulationUIService';

export interface SimulationSeriesRequest {
	range: SimulationRange;
	startDay: Date;
	initialStoragePercent: number;
	historyYears: HistoryYears;
}

export class UIService {
	private readonly simulationUIService: SimulationUIService;
	private readonly chartUIService: ChartUIService;

	constructor(
		dataResolver: DataResolver,
		simulationUIService = new SimulationUIService(),
		chartUIService = new ChartUIService(dataResolver),
	) {
		this.simulationUIService = simulationUIService;
		this.chartUIService = chartUIService;
	}

	public getUIData(input: SimulationInput): UIData {
		const simulationData: SimulationData = this.simulationUIService.getSimulationData(input);
		const chartData: ChartData = this.chartUIService.getChartData(simulationData);
		return { simulationData, chartData };
	}

	public getChartsData(
		historyYears: HistoryYears,
		granularity: Granularity = 'daily',
		startDate?: Date,
	): Promise<ChartsData> {
		return this.chartUIService.getChartsData(historyYears, granularity, startDate);
	}

	public async getSimulationSeries(request: SimulationSeriesRequest): Promise<SimulationSeriesData> {
		const granularity = request.range === 'month' ? 'daily' : 'hourly';
		const chartsData = await this.chartUIService.getChartsData(
			request.historyYears,
			granularity,
			request.startDay,
		);

		return this.simulationUIService.getSimulationSeries({
			chartsData,
			range: request.range,
			initialStoragePercent: request.initialStoragePercent,
		});
	}

	public getSimulationSeriesFromCharts(input: SimulationSeriesInput): SimulationSeriesData {
		return this.simulationUIService.getSimulationSeries(input);
	}
}
