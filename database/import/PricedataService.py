import pandas as pd

def buildDailyPrice(data: pd.DataFrame):
    daily_price = (
        data.groupby(["date", "year", "month", "day"], as_index=False)
        .agg(
            avg_price=("Price (EUR/MWhe)", "mean")
        )
    )

    return daily_price

def buildDailyPriceProfileForDB(daily_price: pd.DataFrame):
    return daily_price[["date", "avg_price"]].copy()