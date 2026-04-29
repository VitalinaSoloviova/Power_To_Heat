// src/calculations/getWeatherData.ts
import type { WeatherData } from "./types";

/**
 * Dummy weather data for January (base year 2020).
 */
const januaryWeatherData: WeatherData[] = Array.from({ length: 31 }, (_, idx) => {
  const date = new Date(2020, 0, idx + 1);
  return {
    date,
    minTemp: -15 + (idx % 5),
    maxTemp: -5 + (idx % 5),
    avgTemp: -10 + (idx % 5),
    wind: 3 + (idx % 4),
  };
});

/**
 * Return weather rows between two real Date objects (inclusive).
 */
export function getWeatherData(startDate: Date, endDate: Date): WeatherData[] {
  return januaryWeatherData.filter((row) => row.date >= startDate && row.date <= endDate);
}

/**
 * Utility: return the dummy january weather data shifted to a specific year.
 */
export function shiftWeatherDataToYear(year: number): WeatherData[] {
  return januaryWeatherData.map((row) => ({
    ...row,
    date: new Date(year, row.date.getMonth(), row.date.getDate()),
  }));
}

export { januaryWeatherData };
