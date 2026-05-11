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

