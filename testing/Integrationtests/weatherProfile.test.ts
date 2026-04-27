import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../database/api/rest-server.js';

describe('GET /api/weather-profile/:date', () => {
    it('get weather profile for a specific day', async () => {
        const res = await request(app).get('/api/weather-profile/1979-01-01');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('avg_temp');
        expect(res.body[0]).toHaveProperty('dominant_weather_main');
    });

    it('returns empty array if day does not exist', async () => {
        const res = await request(app).get('/api/weather-profile/9999-12-31');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('GET /api/weather-profile/range', () => {
    it('get weather data for a range', async () => {
        const res = await request(app).get(
            '/api/weather-profile/range?date_from=1979-01-01&date_to=1979-01-05',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('returns data for a month-overlapping range', async () => {
        const res = await request(app).get(
            '/api/weather-profile/range?date_from=1979-01-28&date_to=1979-02-03',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
