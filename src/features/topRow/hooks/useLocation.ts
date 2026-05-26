import { useEffect, useState } from "react";
import { locationService } from "@services/serviceRegistry";
import type { Location } from "@features/topRow/LocationService";
import { useSettings } from "@features/settings/useSettings";

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

export const useLocation = (): AsyncState<Location> => {
    const [state, setState] = useState<AsyncState<Location>>(initial<Location>());
    const { settings } = useSettings();

    useEffect(() => {
        let cancelled = false;
        locationService
            .getCurrentLocation()
            .then((base) => {
                if (!cancelled) {
                    setState({
                        data: {
                            ...base,
                            name:      settings.cityName  || base.name,
                            latitude:  settings.cityLat   || base.latitude,
                            longitude: settings.cityLon   || base.longitude,
                        },
                        loading: false,
                        error: null,
                    });
                }
            })
            .catch((error: Error) => {
                if (!cancelled) setState({ data: null, loading: false, error });
            });
        return () => { cancelled = true; };
    }, [settings.cityName, settings.cityLat, settings.cityLon]);

    return state;
};
