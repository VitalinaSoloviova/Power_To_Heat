import type { DataResolver } from "../calculations/DataResolver";
import type { Granularity } from "../calculations/DataResolver";
import type { UiHourData } from "../calculations/uiDataProfile";
import { DataCoverageCalculator } from "./DataCoverageCalculator";
import type { DataCoverage } from "./DataCoverageCalculator";

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

export class UIService {
    private resolver: DataResolver;

    constructor(resolver: DataResolver) {
        this.resolver = resolver;
    }

    public async getChartsData(
        historyYears: HistoryYears,
        granularity: Granularity = 'daily',
        startDate?: Date
    ): Promise<ChartsData> {
        const period = this.buildPeriod(historyYears, startDate);

        const { hours, weatherDates, priceDates } = await this.resolver.getUiDataProfile(
            period.start,
            period.end,
            historyYears,
            granularity
        );

        const dataYears = DataCoverageCalculator.fromDateLists(weatherDates, priceDates);

        const xLabels = hours.map((h) =>
            granularity === 'hourly'
                ? h.datetime.toLocaleString('en-GB', 
                    { day: '2-digit', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' })
                : h.datetime.toLocaleDateString('en-GB', 
                    { day: '2-digit',
                    month: 'short' })
        );

        return { period, hours, xLabels, dataYears, granularity };
    }

    private buildPeriod(historyYears: HistoryYears, startDate?: Date): ChartsPeriod {
        const days = 28;
        const start = startDate ? new Date(startDate) : new Date();
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + days - 1);
        return { start, end, historyYears };
    }

}
