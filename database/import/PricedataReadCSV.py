import pandas as pd


def readCSV(path: str) -> pd.DataFrame:
    data = pd.read_csv(path, sep=",")

    data["datetime"] = pd.to_datetime(data["Datetime (UTC)"], errors="coerce", utc=True)
    data["price_eur_mwhe"] = pd.to_numeric(data["Price (EUR/MWhe)"], errors="coerce")

    return data[["datetime", "price_eur_mwhe"]].copy()
