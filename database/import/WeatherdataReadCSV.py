import pandas as pd


def readCSV(path:str) -> pd.DataFrame:
    data = pd.read_csv(path, sep=";")

    return data

def prepDateColumns(data:pd.DataFrame):
    date_strings = data["dt_iso"].astype(str)
    date_strings = date_strings.str.replace(" +0000 UTC", "", regex=False)
    data["dt_iso"] = pd.to_datetime(date_strings, errors="coerce", utc=True)

    data["date"] = data["dt_iso"].dt.date
    data["year"] = data["dt_iso"].dt.year
    data["month"] = data["dt_iso"].dt.month
    data["day"] = data["dt_iso"].dt.day

    return data


def prepareNumericColumns(data: pd.DataFrame):
    numeric_columns = ["temp", "temp_min", "temp_max", "wind_speed"]

    for col in numeric_columns:
        data[col] = pd.to_numeric(data[col], errors="coerce")

    return data

