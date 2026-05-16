import type { DataResolver, Granularity } from '@calculations/DataResolver';
import {
	ChartUIService,
	type ChartsData,
	type HistoryYears,
} from './ChartUIService';
import {
	SimulationUIService,
	type SimulationSeriesInput,
	type SimulationSeriesData,
} from './SimulationUIService';

/**
 * Single public-facing UI service. Orchestrates chart data loading and
 * pure simulation-series computation.
 *
 * Contract:
 *  - `getChartsData()` — async, may hit the network (deduplicated/cached
 *    by `ChartUIService`).
 *  - `computeSimulationSeries()` — pure, synchronous. Does NOT fetch.
 *    Call this on every storage-slider change without fear of refetches.
 */
export class UIService {
	private readonly chartUIService: ChartUIService;
	private readonly simulationUIService: SimulationUIService;

	constructor(
		dataResolver: DataResolver,
		chartUIService = new ChartUIService(dataResolver),
		simulationUIService = new SimulationUIService(),
	) {
		this.chartUIService = chartUIService;
		this.simulationUIService = simulationUIService;
	}

	public getChartsData(
		historyYears: HistoryYears,
		granularity: Granularity = 'daily',
		startDate?: Date,
	): Promise<ChartsData> {
		return this.chartUIService.getChartsData(historyYears, granularity, startDate);
	}

	public computeSimulationSeries(input: SimulationSeriesInput): SimulationSeriesData {
		return this.simulationUIService.getSimulationSeries(input);
	}
}
