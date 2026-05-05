import type { UiHourData } from "./uiDataProfile";
import { type CityProfile, city } from "./CityData";

type WeatherRow = {
    datetime: string
    temp: number
    temp_min: number
    temp_max: number
    wind_speed: number
    weather_main: string
}

type PriceRow = {
    datetime: string
    price_eur_mwhe: number
}

type WeatherAvg = {
    temp: number
    minTemp: number
    maxTemp: number
    wind: number
    description: string
}

export interface UiDataProfileResult {
    hours: UiHourData[]
}

export class DataResolver {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    public async getUiDataProfile(
        periodStart: Date,
        periodEnd: Date,
        historicalData: number
    ): Promise<UiDataProfileResult> {
        const currentYear = new Date().getFullYear()
        const yearFrom = currentYear - historicalData
        const dateFrom = new Date(yearFrom, periodStart.getMonth(), periodStart.getDate())
        const dateTo   = new Date(currentYear - 1, periodEnd.getMonth(), periodEnd.getDate())

        const [weatherData, priceData] = await Promise.all([
            this.fetchWeather(this.formatDate(dateFrom), this.formatDate(dateTo)),
            this.fetchPrice(this.formatDate(dateFrom), this.formatDate(dateTo)),
        ])

        const weatherByHour = this.groupAndAverageWeather(weatherData)
        const priceByHour   = this.groupAndAveragePrice(priceData)

        const hours: UiHourData[] = this.eachHour(periodStart, periodEnd).map((dt) => {
            const key     = this.calendarHourKey(dt)
            const weather = weatherByHour.get(key)
            const price   = priceByHour.get(key) ?? 0
            if (!weather) return this.emptyHour(dt)
            return {
                datetime: dt,
                weather: {
                    temp:        weather.temp,
                    minTemp:     weather.minTemp,
                    maxTemp:     weather.maxTemp,
                    wind:        weather.wind,
                    description: weather.description,
                },
                price,
                energyDemand: this.getEnergyDemand(weather.temp, city),
            }
        })

        return { hours }
    }

    private formatDate(date: Date): string {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    // "MM-DD-HH" — calendar key for grouping across years (UTC to match DB timestamps)
    private calendarHourKey(dt: Date): string {
        const m  = String(dt.getUTCMonth() + 1).padStart(2, '0')
        const d  = String(dt.getUTCDate()).padStart(2, '0')
        const hh = String(dt.getUTCHours()).padStart(2, '0')
        return `${m}-${d}-${hh}`
    }

    private eachHour(start: Date, end: Date): Date[] {
        const hours: Date[] = []
        const cursor = new Date(start)
        cursor.setUTCHours(0, 0, 0, 0)
        const last = new Date(end)
        last.setUTCHours(23, 0, 0, 0)
        while (cursor <= last) {
            hours.push(new Date(cursor))
            cursor.setUTCHours(cursor.getUTCHours() + 1)
        }
        return hours
    }

    private average(values: number[]): number {
        return values.reduce((s, v) => s + v, 0) / values.length
    }

    private groupAndAverageWeather(rows: WeatherRow[]): Map<string, WeatherAvg> {
        const groups = new Map<string, WeatherRow[]>()
        for (const row of rows) {
            const key = this.calendarHourKey(new Date(row.datetime))
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(row)
        }
        const result = new Map<string, WeatherAvg>()
        for (const [key, group] of groups) {
            const minTemp = Math.min(...group.map(r => Number(r.temp_min)))
            const maxTemp = Math.max(...group.map(r => Number(r.temp_max)))
            result.set(key, {
                temp:        (minTemp + maxTemp) / 2,
                minTemp,
                maxTemp,
                wind:        this.average(group.map(r => Number(r.wind_speed))),
                description: group[group.length - 1].weather_main,
            })
        }
        return result
    }

    private groupAndAveragePrice(rows: PriceRow[]): Map<string, number> {
        const groups = new Map<string, number[]>()
        for (const row of rows) {
            const key = this.calendarHourKey(new Date(row.datetime))
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(Number(row.price_eur_mwhe))
        }
        const result = new Map<string, number>()
        for (const [key, values] of groups) {
            result.set(key, this.average(values))
        }
        return result
    }

    private async fetchWeather(from: string, to: string): Promise<WeatherRow[]> {
        const res = await fetch(`${this.baseUrl}/api/weather/range?date_from=${from}&date_to=${to}`)
        return res.json() as Promise<WeatherRow[]>
    }

    private async fetchPrice(from: string, to: string): Promise<PriceRow[]> {
        const res = await fetch(`${this.baseUrl}/api/price/range?date_from=${from}&date_to=${to}`)
        return res.json() as Promise<PriceRow[]>
    }

    private getEnergyDemand(outsideTemp: number, city: CityProfile) {
        return Math.max(
            0,
            city.clients * city.energyDemandPerPerson * (city.targetInsideTemp - outsideTemp)
        )
    }

    private emptyHour(dt: Date): UiHourData {
        return {
            datetime: dt,
            weather: { temp: 0, minTemp: 0, maxTemp: 0, wind: 0, description: '' },
            price: 0,
            energyDemand: 0,
        }
    }
}
