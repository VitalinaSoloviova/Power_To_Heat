export const DURATION_OPTIONS = [1, 2, 3] as const;
export type Duration = (typeof DURATION_OPTIONS)[number];

export const HISTORY_OPTIONS = [5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_DURATION: Duration = 3;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;


interface ElectricityPriceDataPoint {
    date: Date;
     price: number;
}

interface WeatherDataPoint {
    date: Date;
    minTemp: number
    maxTemp: number;
    everageTemp: number;
    forcast: 
}

// TODO Forcast number of sunny days and wind speed
export interface ChartsData {
ele
}

export class UIService {
    public getChartsData(forecastDuration: Duration, historyYears: HistoryYears): any {
        return {
            forecastDuration,
            historyYears,
        };
    }

    private calculateForecast(storageLevel: number, forecastDuration: Duration, historyYears: HistoryYears): any {}

    private calculateHistoryData(historyYears: HistoryYears): any {

    }

    private getWeatherData(): any {

    }

    private getDemandData(): any {

    }

    private getElectricityPriceData(): any {

    }
}