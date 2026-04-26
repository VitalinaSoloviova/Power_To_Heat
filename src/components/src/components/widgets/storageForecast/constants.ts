export const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
export type Duration = (typeof DURATION_OPTIONS)[number];

export const HISTORY_OPTIONS = [5, 10, 20, 30, 50] as const;
export type HistoryYears = (typeof HISTORY_OPTIONS)[number];

export const DEFAULT_STORAGE_LEVEL = 45;
export const DEFAULT_DURATION: Duration = 3;
export const DEFAULT_HISTORY_YEARS: HistoryYears = 5;
