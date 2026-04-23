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
  windSpeedAverage: number;
}
