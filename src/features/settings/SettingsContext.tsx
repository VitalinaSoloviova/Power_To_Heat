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
    if (raw) return { ...DEFAULT_SETTINGS, ...sanitize(JSON.parse(raw)) };
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
