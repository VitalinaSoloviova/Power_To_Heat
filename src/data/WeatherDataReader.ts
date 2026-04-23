import { type WeatherData, type DateString } from './WeatherInterface';

export class WeatherDataReader {
  /**
   * Reads the content of a CSV file and converts it into an array of WeatherData.
   * Each row is directly converted without aggregation or filtering.
   * 
   * @param csvContent The raw text content of the CSV file
   * @returns An array with all weather data entries
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

    const allWeatherData: WeatherData[] = [];
    // Process each line of the CSV, starting from the second line (index 1)
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      // Skip empty lines
      if (!currentLine) continue;

      const columnValues = currentLine.split(';');
      const isoTimestamp = columnValues[timeIndex]; 
      // Skip rows without a valid timestamp
      if (!isoTimestamp) continue;

      const dateKey: DateString = isoTimestamp.split(' ')[0]; 
      const currentMinTemp = parseFloat(columnValues[temperatureMinIndex]);
      const currentMaxTemp = parseFloat(columnValues[temperatureMaxIndex]);
      const currentDescription = columnValues[weatherDescriptionIndex] || '';
      const currentWindSpeed = parseFloat(columnValues[windSpeedIndex]);

      // Create a WeatherData entry for each row
      allWeatherData.push({
        date: dateKey,
        minTemperatureRecord: currentMinTemp,
        maxTemperatureRecord: currentMaxTemp,
        weatherDescriptions: [currentDescription],
        windSpeedMeasurements: [currentWindSpeed],
        windSpeedAverage: currentWindSpeed
      });
    }

    return allWeatherData;
  }
}
