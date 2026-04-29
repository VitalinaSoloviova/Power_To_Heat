// src/calculations/dateUtils.ts

/**
 * Compute a date range for a historical "yearsAgo" selection.
 * Defaults to January 1..30 unless month/day overrides are provided.
 */
export function computeHistoricalRange(
  yearsAgo: number,
  monthIndex = 0, // 0 = January, 3 = April etc.
  dayFrom = 1,
  dayTo = 30
) {
  const now = new Date();
  const targetYear = now.getFullYear() - yearsAgo;
  const start = new Date(targetYear, monthIndex, dayFrom);
  const end = new Date(targetYear, monthIndex, dayTo);
  return { start, end, targetYear };
}

/**
 * Shift an array of objects that contain a `date: Date` field to a new year.
 * Keeps month and day the same.
 */
export function shiftDataToYear<T extends { date: Date }>(data: T[], year: number): T[] {
  return data.map((item) => ({
    ...item,
    date: new Date(year, item.date.getMonth(), item.date.getDate()),
  }));
}
