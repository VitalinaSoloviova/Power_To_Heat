# REST API Server

Express-based REST API that serves raw hourly weather and electricity price data from the Supabase database.

## Setup

Set the following environment variables (e.g. in a `.env` file):

```
DATABASE_URL=postgresql://...
PORT=3001  # optional, defaults to 3001
```

## Running the server

```bash
npx tsx database/api/rest-server.ts
```

The server will be available at `http://localhost:3001`.

## Endpoints

All dates use the format `YYYY-MM-DD`. Both endpoints return all hourly rows within the given date range, ordered by `datetime` ascending.

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/range?date_from=...&date_to=...` | Hourly weather data for a date range |

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `datetime` | string (ISO 8601) | UTC timestamp |
| `temp` | number | Temperature in °C |
| `temp_min` | number | Minimum temperature in °C |
| `temp_max` | number | Maximum temperature in °C |
| `wind_speed` | number | Wind speed in m/s |
| `weather_main` | string | Weather category (e.g. `Clear`, `Rain`, `Snow`) |
| `weather_description` | string | Detailed weather description |

### Price

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/price/range?date_from=...&date_to=...` | Hourly electricity price data for a date range |

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `datetime` | string (ISO 8601) | UTC timestamp |
| `price_eur_mwhe` | number | Electricity price in EUR/MWh |

## Example requests

```bash
GET /api/weather/range?date_from=2020-01-01&date_to=2020-01-07
GET /api/price/range?date_from=2020-01-01&date_to=2020-01-07
```

## Error responses

On server errors all endpoints return HTTP `500` with:

```json
{ "error": "..." }
```
