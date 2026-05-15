import type { UiHourData } from "./uiDataProfile";
import { type CityProfile, city } from "./CityData";

export type Granularity = 'hourly' | 'daily'

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
    weatherDates: string[]
    priceDates: string[]
}

export class DataResolver {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    public async getUiDataProfile(
        periodStart: Date,
        periodEnd: Date,
        historicalData: number,
        granularity: Granularity = 'daily'
    ): Promise<UiDataProfileResult> {
        const currentYear = new Date().getFullYear()
        const yearFrom = currentYear - historicalData
        const dateFrom = new Date(yearFrom, periodStart.getMonth(), periodStart.getDate())
        const dateTo   = new Date(currentYear - 1, periodEnd.getMonth(), periodEnd.getDate())

        const [weatherData, priceData] = await Promise.all([
            this.fetchWeather(this.formatDate(dateFrom), this.formatDate(dateTo)),
            this.fetchPrice(this.formatDate(dateFrom), this.formatDate(dateTo)),
        ])

        const weatherDates = weatherData.map(r => r.datetime.slice(0, 10))
        const priceDates   = priceData.map(r => r.datetime.slice(0, 10))

        if (granularity === 'hourly') {
            const weatherMap = this.groupWeather(weatherData, this.calendarHourKey.bind(this))
            const priceMap   = this.groupPrice(priceData,   this.calendarHourKey.bind(this))
            const hours = this.eachHour(periodStart, periodEnd).map((dt) => {
                const key = this.calendarHourKey(dt)
                return this.buildEntry(dt, weatherMap.get(key), priceMap.get(key) ?? 0)
            })
            return { hours, weatherDates, priceDates }
        } else {
            const weatherMap = this.groupWeather(weatherData, this.calendarDayKey.bind(this))
            const priceMap   = this.groupPrice(priceData,   this.calendarDayKey.bind(this))
            const hours = this.eachDay(periodStart, periodEnd).map((dt) => {
                const key = this.calendarDayKey(dt)
                return this.buildEntry(dt, weatherMap.get(key), priceMap.get(key) ?? 0)
            })
            return { hours, weatherDates, priceDates }
        }
    }

    private buildEntry(dt: Date, weather: WeatherAvg | undefined, price: number): UiHourData {
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
    }

    private formatDate(date: Date): string {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    // "MM-DD-HH" — one bucket per calendar hour (UTC)
    private calendarHourKey(dt: Date): string {
        const m  = String(dt.getUTCMonth() + 1).padStart(2, '0')
        const d  = String(dt.getUTCDate()).padStart(2, '0')
        const hh = String(dt.getUTCHours()).padStart(2, '0')
        return `${m}-${d}-${hh}`
    }

    // "MM-DD" — one bucket per calendar day (UTC)
    private calendarDayKey(dt: Date): string {
        const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
        const d = String(dt.getUTCDate()).padStart(2, '0')
        return `${m}-${d}`
    }

    private eachHour(start: Date, end: Date): Date[] {
        const result: Date[] = []
        const cursor = new Date(start)
        cursor.setUTCHours(0, 0, 0, 0)
        const last = new Date(end)
        last.setUTCHours(23, 0, 0, 0)
        while (cursor <= last) {
            result.push(new Date(cursor))
            cursor.setUTCHours(cursor.getUTCHours() + 1)
        }
        return result
    }

    private eachDay(start: Date, end: Date): Date[] {
        const result: Date[] = []
        const cursor = new Date(start)
        cursor.setUTCHours(0, 0, 0, 0)
        const last = new Date(end)
        last.setUTCHours(0, 0, 0, 0)
        while (cursor <= last) {
            result.push(new Date(cursor))
            cursor.setUTCDate(cursor.getUTCDate() + 1)
        }
        return result
    }

    private average(values: number[]): number {
        return values.reduce((s, v) => s + v, 0) / values.length
    }

    private groupWeather(
        rows: WeatherRow[],
        keyFn: (dt: Date) => string
    ): Map<string, WeatherAvg> {
        const groups = new Map<string, WeatherRow[]>()
        for (const row of rows) {
            const key = keyFn(new Date(row.datetime))
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

    private groupPrice(
        rows: PriceRow[],
        keyFn: (dt: Date) => string
    ): Map<string, number> {
        const groups = new Map<string, number[]>()
        for (const row of rows) {
            const key = keyFn(new Date(row.datetime))
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
            city.households * city.heatloss_coefficent_kWperK * (city.targetInsideTemp - outsideTemp)
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
