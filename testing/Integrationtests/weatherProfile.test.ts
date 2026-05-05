import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../database/api/rest-server.js';

describe('GET /api/weather/range', () => {
    it('returns hourly weather data for a given range', async () => {
        const res = await request(app).get(
            '/api/weather/range?date_from=1979-01-01&date_to=1979-01-05',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('datetime');
        expect(res.body[0]).toHaveProperty('temp');
        expect(res.body[0]).toHaveProperty('temp_min');
        expect(res.body[0]).toHaveProperty('temp_max');
        expect(res.body[0]).toHaveProperty('wind_speed');
        expect(res.body[0]).toHaveProperty('weather_main');
    });

    it('returns data for a month-overlapping range', async () => {
        const res = await request(app).get(
            '/api/weather/range?date_from=1979-01-28&date_to=1979-02-03',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('returns empty array for a date range with no data', async () => {
        const res = await request(app).get(
            '/api/weather/range?date_from=9999-01-01&date_to=9999-01-05',
        );
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns rows ordered by datetime ascending', async () => {
        const res = await request(app).get(
            '/api/weather/range?date_from=1979-01-01&date_to=1979-01-02',
        );
        expect(res.status).toBe(200);
        const datetimes = res.body.map((r: { datetime: string }) => new Date(r.datetime).getTime());
        expect(datetimes).toEqual([...datetimes].sort((a, b) => a - b));
    });
});
