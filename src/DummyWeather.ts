import type { UiDayData } from "./calculations/uiDataProfile";


// Dummy weather data for April 2026 (30 days)
export const dummyWeatherDataApril: UiDayData[] = [
  { day: new Date('2026-04-01'), weather: { minTemp: 8.5, maxTemp: 15.2, avgTemp: 11.9, wind: 4.2, description: ['cloudy'] }, avgPrice: 0.32, energyDemand: 2800 },
  { day: new Date('2026-04-02'), weather: { minTemp: 6.8, maxTemp: 13.1, avgTemp: 10.0, wind: 6.8, description: ['rainy'] }, avgPrice: 0.28, energyDemand: 3200 },
  { day: new Date('2026-04-03'), weather: { minTemp: 7.2, maxTemp: 14.5, avgTemp: 10.9, wind: 5.1, description: ['cloudy'] }, avgPrice: 0.30, energyDemand: 2900 },
  { day: new Date('2026-04-04'), weather: { minTemp: 9.1, maxTemp: 16.8, avgTemp: 13.0, wind: 3.2, description: ['sunny'] }, avgPrice: 0.35, energyDemand: 2600 },
  { day: new Date('2026-04-05'), weather: { minTemp: 11.3, maxTemp: 18.7, avgTemp: 15.0, wind: 2.8, description: ['clear'] }, avgPrice: 0.33, energyDemand: 2400 },
  { day: new Date('2026-04-06'), weather: { minTemp: 10.5, maxTemp: 17.2, avgTemp: 13.9, wind: 3.5, description: ['sunny'] }, avgPrice: 0.34, energyDemand: 2500 },
  { day: new Date('2026-04-07'), weather: { minTemp: 8.9, maxTemp: 15.6, avgTemp: 12.3, wind: 4.7, description: ['cloudy'] }, avgPrice: 0.31, energyDemand: 2700 },
  { day: new Date('2026-04-08'), weather: { minTemp: 7.1, maxTemp: 12.8, avgTemp: 10.0, wind: 7.2, description: ['rainy'] }, avgPrice: 0.27, energyDemand: 3300 },
  { day: new Date('2026-04-09'), weather: { minTemp: 5.8, maxTemp: 11.4, avgTemp: 8.6, wind: 8.9, description: ['windy'] }, avgPrice: 0.25, energyDemand: 3500 },
  { day: new Date('2026-04-10'), weather: { minTemp: 6.2, maxTemp: 13.7, avgTemp: 10.0, wind: 6.1, description: ['cloudy'] }, avgPrice: 0.29, energyDemand: 3100 },
  { day: new Date('2026-04-11'), weather: { minTemp: 8.7, maxTemp: 16.2, avgTemp: 12.5, wind: 2.3, description: ['foggy'] }, avgPrice: 0.32, energyDemand: 2800 },
  { day: new Date('2026-04-12'), weather: { minTemp: 10.1, maxTemp: 17.8, avgTemp: 14.0, wind: 3.1, description: ['clear'] }, avgPrice: 0.33, energyDemand: 2600 },
  { day: new Date('2026-04-13'), weather: { minTemp: 12.4, maxTemp: 19.6, avgTemp: 16.0, wind: 2.9, description: ['sunny'] }, avgPrice: 0.36, energyDemand: 2300 },
  { day: new Date('2026-04-14'), weather: { minTemp: 13.2, maxTemp: 21.1, avgTemp: 17.2, wind: 3.4, description: ['sunny'] }, avgPrice: 0.37, energyDemand: 2200 },
  { day: new Date('2026-04-15'), weather: { minTemp: 11.8, maxTemp: 18.9, avgTemp: 15.4, wind: 4.6, description: ['cloudy'] }, avgPrice: 0.33, energyDemand: 2500 },
  { day: new Date('2026-04-16'), weather: { minTemp: 9.5, maxTemp: 16.3, avgTemp: 12.9, wind: 6.7, description: ['rainy'] }, avgPrice: 0.28, energyDemand: 3000 },
  { day: new Date('2026-04-17'), weather: { minTemp: 8.2, maxTemp: 14.7, avgTemp: 11.5, wind: 5.3, description: ['cloudy'] }, avgPrice: 0.30, energyDemand: 2800 },
  { day: new Date('2026-04-18'), weather: { minTemp: 10.6, maxTemp: 17.4, avgTemp: 14.0, wind: 3.8, description: ['clear'] }, avgPrice: 0.34, energyDemand: 2600 },
  { day: new Date('2026-04-19'), weather: { minTemp: 12.1, maxTemp: 19.2, avgTemp: 15.7, wind: 2.7, description: ['sunny'] }, avgPrice: 0.36, energyDemand: 2400 },
  { day: new Date('2026-04-20'), weather: { minTemp: 13.5, maxTemp: 20.8, avgTemp: 17.2, wind: 3.0, description: ['sunny'] }, avgPrice: 0.38, energyDemand: 2200 },
  { day: new Date('2026-04-21'), weather: { minTemp: 14.2, maxTemp: 22.1, avgTemp: 18.2, wind: 2.4, description: ['clear'] }, avgPrice: 0.39, energyDemand: 2100 },
  { day: new Date('2026-04-22'), weather: { minTemp: 12.8, maxTemp: 19.7, avgTemp: 16.3, wind: 4.2, description: ['cloudy'] }, avgPrice: 0.34, energyDemand: 2400 },
  { day: new Date('2026-04-23'), weather: { minTemp: 11.4, maxTemp: 18.3, avgTemp: 14.9, wind: 5.1, description: ['cloudy'] }, avgPrice: 0.32, energyDemand: 2600 },
  { day: new Date('2026-04-24'), weather: { minTemp: 9.7, maxTemp: 16.5, avgTemp: 13.1, wind: 6.4, description: ['rainy'] }, avgPrice: 0.29, energyDemand: 2900 },
  { day: new Date('2026-04-25'), weather: { minTemp: 8.3, maxTemp: 15.1, avgTemp: 11.7, wind: 8.2, description: ['windy'] }, avgPrice: 0.26, energyDemand: 3200 },
  { day: new Date('2026-04-26'), weather: { minTemp: 10.2, maxTemp: 17.6, avgTemp: 13.9, wind: 2.1, description: ['foggy'] }, avgPrice: 0.33, energyDemand: 2700 },
  { day: new Date('2026-04-27'), weather: { minTemp: 11.9, maxTemp: 19.4, avgTemp: 15.7, wind: 3.3, description: ['clear'] }, avgPrice: 0.35, energyDemand: 2500 },
  { day: new Date('2026-04-28'), weather: { minTemp: 13.6, maxTemp: 21.2, avgTemp: 17.4, wind: 2.8, description: ['sunny'] }, avgPrice: 0.37, energyDemand: 2300 },
  { day: new Date('2026-04-29'), weather: { minTemp: 15.1, maxTemp: 23.4, avgTemp: 19.3, wind: 2.5, description: ['sunny'] }, avgPrice: 0.40, energyDemand: 2000 },
  { day: new Date('2026-04-30'), weather: { minTemp: 14.8, maxTemp: 22.7, avgTemp: 18.8, wind: 3.1, description: ['clear'] }, avgPrice: 0.38, energyDemand: 2100 }
]; 

