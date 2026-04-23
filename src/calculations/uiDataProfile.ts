/* 
- slider is adjusted to some period, let say January -> sliderRange start 1.1 , end 30.1. (we assume all months to have only 30 days)
- rest of the values are derived from dataBase and Calculations
*/



// this represents a day within the sliderperiod
export type UiDayData = {
    day: number 
    weather: {
        minTemp: number
        maxTemp: number
        avgTemp: number
        wind: number

    }
    avgPrice: number
    energyDemand: number
}

// this represents the period and includes a list of UiDayData objects
export type UiDataProfile = {
    sliderRange: {
        periodStart: number
        periodEnd: number
    }
    period: UiDayData[] // limited to 30 days ?
    selectedDay: number
}