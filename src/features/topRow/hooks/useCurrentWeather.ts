import { useEffect, useState } from "react";
import { uiService } from "@services/serviceRegistry";
import type { Location } from "@features/topRow/LocationService";
import type { CurrentWeather } from "@features/topRow/currentData/CurrentWeatherService";

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

/** Refresh interval for live current-weather polling (ms). */
const WEATHER_REFRESH_MS = 10 * 60 * 1000; // 10 min

export const useCurrentWeather = (
    location: Location | null
): AsyncState<CurrentWeather> => {
    const [state, setState] = useState<AsyncState<CurrentWeather>>(
        initial<CurrentWeather>()
    );

    useEffect(() => {
        if (!location) return;
        let cancelled = false;

        const load = () => {
            uiService
                .getCurrentWeather(location)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.latitude, location?.longitude]);

    return state;
};
