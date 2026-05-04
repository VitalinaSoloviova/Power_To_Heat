import { useEffect, useState } from "react";
import {
    locationService,
    currentWeatherService,
    currentEnergyPriceService,
} from "../../../../../../services/serviceContainer";
import type { Location } from "../../../../../../services/LocationService";
import type { CurrentWeather } from "../../../../../../services/CurrentWeatherService";
import type { CurrentEnergyPrice } from "../../../../../../services/CurrentEnergyPriceService";

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

const initial = <T,>(): AsyncState<T> => ({
    data: null,
    loading: true,
    error: null,
});

export function useLocation(): AsyncState<Location> {
    const [state, setState] = useState<AsyncState<Location>>(initial<Location>());

    useEffect(() => {
        let cancelled = false;
        locationService
            .getCurrentLocation()
            .then((data) => {
                if (!cancelled) setState({ data, loading: false, error: null });
            })
            .catch((error: Error) => {
                if (!cancelled) setState({ data: null, loading: false, error });
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}

/** Refresh interval for live current-weather polling (ms). */
const WEATHER_REFRESH_MS = 10 * 60 * 1000; // 10 min

export function useCurrentWeather(
    location: Location | null
): AsyncState<CurrentWeather> {
    const [state, setState] = useState<AsyncState<CurrentWeather>>(
        initial<CurrentWeather>()
    );

    useEffect(() => {
        if (!location) return;
        let cancelled = false;

        const load = () => {
            currentWeatherService
                .getCurrent(location)
                .then((data) => {
                    if (!cancelled)
                        setState({ data, loading: false, error: null });
                })
                .catch((error: Error) => {
                    if (!cancelled)
                        setState({ data: null, loading: false, error });
                });
        };

        load();
        const id = setInterval(load, WEATHER_REFRESH_MS);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [location?.latitude, location?.longitude]);

    return state;
}

/** Refresh interval for live energy-price polling (ms). */
const PRICE_REFRESH_MS = 5 * 60 * 1000; // 5 min

export function useCurrentEnergyPrice(): AsyncState<CurrentEnergyPrice> {
    const [state, setState] = useState<AsyncState<CurrentEnergyPrice>>(
        initial<CurrentEnergyPrice>()
    );

    useEffect(() => {
        let cancelled = false;

        const load = () => {
            currentEnergyPriceService
                .getCurrent()
                .then((data) => {
                    if (!cancelled)
                        setState({ data, loading: false, error: null });
                })
                .catch((error: Error) => {
                    if (!cancelled)
                        setState({ data: null, loading: false, error });
                });
        };

        load();
        const id = setInterval(load, PRICE_REFRESH_MS);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    return state;
}
