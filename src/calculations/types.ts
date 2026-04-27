// src/calculations/types.ts

export type PriceData = {
  date: Date;
  avgPrice: number;
};

export type WeatherData = {
  date: Date;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  wind: number;
};

export type WeatherDescriptions =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "windy"
  | "foggy"
  | "clear";
