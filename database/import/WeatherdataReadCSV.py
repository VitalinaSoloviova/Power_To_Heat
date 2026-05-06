import pandas as pd


def readCSV(path: str) -> pd.DataFrame:
    data = pd.read_csv(path, sep=";")

    date_strings = data["dt_iso"].astype(str).str.replace(" +0000 UTC", "", regex=False)
    data["datetime"] = pd.to_datetime(date_strings, errors="coerce", utc=True)

    for col in ["temp", "temp_min", "temp_max", "wind_speed"]:
        data[col] = pd.to_numeric(data[col], errors="coerce")

    return data[["datetime", "temp", "temp_min", "temp_max", "wind_speed", "weather_main", "weather_description"]].copy()
