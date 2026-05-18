import { createContext } from 'react';

export interface AppSettings {
  // City
  cityName: string;
  postalCode: string;
  cityLat: number;
  cityLon: number;
  cityPopulation: number; // auto-detected from Nominatim
  residents: number;      // effective value after % adjustment

  // Storage
  storageCapacityMwh: number;
  maxChargePercent: number;

  // Charging behaviour
  priceHistoryDays: number;
  emergencyBuyEnabled: boolean;
  criticalThresholdPct: number;     // charge immediately regardless of price below this level
  nearCriticalThresholdPct: number; // charge if price < median below this level
  halfCapacityThresholdPct: number; // charge if price < P10 below this level
}

export const DEFAULT_SETTINGS: AppSettings = {
  cityName: 'Bad Homburg',
  postalCode: '61348',
  cityLat: 50.23,
  cityLon: 8.62,
  cityPopulation: 55_000,
  residents: 55_000,

  storageCapacityMwh: 2_000,
  maxChargePercent: 89,

  priceHistoryDays: 90,
  emergencyBuyEnabled: true,
  criticalThresholdPct: 25,
  nearCriticalThresholdPct: 30,
  halfCapacityThresholdPct: 50,
};

export interface SettingsContextValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  update: () => {},
  reset: () => {},
});
