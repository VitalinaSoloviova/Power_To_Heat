import pandas as pd

def buildDailyPrice(data: pd.DataFrame):
    daily_price = (
        data.groupby(["date", "year", "month", "day"], as_index=False)
        .agg(
            avg_price=("Price (EUR/MWhe)", "mean")
        )
    )

    return daily_price

def buildMonthDayPriceProfile(daily_price: pd.DataFrame):
    month_day_price = (
        daily_price.groupby(["month", "day"], as_index=False)
        .agg(
            avg_price=("avg_price", "mean")
        )
    )

    return month_day_price