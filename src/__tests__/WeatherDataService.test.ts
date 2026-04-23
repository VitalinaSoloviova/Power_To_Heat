import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { WeatherDataService } from '../data/WeatherDataService';
import type { WeatherData } from '../data/WeatherInterface';

describe('WeatherDataService', () => {
  
  // Mocked return data: 2 days with multiple hourly entries
  const mockWeatherData: WeatherData[] = [
    // Day 1: 2023-01-01 - 3 hourly entries
    {
      date: '2023-01-01',
      minTemperatureRecord: -5,
      maxTemperatureRecord: 2,
      weatherDescriptions: ['snow'],
      windSpeedMeasurements: [3.2]
    },
    {
      date: '2023-01-01', 
      minTemperatureRecord: -3,
      maxTemperatureRecord: 4,
      weatherDescriptions: ['cloudy'],
      windSpeedMeasurements: [4.1]
    },
    {
      date: '2023-01-01',
      minTemperatureRecord: -1,
      maxTemperatureRecord: 6,
      weatherDescriptions: ['snow'],
      windSpeedMeasurements: [2.8]
    },
    // Day 2: 2023-01-02 - 2 hourly entries  
    {
      date: '2023-01-02',
      minTemperatureRecord: 0,
      maxTemperatureRecord: 8,
      weatherDescriptions: ['sunny'],
      windSpeedMeasurements: [1.5]
    },
    {
      date: '2023-01-02',
      minTemperatureRecord: 3,
      maxTemperatureRecord: 12,
      weatherDescriptions: ['clear'],
      windSpeedMeasurements: [2.1]
    }
  ];

  beforeEach(() => {
    // Mock fetchHourlyWeatherData to return our test data
    jest.spyOn(WeatherDataService, 'fetchHourlyWeatherData').mockResolvedValue(mockWeatherData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchDailyWeatherData', () => {
    it('should aggregate hourly data into daily data correctly', async () => {
      const result = await WeatherDataService.fetchDailyWeatherData();
      
      expect(result).toHaveLength(2); // 2 unique days
      
      // Day 1: 2023-01-01 (3 hourly entries aggregated)
      const day1 = result.find(d => d.date === '2023-01-01');
      expect(day1).toBeDefined();
      expect(day1?.minTemperatureRecord).toBe(-5); // min(-5, -3, -1) = -5
      expect(day1?.maxTemperatureRecord).toBe(6);  // max(2, 4, 6) = 6
      expect(day1?.weatherDescriptions).toEqual(['snow', 'cloudy']); // unique descriptions
      expect(day1?.windSpeedMeasurements).toEqual([3.2, 4.1, 2.8]); // all wind measurements
      
      // Day 2: 2023-01-02 (2 hourly entries aggregated)
      const day2 = result.find(d => d.date === '2023-01-02');
      expect(day2).toBeDefined();
      expect(day2?.minTemperatureRecord).toBe(0);  // min(0, 3) = 0
      expect(day2?.maxTemperatureRecord).toBe(12); // max(8, 12) = 12
      expect(day2?.weatherDescriptions).toEqual(['sunny', 'clear']); // unique descriptions
      expect(day2?.windSpeedMeasurements).toEqual([1.5, 2.1]); // all wind measurements
    });
  });

  describe('fetchDailySummary', () => {
    it('should create daily summaries with correct averages', async () => {
      const result = await WeatherDataService.fetchDailySummary();
      
      expect(result).toHaveLength(2); // 2 unique days
      
      // Day 1 summary: 2023-01-01
      const day1Summary = result.find(s => s.date === '2023-01-01');
      expect(day1Summary).toBeDefined();
      expect(day1Summary?.temperatureAverage).toBeCloseTo(0.5, 1); // (-5 + 6) / 2 = 0.5
      expect(day1Summary?.weatherDescription).toBe('snow, cloudy'); // joined descriptions
      expect(day1Summary?.windSpeedAverage).toBeCloseTo(3.37, 2); // (3.2 + 4.1 + 2.8) / 3 = 3.37
      
      // Day 2 summary: 2023-01-02  
      const day2Summary = result.find(s => s.date === '2023-01-02');
      expect(day2Summary).toBeDefined();
      expect(day2Summary?.temperatureAverage).toBeCloseTo(6, 1); // (0 + 12) / 2 = 6
      expect(day2Summary?.weatherDescription).toBe('sunny, clear'); // joined descriptions
      expect(day2Summary?.windSpeedAverage).toBeCloseTo(1.8, 2); // (1.5 + 2.1) / 2 = 1.8
    });
  });
});

     