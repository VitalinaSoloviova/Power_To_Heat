-- Power To Heat - Database Initialization + Sample Data

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

CREATE INDEX IF NOT EXISTS idx_weather_datetime ON hourly_weather_data(datetime);
CREATE INDEX IF NOT EXISTS idx_price_datetime   ON hourly_price_data(datetime);

-- Insert sample data for May 2026 (so charts show something)
INSERT INTO hourly_price_data (datetime, price_eur_mwhe)
VALUES 
    ('2026-05-09 10:00:00+00', 85.4),
    ('2026-05-09 11:00:00+00', 92.1),
    ('2026-05-09 12:00:00+00', 78.5),
    ('2026-05-10 10:00:00+00', 65.3),
    ('2026-05-10 11:00:00+00', 70.8)
ON CONFLICT (datetime) DO NOTHING;

INSERT INTO hourly_weather_data (datetime, temp, temp_min, temp_max, wind_speed, weather_main, weather_description)
VALUES 
    ('2026-05-09 10:00:00+00', 14.2, 13.5, 15.1, 12.4, 'Clouds', 'Few clouds'),
    ('2026-05-09 11:00:00+00', 15.8, 14.9, 16.3, 14.1, 'Clear', 'Clear sky'),
    ('2026-05-10 10:00:00+00', 13.9, 12.8, 14.5, 8.7, 'Rain', 'Light rain')
ON CONFLICT (datetime) DO NOTHING;

SELECT '✅ Tables + Sample Data initialized!' as status;