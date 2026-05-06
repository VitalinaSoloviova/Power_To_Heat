-- Supabase Schema: Power To Heat
-- Run this in the Supabase SQL Editor before importing CSV data.

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
