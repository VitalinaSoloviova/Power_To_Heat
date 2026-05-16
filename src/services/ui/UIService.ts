import type { DataResolver, Granularity } from '@calculations/DataResolver';
import type { Location } from '@services/LocationService';
import type {
	CurrentEnergyPrice,
	CurrentEnergyPriceService,
	EnergyPriceWindowEntry,
} from '@features/topRow/currentData/CurrentEnergyPriceService';
import type { CurrentWeather } from '@features/topRow/currentData/CurrentWeatherService';
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

export type PeriodTag = 'past' | 'current' | 'future';

export interface PriceGraphPoint {
	timestamp: number;
	priceCtKwh: number;
	period: PeriodTag;
}

interface CurrentWeatherService {
	getCurrent(location: Location): Promise<CurrentWeather>;
}

interface UIServiceOptions {
	chartUIService?: ChartUIService;
	simulationUIService?: SimulationUIService;
	currentEnergyPriceService: CurrentEnergyPriceService;
	currentWeatherService: CurrentWeatherService;
}

export interface ChartUIDataInput {
	historyYears: HistoryYears;
	granularity?: Granularity;
	startDate?: Date;
}

export interface SimulationUIDataInput {
	range: SimulationSeriesInput['range'];
	startDate: Date;
	initialStoragePercent: number;
	historyYears: HistoryYears;
}

const ENERGY_PRICE_REFRESH_MS = 5 * 60 * 1000;
const WEATHER_REFRESH_MS = 10 * 60 * 1000;

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
	private readonly currentEnergyPriceService: CurrentEnergyPriceService;
	private readonly currentWeatherService: CurrentWeatherService;
	private readonly chartDataCache = new Map<string, Promise<ChartsData>>();
	private readonly simulationDataCache = new Map<string, Promise<SimulationSeriesData>>();
	private readonly energyPriceCache = new Map<string, Promise<CurrentEnergyPrice>>();
	private readonly energyPriceWindowCache = new Map<string, Promise<PriceGraphPoint[]>>();
	private readonly currentWeatherCache = new Map<string, Promise<CurrentWeather>>();

	constructor(
		dataResolver: DataResolver,
		options: UIServiceOptions,
	) {
		this.chartUIService = options.chartUIService ?? new ChartUIService(dataResolver);
		this.simulationUIService = options.simulationUIService ?? new SimulationUIService();
		this.currentEnergyPriceService = options.currentEnergyPriceService;
		this.currentWeatherService = options.currentWeatherService;
	}

	public getChartUIData(input: ChartUIDataInput): Promise<ChartsData> {
		const normalizedInput = {
			...input,
			granularity: input.granularity ?? 'daily',
		};
		const cacheKey = this.buildChartCacheKey(normalizedInput);
		return this.getOrCreate(this.chartDataCache, cacheKey, () =>
			this.chartUIService.getChartsData(
				normalizedInput.historyYears,
				normalizedInput.granularity,
				normalizedInput.startDate,
			),
		);
	}

	public getChartsData(
		historyYears: HistoryYears,
		granularity: Granularity = 'daily',
		startDate?: Date,
	): Promise<ChartsData> {
		return this.getChartUIData({ historyYears, granularity, startDate });
	}

	public getSimulationUIData(input: SimulationUIDataInput): Promise<SimulationSeriesData> {
		const cacheKey = this.buildSimulationCacheKey(input);
		return this.getOrCreate(this.simulationDataCache, cacheKey, async () => {
			const granularity = input.range === 'month' ? 'daily' : 'hourly';
			const chartsData = await this.getChartUIData({
				historyYears: input.historyYears,
				granularity,
				startDate: input.startDate,
			});

			return this.simulationUIService.getSimulationSeries({
				chartsData,
				range: input.range,
				initialStoragePercent: input.initialStoragePercent,
			});
		});
	}

	public computeSimulationSeries(input: SimulationSeriesInput): SimulationSeriesData {
		const result = this.simulationUIService.getSimulationSeries(input);
		this.simulationDataCache.set(this.buildSimulationSeriesCacheKey(input), Promise.resolve(result));
		return result;
	}

	public getCurrentEnergyPrice(): Promise<CurrentEnergyPrice> {
		const cacheKey = this.buildTimeBucketKey('current-price', ENERGY_PRICE_REFRESH_MS);
		return this.getOrCreate(this.energyPriceCache, cacheKey, () =>
			this.currentEnergyPriceService.getCurrent(),
		);
	}

	public getEnergyPricesAroundNow(): Promise<PriceGraphPoint[]> {
		const cacheKey = this.buildTimeBucketKey('price-window', ENERGY_PRICE_REFRESH_MS);
		return this.getOrCreate(this.energyPriceWindowCache, cacheKey, async () => {
			const entries = await this.currentEnergyPriceService.getPriceWindow();
			return this.buildPriceGraphPoints(entries);
		});
	}

	public getCurrentWeather(location: Location): Promise<CurrentWeather> {
		const cacheKey = [
			'current-weather',
			location.latitude,
			location.longitude,
			Math.floor(Date.now() / WEATHER_REFRESH_MS),
		].join('|');

		return this.getOrCreate(this.currentWeatherCache, cacheKey, () =>
			this.currentWeatherService.getCurrent(location),
		);
	}

	private getOrCreate<T>(
		cache: Map<string, Promise<T>>,
		cacheKey: string,
		load: () => Promise<T>,
	): Promise<T> {
		const cached = cache.get(cacheKey);
		if (cached) return cached;

		const request = load().catch((error) => {
			cache.delete(cacheKey);
			throw error;
		});
		cache.set(cacheKey, request);
		return request;
	}

	private buildChartCacheKey(input: Required<Pick<ChartUIDataInput, 'historyYears' | 'granularity'>> & Pick<ChartUIDataInput, 'startDate'>): string {
		return [
			'charts',
			input.historyYears,
			input.granularity,
			this.toUtcDayTimestamp(input.startDate),
		].join('|');
	}

	private buildSimulationCacheKey(input: SimulationUIDataInput): string {
		return [
			'simulation',
			input.range,
			input.historyYears,
			this.toUtcDayTimestamp(input.startDate),
			input.initialStoragePercent,
		].join('|');
	}

	private buildSimulationSeriesCacheKey(input: SimulationSeriesInput): string {
		return [
			'simulation-series',
			input.range,
			input.chartsData.period.historyYears,
			input.chartsData.granularity,
			input.chartsData.period.start.getTime(),
			input.initialStoragePercent,
		].join('|');
	}

	private buildTimeBucketKey(prefix: string, refreshMs: number): string {
		return `${prefix}|${Math.floor(Date.now() / refreshMs)}`;
	}

	private toUtcDayTimestamp(date?: Date): number {
		const source = date ? new Date(date) : new Date();
		source.setUTCHours(0, 0, 0, 0);
		return source.getTime();
	}

	private buildPriceGraphPoints(entries: EnergyPriceWindowEntry[]): PriceGraphPoint[] {
		const now = Date.now();
		const rangeStart = now - 24 * 60 * 60 * 1000;
		const rangeEnd = now + 24 * 60 * 60 * 1000;

		return entries
			.filter((entry) => entry.startTimestamp >= rangeStart)
			.filter((entry) => entry.startTimestamp <= rangeEnd + 60 * 60 * 1000)
			.sort((a, b) => a.startTimestamp - b.startTimestamp)
			.map((entry) => {
				const timestamp = entry.startTimestamp;
				const priceCtKwh = Number((entry.marketPrice / 10).toFixed(2));
				const period: PeriodTag = timestamp + 60 * 60 * 1000 <= now
					? 'past'
					: timestamp <= now && now < timestamp + 60 * 60 * 1000
						? 'current'
						: 'future';

				return { timestamp, priceCtKwh, period };
			});
	}
}
