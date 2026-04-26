import express, { Request, Response } from 'express';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const app = express();
const PORT = process.env.PORT ?? 3001;


app.get('/api/weather-profile/:month/:day', async (req: Request, res: Response) => {
    const month = Number(req.params.month);
    const day = Number(req.params.day);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_profile WHERE month = $1 AND day = $2`,
            [month, day],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-profile/:month/:day', error);
        res.status(500).json({ error: 'Error loading weather profile' });
    }
});

app.get('/api/weather-condition-stats/:month/:day', async (req: Request, res: Response) => {
    const month = Number(req.params.month);
    const day = Number(req.params.day);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_condition_stats WHERE month = $1 AND day = $2 ORDER BY rank`,
            [month, day],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-condition-stats/:month/:day', error);
        res.status(500).json({ error: 'Error loading weather condition stats' });
    }
});

app.get('/api/price-profile/:month/:day', async (req: Request, res: Response) => {
    const month = Number(req.params.month);
    const day = Number(req.params.day);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_price_profile WHERE month = $1 AND day = $2`,
            [month, day],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/price-profile/:month/:day', error);
        res.status(500).json({ error: 'Error loading price profile' });
    }
});


app.get('/api/weather-profile/range', async (req: Request, res: Response) => {
    const month_from = Number(req.query.month_from);
    const day_from = Number(req.query.day_from);
    const month_to = Number(req.query.month_to);
    const day_to = Number(req.query.day_to);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_profile
                WHERE (month > $1 OR (month = $1 AND day >= $2))
                AND (month < $3 OR (month = $3 AND day <= $4))
                ORDER BY month, day`,
            [month_from, day_from, month_to, day_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-profile/range', error);
        res.status(500).json({ error: 'Error loading weather profile' });
    }
});

app.get('/api/weather-condition-stats/range', async (req: Request, res: Response) => {
    const month_from = Number(req.query.month_from);
    const day_from = Number(req.query.day_from);
    const month_to = Number(req.query.month_to);
    const day_to = Number(req.query.day_to);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_weather_condition_stats
                WHERE (month > $1 OR (month = $1 AND day >= $2))
                AND (month < $3 OR (month = $3 AND day <= $4))
                ORDER BY month, day, rank`,
            [month_from, day_from, month_to, day_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/weather-condition-stats/range', error);
        res.status(500).json({ error: 'Error loading weather condition stats' });
    }
});

app.get('/api/price-profile/range', async (req: Request, res: Response) => {
    const month_from = Number(req.query.month_from);
    const day_from = Number(req.query.day_from);
    const month_to = Number(req.query.month_to);
    const day_to = Number(req.query.day_to);
    try {
        const result = await pool.query(
            `SELECT * FROM daily_price_profile
                WHERE (month > $1 OR (month = $1 AND day >= $2))
                AND (month < $3 OR (month = $3 AND day <= $4))
                ORDER BY month, day`,
            [month_from, day_from, month_to, day_to],
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error in /api/price-profile/range', error);
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
