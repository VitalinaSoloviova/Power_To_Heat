import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../database/api/rest-server.js';

describe('GET /api/price/range', () => {
    it('returns hourly price data for a given range', async () => {
        const res = await request(app).get(
            '/api/price/range?date_from=2015-01-01&date_to=2015-01-10',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('datetime');
        expect(res.body[0]).toHaveProperty('price_eur_mwhe');
    });

    it('returns empty array for a date range with no data', async () => {
        const res = await request(app).get(
            '/api/price/range?date_from=9999-01-01&date_to=9999-01-05',
        );
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns rows ordered by datetime ascending', async () => {
        const res = await request(app).get(
            '/api/price/range?date_from=2015-01-01&date_to=2015-01-02',
        );
        expect(res.status).toBe(200);
        const datetimes = res.body.map((r: { datetime: string }) => new Date(r.datetime).getTime());
        expect(datetimes).toEqual([...datetimes].sort((a, b) => a - b));
    });

    it('rejects non-GET requests', async () => {
        const res = await request(app).post('/api/price/range');
        expect(res.status).toBe(404);
    });
});
