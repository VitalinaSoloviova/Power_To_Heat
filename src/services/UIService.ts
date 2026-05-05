import type { DataResolver } from "../calculations/DataResolver";
import type { Granularity } from "../calculations/DataResolver";
import type { UiHourData } from "../calculations/uiDataProfile";
import { DataCoverageCalculator } from "./DataCoverageCalculator";
import type { DataCoverage } from "./DataCoverageCalculator";

/** Number of past years to average for the historical comparison. */
export const HISTORY_OPTIONS = [5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;


// UI section data shape – x-axis is one tick per day

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
        granularity: Granularity = 'daily'
    ): Promise<ChartsData> {
        const period = this.buildPeriod(historyYears);

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

    private buildPeriod(
        historyYears: HistoryYears
    ): ChartsPeriod {
        const days = 30; 
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);
        return { start, end, durationWeeks: duration, historyYears };
    }

    private eachDay(start: Date, end: Date): Date[] {
        const out: Date[] = [];
        const cursor = new Date(start);
        cursor.setHours(0, 0, 0, 0);
        const last = new Date(end);
        last.setHours(0, 0, 0, 0);
        while (cursor.getTime() <= last.getTime()) {
            out.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        return out;
    }

    /** "MM-DD" key for matching the same calendar day across years. */
    private calendarKey(d: Date): string {
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${m}-${day}`;
    }

    private emptyDay(day: Date): UiDayData {
        return {
            day,
            weather: {
                minTemp: 0,
                maxTemp: 0,
                avgTemp: 0,
                wind: 0,
                description: "",
            },
            avgPrice: 0,
            energyDemand: 0,
        };
    }

}
