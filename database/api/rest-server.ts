import express, { Request, Response } from 'express';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const app = express();
const PORT = process.env.PORT ?? 3001;


app.get('/api/weather-profile/range', async (req: Request, res: Response) => {
    const date_from = req.query.date_from as string;
    const date_to = req.query.date_to as string;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_profile
                WHERE date >= $1 AND date <= $2
                ORDER BY date`,
            [date_from, date_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-profile/range', error);
        res.status(500).json({ error: 'Error loading weather profile' });
    }
});

app.get('/api/weather-condition-stats/range', async (req: Request, res: Response) => {
    const date_from = req.query.date_from as string;
    const date_to = req.query.date_to as string;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_condition_stats
                WHERE date >= $1 AND date <= $2
                ORDER BY date, rank`,
            [date_from, date_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-condition-stats/range', error);
        res.status(500).json({ error: 'Error loading weather condition stats' });
    }
});

app.get('/api/price-profile/range', async (req: Request, res: Response) => {
    const date_from = req.query.date_from as string;
    const date_to = req.query.date_to as string;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_price_profile
                WHERE date >= $1 AND date <= $2
                ORDER BY date`,
            [date_from, date_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/price-profile/range', error);
        res.status(500).json({ error: 'Error loading price profile' });
    }
});


app.get('/api/weather-profile/:date', async (req: Request, res: Response) => {
    const date = req.params.date;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_profile WHERE date = $1`,
            [date],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-profile/:date', error);
        res.status(500).json({ error: 'Error loading weather profile' });
    }
});

app.get('/api/weather-condition-stats/:date', async (req: Request, res: Response) => {
    const date = req.params.date;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_condition_stats WHERE date = $1 ORDER BY rank`,
            [date],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-condition-stats/:date', error);
        res.status(500).json({ error: 'Error loading weather condition stats' });
    }
});

app.get('/api/price-profile/:date', async (req: Request, res: Response) => {
    const date = req.params.date;
    try {
        const result = await pool.query(
            `SELECT * FROM daily_price_profile WHERE date = $1`,
            [date],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/price-profile/:date', error);
        res.status(500).json({ error: 'Error loading price profile' });
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
