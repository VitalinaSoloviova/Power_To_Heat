# Calculations

TypeScript modules that fetch data from the REST API, aggregate it, and produce the data structures consumed by the UI.

## Files

| File | Description |
|------|-------------|
| `uiCommunication.ts` | `ForecastService` class — fetches and processes data for the UI |
| `uiDataProfile.ts` | Type definitions for UI data (`UiDayData`, `UiDataProfile`) |
| `CityData.ts` | City configuration used for energy demand calculations |

---

## ForecastService (`uiCommunication.ts`)

The central class of this module. It fetches historical weather and price data from the REST API, averages them across multiple years into calendar-day profiles, and returns a list of `UiDayData` objects ready for the UI.

### Constructor

```ts
new ForecastService(baseUrl: string)
```

| Parameter | Description |
|-----------|-------------|
| `baseUrl` | Base URL of the REST API (e.g. `http://localhost:3001`) |

### Main method

```ts
getUiDataProfile(periodStart: Date, periodEnd: Date, historicalData: number): Promise<UiDayData[]>
```

| Parameter | Description |
|-----------|-------------|
| `periodStart` | Start of the period the user selected (day and month are used, year is ignored) |
| `periodEnd` | End of the period the user selected (day and month are used, year is ignored) |
| `historicalData` | Number of past years to include (e.g. `5` uses the last 5 complete years) |

**Returns** an array of `UiDayData` objects, one per calendar day in the period, sorted by date.

#### How it works

1. **Date range** — builds a fetch range from `(currentYear - historicalData)` to `(currentYear - 1)`, covering the same calendar period across multiple years.
2. **Fetch** — calls `/api/weather-profile/range` and `/api/price-profile/range` in parallel.
3. **Average by calendar day** — groups all fetched rows by month+day (`MM-DD`) and averages the values across years.
4. **Energy demand** — calculates energy demand per day using the city profile (see below).
5. **Return** — assembles and returns the sorted `UiDayData[]`.

---

## Data types (`uiDataProfile.ts`)

### `UiDayData`

Represents a single day in the UI period.

```ts
type UiDayData = {
    day: Date
    weather: {
        avgTemp: number
        minTemp: number
        maxTemp: number
        wind: number
        description: string   // e.g. "clear", "rain", "snow"
    }
    avgPrice: number          // average electricity price in EUR/MWh
    energyDemand: number      // estimated heating energy demand in kW
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
    period: UiDayData[]
    selectedDay: Date
}
```

---

## City configuration (`CityData.ts`)

Used by `ForecastService` to estimate heating energy demand.

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
