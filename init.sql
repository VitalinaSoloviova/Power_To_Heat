-- Initialize database tables for Power To Heat

CREATE TABLE IF NOT EXISTS hourly_weather_data (
    datetime            TIMESTAMPTZ  PRIMARY KEY,
    temp                NUMERIC,
    temp_min            NUMERIC,
    temp_max            NUMERIC,
    wind_speed          NUMERIC,
    weather_main        TEXT,
    weather_description TEXT
);

CREATE TABLE IF NOT EXISTS hourly_price_data (
    datetime        TIMESTAMPTZ  PRIMARY KEY,
    price_eur_mwhe  NUMERIC
);

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weather_datetime ON hourly_weather_data(datetime);
CREATE INDEX IF NOT EXISTS idx_price_datetime ON hourly_price_data(datetime);

SELECT 'Database tables initialized successfully!' AS message;