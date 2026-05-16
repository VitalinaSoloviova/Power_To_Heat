import type { DataResolver, Granularity } from '@calculations/DataResolver';
import type { UiHourData } from '@calculations/uiDataProfile';
import { city } from '@calculations/CityData';
import { DataCoverageCalculator, type DataCoverage } from '../DataCoverageCalculator';
import { CityDemandResolver } from '../resolvers/CityDemandResolver';

/** Number of past years to average for the historical comparison. */
export const HISTORY_OPTIONS = [1, 5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;

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
 *
 * Caches results and in-flight requests by (historyYears, granularity, startDay)
 * so concurrent consumers (e.g. simulation hook + chart-cards) share the same
 * network fetch instead of triggering duplicate requests.
 */
export class ChartUIService {
  private readonly dataResolver: DataResolver;
  private readonly resultCache = new Map<string, ChartsData>();
  private readonly inFlight = new Map<string, Promise<ChartsData>>();

  constructor(dataResolver: DataResolver) {
    this.dataResolver = dataResolver;
  }

  public getChartsData(
    historyYears: HistoryYears,
    granularity: Granularity = 'daily',
    startDate?: Date,
  ): Promise<ChartsData> {
    const period = this.buildPeriod(historyYears, startDate);
    const cacheKey = `${historyYears}|${granularity}|${period.start.getTime()}`;

    const cached = this.resultCache.get(cacheKey);
    if (cached) return Promise.resolve(cached);

    const pending = this.inFlight.get(cacheKey);
    if (pending) return pending;

    const request = this.fetchChartsData(period, granularity)
      .then((data) => {
        this.resultCache.set(cacheKey, data);
        this.inFlight.delete(cacheKey);
        return data;
      })
      .catch((error) => {
        this.inFlight.delete(cacheKey);
        throw error;
      });

    this.inFlight.set(cacheKey, request);
    return request;
  }

  private async fetchChartsData(
    period: ChartsPeriod,
    granularity: Granularity,
  ): Promise<ChartsData> {
    const { hours, weatherDates, priceDates } = await this.dataResolver.getUiDataProfile(
      period.start,
      period.end,
      period.historyYears,
      granularity,
    );

    const dataYears = DataCoverageCalculator.fromDateLists(weatherDates, priceDates);
    const enrichedHours = this.enrichHoursWithEnergyDemand(hours);
    const xLabels = this.buildXLabels(enrichedHours, granularity);

    return { period, hours: enrichedHours, xLabels, dataYears, granularity };
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
