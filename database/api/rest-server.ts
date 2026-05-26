import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());

// API endpoint for current energy price (proxied from corrently.io)
app.get('/api/energy-price/current', async (_req: Request, res: Response) => {
    try {
        const upstream = await fetch(
            'https://api.awattar.de/v1/marketdata'
        );
        if (!upstream.ok) {
            res.status(upstream.status).json({ error: 'upstream error' });
            return;
        }
        const data = await upstream.json();
        res.json(data);
    } catch (error) {
        console.error('Error proxying corrently.io', error);
        res.status(500).json({ error: 'proxy error' });
    }
});

// API endpoint for weather data in a date range
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

// 
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


// Serve the built React frontend (production)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

export { app };

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    app.listen(PORT, () => {
        console.log(`API=> http://localhost:${PORT}`);
    });
}
