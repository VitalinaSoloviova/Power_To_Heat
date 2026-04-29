import type { UiDayData } from "./uiDataProfile";
import { type CityProfile, city } from "./CityData";


type WeatherRow = {
    date: string
    avg_temp: number
    min_temp: number
    max_temp: number
    avg_wind: number
    dominant_weather_main: string
}

type PriceRow = {
    date: string
    avg_price: number
}

class ForecastService {

    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    private formatDate(date: Date): string {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    private async fetchWeather(dateFrom: Date, dateTo: Date): Promise<WeatherRow[]> {
        const from = this.formatDate(dateFrom)
        const to = this.formatDate(dateTo)
        const res = await fetch(
            `${this.baseUrl}/api/weather-profile/range?date_from=${from}&date_to=${to}`
        )
        return res.json()
    }

    private async fetchPrice(dateFrom: Date, dateTo: Date): Promise<PriceRow[]> {
        const from = this.formatDate(dateFrom)
        const to = this.formatDate(dateTo)
        const res = await fetch(
            `${this.baseUrl}/api/price-profile/range?date_from=${from}&date_to=${to}`
        )
        return res.json()
    }


    private average(values: number[]): number {
        return values.reduce((sum, v) => sum + v, 0) / values.length
    }

    private groupAndAverageWeather(rows: WeatherRow[]): Map<string, WeatherRow> {
        const groups = new Map<string, WeatherRow[]>()
        for (const row of rows) {
            const key = row.date.slice(5) // "YYYY-MM-DD" → "MM-DD"
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(row)
        }
        const result = new Map<string, WeatherRow>()
        for (const [key, group] of groups) {
            result.set(key, {
                date: key,
                avg_temp: this.average(group.map(r => r.avg_temp)),
                min_temp: this.average(group.map(r => r.min_temp)),
                max_temp: this.average(group.map(r => r.max_temp)),
                avg_wind: this.average(group.map(r => r.avg_wind)),
                dominant_weather_main: group[group.length - 1].dominant_weather_main,
            })
        }
        return result
    }

    private groupAndAveragePrice(rows: PriceRow[]): Map<string, number> {
        const groups = new Map<string, number[]>()
        for (const row of rows) {
            const key = row.date.slice(5)
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(row.avg_price)
        }
        const result = new Map<string, number>()
        for (const [key, values] of groups) {
            result.set(key, this.average(values))
        }
        return result
    }

    private getEenergyDemand(outsideTemp: number, city: CityProfile) {
        return Math.max(
            0,              // returns 0 if result < 0 i.e. outsideTemp > insideTemp
            city.clients * 
            city.energyDemandPerPerson * 
            (city.targetInsideTemp - outsideTemp) // for MW => / 1000
        )
    }



    async getUiDataProfile(periodStart: Date, periodEnd: Date, historicalData: number): Promise<UiDayData[]> {
        // fetch-Range calculates the date range
        const currentYear = new Date().getFullYear()
        const yearFrom = currentYear - historicalData
        const dateFrom = new Date(yearFrom, periodStart.getMonth(), periodStart.getDate())
        const dateTo   = new Date(currentYear - 1, periodEnd.getMonth(), periodEnd.getDate())

        // etch weather and price data for the calculated range
        const [weatherData, priceData] = await Promise.all([
            this.fetchWeather(dateFrom, dateTo),
            this.fetchPrice(dateFrom, dateTo),
        ])

        // data avg calculations: group by calendar day (month+day) and average over the years
        const weatherByDay = this.groupAndAverageWeather(weatherData)
        const priceByDay   = this.groupAndAveragePrice(priceData)

        // buld UiDayData for each calendar day within the period
        const days: UiDayData[] = []
        for (const [key, weather] of weatherByDay) {
            days.push({
                day: new Date(`2000-${key}`),
                weather: {
                    avgTemp:     weather.avg_temp,
                    minTemp:     weather.min_temp,
                    maxTemp:     weather.max_temp,
                    wind:        weather.avg_wind,
                    description: weather.dominant_weather_main,
                },
                avgPrice:     priceByDay.get(key) ?? 0,
                energyDemand: this.getEenergyDemand(weather.avg_temp, city),
            })
        }
        console.log(days);

        return days.sort((a, b) => a.day.getTime() - b.day.getTime());
    }

}

export { ForecastService };