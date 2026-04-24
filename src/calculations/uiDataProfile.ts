/* 
- slider is adjusted to some period, let say January -> sliderRange start 1.1 , end 30.1. (we assume all months to have only 30 days)
- rest of the values are derived from dataBase and Calculations
*/

export type WeatherDescriptions = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy' | 'clear';

// this represents a day within the sliderperiod
export type UiDayData = {
    day: Date 
    weather: {
        minTemp: number
        maxTemp: number
        avgTemp: number
        wind: number
        description:  WeatherDescriptions[]
    }
    avgPrice: number
    energyDemand: number
}

// this represents the period and includes a list of UiDayData objects
export type UiDataProfile = {
    sliderRange: {
        periodStart: Date
        periodEnd: Date
    }
    period: UiDayData[] 
    selectedDay: Date
}