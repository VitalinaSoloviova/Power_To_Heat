import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../database/api/rest-server.js';

describe('GET /api/weather-profile/:month/:day', () => {
    it('get weather profile for a specific day', async () => {
        const res = await request(app).get('/api/weather-profile/1/1');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('avg_temp');
        expect(res.body[0]).toHaveProperty('dominant_weather_main');
    });

    it('returns empty array if day does not exist', async () => {
        const res = await request(app).get('/api/weather-profile/99/99');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('GET /api/weather-profile/range', () => {
    it('get weather data for a range', async () => {
        const res = await request(app).get(
            '/api/weather-profile/range?month_from=1&day_from=1&month_to=1&day_to=5',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('returns data for a month-overlapping range', async () => {
        const res = await request(app).get(
            '/api/weather-profile/range?month_from=1&day_from=28&month_to=2&day_to=3',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
