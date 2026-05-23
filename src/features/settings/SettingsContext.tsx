import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SETTINGS, SettingsContext } from './settingsTypes';
import type { AppSettings } from './settingsTypes';

const STORAGE_KEY = 'p2h_app_settings';

function sanitize(raw: Record<string, unknown>): Partial<AppSettings> {
  const out: Partial<AppSettings> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'number' && (!isFinite(v) || isNaN(v))) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Record<string, unknown> = JSON.parse(raw);
      const sanitized = sanitize(parsed);
      // Migrate pre-maxChargePowerMw settings: old storageCapacityMwh (2000 MWh) is
      // incompatible with the new explicit pump-power model — reset storage params to defaults.
      if (!('maxChargePowerMw' in parsed)) {
        return {
          ...DEFAULT_SETTINGS,
          ...sanitized,
          storageCapacityMwh: DEFAULT_SETTINGS.storageCapacityMwh,
          maxChargePowerMw:   DEFAULT_SETTINGS.maxChargePowerMw,
          maxChargePercent:   DEFAULT_SETTINGS.maxChargePercent,
        };
      }
      return { ...DEFAULT_SETTINGS, ...sanitized };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
};
