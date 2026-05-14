import { useEffect, useState } from "react";
import { currentEnergyPriceService } from "@services/serviceRegistry";
import type { CurrentEnergyPrice } from "@services/currentData/CurrentEnergyPriceService";

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

/** Refresh interval for live energy-price polling (ms). */
const PRICE_REFRESH_MS = 5 * 60 * 1000; // 5 min

export const useCurrentEnergyPrice = (): AsyncState<CurrentEnergyPrice> => {
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
};
