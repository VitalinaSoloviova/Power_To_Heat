import type { DataResolver } from "../calculations/DataResolver";
import type { UiDayData } from "../calculations/uiDataProfile";
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

/** Bundle the charts UI section receives in one call. */
export interface ChartsData {
    period: ChartsPeriod;
    /** One entry per day in the period (sorted ascending). */
    days: UiDayData[];
    /** Pre-formatted day labels for the chart x-axis (e.g. "04 May"). */
    xLabels: string[];
    /** How many years of data were actually available in the DB (may be < historyYears). */
    dataYears: DataCoverage;
}

export class UIService {
    private resolver: DataResolver;

    constructor(resolver: DataResolver) {
        this.resolver = resolver;
    }

    /**
     * Single entry point for the charts section.
     * Returns one data point per day for the requested duration,
     * each point being the N-year historical average for that calendar day.
     */
    public async getChartsData(
        historyYears: HistoryYears
    ): Promise<ChartsData> {
        const period = this.buildPeriod(historyYears);

        const {
            days: profile,
            weatherDates,
            priceDates,
        } = await this.resolver.getUiDataProfile(
            period.start,
            period.end,
            historyYears
        );

        const coverage = DataCoverageCalculator.fromDateLists(weatherDates, priceDates);

        // DataResolver returns days keyed by calendar (MM-DD) with year=2000.
        // Map them back onto every actual day in our requested period.
        const profileByKey = new Map(
            profile.map((d) => [this.calendarKey(d.day), d])
        );

        const wantedDays = this.eachDay(period.start, period.end);
        const days: UiDayData[] = wantedDays.map((day) => {
            const found = profileByKey.get(this.calendarKey(day));
            return found ? { ...found, day } : this.emptyDay(day);
        });

        const xLabels = wantedDays.map((d) =>
            d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        );

        return { period, days, xLabels, dataYears: coverage };
    }

    // Period helpers

    private buildPeriod(
        historyYears: HistoryYears
    ): ChartsPeriod {
        const period = 
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);
        return { start, end, historyYears };
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
