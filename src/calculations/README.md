# Calculations

TypeScript modules that fetch hourly data from the REST API, average it across historical years, and produce the data structures consumed by the UI.

## Files

| File | Description |
|------|-------------|
| `DataResolver.ts` | `DataResolver` class — fetches and processes hourly data for the UI |
| `uiDataProfile.ts` | Type definitions for UI data (`UiHourData`, `UiDataProfile`) |
| `CityData.ts` | City configuration used for energy demand calculations |

---

## DataResolver (`DataResolver.ts`)

The central class of this module. It fetches historical hourly weather and price data from the REST API, averages them per calendar hour (`MM-DD-HH`) across multiple years, and returns a list of `UiHourData` objects ready for the UI.

### Constructor

```ts
new DataResolver(baseUrl: string)
```

| Parameter | Description |
|-----------|-------------|
| `baseUrl` | Base URL of the REST API (e.g. `http://localhost:3001`) |

### Main method

```ts
getUiDataProfile(periodStart: Date, periodEnd: Date, historicalData: number): Promise<UiDataProfileResult>
```

| Parameter | Description |
|-----------|-------------|
| `periodStart` | Start of the requested period |
| `periodEnd` | End of the requested period |
| `historicalData` | Number of past years to average (e.g. `5` uses the last 5 complete years) |

**Returns** `{ hours: UiHourData[] }` — one entry per hour in the period, sorted ascending.

#### How it works

1. **Date range** — builds a fetch range from `(currentYear - historicalData)` to `(currentYear - 1)`, covering the same calendar period across multiple years.
2. **Fetch** — calls `/api/weather/range` and `/api/price/range` in parallel.
3. **Average by calendar hour** — groups all fetched rows by `MM-DD-HH` (UTC) and averages values across years.
4. **Energy demand** — calculates heating energy demand per hour using the city profile.
5. **Return** — generates every hour in the period; hours with no historical data get zero-filled entries.

---

## Data types (`uiDataProfile.ts`)

### `UiHourData`

Represents a single hour in the UI period.

```ts
type UiHourData = {
    datetime: Date
    weather: {
        temp: number       // average temperature in °C
        minTemp: number    // average of hourly min temperatures in °C
        maxTemp: number    // average of hourly max temperatures in °C
        wind: number       // average wind speed in m/s
        description: string // weather category, e.g. "Clear", "Rain", "Snow"
    }
    price: number          // average electricity price in EUR/MWh (0 if unavailable)
    energyDemand: number   // estimated heating energy demand in kW
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
