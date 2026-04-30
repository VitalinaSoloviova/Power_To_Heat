# REST API Server

Express-based REST API that serves weather and electricity price data from a PostgreSQL database.

## Setup

Set the following environment variable (e.g. in a `.env` file):

```
DATABASE_URL=postgres://user:password@host:5432/dbname
PORT=3001  # optional, defaults to 3001
```

## Running the server

```bash
npx tsx database/api/rest-server.ts
```

The server will be available at `http://localhost:3001`.

## Endpoints

All dates use the format `YYYY-MM-DD`.

### Weather Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather-profile/:date` | Weather profile for a single date |
| GET | `/api/weather-profile/range?date_from=...&date_to=...` | Weather profiles for a date range |

### Weather Condition Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather-condition-stats/:date` | Weather condition stats for a single date (ordered by rank) |
| GET | `/api/weather-condition-stats/range?date_from=...&date_to=...` | Weather condition stats for a date range |

### Price Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/price-profile/:date` | Electricity price profile for a single date |
| GET | `/api/price-profile/range?date_from=...&date_to=...` | Electricity price profiles for a date range |

## Example Requests

```bash
# Single date
GET /api/weather-profile/2024-01-15
GET /api/price-profile/2024-01-15

# Date range
GET /api/weather-profile/range?date_from=2024-01-01&date_to=2024-01-31
GET /api/price-profile/range?date_from=2024-01-01&date_to=2024-01-31
```

## Error Responses

On server errors, all endpoints return:

```json
{ "error": "..." }
```

with HTTP status `500`.
