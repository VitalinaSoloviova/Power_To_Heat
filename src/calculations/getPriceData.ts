// src/calculations/getPriceData.ts
import type { PriceData } from "./types";

/**
 * Dummy electricity price data for January (base year 2020).
 */
const januaryPriceData: PriceData[] = Array.from({ length: 31 }, (_, idx) => {
  const date = new Date(2020, 0, idx + 1);
  return {
    date,
    avgPrice: 50 + (idx + 1) * 0.8,
  };
});

/**
 * Returns price data between two real dates (inclusive).
 */
export function getPriceData(startDate: Date, endDate: Date): PriceData[] {
  return januaryPriceData.filter((row) => row.date >= startDate && row.date <= endDate);
}

/**
 * Utility: shift dummy data to any year
 */
export function shiftPriceDataToYear(year: number): PriceData[] {
  return januaryPriceData.map((item) => ({
    ...item,
    date: new Date(year, item.date.getMonth(), item.date.getDate()),
  }));
}

export { januaryPriceData };
