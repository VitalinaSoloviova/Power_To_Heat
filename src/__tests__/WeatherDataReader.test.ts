import { WeatherDataReader } from '../data/WeatherDataReader';

describe('WeatherDataReader', () => {
  const mockCsvData = `dt;dt_iso;city_name;temp;visibility;dew_point;temp_min;temp_max;pressure;humidity;wind_speed;wind_deg;wind_gust;rain_1h;rain_3h;snow_1h;snow_3h;clouds_all;weather_id;weather_main;weather_description;weather_icon
283996800;1979-01-01 00:00:00 +0000 UTC;Bad Homburg;-13.68;;-16.23;-14.52;-12.57;995;79;5.99;3;;;;0.28;;98;600;Snow;light snow;13n
284000400;1979-01-01 01:00:00 +0000 UTC;Bad Homburg;-14.66;;-17.2;-15.46;-14.13;998;79;5.98;355;;;;0.29;;100;600;Snow;light snow;13n
284004000;1979-01-02 02:00:00 +0000 UTC;Bad Homburg;-14.29;;-16.83;-15.46;-13.82;1000;79;5.85;354;;;;0.31;;100;600;Snow;heavy snow;13n
284007600;1979-01-02 03:00:00 +0000 UTC;Bad Homburg;-16.62;;-19.39;-16.98;-15.46;1002;77;5.32;353;;;;0.23;;100;600;Snow;light snow;13n
284011200;1979-01-02 04:00:00 +0000 UTC;Bad Homburg;-12.45;;-15.12;-13.21;-11.89;1005;82;4.87;2;;;;0.18;;90;800;Clouds;broken clouds;04n
284014800;1979-01-03 05:00:00 +0000 UTC;Bad Homburg;-8.92;;-11.56;-9.67;-8.34;1008;85;3.45;45;;;;0.0;;75;801;Clouds;few clouds;02d
284018400;1979-01-03 06:00:00 +0000 UTC;Bad Homburg;-5.23;;-7.89;-6.12;-4.56;1012;78;2.98;67;;;;0.0;;45;800;Clear;clear sky;01d
284022000;1979-01-03 07:00:00 +0000 UTC;Bad Homburg;-2.14;;-4.67;-3.23;-1.45;1015;71;4.23;89;;;;0.0;;20;800;Clear;clear sky;01d
284025600;1979-01-04 08:00:00 +0000 UTC;Bad Homburg;1.34;;-1.23;0.56;2.12;1018;65;5.67;112;;;;0.0;;10;800;Clear;clear sky;01d
284029200;1979-01-04 09:00:00 +0000 UTC;Bad Homburg;3.89;;1.45;2.67;4.23;1020;62;6.12;134;;;;0.0;;5;800;Clear;clear sky;01d

`;

  it('should map CSV data to WeatherData array', () => {
    const result = WeatherDataReader.mapCsvToWeatherData(mockCsvData);
    
    expect(result).toHaveLength(10);
    expect(result[0]).toEqual({
      date: '1979-01-01',
      minTemperatureRecord: -14.52,
      maxTemperatureRecord: -12.57,
      weatherDescriptions: ['light snow'],
      windSpeedMeasurements: [5.99]
    });
  });

  it('should handle empty CSV content', () => {
    const result = WeatherDataReader.mapCsvToWeatherData('');
    expect(result).toEqual([]);
  });

  it('should handle CSV with only headers', () => {
    const headersOnly = mockCsvData.split('\n')[0];
    const result = WeatherDataReader.mapCsvToWeatherData(headersOnly);
    expect(result).toEqual([]);
  });

  it('should skip empty lines', () => {
    const csvWithEmptyLines = mockCsvData + '\n\n   \n';
    const result = WeatherDataReader.mapCsvToWeatherData(csvWithEmptyLines);
    expect(result).toHaveLength(10);
  });

  it('should parse all different weather descriptions correctly', () => {
    const result = WeatherDataReader.mapCsvToWeatherData(mockCsvData);
    
    // Test specific entries with different weather descriptions
    expect(result[0].weatherDescriptions).toEqual(['light snow']);
    expect(result[2].weatherDescriptions).toEqual(['heavy snow']);
    expect(result[4].weatherDescriptions).toEqual(['broken clouds']);
    expect(result[5].weatherDescriptions).toEqual(['few clouds']);
    expect(result[6].weatherDescriptions).toEqual(['clear sky']);
  });

  it('should collect all unique weather descriptions from dataset', () => {
    const result = WeatherDataReader.mapCsvToWeatherData(mockCsvData);
    
    // Extract all weather descriptions
    const allDescriptions = result.flatMap(entry => entry.weatherDescriptions);
    const uniqueDescriptions = [...new Set(allDescriptions)];
    
    expect(uniqueDescriptions).toEqual(
      expect.arrayContaining([
        'light snow',
        'heavy snow', 
        'broken clouds',
        'few clouds',
        'clear sky'
      ])
    );
    expect(uniqueDescriptions).toHaveLength(5);
  });

});