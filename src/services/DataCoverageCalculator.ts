export interface DataCoverage {
    weatherYears: number;
    priceYears: number;
    weatherFirstDate: string | null;
    priceFirstDate: string | null;
    weatherLastDate: string | null;
    priceLastDate: string | null;
}

export class DataCoverageCalculator {
    /**
     * Creates a DataCoverage object from lists of weather and price dates.
     * @param weatherDates Array of weather dates in "YYYY-MM-DD" format.
     * @param priceDates Array of price dates in "YYYY-MM-DD" format.
     * @returns DataCoverage object containing coverage information.
     */
    public static fromDateLists(
        weatherDates: string[],
        priceDates: string[]
    ): DataCoverage {
        return {
            weatherYears: this.countDistinctYears(weatherDates),
            priceYears: this.countDistinctYears(priceDates),
            weatherFirstDate: this.getEarliestDate(weatherDates),
            priceFirstDate: this.getEarliestDate(priceDates),
            weatherLastDate: this.getLatestDate(weatherDates),
            priceLastDate: this.getLatestDate(priceDates),
        };
    }

    /** Count how many distinct calendar years appear in an array of "YYYY-MM-DD" strings. */
    private static countDistinctYears(dates: string[]): number {
        const years = new Set(dates.map((d) => d.slice(0, 4)));
        return years.size;
    }

    /** Returns the latest date (YYYY-MM-DD) from the provided list, or null if empty. */
    private static getLatestDate(dates: string[]): string | null {
        if (dates.length === 0) return null;
        return [...dates].sort().at(-1) ?? null;
    }

    /** Returns the earliest date (YYYY-MM-DD) from the provided list, or null if empty. */
    private static getEarliestDate(dates: string[]): string | null {
        if (dates.length === 0) return null;
        return [...dates].sort().at(0) ?? null;
    }
}
