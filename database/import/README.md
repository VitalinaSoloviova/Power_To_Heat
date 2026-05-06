# Database Import

Python scripts that read weather and electricity price data from CSV files and write the raw hourly records into the Supabase database.

## Setup

1. Install dependencies:

```bash
pip install pandas sqlalchemy psycopg2-binary python-dotenv
```

2. Make sure the `.env` file in this directory contains the database URL:

```
DATABASE_URL=postgresql://...
```

3. Make sure the CSV source files are present at:
   - `data-tools/Bad_Homburg_Weather.csv` — hourly weather data for Bad Homburg
   - `data-tools/Germany.csv` — hourly electricity price data for Germany

4. Run the schema SQL in the Supabase SQL Editor before the first import (`database/schema.sql`).

## Running the import

From the `database/import/` directory:

```bash
python databaseImport.py
```

This clears the existing data in both tables and re-imports everything from the CSV files. Duplicate timestamps in the source data are dropped automatically.

## File overview

| File | Description |
|------|-------------|
| `databaseImport.py` | Entry point — orchestrates the full import pipeline |
| `WeatherdataReadCSV.py` | Reads the weather CSV and returns only the relevant columns |
| `PricedataReadCSV.py` | Reads the price CSV and returns only the relevant columns |

## What gets imported

### `hourly_weather_data`

One row per hour with raw weather observations.

| Column | Description |
|--------|-------------|
| `datetime` | UTC timestamp (primary key) |
| `temp` | Temperature in °C |
| `temp_min` | Minimum temperature in °C |
| `temp_max` | Maximum temperature in °C |
| `wind_speed` | Wind speed in m/s |
| `weather_main` | Weather category (e.g. `Clear`, `Rain`, `Snow`) |
| `weather_description` | Detailed weather description |

### `hourly_price_data`

One row per hour with the electricity spot price.

| Column | Description |
|--------|-------------|
| `datetime` | UTC timestamp (primary key) |
| `price_eur_mwhe` | Electricity price in EUR/MWh |
