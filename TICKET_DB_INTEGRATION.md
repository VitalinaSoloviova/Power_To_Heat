# Development Ticket: Integrate Database-Backed Data into Simulation Services

## Issue Summary

**Objective**: Replace mocked simulation data with real database-backed data while maintaining the existing clean architecture pattern.

**Priority**: High  
**Complexity**: Medium  
**Estimated Effort**: 2-3 days  

## Current State Analysis

### Architecture Overview
The application currently has a well-structured service architecture:

```
UIService (orchestrator)
├── SimulationUIService → PowerGenerationResolver, CityDemandResolver, EnergyStorageResolver
└── ChartUIService → ChartDataResolver
```

### What's Already Implemented ✅

1. **Service Architecture**: Clean separation between UI orchestration and domain logic
2. **Database Infrastructure**: 
   - Supabase database with `hourly_weather_data` and `hourly_price_data` tables
   - REST API server (`database/api/rest-server.ts`) serving `/api/weather/range` and `/api/price/range`
3. **Data Access Layer**: `DataResolver` in `src/calculations/` that can fetch historical data from the database API
4. **Type System**: Well-defined types in `src/services/types/SimulationTypes.ts`

### What's Currently Mocked ❌

1. **PowerGenerationResolver** (`src/services/resolvers/PowerGenerationResolver.ts`)
   - Uses simple formula-based wind/solar power calculation
   - Uses static weather input instead of historical weather data
   - **Mocked Elements**: Wind power curve, solar power curve with cloud coverage

2. **CityDemandResolver** (`src/services/resolvers/CityDemandResolver.ts`)  
   - Uses basic temperature-based demand calculation
   - Uses single temperature value instead of hourly temperature data
   - **Mocked Elements**: Demand calculation based on comfort temperature deviation

3. **EnergyStorageResolver** (`src/services/resolvers/EnergyStorageResolver.ts`)
   - Logic is correct but operates on mocked generation/demand data
   - **Mocked Elements**: Indirectly mocked through dependency on mocked generation/demand

## Missing Integration Points

### 1. Historical Data Service Layer
**Problem**: No service layer to bridge the existing `DataResolver` with the simulation resolvers.

**Solution**: Create new data service classes that can fetch and transform database data for simulation use.

### 2. Input Data Transformation
**Problem**: `SimulationInput` currently uses single-point weather data, but database contains time-series.

**Solution**: Extend types and resolvers to handle time-series weather/price data.

### 3. Time Range Coordination
**Problem**: Simulation duration is specified by `forecastHours`, but database lookups need date ranges.

**Solution**: Add date range resolution logic to map simulation periods to database queries.

## Implementation Plan

### Phase 1: Create Database-Backed Data Services

**Files to Create:**
- `src/services/data/WeatherDataService.ts` - Fetch historical weather data for simulation periods
- `src/services/data/PriceDataService.ts` - Fetch historical price data for simulation periods  
- `src/services/data/DataServiceContainer.ts` - Dependency injection container for data services

**Files to Modify:**
- `src/services/types/SimulationTypes.ts` - Add time-series input types

### Phase 2: Update Resolvers to Use Real Data

**Files to Modify:**
- `src/services/resolvers/PowerGenerationResolver.ts`
  - Inject `WeatherDataService` 
  - Use real hourly temperature, wind speed, cloud coverage from database
  - Keep existing power calculation formulas as baseline (can be refined later)

- `src/services/resolvers/CityDemandResolver.ts`
  - Inject `WeatherDataService` and `PriceDataService`
  - Use real hourly temperature data for demand calculation
  - Consider price trends for demand forecasting

- `src/services/ui/SimulationUIService.ts` 
  - Inject data services
  - Pass database-backed weather/price data to resolvers

### Phase 3: Coordinate Time Ranges

**Files to Modify:**
- `src/services/types/SimulationTypes.ts` - Add date range fields to `SimulationInput`
- Components calling `UIService.getUIData()` - Provide date ranges alongside city config

### Phase 4: Integration Testing

**Files to Create:**
- `src/services/integration/SimulationIntegration.test.ts` - End-to-end test with real database calls

## Detailed Implementation Steps

### Step 1: Create Weather Data Service

```typescript
// src/services/data/WeatherDataService.ts
export interface WeatherTimeSeriesPoint {
  timestamp: string;
  temperature: number;
  windSpeed: number;
  cloudCoverage: number; // derived from weather_main/weather_description
}

export class WeatherDataService {
  constructor(private dataResolver: DataResolver) {}
  
  async getWeatherTimeSeries(startDate: Date, endDate: Date): Promise<WeatherTimeSeriesPoint[]> {
    // Use existing DataResolver to fetch data
    // Transform weather_main into cloud coverage estimates
    // Return structured time series
  }
}
```

### Step 2: Create Price Data Service

```typescript
// src/services/data/PriceDataService.ts  
export interface PriceTimeSeriesPoint {
  timestamp: string;
  priceEurMwh: number;
}

export class PriceDataService {
  async getPriceTimeSeries(startDate: Date, endDate: Date): Promise<PriceTimeSeriesPoint[]> {
    // Use existing DataResolver to fetch price data
  }
}
```

### Step 3: Extend SimulationInput Types

```typescript
// src/services/types/SimulationTypes.ts
export interface SimulationInput {
  // Keep existing single-point weather for fallback
  weather: WeatherData;
  
  // Add new time-series inputs
  weatherTimeSeries?: WeatherTimeSeriesPoint[];
  priceTimeSeries?: PriceTimeSeriesPoint[];
  
  // Add time range specification
  simulationStartDate?: Date;
  simulationEndDate?: Date;
  
  // Existing fields unchanged
  windTurbineCount: number;
  solarPanelCount: number;
  currentStorage: number;
  cityPopulation: number;
  forecastHours: number;
}
```

### Step 4: Update PowerGenerationResolver

```typescript
// src/services/resolvers/PowerGenerationResolver.ts
export class PowerGenerationResolver {
  constructor(private weatherDataService?: WeatherDataService) {}

  public async resolve(input: SimulationInput): Promise<PowerGenerationPoint[]> {
    const weatherData = input.weatherTimeSeries || 
                       await this.fetchWeatherData(input) ||
                       [this.fallbackWeatherPoint(input.weather)];
    
    // Use real hourly weather data instead of static values
    return weatherData.slice(0, input.forecastHours).map((weather, h) => {
      const windPower = this.calculateWindPower(weather.windSpeed, input.windTurbineCount);
      const solarPower = this.calculateSolarPower(weather.cloudCoverage, input.solarPanelCount, h);
      // ... rest unchanged
    });
  }
}
```

### Step 5: Update SimulationUIService Constructor

```typescript
// src/services/ui/SimulationUIService.ts
export class SimulationUIService {
  constructor(
    private powerResolver = new PowerGenerationResolver(new WeatherDataService()),
    private demandResolver = new CityDemandResolver(new WeatherDataService()),
    private storageResolver = new EnergyStorageResolver(),
  ) {}
}
```

## Acceptance Criteria

### Functional Requirements
- [ ] PowerGenerationResolver uses real historical wind speed and temperature data from database
- [ ] CityDemandResolver uses real historical temperature data for demand calculations  
- [ ] EnergyStorageResolver produces realistic storage levels based on real generation/demand
- [ ] Simulation UI shows realistic power generation curves based on historical weather patterns
- [ ] Charts display data that correlates with actual historical weather conditions
- [ ] Fallback to mocked data when database is unavailable

### Technical Requirements  
- [ ] No breaking changes to existing UIService.getUIData() interface
- [ ] UIService remains a pure orchestration layer (no business logic)
- [ ] All new database calls are properly error-handled
- [ ] New resolvers are unit testable with mocked data services
- [ ] Integration test verifies end-to-end data flow from database to UI
- [ ] Performance: Database queries complete within 2 seconds for typical date ranges

### Data Quality Requirements
- [ ] Historical weather data date ranges are validated before querying
- [ ] Cloud coverage estimates are reasonable approximations from weather_main field
- [ ] Price data is correctly mapped to demand forecasting
- [ ] Storage calculations remain physically plausible (no negative levels, respect capacity limits)

## Risk Mitigation

### Database Availability
- **Risk**: REST API server not running during development
- **Mitigation**: Preserve existing fallback to mocked data; add clear error logging

### Data Quality Issues  
- **Risk**: Missing or inconsistent historical data for certain date ranges
- **Mitigation**: Validate data completeness before processing; interpolate missing hours

### Performance Impact
- **Risk**: Multiple database queries slow down simulation loading
- **Mitigation**: Batch weather and price queries; cache results for repeated simulations

## Testing Strategy

### Unit Tests
- Mock data services in resolver tests to verify business logic
- Test fallback behavior when historical data is unavailable
- Test error handling for malformed database responses

### Integration Tests  
- Verify end-to-end data flow: Database → DataResolver → WeatherDataService → PowerGenerationResolver → UI
- Test with real database using a known date range with good data coverage
- Verify that UI components render correctly with database-backed simulation data

## Future Enhancements (Out of Scope)

- Replace simple power generation formulas with physics-based models
- Add machine learning for demand forecasting based on price trends
- Implement real-time weather data blending with historical data
- Add user-selectable historical periods in the UI
- Optimize database queries with caching layer

## Dependencies

- Database REST API server must be running (`npm run start:api`)
- Historical data must be imported (`python database/import/databaseImport.py`)
- Environment variable `VITE_API_BASE_URL` must point to the REST API server

---

**Next Steps**: Begin implementation with Phase 1 (Create Database-Backed Data Services). Start with `WeatherDataService` as it's used by both power generation and demand resolvers.