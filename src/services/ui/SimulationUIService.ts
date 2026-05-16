import type { DataCoverage } from '../DataCoverageCalculator';
import { EnergyStorageResolver } from '../resolvers/EnergyStorageResolver';
import type { SimulationPoint, SimulationRange } from '../types';
import type { UiHourData } from '@calculations/uiDataProfile';
import type { ChartsData } from './ChartUIService';

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
}

export interface SimulationSeriesData {
	series: SimulationPoint[];
	dataYears: DataCoverage;
}

/**
 * Pure simulation series computation. Takes already-loaded chart data and
 * produces a time-series of `SimulationPoint` for the simulation UI.
 *
 * No I/O, no side effects — safe to call on every storage-slider change.
 */
export class SimulationUIService {
	public getSimulationSeries(input: SimulationSeriesInput): SimulationSeriesData {
		const { chartsData, range, initialStoragePercent } = input;
		const targetCount = POINTS_PER_RANGE[range];
		const stepHours = STEP_HOURS[range];
		const capacity = EnergyStorageResolver.CAPACITY_KWH;
		const clampedInitialStoragePercent = Math.min(100, Math.max(0, initialStoragePercent));
		let level = capacity * (clampedInitialStoragePercent / 100);

		const series = chartsData.hours.slice(0, targetCount).map((hour, pointIndex) => {
			const current = hour.energyDemand / 100;
			const expected = current * 0.97;
			const generated = this.calculatePowerToHeatGeneration(hour, current);
			const storage = pointIndex === 0
				? { level, capacity }
				: EnergyStorageResolver.step({
						price: hour.price,
						demandKw: current,
						previous: { level, capacity },
						stepHours,
					}).storage;

			level = storage.level;

			return {
				timestamp: hour.datetime.toISOString(),
				weather: {
					temperature: hour.weather.temp,
					condition: this.normalizeWeatherCondition(hour.weather.description, hour.weather.wind),
					cloudCoverage: hour.weather.description?.toLowerCase().includes('cloud') ? 0.75 : 0.2,
					windSpeed: hour.weather.wind,
				},
				energy: { generated, price: hour.price },
				demand: { current, expected },
				storage,
			};
		});

		return { series, dataYears: chartsData.dataYears };
	}

	private calculatePowerToHeatGeneration(hour: UiHourData, currentDemand: number): number {
		const p2hMax = 3_000;

		if (hour.price < 60) return p2hMax;
		if (hour.price > 100) return 0;
		return currentDemand;
	}

	private normalizeWeatherCondition(
		description: string | undefined,
		windSpeed = 0,
	): SimulationPoint['weather']['condition'] {
		const normalizedDescription = (description ?? '').toLowerCase();

		if (normalizedDescription.includes('rain') || normalizedDescription.includes('drizzle')) return 'rainy';
		if (normalizedDescription.includes('snow')) return 'snowy';
		if (normalizedDescription.includes('storm') || normalizedDescription.includes('thunder')) return 'stormy';
		if (normalizedDescription.includes('fog') || normalizedDescription.includes('mist')) return 'foggy';
		if (normalizedDescription.includes('cloud') || normalizedDescription.includes('overcast')) return 'cloudy';
		if (windSpeed >= 8) return 'windy';
		if (normalizedDescription.includes('clear') || normalizedDescription.includes('sun')) return 'sunny';
		return 'unknown';
	}
}
