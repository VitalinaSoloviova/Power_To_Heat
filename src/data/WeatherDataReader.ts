import { type WeatherData, type DateString } from './WeatherInterface';

export class WeatherDataReader {
  /**
   * Liest den Inhalt einer CSV-Datei ein und wandelt ihn in ein Array von WeatherData um.
   * Die stündlichen Daten werden dabei auf Tagesbasis aggregiert.
   * 
   * @param csvContent Der rohe Textinhalt der CSV-Datei
   * @returns Ein Array mit aggregierten Wetterdaten pro Tag
   */
  public static mapCsvToWeatherData(csvContent: string): WeatherData[] {
    const lines = csvContent.split('\n');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(';');
    const timeIndex = headers.indexOf('dt_iso');
    const temperatureMinIndex = headers.indexOf('temp_min');
    const temperatureMaxIndex = headers.indexOf('temp_max');
    const weatherDescriptionIndex = headers.indexOf('weather_description');
    const windSpeedIndex = headers.indexOf('wind_speed');

    interface DailyAggregation {
      minTemperatureRecord: number;
      maxTemperatureRecord: number;
      weatherDescriptions: string[];
      windSpeedMeasurements: number[];
    }

    const dailyWeatherAggregation = new Map<DateString, DailyAggregation>();

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      if (!currentLine) continue;

      const columnValues = currentLine.split(';');
      const isoTimestamp = columnValues[timeIndex]; 
      if (!isoTimestamp) continue;

      const dateKey: DateString = isoTimestamp.split(' ')[0]; 
      const currentMinTemp = parseFloat(columnValues[temperatureMinIndex]);
      const currentMaxTemp = parseFloat(columnValues[temperatureMaxIndex]);
      const currentDescription = columnValues[weatherDescriptionIndex];
      const currentWindSpeed = parseFloat(columnValues[windSpeedIndex]);

      if (!dailyWeatherAggregation.has(dateKey)) {
        dailyWeatherAggregation.set(dateKey, {
          minTemperatureRecord: currentMinTemp,
          maxTemperatureRecord: currentMaxTemp,
          weatherDescriptions: currentDescription ? [currentDescription] : [],
          windSpeedMeasurements: [currentWindSpeed]
        });
      } else {
        const dailySummary = dailyWeatherAggregation.get(dateKey)!;
        dailySummary.minTemperatureRecord = Math.min(dailySummary.minTemperatureRecord, currentMinTemp);
        dailySummary.maxTemperatureRecord = Math.max(dailySummary.maxTemperatureRecord, currentMaxTemp);
        dailySummary.weatherDescriptions.push(currentDescription);
        dailySummary.windSpeedMeasurements.push(currentWindSpeed);
      }
    }

    return Array.from(dailyWeatherAggregation.entries()).map(([date, dailySummary]) => {
      const averageWindSpeed = dailySummary.windSpeedMeasurements.reduce((sum, speed) => sum + speed, 0) / dailySummary.windSpeedMeasurements.length;
      
      return {
        date: date as DateString,
        minTemperatureRecord: dailySummary.minTemperatureRecord,
        maxTemperatureRecord: dailySummary.maxTemperatureRecord,
        weatherDescriptions: dailySummary.weatherDescriptions,
        windSpeedMeasurements: dailySummary.windSpeedMeasurements,
        windSpeedAverage: parseFloat(averageWindSpeed.toFixed(2))
      };
    });
  }
}
