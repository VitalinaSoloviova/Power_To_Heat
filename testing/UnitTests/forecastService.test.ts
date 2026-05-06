import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataResolver } from '../../src/calculations/DataResolver.js';

const mockWeatherData = [
    { datetime: '2020-01-01T00:00:00Z', temp: -2, temp_min: -5, temp_max:  1, wind_speed: 10, weather_main: 'Snow'   },
    { datetime: '2021-01-01T00:00:00Z', temp:  2, temp_min: -1, temp_max:  5, wind_speed:  8, weather_main: 'Clouds' },
    { datetime: '2020-01-02T00:00:00Z', temp:  0, temp_min: -3, temp_max:  3, wind_speed: 12, weather_main: 'Clouds' },
    { datetime: '2021-01-02T00:00:00Z', temp:  4, temp_min:  1, temp_max:  7, wind_speed:  6, weather_main: 'Clear'  },
];

const mockPriceData = [
    { datetime: '2020-01-01T00:00:00Z', price_eur_mwhe: 50 },
    { datetime: '2021-01-01T00:00:00Z', price_eur_mwhe: 70 },
    { datetime: '2020-01-02T00:00:00Z', price_eur_mwhe: 40 },
    { datetime: '2021-01-02T00:00:00Z', price_eur_mwhe: 60 },
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

    it('returns 24 UiHourData entries for a single-day period (hourly)', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5, 'hourly'
        );
        expect(result.hours).toHaveLength(24);
    });

    it('returns 48 UiHourData entries for a two-day period (hourly)', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-02'), 5, 'hourly'
        );
        expect(result.hours).toHaveLength(48);
    });

    it('returns 1 UiHourData entry per day for a single-day period (daily)', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5, 'daily'
        );
        expect(result.hours).toHaveLength(1);
    });

    it('returns 2 UiHourData entries for a two-day period (daily)', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-02'), 5, 'daily'
        );
        expect(result.hours).toHaveLength(2);
    });

    it('averages temperature correctly across years for the 00:00 hour', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // Jan 1 00:00 UTC: (MIN(-5,-1) + MAX(1,5)) / 2 = (-5 + 5) / 2 = 0
        expect(result.hours[0].weather.temp).toBeCloseTo(0);
    });

    it('takes the minimum of all minTemps across years', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // MIN(-5, -1) = -5
        expect(result.hours[0].weather.minTemp).toBeCloseTo(-5);
    });

    it('takes the maximum of all maxTemps across years', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // MAX(1, 5) = 5
        expect(result.hours[0].weather.maxTemp).toBeCloseTo(5);
    });

    it('sets weather description from most recent entry', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.hours[0].weather.description).toBe('Clouds');
    });

    it('averages price correctly across years', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        // (50 + 70) / 2 = 60
        expect(result.hours[0].price).toBeCloseTo(60);
    });

    it('returns hours sorted chronologically', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-02'), 5
        );
        expect(result.hours[0].datetime.getTime()).toBeLessThan(result.hours[1].datetime.getTime());
    });

    it('sets price to 0 if no price data exists for that hour', async () => {
        mockFetch(mockWeatherData, []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.hours[0].price).toBe(0);
    });

    it('sets energyDemand to 0 when temperature is above target (20°C)', async () => {
        mockFetch([
            { datetime: '2020-01-01T00:00:00Z', temp: 25, temp_min: 20, temp_max: 30, wind_speed: 5, weather_main: 'Clear' },
        ], []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.hours[0].energyDemand).toBe(0);
    });

    it('calculates positive energyDemand when temperature is below target', async () => {
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5
        );
        expect(result.hours[0].energyDemand).toBeGreaterThan(0);
    });

    it('returns empty hours (all zeros) when no weather data is available', async () => {
        mockFetch([], []);
        const result = await service.getUiDataProfile(
            new Date('2000-01-01'), new Date('2000-01-01'), 5, 'hourly'
        );
        expect(result.hours).toHaveLength(24);
        expect(result.hours[0].weather.temp).toBe(0);
        expect(result.hours[0].price).toBe(0);
        expect(result.hours[0].energyDemand).toBe(0);
    });
});
