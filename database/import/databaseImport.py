import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import WeatherdataReadCSV
import WeatherdataService
import PricedataReadCSV
import PricedataService

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL fehlt in .env")
    
engine = create_engine(DATABASE_URL)

def replaceTable(table_name: str):
        with engine.begin() as conn:
            conn.execute(text(f"delete from {table_name}"))

def main():
    # importig Weather data from CSV, preparing it and building the final profile for the database
    weatherdata = WeatherdataReadCSV.readCSV("../../data-tools/Bad_Homburg_Weather.csv")
    weatherdata = WeatherdataReadCSV.prepDateColumns(weatherdata)
    weatherdata = WeatherdataReadCSV.prepareNumericColumns(weatherdata)

    daily_data = WeatherdataService.buildDailyNumeric(weatherdata)

    daily_weather_counts = WeatherdataService.DailyWeatherCounts(weatherdata)
    daily_weather_counts = WeatherdataService.addWeatherShares(daily_weather_counts)

    daily_weather_type = WeatherdataService.DailyWeatherType(daily_weather_counts)

    full_daily_data = WeatherdataService.mergeDailyData(daily_data, daily_weather_type)

    month_day_numeric = WeatherdataService.MonthDayNumericProfile(full_daily_data)
    month_day_weather_counts = WeatherdataService.MonthDayWeatherCounts(full_daily_data)
    month_day_weather_counts = WeatherdataService.addMonthDayWeatherShares(month_day_weather_counts)
    dominant_weather = WeatherdataService.MonthDayDominantWeather(month_day_weather_counts)

    final_profile = WeatherdataService.FinalWeatherProfile(month_day_numeric, dominant_weather)

    weather_stats_for_db = WeatherdataService.buildWeatherConditionStatsForDB(month_day_weather_counts)

    print("Delete old data ...")
    replaceTable("daily_weather_condition_stats")
    replaceTable("daily_weather_profile")

    print("Write daily_weather_profile ...")
    final_profile.to_sql("daily_weather_profile", engine, if_exists="append", index=False)

    print("Write daily_weather_condition_stats ...")
    weather_stats_for_db.to_sql("daily_weather_condition_stats", engine, if_exists="append", index=False)


    # importing Price data from CSV, preparing it and building the final profile for the database
    pricedata = PricedataReadCSV.readCSV("../../data-tools/Germany.csv")
    pricedata = PricedataReadCSV.prepareDateColumns(pricedata)
    pricedata = PricedataReadCSV.prepareNumericColumns(pricedata)

    daily_price = PricedataService.buildDailyPrice(pricedata)
    month_day_price = PricedataService.buildMonthDayPriceProfile(daily_price)

    print("Delete old Preisdaten ...")
    replaceTable("daily_price_profile")

    print("Writing daily_price_profile ...")
    month_day_price.to_sql("daily_price_profile", engine, if_exists="append", index=False)

if __name__ == "__main__":    
    main()