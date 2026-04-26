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

def MonthDayNumericProfile(full_daily_data: pd.DataFrame):
    month_day_numeric = (
        full_daily_data.groupby(["month", "day"], as_index=False)
        .agg(
            avg_temp=("avg_temp", "mean"),
            min_temp=("min_temp", "mean"),
            max_temp=("max_temp", "mean"),
            avg_wind=("avg_wind", "mean"),
        )
    )

    return month_day_numeric

def MonthDayWeatherCounts(full_daily_data: pd.DataFrame):
    month_day_weather_counts = (
        full_daily_data.groupby(["month", "day", "daily_weather_type"], as_index=False)
        .size()
        .rename(columns={"size": "count"})
    )

    return month_day_weather_counts

def addMonthDayWeatherShares(month_day_weather_counts: pd.DataFrame):
    totals = (
        month_day_weather_counts.groupby(["month", "day"], as_index=False)["count"]
        .sum()
        .rename(columns={"count": "total_count"})
    )

    month_day_weather_counts = month_day_weather_counts.merge(
        totals,
        on=["month", "day"],
        how="left"
    )

    month_day_weather_counts["share"] = (
        month_day_weather_counts["count"] / month_day_weather_counts["total_count"]
    )

    return month_day_weather_counts

def MonthDayDominantWeather(month_day_weather_counts: pd.DataFrame):
    sorted_weather = month_day_weather_counts.sort_values(
        ["month", "day", "count"],
        ascending=[True, True, False]
    )

    dominant_weather = (
        sorted_weather.groupby(["month", "day"], as_index=False)
        .first()
    )

    dominant_weather = dominant_weather.rename(
        columns={"daily_weather_type": "dominant_weather_main"}
    )

    return dominant_weather[["month", "day", "dominant_weather_main"]]

def FinalWeatherProfile(month_day_numeric: pd.DataFrame, dominant_weather: pd.DataFrame):
    final_profile = month_day_numeric.merge(
        dominant_weather,
        on=["month", "day"],
        how="left"
    )

    return final_profile

def buildWeatherConditionStatsForDB(month_day_weather_counts: pd.DataFrame):
    stats_for_db = month_day_weather_counts.copy()

    stats_for_db = stats_for_db.sort_values(
        ["month", "day", "count"],
        ascending=[True, True, False]
    ).reset_index(drop=True)

    stats_for_db["rank"] = stats_for_db.groupby(["month", "day"]).cumcount() + 1

    stats_for_db = stats_for_db.rename(columns={
        "daily_weather_type": "weather_main",
        "count": "occurrence_count",
        "share": "occurrence_share"
    })

    stats_for_db["weather_description"] = stats_for_db["weather_main"]

    return stats_for_db[[
        "month",
        "day",
        "weather_main",
        "weather_description",
        "occurrence_count",
        "occurrence_share",
        "rank"
    ]]