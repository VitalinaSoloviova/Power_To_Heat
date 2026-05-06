// src/calculations/OpenWeatherCurrentWeatherService.ts
export class OpenWeatherCurrentWeatherService {
  private readonly lat = 50.2269;   // Bad Homburg
  private readonly lon = 8.6217;

  async getCurrent() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current_weather=true&timezone=Europe/Berlin`;

      const res = await fetch(url);
      const data = await res.json();

      return {
        temperature: Math.round(data.current_weather.temperature),
        windspeed: Math.round(data.current_weather.windspeed),
        weathercode: data.current_weather.weathercode,
        description: this.getWeatherDescription(data.current_weather.weathercode),
        timestamp: new Date()
      };
    } catch (err) {
      console.warn('Weather fetch failed', err);
      return {
        temperature: 12,
        windspeed: 8,
        description: 'cloudy',
        timestamp: new Date()
      };
    }
  }

  private getWeatherDescription(code: number): string {
    // Simple mapping - you can expand this
    if ([0,1].includes(code)) return 'clear';
    if ([2,3].includes(code)) return 'cloudy';
    if ([51,53,55,61,63,65].includes(code)) return 'rainy';
    if ([71,73,75,77].includes(code)) return 'snowy';
    return 'cloudy';
  }
}