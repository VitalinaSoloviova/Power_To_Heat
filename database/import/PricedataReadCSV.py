import pandas as pd

def readCSV(path:str):
    data = pd.read_csv(path, sep=",")
    return data

def prepareDateColumns(data: pd.DataFrame):
    data["Datetime (UTC)"] = pd.to_datetime(
        data["Datetime (UTC)"],
        errors="coerce",
        utc=True
    )

    data["date"] = data["Datetime (UTC)"].dt.date
    data["year"] = data["Datetime (UTC)"].dt.year
    data["month"] = data["Datetime (UTC)"].dt.month
    data["day"] = data["Datetime (UTC)"].dt.day

    return data

def prepareNumericColumns(data: pd.DataFrame):
    data["Price (EUR/MWhe)"] = pd.to_numeric(data["Price (EUR/MWhe)"], errors="coerce")
    return data