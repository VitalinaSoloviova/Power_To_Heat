import pandas as pd
import numpy as np
from sqlalchemy import text 

# build daily data so we only have dates without hours, minutes, seconds
def buildDailyNumeric(data: pd.DataFrame):
    daily_data = (
        data.groupby(["date", "year", "month", "day"], as_index=False)
        .agg(
            avg_temp=("temp", "mean"),
            min_temp=("temp_min", "mean"),
            max_temp=("temp_max", "mean"),
            avg_wind=("wind_speed", "mean"),
        )
    )

    return daily_data

def DailyWeatherCounts(data: pd.DataFrame):
    daily_weather_counts = (
        data.groupby(["date", "year", "month", "day", "weather_main", "weather_description"], as_index=False)
        .size()
        .rename(columns={"size": "count"})
    )

    return daily_weather_counts

def addWeatherShares(daily_weather_counts: pd.DataFrame):
    totals = (
        daily_weather_counts.groupby(["date"], as_index=False)["count"]
        .sum()
        .rename(columns={"count": "total_count"})
    )

    daily_weather_counts = daily_weather_counts.merge(totals, on="date", how="left")
    daily_weather_counts["share"] = daily_weather_counts["count"] / daily_weather_counts["total_count"]

    return daily_weather_counts

def chooseDailyWeather(one_day_weather: pd.DataFrame):
    shares = {}

    for _, row in one_day_weather.iterrows():
        main = str(row["weather_main"]).strip().lower()
        share = row["share"]

        shares[main] = shares.get(main, 0) + share

    rain_share = shares.get("rain", 0) + shares.get("drizzle", 0)
    fog_share = shares.get("fog", 0) + shares.get("mist", 0) + shares.get("haze", 0)

    if shares.get("thunderstorm", 0) >= 0.05:
        return "thunderstorm"

    if shares.get("snow", 0) >= 0.10:
        return "snow"

    if rain_share >= 0.15:
        return "rain"

    if fog_share >= 0.15:
        return "fog"

    if shares.get("clear", 0) >= 0.25:
        return "clear"

    return "clouds"

def DailyWeatherType(daily_weather_counts: pd.DataFrame):
    rows = []

    for (date, year, month, day), one_day_weather in daily_weather_counts.groupby(
        ["date", "year", "month", "day"]
    ):
        weather_type = chooseDailyWeather(one_day_weather)

        rows.append({
            "date": date,
            "year": year,
            "month": month,
            "day": day,
            "daily_weather_type": weather_type
        })

    return pd.DataFrame(rows)

def mergeDailyData(daily_data: pd.DataFrame, daily_weather_type: pd.DataFrame):
    full_daily_data = daily_data.merge(
        daily_weather_type,
        on=["date", "year", "month", "day"],
        how="left"
    )

    return full_daily_data

def buildDailyWeatherProfileForDB(full_daily_data: pd.DataFrame):
    profile = full_daily_data[["date", "avg_temp", "min_temp", "max_temp", "avg_wind", "daily_weather_type"]].copy()
    profile = profile.rename(columns={"daily_weather_type": "dominant_weather_main"})
    return profile

def buildWeatherConditionStatsForDB(daily_weather_counts: pd.DataFrame):
    stats_for_db = (
        daily_weather_counts.groupby(["date", "weather_main"], as_index=False)
        .agg(occurrence_count=("count", "sum"))
    )

    totals = stats_for_db.groupby("date")["occurrence_count"].transform("sum")
    stats_for_db["occurrence_share"] = stats_for_db["occurrence_count"] / totals

    stats_for_db = stats_for_db.sort_values(
        ["date", "occurrence_count"],
        ascending=[True, False]
    ).reset_index(drop=True)

    stats_for_db["rank"] = stats_for_db.groupby(["date"]).cumcount() + 1
    stats_for_db["weather_description"] = stats_for_db["weather_main"]

    return stats_for_db[[
        "date",
        "weather_main",
        "weather_description",
        "occurrence_count",
        "occurrence_share",
        "rank"
    ]]