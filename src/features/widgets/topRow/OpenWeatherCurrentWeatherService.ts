import type { CurrentWeatherService, CurrentWeather, WeatherCondition } from '@services/CurrentWeatherService';
import type { Location } from '@services/LocationService';

export class OpenWeatherCurrentWeatherService implements CurrentWeatherService {
    async getCurrent(location: Location): Promise<CurrentWeather> {
        try {
            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${location.latitude}&longitude=${location.longitude}` +
                `&current_weather=true&timezone=Europe/Berlin`;

            const res = await fetch(url);
            const data = await res.json() as OpenMeteoResponse;
            const cw = data.current_weather;

            return {
                temperatureCelsius: Math.round(cw.temperature),
                windKilometersPerHour: Math.round(cw.windspeed),
                condition: wmoToCondition(cw.weathercode),
                description: wmoToDescription(cw.weathercode),
                fetchedAt: new Date(),
            };
        } catch (err) {
            console.warn('Weather fetch failed', err);
            return {
                temperatureCelsius: 12,
                windKilometersPerHour: 8,
                condition: 'cloudy',
                description: 'cloudy',
                fetchedAt: new Date(),
            };
        }
    }
}

interface OpenMeteoResponse {
    current_weather: {
        temperature: number;
        windspeed: number;
        weathercode: number;
    };
}

function wmoToCondition(code: number): WeatherCondition {
    if ([0, 1].includes(code)) return 'sunny';
    if ([2, 3].includes(code)) return 'cloudy';
    if ([45, 48].includes(code)) return 'foggy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
    if ([95, 96, 99].includes(code)) return 'stormy';
    return 'cloudy';
}

function wmoToDescription(code: number): string {
    if ([0, 1].includes(code)) return 'clear';
    if ([2, 3].includes(code)) return 'cloudy';
    if ([45, 48].includes(code)) return 'fog';
    if ([51, 53, 55].includes(code)) return 'drizzle';
    if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
    if ([95, 96, 99].includes(code)) return 'thunderstorm';
    return 'cloudy';
}
