import type { DataResolver } from "../calculations/DataResolver";
import type { Granularity } from "../calculations/DataResolver";
import type { UiHourData } from "../calculations/uiDataProfile";
import { DataCoverageCalculator } from "./DataCoverageCalculator";
import type { DataCoverage } from "./DataCoverageCalculator";

/** Forecast / analysis duration in weeks. Hard cap at 4 weeks. */
export const DURATION_OPTIONS = [1, 2, 3, 4] as const;
export type Duration = (typeof DURATION_OPTIONS)[number];

/** Number of past years to average for the historical comparison. */
export const HISTORY_OPTIONS = [5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_DURATION: Duration = 4;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;

/** Hard cap: never analyse more than 4 weeks ahead. */
export const MAX_FORECAST_DAYS = 4 * 7;

export interface ChartsPeriod {
    start: Date;
    end: Date;
    durationWeeks: Duration;
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
        duration: Duration,
        historyYears: HistoryYears,
        granularity: Granularity = 'daily'
    ): Promise<ChartsData> {
        const period = this.buildPeriod(duration, historyYears);

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

    private buildPeriod(duration: Duration, historyYears: HistoryYears): ChartsPeriod {
        const days = Math.min(duration * 7, MAX_FORECAST_DAYS);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);
        return { start, end, durationWeeks: duration, historyYears };
    }

}
