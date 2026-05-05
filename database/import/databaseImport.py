import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import WeatherdataReadCSV
import PricedataReadCSV

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL fehlt in .env")

engine = create_engine(DATABASE_URL)

def clearTable(table_name: str):
    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM {table_name}"))

def main():
    weather = WeatherdataReadCSV.readCSV("../../data-tools/Bad_Homburg_Weather.csv")
    weather = weather.drop_duplicates(subset=["datetime"])
    print("Delete old weather data...")
    clearTable("hourly_weather_data")
    print(f"Writing {len(weather)} rows to hourly_weather_data...")
    weather.to_sql("hourly_weather_data", engine, if_exists="append", index=False)

    price = PricedataReadCSV.readCSV("../../data-tools/Germany.csv")
    price = price.drop_duplicates(subset=["datetime"])
    print("Delete old price data...")
    clearTable("hourly_price_data")
    print(f"Writing {len(price)} rows to hourly_price_data...")
    price.to_sql("hourly_price_data", engine, if_exists="append", index=False)

if __name__ == "__main__":
    main()
