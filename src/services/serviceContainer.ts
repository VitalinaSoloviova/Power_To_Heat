import { DataResolver } from "../calculations/DataResolver";
import { UIService } from "./UIService";
import { StaticLocationService, type LocationService } from "./LocationService";
import { type CurrentEnergyPriceService } from "./currentData/CurrentEnergyPriceService";
import { OpenWeatherCurrentWeatherService } from "../calculations/OpenWeatherCurrentWeatherService";
import { AwattarEnergyPriceService } from "../calculations/AwattarEnergyPriceService";

// Backend base URL – override via Vite env when needed (VITE_API_BASE_URL).
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const dataResolver = new DataResolver(BASE_URL);

/** Application-wide singleton used by hooks/components. */
export const uiService = new UIService(dataResolver);

// ---- Top-row dashboard widgets --------------------------------------

export const locationService: LocationService = new StaticLocationService();

export const currentWeatherService = new OpenWeatherCurrentWeatherService();

export const currentEnergyPriceService: CurrentEnergyPriceService =
    new AwattarEnergyPriceService(BASE_URL);
