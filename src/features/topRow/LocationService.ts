/**
 * Provides the currently selected dashboard location.
 *
 * For now this is hard-coded to "Bad Homburg" but the service shape is
 * intentionally async so it can later be swapped for a real API / user
 * preference / geolocation source without touching widgets.
 */
export interface Location {
    /** Display name shown to the user, e.g. "Bad Homburg". */
    name: string;
    /** ISO country code – useful for weather APIs ("DE"). */
    countryCode: string;
    /** Latitude / longitude for downstream services (weather, etc.). */
    latitude: number;
    longitude: number;
}

export interface LocationService {
    getCurrentLocation(): Promise<Location>;
}

/** Static implementation – returns Bad Homburg until a real source exists. */
export class StaticLocationService implements LocationService {
    private readonly location: Location;

    constructor(location: Location = BAD_HOMBURG) {
        this.location = location;
    }

    public async getCurrentLocation(): Promise<Location> {
        return this.location;
    }
}

export const BAD_HOMBURG: Location = {
    name: "Bad Homburg",
    countryCode: "DE",
    latitude: 50.2274,
    longitude: 8.6182,
};
