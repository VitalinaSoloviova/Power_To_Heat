import type { DataCoverage } from '../DataCoverageCalculator';
import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';
import type { SimulationPoint, SimulationRange } from '../types';
import type { ChartsData } from './ChartUIService';
import type { ChargingConfig } from '@features/simulationSection/simulation/P2HChargingLogic';

const POINTS_PER_RANGE: Record<SimulationRange, number> = {
	day: 24,
	week: 7 * 24,
	month: 30,
};

const STEP_HOURS: Record<SimulationRange, number> = {
	day: 1,
	week: 1,
	month: 24,
};

export interface SimulationSeriesInput {
	chartsData: ChartsData;
	range: SimulationRange;
	initialStoragePercent: number;
	chargingConfig?: ChargingConfig;
	emergencyBuyEnabled?: boolean;
	priceHistoryDays?: number;
}

export interface SimulationSeriesData {
	series: SimulationPoint[];
	dataYears: DataCoverage;
}

export class SimulationUIService {
	public getSimulationSeries(input: SimulationSeriesInput): SimulationSeriesData {
		const {
			chartsData, range, initialStoragePercent,
			chargingConfig, emergencyBuyEnabled = true, priceHistoryDays,
		} = input;

		const targetCount = POINTS_PER_RANGE[range];
		const stepHours = STEP_HOURS[range];

		// Capacity from config (if provided) or default
		const capacityKwh = chargingConfig
			? chargingConfig.storageCapacityMwh * 1_000 * 0.9
			: EnergyStorageResolver.CAPACITY_KWH;

		const clampedInitialStoragePercent = Math.min(100, Math.max(0, initialStoragePercent));
		let level = capacityKwh * (clampedInitialStoragePercent / 100);

		// Limit historical prices to requested number of days (each day = 24 price points)
		const maxHistoricalPoints = priceHistoryDays ? priceHistoryDays * 24 : chartsData.hours.length;
		const historicalPrices = chartsData.hours
			.slice(0, maxHistoricalPoints)
			.map((h) => h.price);

		const series = chartsData.hours.slice(0, targetCount).map((hour, pointIndex) => {
			const current = hour.energyDemand / 100;
			const expected = current * 0.97;

			let storage: SimulationPoint['storage'];
			let generated = 0;
			let mode: 'charging' | 'emergency' | 'idle' = 'idle';

			if (pointIndex === 0) {
				storage = { level, capacity: capacityKwh };
			} else {
				const step = EnergyStorageResolver.step({
					price: hour.price,
					tempOut: hour.weather.temp,
					previous: { level, capacity: capacityKwh },
					stepHours,
					historicalPrices,
					chargingConfig,
					emergencyBuyEnabled,
				});
				storage = step.storage;
				generated = step.generated;
				mode = step.mode;
			}

			level = storage.level;

			return {
				timestamp: hour.datetime.toISOString(),
				weather: {
					temperature: hour.weather.temp,
					condition: this.normalizeWeatherCondition(hour.weather.description, hour.weather.wind),
					cloudCoverage: hour.weather.description?.toLowerCase().includes('cloud') ? 0.75 : 0.2,
					windSpeed: hour.weather.wind,
				},
				energy: { generated, price: hour.price, mode },
				demand: { current, expected },
				storage,
			};
		});

		return { series, dataYears: chartsData.dataYears };
	}

	private normalizeWeatherCondition(
		description: string | undefined,
		windSpeed = 0,
	): SimulationPoint['weather']['condition'] {
		const d = (description ?? '').toLowerCase();
		if (d.includes('rain') || d.includes('drizzle')) return 'rainy';
		if (d.includes('snow')) return 'snowy';
		if (d.includes('storm') || d.includes('thunder')) return 'stormy';
		if (d.includes('fog') || d.includes('mist')) return 'foggy';
		if (d.includes('cloud') || d.includes('overcast')) return 'cloudy';
		if (windSpeed >= 8) return 'windy';
		if (d.includes('clear') || d.includes('sun')) return 'sunny';
		return 'unknown';
	}
}
