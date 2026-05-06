// one entry per hour of data from the database
export type UiHourData = {
    datetime: Date
    weather: {
        temp: number
        minTemp: number
        maxTemp: number
        wind: number
        description: string
    }
    price: number
    energyDemand: number
}

export type UiDataProfile = {
    sliderRange: {
        periodStart: Date
        periodEnd: Date
    }
    period: UiHourData[]
    selectedDay: Date
}
