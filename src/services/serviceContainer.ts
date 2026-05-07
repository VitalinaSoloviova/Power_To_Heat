/// <reference types="vite/client" />

import { DataResolver } from "../calculations/DataResolver";
import { UIService } from "./UIService";
import { StaticLocationService, type LocationService } from "./LocationService";
import {
    MockCurrentWeatherService,
    OpenWeatherCurrentWeatherService,
    type CurrentWeatherService,
} from "./CurrentWeatherService";
import { 
    AwattarEnergyPriceService, 
    type CurrentEnergyPriceService 
} from './CurrentEnergyPriceService';

// Backend base URL
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const dataResolver = new DataResolver(BASE_URL);

/** Application-wide singleton used by hooks/components. */
export const uiService = new UIService(dataResolver);

// ---- Top-row dashboard widgets --------------------------------------

export const locationService: LocationService = new StaticLocationService();

const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY as
    | string
    | undefined;

export const currentWeatherService: CurrentWeatherService = openWeatherKey
    ? new OpenWeatherCurrentWeatherService(openWeatherKey)
    : new MockCurrentWeatherService();

export const currentEnergyPriceService: CurrentEnergyPriceService =
    new AwattarEnergyPriceService();