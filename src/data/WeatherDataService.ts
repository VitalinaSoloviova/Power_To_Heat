import type { WeatherData, DateString, DailyWeatherSummary } from "./WeatherInterface";
import { WeatherDataReader } from "./WeatherDataReader";

export class WeatherDataService {
  /**
   * Fetches all hourly weather data from the CSV file without any aggregation.
   * @returns Promise that resolves to an array of all hourly weather measurements
   * @throws Error if the CSV file cannot be fetched or parsed
   */
  public static async fetchHourlyWeatherData(): Promise<WeatherData[]> {
    try {
      const response = await fetch("/Bad_Homburg_Weather.csv");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvContent = await response.text();
      return WeatherDataReader.mapCsvToWeatherData(csvContent);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return [];
    }
  }

  /**
   *    
   * @returns 
   */
  /**
   * Fetches weather data aggregated by day with min/max values and detailed measurements.
   * @returns Promise that resolves to an array of daily aggregated weather data
   * @throws Error if the hourly data cannot be fetched
   */
  public static async fetchDailyWeatherData(): Promise<WeatherData[]> {
    const hourlyData = await this.fetchHourlyWeatherData();
    return this.aggregateByDay(hourlyData);
  }

  /**
   * Fetches simplified daily weather summaries with average values.
   * @returns Promise that resolves to an array of daily weather summaries
   * @throws Error if the daily data cannot be fetched or processed
   */
  public static async fetchDailySummary(): Promise<DailyWeatherSummary[]> {
    const dailyData = await this.fetchDailyWeatherData();
    return this.convertToSummary(dailyData);
  }

  private static aggregateByDay(hourlyData: WeatherData[]): WeatherData[] {
    const dailyMap = new Map<
      DateString,
      {
        minTemp: number;
        maxTemp: number;
        descriptions: Set<string>;
        windSpeeds: number[];
      }
    >();

    for (const entry of hourlyData) {
      const date = entry.date;

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          minTemp: entry.minTemperatureRecord,
          maxTemp: entry.maxTemperatureRecord,
          descriptions: new Set(entry.weatherDescriptions),
          windSpeeds: [...entry.windSpeedMeasurements],
        });
      } else {
        const current = dailyMap.get(date)!;
        current.minTemp = Math.min(current.minTemp, entry.minTemperatureRecord);
        current.maxTemp = Math.max(current.maxTemp, entry.maxTemperatureRecord);
        entry.weatherDescriptions.forEach((desc) => current.descriptions.add(desc));
        current.windSpeeds.push(...entry.windSpeedMeasurements);
      }
    }
    
    return Array.from(dailyMap.entries()).map(([date, data]) => {
      const validWindSpeeds = data.windSpeeds.filter(speed => !isNaN(speed) && speed >= 0);

      return {
        date,
        minTemperatureRecord: data.minTemp,
        maxTemperatureRecord: data.maxTemp,
        weatherDescriptions: Array.from(data.descriptions),
        windSpeedMeasurements: validWindSpeeds,
      };
    });
  }

  private static convertToSummary(dailyData: WeatherData[]): DailyWeatherSummary[] {
    return dailyData.map(data => {
      const temperatureAverage = (data.minTemperatureRecord + data.maxTemperatureRecord) / 2;
      const validWindSpeeds = data.windSpeedMeasurements.filter(speed => !isNaN(speed) && speed >= 0);
      const windSpeedAverage = validWindSpeeds.length > 0 
        ? validWindSpeeds.reduce((sum, speed) => sum + speed, 0) / validWindSpeeds.length
        : 0;

      return {
        date: data.date,
        temperatureAverage: parseFloat(temperatureAverage.toFixed(2)),
        weatherDescription: data.weatherDescriptions.join(', '),
        windSpeedAverage: parseFloat(windSpeedAverage.toFixed(2))
      };
    });
  }
}
