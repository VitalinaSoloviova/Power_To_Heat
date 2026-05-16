import type { DataResolver, Granularity } from '@calculations/DataResolver';
import type { UiHourData } from '@calculations/uiDataProfile';
import { city } from '@calculations/CityData';
import { DataCoverageCalculator, type DataCoverage } from '../DataCoverageCalculator';
import { ChartDataResolver } from '../resolvers/ChartDataResolver';
import { CityDemandResolver } from '../resolvers/CityDemandResolver';
import type { ChartData, SimulationData } from '@services/types';

/** Number of past years to average for the historical comparison. */
export const HISTORY_OPTIONS = [1, 5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;

export interface WeatherRangeForMonth {
  month: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
}

export interface ChartsPeriod {
  start: Date;
  end: Date;
  historyYears: HistoryYears;
}

export interface ChartsData {
  period: ChartsPeriod;
  /** One entry per hour or day depending on granularity (sorted ascending). */
  hours: UiHourData[];
  /** Pre-formatted labels for the chart x-axis. */
  xLabels: string[];
  /** How many years of data were actually available in the DB. */
  dataYears: DataCoverage;
  granularity: Granularity;
}

/**
 * Orchestrates chart-related resolvers and returns chart-ready data.
 */
export class ChartUIService {
  private readonly dataResolver: DataResolver;
  private readonly chartResolver: ChartDataResolver;

  constructor(
    dataResolver: DataResolver,
    chartResolver = new ChartDataResolver(),
  ) {
    this.dataResolver = dataResolver;
    this.chartResolver = chartResolver;
  }

  public async getChartsData(
    historyYears: HistoryYears,
    granularity: Granularity = 'daily',
    startDate?: Date,
  ): Promise<ChartsData> {
    const period = this.buildPeriod(historyYears, startDate);

    const { hours, weatherDates, priceDates } = await this.dataResolver.getUiDataProfile(
      period.start,
      period.end,
      historyYears,
      granularity,
    );

    const dataYears = DataCoverageCalculator.fromDateLists(weatherDates, priceDates);
    const enrichedHours = this.enrichHoursWithEnergyDemand(hours);
    const xLabels = this.buildXLabels(enrichedHours, granularity);

    return { period, hours: enrichedHours, xLabels, dataYears, granularity };
  }

  public getChartData(
    simulation: SimulationData,
  ): ChartData {
    return this.chartResolver.resolve(simulation);
  }

  public buildPeriod(historyYears: HistoryYears, startDate?: Date): ChartsPeriod {
    const days = 28;
    const start = startDate ? new Date(startDate) : new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + days - 1);
    return { start, end, historyYears };
  }

  private enrichHoursWithEnergyDemand(hours: UiHourData[]): UiHourData[] {
    return hours.map((hour) => ({
      ...hour,
      energyDemand: CityDemandResolver.calculate(hour.weather.temp, city),
    }));
  }

  private buildXLabels(hours: UiHourData[], granularity: Granularity): string[] {
    return hours.map((hour) =>
      granularity === 'hourly'
        ? hour.datetime.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : hour.datetime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
          }),
    );
  }
}