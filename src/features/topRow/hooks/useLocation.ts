import { useEffect, useState } from "react";
import { locationService } from "@services/serviceRegistry";
import type { Location } from "@features/topRow/LocationService";

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
};
