-- Power To Heat - Database Initialization
CREATE TABLE IF NOT EXISTS hourly_weather_data (
    datetime            TIMESTAMPTZ PRIMARY KEY,
    temp                NUMERIC,
    temp_min            NUMERIC,
    temp_max            NUMERIC,
    wind_speed          NUMERIC,
    weather_main        TEXT,
    weather_description TEXT
);

CREATE TABLE IF NOT EXISTS hourly_price_data (
    datetime            TIMESTAMPTZ PRIMARY KEY,
    price_eur_mwhe      NUMERIC
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weather_datetime ON hourly_weather_data(datetime);
CREATE INDEX IF NOT EXISTS idx_price_datetime   ON hourly_price_data(datetime);

SELECT '✅ Tables created successfully!' as status;