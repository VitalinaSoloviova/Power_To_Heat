import { DataResolver } from "../calculations/DataResolver";
import { UIService } from "./ui/UIService";
import { StaticLocationService, type LocationService } from "./LocationService";
import { OpenWeatherCurrentWeatherService } from "../features/topRow/OpenWeatherCurrentWeatherService";
import { AwattarEnergyPriceService } from "../features/topRow/AwattarEnergyPriceService";

// Backend base URL – override via Vite env when needed (VITE_API_BASE_URL).
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const dataResolver = new DataResolver(BASE_URL);
const currentWeatherService = new OpenWeatherCurrentWeatherService();
const currentEnergyPriceService = new AwattarEnergyPriceService(BASE_URL);

/** Application-wide singleton used by hooks/components. */
export const uiService = new UIService(dataResolver, {
    currentEnergyPriceService,
    currentWeatherService,
});

// ---- Top-row dashboard widgets --------------------------------------

export const locationService: LocationService = new StaticLocationService();
