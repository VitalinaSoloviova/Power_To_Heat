# Calculations

TypeScript modules that fetch hourly data from the REST API, average it across historical years, and produce the data structures consumed by the UI.

## Files

| File | Description |
|------|-------------|
| `DataResolver.ts` | `DataResolver` class — fetches and processes data for the UI |
| `uiDataProfile.ts` | Type definitions for UI data (`UiHourData`, `UiDataProfile`) |
| `CityData.ts` | City configuration used for energy demand calculations |

---

## DataResolver (`DataResolver.ts`)

The central class of this module. It fetches historical hourly weather and price data from the REST API, groups and averages them per calendar bucket across multiple years, and returns a list of `UiHourData` objects ready for the UI.

### Constructor

```ts
new DataResolver(baseUrl: string)
```

| Parameter | Description |
|-----------|-------------|
| `baseUrl` | Base URL of the REST API (e.g. `http://localhost:3001`) |

### Main method

```ts
getUiDataProfile(
  periodStart: Date,
  periodEnd: Date,
  historicalData: number,
  granularity?: Granularity   // 'daily' (default) | 'hourly'
): Promise<UiDataProfileResult>
```

| Parameter | Description |
|-----------|-------------|
| `periodStart` | Start of the requested period |
| `periodEnd` | End of the requested period |
| `historicalData` | Number of past years to average (e.g. `5` uses the last 5 complete years) |
| `granularity` | `'daily'` — one entry per day (default); `'hourly'` — one entry per hour |

**Returns** `UiDataProfileResult`:

| Field | Description |
|-------|-------------|
| `hours` | `UiHourData[]` — one entry per day or hour in the period, sorted ascending |
| `weatherDates` | Raw date strings of fetched weather rows (used for data coverage calculation) |
| `priceDates` | Raw date strings of fetched price rows (used for data coverage calculation) |

#### How it works

1. **Date range** — builds a fetch range from `(currentYear - historicalData)` to `(currentYear - 1)`, covering the same calendar period across multiple years.
2. **Fetch** — calls `/api/weather/range` and `/api/price/range` in parallel.
3. **Group & average** — groups all fetched rows by calendar bucket (UTC) and averages across years:
   - `'daily'` → bucket key `MM-DD`, one entry per calendar day
   - `'hourly'` → bucket key `MM-DD-HH`, one entry per calendar hour
4. **Temperature range** — `minTemp` = `MIN` of all `temp_min` values in the bucket, `maxTemp` = `MAX` of all `temp_max` values, `temp` = `(minTemp + maxTemp) / 2`.
5. **Energy demand** — calculated per entry using the city profile (see below).
6. **Return** — generates every day or hour in the period; entries with no historical data are zero-filled.

---

## Data types (`uiDataProfile.ts`)

### `UiHourData`

Represents one entry in the UI period (one hour or one day depending on granularity).

```ts
type UiHourData = {
    datetime: Date
    weather: {
        temp: number        // midpoint temperature in °C: (minTemp + maxTemp) / 2
        minTemp: number     // minimum temperature across all matching historical entries
        maxTemp: number     // maximum temperature across all matching historical entries
        wind: number        // average wind speed in m/s
        description: string // weather category, e.g. "Clear", "Rain", "Snow"
    }
    price: number           // average electricity price in EUR/MWh (0 if unavailable)
    energyDemand: number    // estimated heating energy demand in kW
}
```

### `UiDataProfile`

Wraps the full period including the slider range and the selected day.

```ts
type UiDataProfile = {
    sliderRange: {
        periodStart: Date
        periodEnd: Date
    }
    period: UiHourData[]
    selectedDay: Date
}
```

---

## City configuration (`CityData.ts`)

Used by `DataResolver` to estimate heating energy demand.

```ts
const city: CityProfile = {
    clients: 60000,              // number of residents
    targetInsideTemp: 20,        // target indoor temperature in °C
    energyDemandPerPerson: 0.1   // kW per person per 1 °C temperature difference
}
```

### Energy demand formula

```
energyDemand = max(0, clients × energyDemandPerPerson × (targetInsideTemp − outsideTemp))
```

The result is `0` when the outside temperature exceeds the target indoor temperature (no heating needed).
