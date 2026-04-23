/**
 * Repräsentiert ein Datum im Format YYYY-MM-DD als String.
 */
export type DateString = string;

export interface WeatherData {
  date: DateString;
  minTemperatureRecord: number;
  maxTemperatureRecord: number;
  weatherDescriptions: string[];
  windSpeedMeasurements: number[];
}

export interface DailyWeatherSummary {
  date: DateString;
  temperatureAverage: number;
  weatherDescription: string;
  windSpeedAverage: number;
}
