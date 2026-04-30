# Database Import

Python scripts that read weather and electricity price data from CSV files, process them, and write the results into a PostgreSQL database.

## Setup

1. Install dependencies:

```bash
pip install pandas sqlalchemy psycopg2-binary python-dotenv numpy
```

2. Create a `.env` file in this directory:

```
DATABASE_URL=postgres://user:password@host:5432/dbname
```

3. Make sure the CSV source files are present at:
   - `data-tools/Bad_Homburg_Weather.csv` — hourly weather data for Bad Homburg
   - `data-tools/Germany.csv` — hourly electricity price data for Germany

## Running the import

From the `database/import/` directory:

```bash
python databaseImport.py
```

This will clear the existing data in all three tables and re-import everything from the CSV files.

## File overview

| File | Description |
|------|-------------|
| `databaseImport.py` | Entry point — orchestrates the full import pipeline |
| `WeatherdataReadCSV.py` | Reads and parses the weather CSV file |
| `WeatherdataService.py` | Aggregates hourly weather data into daily profiles |
| `PricedataReadCSV.py` | Reads and parses the electricity price CSV file |
| `PricedataService.py` | Aggregates hourly price data into daily averages |

## What gets imported

### `daily_weather_profile`
One row per day with aggregated temperature, wind speed, and a dominant weather type.

| Column | Description |
|--------|-------------|
| `date` | Date |
| `avg_temp` | Average temperature (°C) |
| `min_temp` | Average of daily minimum temperatures |
| `max_temp` | Average of daily maximum temperatures |
| `avg_wind` | Average wind speed (m/s) |
| `dominant_weather_main` | Most representative weather type for the day (e.g. `clear`, `rain`, `snow`) |

The dominant weather type is determined by the share of hourly observations per category, with priority rules:
- `thunderstorm` ≥ 5 %
- `snow` ≥ 10 %
- `rain` / `drizzle` combined ≥ 15 %
- `fog` / `mist` / `haze` combined ≥ 15 %
- `clear` ≥ 25 %
- otherwise: `clouds`

### `daily_weather_condition_stats`
One row per day and weather category, ranked by frequency.

| Column | Description |
|--------|-------------|
| `date` | Date |
| `weather_main` | Weather category (e.g. `Rain`, `Clear`) |
| `weather_description` | Same as `weather_main` |
| `occurrence_count` | Number of hourly observations for this category |
| `occurrence_share` | Share of observations relative to all observations that day |
| `rank` | Rank by frequency (1 = most frequent) |

### `daily_price_profile`
One row per day with the average electricity price.

| Column | Description |
|--------|-------------|
| `date` | Date |
| `avg_price` | Average electricity price (EUR/MWh) |
