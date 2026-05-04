import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataResolver } from '../../src/calculations/DataResolver.js';

const mockWeatherData = [
    { date: '2020-01-01', avg_temp: -2, min_temp: -5, max_temp: 1,  avg_wind: 10, dominant_weather_main: 'Snow'   },
    { date: '2021-01-01', avg_temp:  2, min_temp: -1, max_temp: 5,  avg_wind:  8, dominant_weather_main: 'Clouds' },
    { date: '2020-01-02', avg_temp:  0, min_temp: -3, max_temp: 3,  avg_wind: 12, dominant_weather_main: 'Clouds' },
    { date: '2021-01-02', avg_temp:  4, min_temp:  1, max_temp: 7,  avg_wind:  6, dominant_weather_main: 'Clear'  },
];

const mockPriceData = [
    { date: '2020-01-01', avg_price: 50 },
    { date: '2021-01-01', avg_price: 70 },
    { date: '2020-01-02', avg_price: 40 },
    { date: '2021-01-02', avg_price: 60 },
];

function mockFetch(weatherData = mockWeatherData, priceData = mockPriceData) {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
        const data = url.includes('weather') ? weatherData : priceData;
        return Promise.resolve({ json: () => Promise.resolve(data) });
    }));
}

describe('ForecastService', () => {
    let service: DataResolver;

    beforeEach(() => {
        service = new DataResolver('http://localhost:3001');
        mockFetch();
    });

    it('returns one UiDayData per unique calendar day', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-02'), 5
        );
        expect(result.days).toHaveLength(2);
    });

    it('averages temperature correctly across years', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // Jan 1: (-2 + 2) / 2 = 0
        expect(result.days[0].weather.avgTemp).toBeCloseTo(0);
    });

    it('sets weather description from most recent year', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.days[0].weather.description).toBe('Clouds');
    });

    it('averages price correctly across years', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // Jan 1: (50 + 70) / 2 = 60
        expect(result.days[0].avgPrice).toBeCloseTo(60);
    });

    it('returns days sorted chronologically', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-02'), 5
        );
        expect(result.days[0].day.getTime()).toBeLessThan(result.days[1].day.getTime());
    });

    it('sets avgPrice to 0 if no price data exists for that day', async () => {
        mockFetch(mockWeatherData, []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.days[0].avgPrice).toBe(0);
    });

    it('sets energyDemand to 0 when temperature is above target (20°C)', async () => {
        mockFetch([
            { date: '2020-01-01', avg_temp: 25, min_temp: 20, max_temp: 30, avg_wind: 5, dominant_weather_main: 'Clear' },
        ], []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.days[0].energyDemand).toBe(0);
    });

    it('calculates positive energyDemand when temperature is below target', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.days[0].energyDemand).toBeGreaterThan(0);
    });

    it('returns empty array if no weather data is available', async () => {
        mockFetch([], []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.days).toEqual([]);
    });
});
