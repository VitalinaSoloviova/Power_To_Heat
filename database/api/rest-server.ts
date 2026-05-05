import express from 'express';
import type { Request, Response } from 'express';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const app = express();
const PORT = process.env.PORT ?? 3001;


app.get('/api/weather/range', async (req: Request, res: Response) => {
    const date_from = req.query.date_from as string;
    const date_to = req.query.date_to as string;
    try {
        const result = await pool.query(
            `SELECT *
            FROM hourly_weather_data
            WHERE datetime::date >= $1 AND datetime::date <= $2
            ORDER BY datetime`,
            [date_from, date_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather/range', error);
        res.status(500).json({ error: 'Error loading weather data' });
    }
});

app.get('/api/price/range', async (req: Request, res: Response) => {
    const date_from = req.query.date_from as string;
    const date_to = req.query.date_to as string;
    try {
        const result = await pool.query(
            `SELECT *
            FROM hourly_price_data
            WHERE datetime::date >= $1 AND datetime::date <= $2
            ORDER BY datetime`,
            [date_from, date_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/price/range', error);
        res.status(500).json({ error: 'Error loading price data' });
    }
});


export { app };

import { fileURLToPath } from 'url';
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    app.listen(PORT, () => {
        console.log(`API=> http://localhost:${PORT}`);
    });
}
