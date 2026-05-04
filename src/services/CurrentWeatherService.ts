import type { Location } from "./LocationService";

/** Coarse weather buckets used by the UI for icons & labels. */
export type WeatherCondition =
    | "sunny"
    | "cloudy"
    | "rainy"
    | "snowy"
    | "stormy"
    | "foggy"
    | "windy"
    | "unknown";

export interface CurrentWeather {
    /** Air temperature in °C. */
    temperatureCelsius: number;
    /** Wind speed in km/h. */
    windKilometersPerHour: number;
    /** Coarse condition bucket for icon rendering. */
    condition: WeatherCondition;
    /** Free-form, localised description (e.g. "light rain"). */
    description: string;
    /** When this snapshot was produced (UTC). */
    fetchedAt: Date;
}

export interface CurrentWeatherService {
    getCurrent(location: Location): Promise<CurrentWeather>;
}

// =====================================================================
// Mock implementation – stable, deterministic, no network needed.
// =====================================================================

export class MockCurrentWeatherService implements CurrentWeatherService {
    public async getCurrent(_location: Location): Promise<CurrentWeather> {
        return {
            temperatureCelsius: 12.4,
            windKilometersPerHour: 14,
            condition: "cloudy",
            description: "Partly cloudy",
            fetchedAt: new Date(),
        };
    }
}

// =====================================================================
// OpenWeather adapter – activated when VITE_OPENWEATHER_API_KEY is set.
// =====================================================================

export class OpenWeatherCurrentWeatherService implements CurrentWeatherService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(apiKey: string, baseUrl = "MOCK") {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    public async getCurrent(location: Location): Promise<CurrentWeather> {
        const url =
            `${this.baseUrl}/weather` +
            `?lat=${location.latitude}&lon=${location.longitude}` +
            `&units=metric&appid=${this.apiKey}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`OpenWeather request failed: ${res.status}`);
        }
        const json = (await res.json()) as OpenWeatherResponse;

        return {
            temperatureCelsius: json.main?.temp ?? 0,
            windKilometersPerHour: metersPerSecondToKilometersPerHour(json.wind?.speed ?? 0),
            condition: mapOpenWeatherToCondition(json.weather?.[0]?.main),
            description: json.weather?.[0]?.description ?? "",
            fetchedAt: new Date(),
        };
    }
}

// ---- helpers ---------------------------------------------------------

interface OpenWeatherResponse {
    main?: { temp?: number };
    wind?: { speed?: number };
    weather?: { main?: string; description?: string }[];
}

function metersPerSecondToKilometersPerHour(metersPerSecond: number): number {
    return Math.round(metersPerSecond * 3.6);
}

function mapOpenWeatherToCondition(main?: string): WeatherCondition {
    switch ((main ?? "").toLowerCase()) {
        case "clear":
            return "sunny";
        case "clouds":
            return "cloudy";
        case "rain":
        case "drizzle":
            return "rainy";
        case "snow":
            return "snowy";
        case "thunderstorm":
            return "stormy";
        case "mist":
        case "fog":
        case "haze":
            return "foggy";
        case "squall":
        case "tornado":
            return "windy";
        default:
            return "unknown";
    }
}
