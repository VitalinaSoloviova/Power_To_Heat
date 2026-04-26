import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../database/api/rest-server.js';

describe('GET /api/price-profile/:month/:day', () => {
    it('get price profile for a specific day', async () => {
        const res = await request(app).get('/api/price-profile/1/1');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('avg_price');
    });

    it('returns empty array if day does not exist', async () => {
        const res = await request(app).get('/api/price-profile/99/99');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('rejects non-GET requests', async () => {
        const res = await request(app).post('/api/price-profile/1/1');
        expect(res.status).toBe(404);
    });
});

describe('GET /api/price-profile/range', () => {
    it('get prices for a range', async () => {
        const res = await request(app).get(
            '/api/price-profile/range?month_from=1&day_from=1&month_to=1&day_to=10',
        );
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

